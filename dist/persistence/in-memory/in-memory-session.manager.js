import { randomUUID } from 'node:crypto';
export class InMemorySessionManager {
    sessions = new Map();
    byUser = new Map();
    ttl;
    constructor(opts = {}) {
        this.ttl = opts.ttlSeconds ?? 60 * 60 * 8;
    }
    async create(principal) {
        const now = new Date();
        const session = {
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
        this.byUser.get(session.userId).add(session.id);
        return session;
    }
    async get(sessionId) {
        const s = this.sessions.get(sessionId);
        if (!s)
            return null;
        if (s.expiresAt.getTime() <= Date.now()) {
            await this.destroy(sessionId);
            return null;
        }
        return s;
    }
    async destroy(sessionId) {
        const s = this.sessions.get(sessionId);
        if (!s)
            return;
        this.sessions.delete(sessionId);
        this.byUser.get(s.userId)?.delete(sessionId);
    }
    async destroyByUserId(userId) {
        const ids = this.byUser.get(userId);
        if (!ids)
            return;
        for (const id of ids)
            this.sessions.delete(id);
        this.byUser.delete(userId);
    }
}
//# sourceMappingURL=in-memory-session.manager.js.map