import type { AuthenticatedPrincipal, ExternalIdentity } from '../domain/identity.js';
import type { IdentityRepository } from '../port/identity-repository.port.js';
import type { OidcProvider } from '../port/oidc-provider.port.js';
import type { SessionManager } from '../port/session-manager.port.js';
import type { StateStore } from '../port/state-store.port.js';
import type { UserResolver } from '../port/user-resolver.port.js';
import type { ClaimMapping } from '../../protocols/oidc/oidc.types.js';
import type { SessionConfig } from '../domain/session.js';
export interface AuthenticationServiceOptions {
    provider: OidcProvider;
    identityRepository: IdentityRepository;
    sessionManager: SessionManager;
    stateStore: StateStore;
    userResolver: UserResolver;
    claimMapping?: ClaimMapping;
    session: SessionConfig;
    stateTtlSeconds?: number;
    redirectUri: string;
}
export interface StartLoginResult {
    url: string;
    state: string;
}
export interface CallbackInput {
    code: string;
    state: string;
}
export interface CallbackResult {
    principal: AuthenticatedPrincipal;
    sessionId?: string;
}
export declare class AuthenticationService {
    private readonly opts;
    private readonly stateTtl;
    constructor(opts: AuthenticationServiceOptions);
    startLogin(): Promise<StartLoginResult>;
    handleCallback(input: CallbackInput): Promise<CallbackResult>;
    linkIdentity(principal: AuthenticatedPrincipal, input: {
        issuer: string;
        subject: string;
        providerId: string;
    }): Promise<ExternalIdentity>;
}
//# sourceMappingURL=authentication.service.d.ts.map