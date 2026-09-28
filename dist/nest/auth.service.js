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
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationService, } from '../core/application/authentication.service.js';
import { SESSION_MANAGER } from '../core/port/session-manager.port.js';
export const AUTHENTICATION_SERVICE = Symbol('AUTHENTICATION_SERVICE');
let AuthService = class AuthService {
    auth;
    sessions;
    constructor(auth, sessions) {
        this.auth = auth;
        this.sessions = sessions;
    }
    startLogin() {
        return this.auth.startLogin();
    }
    handleCallback(code, state) {
        return this.auth.handleCallback({ code, state });
    }
    async resolveSession(sessionId) {
        const session = await this.sessions.get(sessionId);
        return session ? session.principal : null;
    }
    async logout(sessionId) {
        await this.sessions.destroy(sessionId);
    }
    linkIdentity(principal, input) {
        return this.auth.linkIdentity(principal, input);
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, Inject(AUTHENTICATION_SERVICE)),
    __param(1, Inject(SESSION_MANAGER)),
    __metadata("design:paramtypes", [AuthenticationService, Object])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map