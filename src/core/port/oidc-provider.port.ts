import type { TokenSet, TokenClaims } from '../domain/token.js';
import type { Capability } from '../domain/capability.js';

export const OIDC_PROVIDER = Symbol('OIDC_PROVIDER');

export interface AuthorizationRequest {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  scopes: string[];
  extraParams?: Record<string, string>;
}

export interface AuthorizationUrlResult {
  url: string;
  state: string;
  nonce: string;
  codeVerifier: string;
}

export interface CallbackParams {
  code: string;
  state: string;
  expectedState: string;
  expectedNonce: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface OidcCallbackResult {
  claims: TokenClaims;
  tokens: TokenSet;
  issuer: string;
  subject: string;
}

export interface OidcProvider {
  readonly providerId: string;
  readonly issuer: string;

  hasCapability(capability: Capability): boolean;

  buildAuthorizationUrl(
    request: AuthorizationRequest,
  ): Promise<AuthorizationUrlResult>;

  handleCallback(params: CallbackParams): Promise<OidcCallbackResult>;

  refresh(refreshToken: string): Promise<TokenSet>;

  buildLogoutUrl?(input: {
    idTokenHint?: string;
    postLogoutRedirectUri?: string;
    state?: string;
  }): Promise<string | null>;
}
