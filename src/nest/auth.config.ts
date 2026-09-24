import type { GenericOidcProviderConfig } from '../providers/generic-oidc/generic-oidc.config.js';
import type { SessionConfig } from '../core/domain/session.js';
import type { UserResolver } from '../core/port/user-resolver.port.js';

export interface AuthModuleOptions {
  redirectUri: string;
  provider: GenericOidcProviderConfig;
  session?: SessionConfig;
  stateTtlSeconds?: number;

  /**
   * Application-owned user resolver instance.
   * Construct it in AppModule (or via useFactory in forRootAsync) and hand it over.
   */
  userResolver?: UserResolver;
}

export interface AuthModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
}