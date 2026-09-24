export interface ExternalIdentity {
  id: string;
  tenantId?: string;
  issuer: string;
  subject: string;
  providerId: string;
  userId: string;
  linkedAt: Date;
  lastLoginAt?: Date;
}

export interface AuthenticatedPrincipal {
  userId: string;
  sessionId?: string;
  identities: ExternalIdentity[];
  claims: Record<string, unknown>;
  roles: string[];
  authTime: Date;
  acr?: string;
  amr?: string[];
}
