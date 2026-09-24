export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class ConfigurationError extends AuthError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', context);
  }
}

export class AuthenticationError extends AuthError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', context);
  }
}

export class InvalidStateError extends AuthError {
  constructor(context?: Record<string, unknown>) {
    super('Invalid OAuth state', 'INVALID_STATE', context);
  }
}

export class InvalidNonceError extends AuthError {
  constructor(context?: Record<string, unknown>) {
    super('Invalid OIDC nonce', 'INVALID_NONCE', context);
  }
}

export class TokenValidationError extends AuthError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'TOKEN_VALIDATION_ERROR', context);
  }
}

export class ProviderUnavailableError extends AuthError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'PROVIDER_UNAVAILABLE', context);
  }
}

export class IdentityNotFoundError extends AuthError {
  constructor(context?: Record<string, unknown>) {
    super('Identity not found', 'IDENTITY_NOT_FOUND', context);
  }
}

export class IdentityAlreadyLinkedError extends AuthError {
  constructor(context?: Record<string, unknown>) {
    super('Identity already linked', 'IDENTITY_ALREADY_LINKED', context);
  }
}

export class UnsupportedCapabilityError extends AuthError {
  constructor(capability: string) {
    super(`Unsupported capability: ${capability}`, 'UNSUPPORTED_CAPABILITY', {
      capability,
    });
  }
}
