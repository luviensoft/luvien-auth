import { ProviderUnavailableError, ConfigurationError, } from '../../core/domain/errors.js';
const DEFAULT_TTL_MS = 10 * 60 * 1000;
export class OidcDiscovery {
    issuer;
    allowInsecure;
    ttlMs;
    issuerUrl;
    cache;
    inflight;
    constructor(issuer, allowInsecure = false, ttlMs = DEFAULT_TTL_MS) {
        this.issuer = issuer;
        this.allowInsecure = allowInsecure;
        this.ttlMs = ttlMs;
        this.issuerUrl = new URL(issuer);
        if (this.issuerUrl.protocol !== 'https:' && !allowInsecure) {
            throw new ConfigurationError('OIDC issuer must use https (set allowInsecureRequests for local dev)', { issuer });
        }
    }
    async get() {
        if (this.cache && this.cache.expiresAt > Date.now()) {
            return this.cache.doc;
        }
        if (this.inflight) {
            return this.inflight;
        }
        this.inflight = this.fetchDocument().finally(() => {
            this.inflight = undefined;
        });
        return this.inflight;
    }
    async fetchDocument() {
        const url = new URL('.well-known/openid-configuration', this.issuerUrl).toString();
        let res;
        try {
            res = await fetch(url, {
                headers: {
                    accept: 'application/json',
                },
            });
        }
        catch (err) {
            throw new ProviderUnavailableError('OIDC discovery fetch failed', {
                url,
                cause: err.message,
            });
        }
        if (!res.ok) {
            throw new ProviderUnavailableError('OIDC discovery returned non-2xx', {
                url,
                status: res.status,
            });
        }
        const doc = (await res.json());
        if (!doc.issuer ||
            !doc.authorization_endpoint ||
            !doc.token_endpoint ||
            !doc.jwks_uri) {
            throw new ConfigurationError('OIDC discovery document is malformed', {
                issuer: doc.issuer,
            });
        }
        if (doc.issuer !== this.issuer) {
            throw new ConfigurationError('OIDC issuer mismatch', {
                expected: this.issuer,
                actual: doc.issuer,
            });
        }
        this.cache = {
            doc,
            expiresAt: Date.now() + this.ttlMs,
        };
        return doc;
    }
}
//# sourceMappingURL=oidc.discovery.js.map