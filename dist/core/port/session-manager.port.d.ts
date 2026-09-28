import type { Session } from '../domain/session.js';
import type { AuthenticatedPrincipal } from '../domain/identity.js';
export declare const SESSION_MANAGER: unique symbol;
export interface SessionManager {
    create(principal: AuthenticatedPrincipal): Promise<Session>;
    get(sessionId: string): Promise<Session | null>;
    destroy(sessionId: string): Promise<void>;
    destroyByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=session-manager.port.d.ts.map