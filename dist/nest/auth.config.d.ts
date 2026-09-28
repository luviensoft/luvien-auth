import type { GenericOidcProviderConfig } from '../providers/generic-oidc/generic-oidc.config.js';
import type { SessionConfig } from '../core/domain/session.js';
import type { UserResolver } from '../core/port/user-resolver.port.js';
export interface AuthConfig {
    redirectUri: string;
    provider: GenericOidcProviderConfig;
    session?: SessionConfig;
    stateTtlSeconds?: number;
}
export interface AuthModuleOptions extends AuthConfig {
    userResolver?: UserResolver;
}
export interface AuthModuleAsyncOptions<TArgs extends unknown[] = any[]> {
    imports?: unknown[];
    inject?: Array<string | symbol | Function>;
    useFactory: (...args: TArgs) => Promise<AuthModuleOptions> | AuthModuleOptions;
}
//# sourceMappingURL=auth.config.d.ts.map