import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticationService } from './authentication.service.js';
import { InMemoryIdentityRepository } from '../../persistence/in-memory/in-memory-identity.repository.js';
import { InMemorySessionManager } from '../../persistence/in-memory/in-memory-session.manager.js';
import { InMemoryStateStore } from '../../persistence/in-memory/in-memory-state.store.js';
import { OidcProvider } from '../port/oidc-provider.port.js';

function fakeProvider(overrides: Partial<OidcProvider> = {}): OidcProvider {
  return {
    providerId: 'test',
    issuer: 'https://issuer.test',
    hasCapability: () => true,
    buildAuthorizationUrl: async (req) => ({
      url: `https://issuer.test/auth?state=${req.state}`,
      state: req.state,
      nonce: req.nonce,
      codeVerifier: '',
    }),
    handleCallback: async (params) => ({
      issuer: 'https://issuer.test',
      subject: 'sub-1',
      claims: {
        iss: 'https://issuer.test',
        sub: 'sub-1',
        aud: 'client',
        exp: Math.floor(Date.now() / 1000) + 60,
        iat: Math.floor(Date.now() / 1000),
        nonce: params.expectedNonce,
        roles: ['admin'],
      } as never,
      tokens: { accessToken: 'a', tokenType: 'Bearer' },
    }),
    refresh: async () => ({ accessToken: 'a', tokenType: 'Bearer' }),
    ...overrides,
  };
}

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let identities: InMemoryIdentityRepository;
  let sessions: InMemorySessionManager;
  let states: InMemoryStateStore;

  beforeEach(() => {
    identities = new InMemoryIdentityRepository();
    sessions = new InMemorySessionManager();
    states = new InMemoryStateStore();
    service = new AuthenticationService({
      provider: fakeProvider(),
      identityRepository: identities,
      sessionManager: sessions,
      stateStore: states,
      userResolver: { resolve: async () => 'user-42' },
      session: { mode: 'server' },
      redirectUri: 'https://app.test/callback',
    });
  });

  it('startLogin returns a URL and stores state', async () => {
    const { url, state } = await service.startLogin();
    expect(url).toContain('state=');
    const entry = await states.consume(state);
    expect(entry).not.toBeNull();
  });

  it('handleCallback creates identity and session', async () => {
    const { state } = await service.startLogin();
    const result = await service.handleCallback({ code: 'c', state });
    expect(result.principal.userId).toBe('user-42');
    expect(result.principal.roles).toEqual(['admin']);
    expect(result.sessionId).toBeTruthy();
    const stored = await identities.findByIssuerSubject(
      undefined,
      'https://issuer.test',
      'sub-1',
    );
    expect(stored?.userId).toBe('user-42');
  });

  it('rejects unknown state', async () => {
    await expect(
      service.handleCallback({ code: 'c', state: 'nope' }),
    ).rejects.toThrow(/Unknown or expired state/);
  });
});
