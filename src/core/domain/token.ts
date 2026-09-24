export interface TokenSet {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
  scope?: string;
}

export interface TokenClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nbf?: number;
  azp?: string;
  nonce?: string;
  acr?: string;
  amr?: string[];
  [key: string]: unknown;
}
