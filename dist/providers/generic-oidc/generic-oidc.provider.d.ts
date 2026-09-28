import { Capability } from '../../core/domain/capability.js';
import type { TokenSet } from '../../core/domain/token.js';
import type { AuthorizationRequest, AuthorizationUrlResult, CallbackParams, OidcCallbackResult, OidcProvider } from '../../core/port/oidc-provider.port.js';
import type { GenericOidcProviderConfig } from './generic-oidc.config.js';
export declare class GenericOidcProvider implements OidcProvider {
    private readonly config;
    readonly providerId: string;
    readonly issuer: string;
    private readonly discovery;
    private readonly validator;
    private readonly scopes;
    private readonly tokenAuthMethod;
    constructor(config: GenericOidcProviderConfig);
    hasCapability(capability: Capability): boolean;
    buildAuthorizationUrl(request: AuthorizationRequest): Promise<AuthorizationUrlResult>;
    handleCallback(params: CallbackParams): Promise<OidcCallbackResult>;
    refresh(refreshToken: string): Promise<TokenSet>;
    buildLogoutUrl(input: {
        idTokenHint?: string;
        postLogoutRedirectUri?: string;
        state?: string;
    }): Promise<string | null>;
    private exchangeCode;
    private postToken;
}
//# sourceMappingURL=generic-oidc.provider.d.ts.map