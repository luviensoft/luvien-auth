import type { ExternalIdentity } from '../domain/identity.js';

export const USER_RESOLVER = Symbol('USER_RESOLVER');

export interface UserResolver {
  /**
   * Return the local user id for the given external identity, or null if unknown.
   * The library never creates users itself; the application decides.
   */
  resolve(identity: {
    tenantId?: string;
    issuer: string;
    subject: string;
    providerId: string;
  }): Promise<string | null>;
}
