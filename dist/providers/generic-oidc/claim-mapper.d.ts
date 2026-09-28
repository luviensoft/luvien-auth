import type { ClaimMapping } from '../../protocols/oidc/oidc.types.js';
export declare function pickByPath(obj: Record<string, unknown>, path: string): unknown;
export declare function extractRoles(claims: Record<string, unknown>, mapping: ClaimMapping | undefined): string[];
//# sourceMappingURL=claim-mapper.d.ts.map