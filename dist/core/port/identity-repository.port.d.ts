import type { ExternalIdentity } from '../domain/identity.js';
export declare const IDENTITY_REPOSITORY: unique symbol;
export interface IdentityRepository {
    findByIssuerSubject(tenantId: string | undefined, issuer: string, subject: string): Promise<ExternalIdentity | null>;
    findByUserId(userId: string): Promise<ExternalIdentity[]>;
    create(identity: ExternalIdentity): Promise<ExternalIdentity>;
    delete(tenantId: string | undefined, issuer: string, subject: string): Promise<void>;
    touch(tenantId: string | undefined, issuer: string, subject: string, at: Date): Promise<void>;
}
//# sourceMappingURL=identity-repository.port.d.ts.map