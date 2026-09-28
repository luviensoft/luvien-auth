import { AuthenticationService, type CallbackResult, type StartLoginResult } from '../core/application/authentication.service.js';
import type { AuthenticatedPrincipal } from '../core/domain/identity.js';
import type { SessionManager } from '../core/port/session-manager.port.js';
export declare const AUTHENTICATION_SERVICE: unique symbol;
export declare class AuthService {
    private readonly auth;
    private readonly sessions;
    constructor(auth: AuthenticationService, sessions: SessionManager);
    startLogin(): Promise<StartLoginResult>;
    handleCallback(code: string, state: string): Promise<CallbackResult>;
    resolveSession(sessionId: string): Promise<AuthenticatedPrincipal | null>;
    logout(sessionId: string): Promise<void>;
    linkIdentity(principal: AuthenticatedPrincipal, input: {
        issuer: string;
        subject: string;
        providerId: string;
    }): Promise<import("../core/domain/identity.js").ExternalIdentity>;
}
//# sourceMappingURL=auth.service.d.ts.map