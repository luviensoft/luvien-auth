export interface OidcDiscoveryDocument {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  userinfo_endpoint?: string;
  end_session_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  grant_types_supported?: string[];
  id_token_signing_alg_values_supported: string[];
  token_endpoint_auth_methods_supported?: string[];
  code_challenge_methods_supported?: string[];
}

export interface OidcConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  scopes: string[];
  redirectUri: string;
  tokenAuthMethod?: 'client_secret_basic' | 'client_secret_post' | 'none';
  clockSkewSeconds?: number;
  allowInsecureRequests?: boolean;
}

export interface ClaimMapping {
  roles?: string | string[];
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: string | string[] | undefined;
}
