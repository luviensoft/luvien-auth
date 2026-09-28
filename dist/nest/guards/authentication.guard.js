var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { SESSION_MANAGER } from '../../core/port/session-manager.port.js';
let AuthenticationGuard = class AuthenticationGuard {
    authService;
    sessions;
    constructor(authService, sessions) {
        this.authService = authService;
        this.sessions = sessions;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const header = req.headers.authorization;
        if (typeof header === 'string' && header.startsWith('Bearer ')) {
            throw new UnauthorizedException();
        }
        const sessionId = readSessionCookie(req);
        if (!sessionId)
            throw new UnauthorizedException();
        const session = await this.sessions.get(sessionId);
        if (!session)
            throw new UnauthorizedException();
        req.principal = session.principal;
        return true;
    }
};
AuthenticationGuard = __decorate([
    Injectable(),
    __param(1, Inject(SESSION_MANAGER)),
    __metadata("design:paramtypes", [AuthService, Object])
], AuthenticationGuard);
export { AuthenticationGuard };
function readSessionCookie(req) {
    const raw = req.headers.cookie;
    if (!raw)
        return undefined;
    for (const part of raw.split(';')) {
        const [k, ...rest] = part.trim().split('=');
        if (k === 'luvien_session')
            return decodeURIComponent(rest.join('='));
    }
    return undefined;
}
//# sourceMappingURL=authentication.guard.js.map