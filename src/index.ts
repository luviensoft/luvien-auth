// Module & service
export { AuthModule } from './nest/auth.module.js';
export { AuthService } from './nest/auth.service.js';

// Guards & decorators
export { AuthenticationGuard } from './nest/guards/authentication.guard.js';
export { AuthorizationGuard } from './nest/guards/authorization.guard.js';
export { CurrentUser } from './nest/decorators/current-user.decorator.js';
export { RequireRoles } from './nest/decorators/require-roles.decorator.js';

// Config types
export type {
  AuthModuleOptions,
  AuthModuleAsyncOptions,
} from './nest/auth.config.js';
export type { GenericOidcProviderConfig } from './providers/generic-oidc/generic-oidc.config.js';
export type {
  SessionConfig,
  SessionMode,
  Session,
} from './core/domain/session.js';
export type {
  AuthenticatedPrincipal,
  ExternalIdentity,
} from './core/domain/identity.js';
export type { TokenSet, TokenClaims } from './core/domain/token.js';

// port (for consumers implementing their own adapters)
export type { IdentityRepository } from './core/port/identity-repository.port.js';
export type { SessionManager } from './core/port/session-manager.port.js';
export type { UserResolver } from './core/port/user-resolver.port.js';
export type { StateStore } from './core/port/state-store.port.js';
export type { OidcProvider } from './core/port/oidc-provider.port.js';

// DI tokens
export { IDENTITY_REPOSITORY } from './core/port/identity-repository.port.js';
export { SESSION_MANAGER } from './core/port/session-manager.port.js';
export { USER_RESOLVER } from './core/port/user-resolver.port.js';
export { STATE_STORE } from './core/port/state-store.port.js';
export { OIDC_PROVIDER } from './core/port/oidc-provider.port.js';

// Errors
export {
  AuthError,
  AuthenticationError,
  ConfigurationError,
  InvalidNonceError,
  InvalidStateError,
  IdentityAlreadyLinkedError,
  IdentityNotFoundError,
  ProviderUnavailableError,
  TokenValidationError,
  UnsupportedCapabilityError,
} from './core/domain/errors.js';
