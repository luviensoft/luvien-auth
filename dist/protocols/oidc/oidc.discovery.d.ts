import type { OidcDiscoveryDocument } from './oidc.types.js';
export declare class OidcDiscovery {
    private readonly issuer;
    private readonly allowInsecure;
    private readonly ttlMs;
    private readonly issuerUrl;
    private cache?;
    private inflight?;
    constructor(issuer: string, allowInsecure?: boolean, ttlMs?: number);
    get(): Promise<OidcDiscoveryDocument>;
    private fetchDocument;
}
//# sourceMappingURL=oidc.discovery.d.ts.map