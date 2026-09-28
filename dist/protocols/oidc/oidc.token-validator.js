import { createRemoteJWKSet, jwtVerify, } from 'jose';
import { TokenValidationError } from '../../core/domain/errors.js';
export class OidcTokenValidator {
    discovery;
    jwks;
    constructor(discovery) {
        this.discovery = discovery;
    }
    async getJwks() {
        if (!this.jwks) {
            const doc = await this.discovery.get();
            this.jwks = createRemoteJWKSet(new URL(doc.jwks_uri));
        }
        return this.jwks;
    }
    async validateIdToken(input) {
        const doc = await this.discovery.get();
        const jwks = await this.getJwks();
        const skew = input.clockSkewSeconds ?? 60;
        let payload;
        try {
            const result = await jwtVerify(input.token, jwks, {
                issuer: input.expectedIssuer,
                audience: input.expectedAudience,
                clockTolerance: skew,
                algorithms: doc.id_token_signing_alg_values_supported,
            });
            payload = result.payload;
        }
        catch (err) {
            throw new TokenValidationError('ID token validation failed', {
                cause: err.message,
            });
        }
        if (input.expectedNonce !== undefined) {
            if (typeof payload.nonce !== 'string' ||
                payload.nonce !== input.expectedNonce) {
                throw new TokenValidationError('ID token nonce mismatch');
            }
        }
        const aud = payload.aud;
        if (Array.isArray(aud) && aud.length > 1) {
            if (payload.azp !== input.expectedAudience) {
                throw new TokenValidationError('ID token azp must equal client_id when multiple audiences present');
            }
        }
        if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
            throw new TokenValidationError('ID token missing sub');
        }
        return payload;
    }
}
//# sourceMappingURL=oidc.token-validator.js.map