import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service.js';
import { SESSION_MANAGER } from '../../core/port/session-manager.port.js';
import type { SessionManager } from '../../core/port/session-manager.port.js';

export interface AuthenticatedRequest extends Request {
  principal?: import('../../core/domain/identity.js').AuthenticatedPrincipal;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @Inject(SESSION_MANAGER) private readonly sessions: SessionManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const header = req.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      // v1: bearer tokens are not accepted by default. Fail closed.
      throw new UnauthorizedException();
    }

    const sessionId = readSessionCookie(req);
    if (!sessionId) throw new UnauthorizedException();

    const session = await this.sessions.get(sessionId);
    if (!session) throw new UnauthorizedException();

    req.principal = session.principal;
    return true;
  }
}

function readSessionCookie(req: Request): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === 'luvien_session') return decodeURIComponent(rest.join('='));
  }
  return undefined;
}
