var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ROLES_KEY } from '../decorators/require-roles.decorator.js';
let AuthorizationGuard = class AuthorizationGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const required = this.reflector.getAllAndOverride(REQUIRE_ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!required || required.length === 0)
            return true;
        const req = context.switchToHttp().getRequest();
        const roles = req.principal?.roles ?? [];
        const ok = required.some((r) => roles.includes(r));
        if (!ok)
            throw new ForbiddenException();
        return true;
    }
};
AuthorizationGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], AuthorizationGuard);
export { AuthorizationGuard };
//# sourceMappingURL=authorization.guard.js.map