import {
  AuthenticationError,
  InvalidStateError,
  ProviderUnavailableError,
  UnsupportedCapabilityError,
} from '../../core/domain/errors.js';
import { Capability } from '../../core/domain/capability.js';
import type { TokenSet, TokenClaims } from '../../core/domain/token.js';
import type {
  AuthorizationRequest,
  AuthorizationUrlResult,
  CallbackParams,
  OidcCallbackResult,
  OidcProvider,
} from '../../core/port/oidc-provider.port.js';
import { OidcDiscovery } from '../../protocols/oidc/oidc.discovery.js';
import { OidcTokenValidator } from '../../protocols/oidc/oidc.token-validator.js';
import type { GenericOidcProviderConfig } from './generic-oidc.config.js';

export class GenericOidcProvider implements OidcProvider {
  readonly providerId: string;
  readonly issuer: string;

  private readonly discovery: OidcDiscovery;
  private readonly validator: OidcTokenValidator;
  private readonly scopes: string[];
  private readonly tokenAuthMethod:
    'client_secret_basic' | 'client_secret_post' | 'none';

  constructor(private readonly config: GenericOidcProviderConfig) {
    this.providerId = config.id;
    this.issuer = config.issuer;
    this.scopes = config.scopes ?? ['openid', 'profile', 'email'];
    this.tokenAuthMethod = config.tokenAuthMethod ?? 'client_secret_basic';
    this.discovery = new OidcDiscovery(
      config.issuer,
      config.allowInsecureRequests ?? false,
    );
    this.validator = new OidcTokenValidator(this.discovery);
  }

  hasCapability(capability: Capability): boolean {
    switch (capability) {
      case Capability.Oidc:
      case Capability.RefreshToken:
        return true;
      case Capability.RpInitiatedLogout:
        return true; // conditional, resolved at runtime via discovery
      default:
        return false;
    }
  }

  async buildAuthorizationUrl(
    request: AuthorizationRequest,
  ): Promise<AuthorizationUrlResult> {
    const doc = await this.discovery.get();
    const url = new URL(doc.authorization_endpoint);

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.config.clientId);
    url.searchParams.set('redirect_uri', request.redirectUri);
    url.searchParams.set('scope', request.scopes.join(' '));
    url.searchParams.set('state', request.state);
    url.searchParams.set('nonce', request.nonce);
    url.searchParams.set('code_challenge', request.codeChallenge);
    url.searchParams.set('code_challenge_method', request.codeChallengeMethod);

    if (request.extraParams) {
      for (const [k, v] of Object.entries(request.extraParams)) {
        url.searchParams.set(k, v);
      }
    }

    return {
      url: url.toString(),
      state: request.state,
      nonce: request.nonce,
      codeVerifier: '',
    };
  }

  async handleCallback(params: CallbackParams): Promise<OidcCallbackResult> {
    if (params.state !== params.expectedState) {
      throw new InvalidStateError();
    }

    const doc = await this.discovery.get();
    const tokens = await this.exchangeCode(
      doc.token_endpoint,
      params.code,
      params.redirectUri,
      params.codeVerifier,
    );

    if (!tokens.idToken) {
      throw new AuthenticationError('Token response missing id_token');
    }

    const claims: TokenClaims = await this.validator.validateIdToken({
      token: tokens.idToken,
      expectedIssuer: doc.issuer,
      expectedAudience: this.config.clientId,
      expectedNonce: params.expectedNonce,
      clockSkewSeconds: this.config.clockSkewSeconds,
    });

    return {
      claims,
      tokens,
      issuer: doc.issuer,
      subject: claims.sub,
    };
  }

  async refresh(refreshToken: string): Promise<TokenSet> {
    const doc = await this.discovery.get();
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    return this.postToken(doc.token_endpoint, body);
  }

  async buildLogoutUrl(input: {
    idTokenHint?: string;
    postLogoutRedirectUri?: string;
    state?: string;
  }): Promise<string | null> {
    const doc = await this.discovery.get();
    if (!doc.end_session_endpoint) return null;
    const url = new URL(doc.end_session_endpoint);
    if (input.idTokenHint)
      url.searchParams.set('id_token_hint', input.idTokenHint);
    if (input.postLogoutRedirectUri)
      url.searchParams.set(
        'post_logout_redirect_uri',
        input.postLogoutRedirectUri,
      );
    if (input.state) url.searchParams.set('state', input.state);
    return url.toString();
  }

  // --- internals ---

  private async exchangeCode(
    tokenEndpoint: string,
    code: string,
    redirectUri: string,
    codeVerifier: string,
  ): Promise<TokenSet> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      client_id: this.config.clientId,
    });
    return this.postToken(tokenEndpoint, body);
  }

  private async postToken(
    tokenEndpoint: string,
    body: URLSearchParams,
  ): Promise<TokenSet> {
    const headers: Record<string, string> = {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    };

    switch (this.tokenAuthMethod) {
      case 'client_secret_basic': {
        if (!this.config.clientSecret) {
          throw new UnsupportedCapabilityError(
            'client_secret_basic without secret',
          );
        }

        const credentials = Buffer.from(
          `${this.config.clientId}:${this.config.clientSecret}`,
          'utf8',
        ).toString('base64');

        headers.authorization = `Basic ${credentials}`;

        break;
      }

      case 'client_secret_post': {
        if (!this.config.clientSecret) {
          throw new UnsupportedCapabilityError(
            'client_secret_post without secret',
          );
        }

        body.set('client_id', this.config.clientId);
        body.set('client_secret', this.config.clientSecret);

        break;
      }

      case 'none': {
        body.set('client_id', this.config.clientId);

        break;
      }
    }

    let res: Response;

    try {
      res = await fetch(tokenEndpoint, {
        method: 'POST',
        headers,
        body,
      });
    } catch (err) {
      throw new ProviderUnavailableError('Token endpoint unreachable', {
        cause: (err as Error).message,
      });
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');

      throw new AuthenticationError('Token endpoint returned error', {
        status: res.status,
        body: text.slice(0, 500),
      });
    }

    const json = (await res.json()) as Record<string, unknown>;

    if (typeof json.access_token !== 'string') {
      throw new AuthenticationError('Token response missing access_token');
    }

    return {
      accessToken: json.access_token,
      idToken: typeof json.id_token === 'string' ? json.id_token : undefined,
      refreshToken:
        typeof json.refresh_token === 'string' ? json.refresh_token : undefined,
      tokenType:
        typeof json.token_type === 'string' ? json.token_type : 'Bearer',
      expiresIn:
        typeof json.expires_in === 'number' ? json.expires_in : undefined,
      scope: typeof json.scope === 'string' ? json.scope : undefined,
    };
  }
}
