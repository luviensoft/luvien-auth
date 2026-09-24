import type { ExternalIdentity } from '../domain/identity.js';

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');

export interface IdentityRepository {
  findByIssuerSubject(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
  ): Promise<ExternalIdentity | null>;

  findByUserId(userId: string): Promise<ExternalIdentity[]>;

  create(identity: ExternalIdentity): Promise<ExternalIdentity>;

  delete(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
  ): Promise<void>;

  touch(
    tenantId: string | undefined,
    issuer: string,
    subject: string,
    at: Date,
  ): Promise<void>;
}
