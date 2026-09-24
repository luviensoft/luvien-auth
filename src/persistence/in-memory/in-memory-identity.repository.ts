import { randomUUID } from 'node:crypto';
import type { ExternalIdentity } from '../../core/domain/identity.js';
import type { IdentityRepository } from '../../core/port/identity-repository.port.js';

export class InMemoryIdentityRepository implements IdentityRepository {
  private readonly byKey = new Map<string, ExternalIdentity>();
  private readonly byUser = new Map<string, Set<string>>();

  private key(tenantId: string | undefined, issuer: string, subject: string) {
    return `${tenantId ?? ''}::${issuer}::${subject}`;
  }

  async findByIssuerSubject(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
  ): Promise<ExternalIdentity | null> {
    return this.byKey.get(this.key(tenantId, issuer, subject)) ?? null;
  }

  async findByUserId(userId: string): Promise<ExternalIdentity[]> {
    const keys = this.byUser.get(userId);
    if (!keys) return [];
    return [...keys]
      .map((k) => this.byKey.get(k))
      .filter((v): v is ExternalIdentity => Boolean(v));
  }

  async create(identity: ExternalIdentity): Promise<ExternalIdentity> {
    const record: ExternalIdentity = {
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
    this.byUser.get(record.userId)!.add(k);
    return record;
  }

  async delete(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
  ): Promise<void> {
    const k = this.key(tenantId, issuer, subject);
    const existing = this.byKey.get(k);
    if (!existing) return;
    this.byKey.delete(k);
    this.byUser.get(existing.userId)?.delete(k);
  }

  async touch(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
    at: Date,
  ): Promise<void> {
    const k = this.key(tenantId, issuer, subject);
    const existing = this.byKey.get(k);
    if (!existing) return;
    existing.lastLoginAt = at;
  }
}
