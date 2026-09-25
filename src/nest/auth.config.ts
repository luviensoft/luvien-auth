import type { Provider } from '@nestjs/common';
import type { GenericOidcProviderConfig } from '../providers/generic-oidc/generic-oidc.config.js';
import type { SessionConfig } from '../core/domain/session.js';
import type { UserResolver } from '../core/port/user-resolver.port.js';

/**
 * The configuration contract owned by @luvien/auth.
 *
 * Contains only declarative configuration. No NestJS providers, no DI
 * instances, no runtime dependencies. The application composes this from
 * its own environment and hands it to AuthModule.
 */
export interface AuthConfig {
  redirectUri: string;
  provider: GenericOidcProviderConfig;
  session?: SessionConfig;
  stateTtlSeconds?: number;
}

/**
 * Nest module options. Extends AuthConfig with application-supplied
 * adapter instances. This is what AuthModule.forRoot actually receives.
 */
export interface AuthModuleOptions extends AuthConfig {
  userResolver?: UserResolver;
}

/**
 * Async variant. The generic TArgs allows callers to declare the exact
 * argument tuple that `useFactory` expects.
 */
export interface AuthModuleAsyncOptions<TArgs extends unknown[] = any[]> {
  imports?: unknown[];
  inject?: Array<string | symbol | Function>;
  useFactory: (
    ...args: TArgs
  ) => Promise<AuthModuleOptions> | AuthModuleOptions;
}
