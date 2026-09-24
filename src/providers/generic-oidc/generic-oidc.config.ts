import type { ClaimMapping } from '../../protocols/oidc/oidc.types.js';

export interface GenericOidcProviderConfig {
  id: string;
  issuer: string;
  clientId: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri: string;
  claimMapping?: ClaimMapping;
  tokenAuthMethod?: 'client_secret_basic' | 'client_secret_post' | 'none';
  clockSkewSeconds?: number;
  allowInsecureRequests?: boolean;
}
