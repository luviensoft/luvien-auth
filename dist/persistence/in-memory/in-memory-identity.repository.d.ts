import type { ExternalIdentity } from '../../core/domain/identity.js';
import type { IdentityRepository } from '../../core/port/identity-repository.port.js';
export declare class InMemoryIdentityRepository implements IdentityRepository {
    private readonly byKey;
    private readonly byUser;
    private key;
    findByIssuerSubject(tenantId: string | undefined, issuer: string, subject: string): Promise<ExternalIdentity | null>;
    findByUserId(userId: string): Promise<ExternalIdentity[]>;
    create(identity: ExternalIdentity): Promise<ExternalIdentity>;
    delete(tenantId: string | undefined, issuer: string, subject: string): Promise<void>;
    touch(tenantId: string | undefined, issuer: string, subject: string, at: Date): Promise<void>;
}
//# sourceMappingURL=in-memory-identity.repository.d.ts.map