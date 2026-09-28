export declare const Capability: {
    readonly Oidc: "oidc";
    readonly Mfa: "mfa";
    readonly UserProvisioning: "user-provisioning";
    readonly RpInitiatedLogout: "rp-initiated-logout";
    readonly RefreshToken: "refresh-token";
};
export type Capability = (typeof Capability)[keyof typeof Capability];
//# sourceMappingURL=capability.d.ts.map