# @luvien/auth

Authentication and identity library for NestJS applications.

`@luvien/auth` provides provider-agnostic authentication abstractions with a generic OIDC implementation.

## Features

* OIDC / OAuth 2.0 Authorization Code Flow
* PKCE (`S256`)
* ID token validation with JWKS
* External identity mapping
* Session management
* Authentication & authorization guards
* Role extraction from OIDC claims
* Provider capability abstraction
* In-memory adapters for development and testing

## Architecture

The library separates authentication protocols from application-specific persistence and user management.

```text
Application
    │
    ▼
@luvien/auth
    │
    ├── OIDC
    ├── Identity
    ├── Session
    └── Authorization
            │
            ▼
       External IdP
       (Authentik, Keycloak, ...)
```

Application-specific components such as user storage, identity repositories, and session storage are provided through interfaces/adapters.

## Installation

This package is currently distributed directly from GitHub.

```bash
bun add github:luviensoft/luvien-auth
```

Then:

```ts
import { AuthModule } from '@luvien/auth';
```

## Status

🚧 **Work in progress**

The API may change before the first stable release.
