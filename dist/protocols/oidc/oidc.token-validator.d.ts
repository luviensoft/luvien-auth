import type { TokenClaims } from '../../core/domain/token.js';
import type { OidcDiscovery } from './oidc.discovery.js';
export interface ValidateIdTokenInput {
    token: string;
    expectedIssuer: string;
    expectedAudience: string;
    expectedNonce?: string;
    clockSkewSeconds?: number;
}
export declare class OidcTokenValidator {
    private readonly discovery;
    private jwks?;
    constructor(discovery: OidcDiscovery);
    private getJwks;
    validateIdToken(input: ValidateIdTokenInput): Promise<TokenClaims>;
}
//# sourceMappingURL=oidc.token-validator.d.ts.map