import { DynamicModule, Module, Provider } from '@nestjs/common';

import { GenericOidcProvider } from '../providers/generic-oidc/generic-oidc.provider.js';

import { InMemoryIdentityRepository } from '../persistence/in-memory/in-memory-identity.repository.js';
import { InMemorySessionManager } from '../persistence/in-memory/in-memory-session.manager.js';
import { InMemoryStateStore } from '../persistence/in-memory/in-memory-state.store.js';

import { AuthenticationService } from '../core/application/authentication.service.js';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../core/port/identity-repository.port.js';

import {
  SESSION_MANAGER,
  type SessionManager,
} from '../core/port/session-manager.port.js';

import { STATE_STORE, type StateStore } from '../core/port/state-store.port.js';

import {
  USER_RESOLVER,
  type UserResolver,
} from '../core/port/user-resolver.port.js';

import {
  OIDC_PROVIDER,
  type OidcProvider,
} from '../core/port/oidc-provider.port.js';

import { AUTHENTICATION_SERVICE, AuthService } from './auth.service.js';

import { AuthenticationGuard } from './guards/authentication.guard.js';
import { AuthorizationGuard } from './guards/authorization.guard.js';

import { AUTH_CONFIG } from './auth.constants.js';

import type {
  AuthModuleAsyncOptions,
  AuthModuleOptions,
} from './auth.config.js';

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,

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

  static forRootAsync<TArgs extends unknown[]>(
    asyncOptions: AuthModuleAsyncOptions<TArgs>,
  ): DynamicModule {
    const configProvider: Provider = {
      provide: AUTH_CONFIG,
      useFactory: asyncOptions.useFactory as (...args: unknown[]) => unknown,
      inject: (asyncOptions.inject ?? []) as never[],
    };

    return {
      module: AuthModule,
      imports: (asyncOptions.imports ?? []) as never[],
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
}

/**
 * Providers for synchronous configuration.
 */
function buildProviders(options: AuthModuleOptions): Provider[] {
  return [
    {
      provide: AUTH_CONFIG,
      useValue: options,
    },

    {
      provide: OIDC_PROVIDER,

      useFactory: (cfg: AuthModuleOptions): OidcProvider => {
        return new GenericOidcProvider(cfg.provider);
      },

      inject: [AUTH_CONFIG],
    },

    {
      provide: IDENTITY_REPOSITORY,

      useFactory: (): IdentityRepository => {
        return new InMemoryIdentityRepository();
      },
    },

    {
      provide: STATE_STORE,

      useFactory: (): StateStore => {
        return new InMemoryStateStore();
      },
    },

    {
      provide: SESSION_MANAGER,

      useFactory: (cfg: AuthModuleOptions): SessionManager => {
        return new InMemorySessionManager({
          ttlSeconds: cfg.session?.ttlSeconds,
        });
      },

      inject: [AUTH_CONFIG],
    },

    {
      provide: USER_RESOLVER,
      useFactory: (cfg: AuthModuleOptions): UserResolver =>
        cfg.userResolver ?? { resolve: async () => null },
      inject: [AUTH_CONFIG],
    },

    {
      provide: AUTHENTICATION_SERVICE,

      useFactory: (
        provider: OidcProvider,
        identityRepository: IdentityRepository,
        sessionManager: SessionManager,
        stateStore: StateStore,
        userResolver: UserResolver,
        cfg: AuthModuleOptions,
      ): AuthenticationService => {
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

/**
 * Providers for async configuration.
 *
 * USER_RESOLVER can also be supplied through the resolved
 * AuthModuleOptions.
 */
function buildProvidersFromConfig(): Provider[] {
  return [
    {
      provide: OIDC_PROVIDER,

      useFactory: (cfg: AuthModuleOptions): OidcProvider => {
        return new GenericOidcProvider(cfg.provider);
      },

      inject: [AUTH_CONFIG],
    },

    {
      provide: IDENTITY_REPOSITORY,

      useFactory: (): IdentityRepository => {
        return new InMemoryIdentityRepository();
      },
    },

    {
      provide: STATE_STORE,

      useFactory: (): StateStore => {
        return new InMemoryStateStore();
      },
    },

    {
      provide: SESSION_MANAGER,

      useFactory: (cfg: AuthModuleOptions): SessionManager => {
        return new InMemorySessionManager({
          ttlSeconds: cfg.session?.ttlSeconds,
        });
      },

      inject: [AUTH_CONFIG],
    },

    /**
     * Default resolver for forRootAsync().
     *
     * NOTE:
     * If you need an application resolver with forRootAsync(),
     * register USER_RESOLVER directly from the module configuration
     * or refactor this into a general `providers` override mechanism.
     */
    {
      provide: USER_RESOLVER,
      useFactory: (cfg: AuthModuleOptions): UserResolver =>
        cfg.userResolver ?? { resolve: async () => null },
      inject: [AUTH_CONFIG],
    },

    {
      provide: AUTHENTICATION_SERVICE,

      useFactory: (
        provider: OidcProvider,
        identityRepository: IdentityRepository,
        sessionManager: SessionManager,
        stateStore: StateStore,
        userResolver: UserResolver,
        cfg: AuthModuleOptions,
      ): AuthenticationService => {
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
