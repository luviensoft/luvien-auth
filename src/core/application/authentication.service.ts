import { randomUUID } from 'node:crypto';
import {
  AuthenticationError,
  ConfigurationError,
  IdentityAlreadyLinkedError,
} from '../domain/errors.js';
import type {
  AuthenticatedPrincipal,
  ExternalIdentity,
} from '../domain/identity.js';
import type { IdentityRepository } from '../port/identity-repository.port.js';
import type { OidcProvider } from '../port/oidc-provider.port.js';
import type { SessionManager } from '../port/session-manager.port.js';
import type { StateStore } from '../port/state-store.port.js';
import type { UserResolver } from '../port/user-resolver.port.js';
import {
  codeChallengeFromVerifier,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from '../../protocols/oidc/oidc.pkce.js';
import { extractRoles } from '../../providers/generic-oidc/claim-mapper.js';
import type { ClaimMapping } from '../../protocols/oidc/oidc.types.js';
import type { SessionConfig } from '../domain/session.js';

export interface AuthenticationServiceOptions {
  provider: OidcProvider;
  identityRepository: IdentityRepository;
  sessionManager: SessionManager;
  stateStore: StateStore;
  userResolver: UserResolver;
  claimMapping?: ClaimMapping;
  session: SessionConfig;
  stateTtlSeconds?: number;
  redirectUri: string;
}

export interface StartLoginResult {
  url: string;
  state: string;
}

export interface CallbackInput {
  code: string;
  state: string;
}

export interface CallbackResult {
  principal: AuthenticatedPrincipal;
  sessionId?: string;
}

export class AuthenticationService {
  private readonly stateTtl: number;

  constructor(private readonly opts: AuthenticationServiceOptions) {
    this.stateTtl = opts.stateTtlSeconds ?? 10 * 60;
  }

  async startLogin(): Promise<StartLoginResult> {
    const state = generateState();
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = codeChallengeFromVerifier(codeVerifier);

    const built = await this.opts.provider.buildAuthorizationUrl({
      redirectUri: this.opts.redirectUri,
      state,
      nonce,
      codeChallenge,
      codeChallengeMethod: 'S256',
      scopes: ['openid', 'profile', 'email'],
    });

    const now = Date.now();
    await this.opts.stateStore.save({
      state,
      nonce,
      codeVerifier,
      redirectUri: this.opts.redirectUri,
      providerId: this.opts.provider.providerId,
      createdAt: now,
      expiresAt: now + this.stateTtl * 1000,
    });

    return { url: built.url, state };
  }

  async handleCallback(input: CallbackInput): Promise<CallbackResult> {
    const entry = await this.opts.stateStore.consume(input.state);
    if (!entry) {
      throw new AuthenticationError('Unknown or expired state');
    }
    if (entry.providerId !== this.opts.provider.providerId) {
      throw new AuthenticationError('State provider mismatch');
    }

    const result = await this.opts.provider.handleCallback({
      code: input.code,
      state: input.state,
      expectedState: entry.state,
      expectedNonce: entry.nonce,
      codeVerifier: entry.codeVerifier,
      redirectUri: entry.redirectUri,
    });

    const roles = extractRoles(result.claims, this.opts.claimMapping);

    const existing = await this.opts.identityRepository.findByIssuerSubject(
      undefined,
      result.issuer,
      result.subject,
    );

    let userId: string;
    if (existing) {
      userId = existing.userId;
      await this.opts.identityRepository.touch(
        undefined,
        result.issuer,
        result.subject,
        new Date(),
      );
    } else {
      const resolved = await this.opts.userResolver.resolve({
        issuer: result.issuer,
        subject: result.subject,
        providerId: this.opts.provider.providerId,
      });
      if (!resolved) {
        throw new AuthenticationError(
          'No local user for this external identity; application must provision or link first',
          { issuer: result.issuer, subject: result.subject },
        );
      }
      userId = resolved;
      const identity: ExternalIdentity = {
        id: randomUUID(),
        issuer: result.issuer,
        subject: result.subject,
        providerId: this.opts.provider.providerId,
        userId,
        linkedAt: new Date(),
        lastLoginAt: new Date(),
      };
      await this.opts.identityRepository.create(identity);
    }

    const identities = await this.opts.identityRepository.findByUserId(userId);

    const principal: AuthenticatedPrincipal = {
      userId,
      identities,
      claims: result.claims as unknown as Record<string, unknown>,
      roles,
      authTime: new Date(
        (result.claims.iat ?? Math.floor(Date.now() / 1000)) * 1000,
      ),
      acr: result.claims.acr,
      amr: result.claims.amr,
    };

    if (this.opts.session.mode === 'server') {
      const session = await this.opts.sessionManager.create(principal);
      return { principal: session.principal, sessionId: session.id };
    }

    return { principal };
  }

  async linkIdentity(
    principal: AuthenticatedPrincipal,
    input: { issuer: string; subject: string; providerId: string },
  ): Promise<ExternalIdentity> {
    const existing = await this.opts.identityRepository.findByIssuerSubject(
      undefined,
      input.issuer,
      input.subject,
    );
    if (existing) {
      if (existing.userId !== principal.userId) {
        throw new IdentityAlreadyLinkedError({
          issuer: input.issuer,
          subject: input.subject,
        });
      }
      return existing;
    }

    if (!this.opts.provider.hasCapability('oidc' as never)) {
      throw new ConfigurationError('Provider does not support OIDC linking');
    }

    return this.opts.identityRepository.create({
      id: randomUUID(),
      issuer: input.issuer,
      subject: input.subject,
      providerId: input.providerId,
      userId: principal.userId,
      linkedAt: new Date(),
    });
  }
}
