import { randomUUID } from 'node:crypto';
import type { Session } from '../../core/domain/session.js';
import type { AuthenticatedPrincipal } from '../../core/domain/identity.js';
import type { SessionManager } from '../../core/port/session-manager.port.js';

export interface InMemorySessionManagerOptions {
  ttlSeconds?: number;
}

export class InMemorySessionManager implements SessionManager {
  private readonly sessions = new Map<string, Session>();
  private readonly byUser = new Map<string, Set<string>>();
  private readonly ttl: number;

  constructor(opts: InMemorySessionManagerOptions = {}) {
    this.ttl = opts.ttlSeconds ?? 60 * 60 * 8;
  }

  async create(principal: AuthenticatedPrincipal): Promise<Session> {
    const now = new Date();
    const session: Session = {
      id: randomUUID(),
      userId: principal.userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.ttl * 1000),
      principal: { ...principal, sessionId: undefined },
    };
    session.principal.sessionId = session.id;
    this.sessions.set(session.id, session);
    if (!this.byUser.has(session.userId))
      this.byUser.set(session.userId, new Set());
    this.byUser.get(session.userId)!.add(session.id);
    return session;
  }

  async get(sessionId: string): Promise<Session | null> {
    const s = this.sessions.get(sessionId);
    if (!s) return null;
    if (s.expiresAt.getTime() <= Date.now()) {
      await this.destroy(sessionId);
      return null;
    }
    return s;
  }

  async destroy(sessionId: string): Promise<void> {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    this.sessions.delete(sessionId);
    this.byUser.get(s.userId)?.delete(sessionId);
  }

  async destroyByUserId(userId: string): Promise<void> {
    const ids = this.byUser.get(userId);
    if (!ids) return;
    for (const id of ids) this.sessions.delete(id);
    this.byUser.delete(userId);
  }
}
