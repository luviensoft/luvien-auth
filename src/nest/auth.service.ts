import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationService,
  type CallbackResult,
  type StartLoginResult,
} from '../core/application/authentication.service.js';
import type { AuthenticatedPrincipal } from '../core/domain/identity.js';
import { SESSION_MANAGER } from '../core/port/session-manager.port.js';
import type { SessionManager } from '../core/port/session-manager.port.js';

export const AUTHENTICATION_SERVICE = Symbol('AUTHENTICATION_SERVICE');

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTHENTICATION_SERVICE)
    private readonly auth: AuthenticationService,
    @Inject(SESSION_MANAGER)
    private readonly sessions: SessionManager,
  ) {}

  startLogin(): Promise<StartLoginResult> {
    return this.auth.startLogin();
  }

  handleCallback(code: string, state: string): Promise<CallbackResult> {
    return this.auth.handleCallback({ code, state });
  }

  async resolveSession(
    sessionId: string,
  ): Promise<AuthenticatedPrincipal | null> {
    const session = await this.sessions.get(sessionId);
    return session ? session.principal : null;
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessions.destroy(sessionId);
  }

  linkIdentity(
    principal: AuthenticatedPrincipal,
    input: { issuer: string; subject: string; providerId: string },
  ) {
    return this.auth.linkIdentity(principal, input);
  }
}
