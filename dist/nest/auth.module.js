var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
import { Module } from '@nestjs/common';
import { GenericOidcProvider } from '../providers/generic-oidc/generic-oidc.provider.js';
import { InMemoryIdentityRepository } from '../persistence/in-memory/in-memory-identity.repository.js';
import { InMemorySessionManager } from '../persistence/in-memory/in-memory-session.manager.js';
import { InMemoryStateStore } from '../persistence/in-memory/in-memory-state.store.js';
import { AuthenticationService } from '../core/application/authentication.service.js';
import { IDENTITY_REPOSITORY, } from '../core/port/identity-repository.port.js';
import { SESSION_MANAGER, } from '../core/port/session-manager.port.js';
import { STATE_STORE } from '../core/port/state-store.port.js';
import { USER_RESOLVER, } from '../core/port/user-resolver.port.js';
import { OIDC_PROVIDER, } from '../core/port/oidc-provider.port.js';
import { AUTHENTICATION_SERVICE, AuthService } from './auth.service.js';
import { AuthenticationGuard } from './guards/authentication.guard.js';
import { AuthorizationGuard } from './guards/authorization.guard.js';
import { AUTH_CONFIG } from './auth.constants.js';
let AuthModule = AuthModule_1 = class AuthModule {
    static forRoot(options) {
        return {
            module: AuthModule_1,
            providers: buildProviders(options),
            exports: [
                AUTH_CONFIG,
                AUTHENTICATION_SERVICE,
                AuthService,
                AuthenticationGuard,
                AuthorizationGuard,
                OIDC_PROVIDER,
                IDENTITY_REPOSITORY,
                SESSION_MANAGER,
            ],
            global: false,
        };
    }
    static forRootAsync(asyncOptions) {
        const configProvider = {
            provide: AUTH_CONFIG,
            useFactory: asyncOptions.useFactory,
            inject: (asyncOptions.inject ?? []),
        };
        return {
            module: AuthModule_1,
            imports: (asyncOptions.imports ?? []),
            providers: [
                configProvider,
                ...buildProvidersFromConfig(),
                AuthService,
                AuthenticationGuard,
                AuthorizationGuard,
            ],
            exports: [
                AUTH_CONFIG,
                AUTHENTICATION_SERVICE,
                AuthService,
                AuthenticationGuard,
                AuthorizationGuard,
                OIDC_PROVIDER,
                IDENTITY_REPOSITORY,
                SESSION_MANAGER,
            ],
            global: false,
        };
    }
};
AuthModule = AuthModule_1 = __decorate([
    Module({})
], AuthModule);
export { AuthModule };
function buildProviders(options) {
    return [
        {
            provide: AUTH_CONFIG,
            useValue: options,
        },
        {
            provide: OIDC_PROVIDER,
            useFactory: (cfg) => {
                return new GenericOidcProvider(cfg.provider);
            },
            inject: [AUTH_CONFIG],
        },
        {
            provide: IDENTITY_REPOSITORY,
            useFactory: () => {
                return new InMemoryIdentityRepository();
            },
        },
        {
            provide: STATE_STORE,
            useFactory: () => {
                return new InMemoryStateStore();
            },
        },
        {
            provide: SESSION_MANAGER,
            useFactory: (cfg) => {
                return new InMemorySessionManager({
                    ttlSeconds: cfg.session?.ttlSeconds,
                });
            },
            inject: [AUTH_CONFIG],
        },
        {
            provide: USER_RESOLVER,
            useFactory: (cfg) => cfg.userResolver ?? { resolve: async () => null },
            inject: [AUTH_CONFIG],
        },
        {
            provide: AUTHENTICATION_SERVICE,
            useFactory: (provider, identityRepository, sessionManager, stateStore, userResolver, cfg) => {
                return new AuthenticationService({
                    provider,
                    identityRepository,
                    sessionManager,
                    stateStore,
                    userResolver,
                    claimMapping: cfg.provider.claimMapping,
                    session: cfg.session ?? {
                        mode: 'server',
                    },
                    redirectUri: cfg.redirectUri,
                    stateTtlSeconds: cfg.stateTtlSeconds,
                });
            },
            inject: [
                OIDC_PROVIDER,
                IDENTITY_REPOSITORY,
                SESSION_MANAGER,
                STATE_STORE,
                USER_RESOLVER,
                AUTH_CONFIG,
            ],
        },
        AuthService,
        AuthenticationGuard,
        AuthorizationGuard,
    ];
}
function buildProvidersFromConfig() {
    return [
        {
            provide: OIDC_PROVIDER,
            useFactory: (cfg) => {
                return new GenericOidcProvider(cfg.provider);
            },
            inject: [AUTH_CONFIG],
        },
        {
            provide: IDENTITY_REPOSITORY,
            useFactory: () => {
                return new InMemoryIdentityRepository();
            },
        },
        {
            provide: STATE_STORE,
            useFactory: () => {
                return new InMemoryStateStore();
            },
        },
        {
            provide: SESSION_MANAGER,
            useFactory: (cfg) => {
                return new InMemorySessionManager({
                    ttlSeconds: cfg.session?.ttlSeconds,
                });
            },
            inject: [AUTH_CONFIG],
        },
        {
            provide: USER_RESOLVER,
            useFactory: (cfg) => cfg.userResolver ?? { resolve: async () => null },
            inject: [AUTH_CONFIG],
        },
        {
            provide: AUTHENTICATION_SERVICE,
            useFactory: (provider, identityRepository, sessionManager, stateStore, userResolver, cfg) => {
                return new AuthenticationService({
                    provider,
                    identityRepository,
                    sessionManager,
                    stateStore,
                    userResolver,
                    claimMapping: cfg.provider.claimMapping,
                    session: cfg.session ?? {
                        mode: 'server',
                    },
                    redirectUri: cfg.redirectUri,
                    stateTtlSeconds: cfg.stateTtlSeconds,
                });
            },
            inject: [
                OIDC_PROVIDER,
                IDENTITY_REPOSITORY,
                SESSION_MANAGER,
                STATE_STORE,
                USER_RESOLVER,
                AUTH_CONFIG,
            ],
        },
    ];
}
//# sourceMappingURL=auth.module.js.map