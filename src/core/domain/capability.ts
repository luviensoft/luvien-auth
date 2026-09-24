export const Capability = {
  Oidc: 'oidc',
  Mfa: 'mfa',
  UserProvisioning: 'user-provisioning',
  RpInitiatedLogout: 'rp-initiated-logout',
  RefreshToken: 'refresh-token',
} as const;

export type Capability = (typeof Capability)[keyof typeof Capability];
