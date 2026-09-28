import { randomUUID } from 'node:crypto';
export class InMemoryIdentityRepository {
    byKey = new Map();
    byUser = new Map();
    key(tenantId, issuer, subject) {
        return `${tenantId ?? ''}::${issuer}::${subject}`;
    }
    async findByIssuerSubject(tenantId, issuer, subject) {
        return this.byKey.get(this.key(tenantId, issuer, subject)) ?? null;
    }
    async findByUserId(userId) {
        const keys = this.byUser.get(userId);
        if (!keys)
            return [];
        return [...keys]
            .map((k) => this.byKey.get(k))
            .filter((v) => Boolean(v));
    }
    async create(identity) {
        const record = {
            ...identity,
            id: identity.id || randomUUID(),
            linkedAt: identity.linkedAt ?? new Date(),
        };
        const k = this.key(record.tenantId, record.issuer, record.subject);
        if (this.byKey.has(k)) {
            throw new Error('Identity already exists');
        }
        this.byKey.set(k, record);
        if (!this.byUser.has(record.userId))
            this.byUser.set(record.userId, new Set());
        this.byUser.get(record.userId).add(k);
        return record;
    }
    async delete(tenantId, issuer, subject) {
        const k = this.key(tenantId, issuer, subject);
        const existing = this.byKey.get(k);
        if (!existing)
            return;
        this.byKey.delete(k);
        this.byUser.get(existing.userId)?.delete(k);
    }
    async touch(tenantId, issuer, subject, at) {
        const k = this.key(tenantId, issuer, subject);
        const existing = this.byKey.get(k);
        if (!existing)
            return;
        existing.lastLoginAt = at;
    }
}
//# sourceMappingURL=in-memory-identity.repository.js.map