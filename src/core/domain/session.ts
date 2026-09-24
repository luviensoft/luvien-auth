import type { AuthenticatedPrincipal } from './identity.js';

export type SessionMode = 'none' | 'server';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  principal: AuthenticatedPrincipal;
  data?: Record<string, unknown>;
}

export interface SessionConfig {
  mode: SessionMode;
  ttlSeconds?: number;
  cookieName?: string;
  cookieSecure?: boolean;
  cookieSameSite?: 'lax' | 'strict' | 'none';
  cookieDomain?: string;
}
