import type { Session } from '../../core/domain/session.js';
import type { AuthenticatedPrincipal } from '../../core/domain/identity.js';
import type { SessionManager } from '../../core/port/session-manager.port.js';
export interface InMemorySessionManagerOptions {
    ttlSeconds?: number;
}
export declare class InMemorySessionManager implements SessionManager {
    private readonly sessions;
    private readonly byUser;
    private readonly ttl;
    constructor(opts?: InMemorySessionManagerOptions);
    create(principal: AuthenticatedPrincipal): Promise<Session>;
    get(sessionId: string): Promise<Session | null>;
    destroy(sessionId: string): Promise<void>;
    destroyByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=in-memory-session.manager.d.ts.map