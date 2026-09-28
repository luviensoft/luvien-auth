export declare const USER_RESOLVER: unique symbol;
export interface UserResolver {
    resolve(identity: {
        tenantId?: string;
        issuer: string;
        subject: string;
        providerId: string;
    }): Promise<string | null>;
}
//# sourceMappingURL=user-resolver.port.d.ts.map