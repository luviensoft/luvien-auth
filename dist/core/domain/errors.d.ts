export declare class AuthError extends Error {
    readonly code: string;
    readonly context?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, context?: Record<string, unknown> | undefined);
}
export declare class ConfigurationError extends AuthError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class AuthenticationError extends AuthError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class InvalidStateError extends AuthError {
    constructor(context?: Record<string, unknown>);
}
export declare class InvalidNonceError extends AuthError {
    constructor(context?: Record<string, unknown>);
}
export declare class TokenValidationError extends AuthError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ProviderUnavailableError extends AuthError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class IdentityNotFoundError extends AuthError {
    constructor(context?: Record<string, unknown>);
}
export declare class IdentityAlreadyLinkedError extends AuthError {
    constructor(context?: Record<string, unknown>);
}
export declare class UnsupportedCapabilityError extends AuthError {
    constructor(capability: string);
}
//# sourceMappingURL=errors.d.ts.map