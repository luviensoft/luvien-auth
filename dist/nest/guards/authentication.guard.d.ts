import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service.js';
import type { SessionManager } from '../../core/port/session-manager.port.js';
export interface AuthenticatedRequest extends Request {
    principal?: import('../../core/domain/identity.js').AuthenticatedPrincipal;
}
export declare class AuthenticationGuard implements CanActivate {
    private readonly authService;
    private readonly sessions;
    constructor(authService: AuthService, sessions: SessionManager);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=authentication.guard.d.ts.map