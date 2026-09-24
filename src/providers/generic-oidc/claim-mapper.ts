import type { ClaimMapping } from '../../protocols/oidc/oidc.types.js';

export function pickByPath(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === 'object' &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function extractRoles(
  claims: Record<string, unknown>,
  mapping: ClaimMapping | undefined,
): string[] {
  if (!mapping?.roles) return [];
  const paths = Array.isArray(mapping.roles) ? mapping.roles : [mapping.roles];
  const out = new Set<string>();
  for (const p of paths) {
    const value = pickByPath(claims, p);
    if (Array.isArray(value)) {
      for (const v of value) if (typeof v === 'string') out.add(v);
    } else if (typeof value === 'string') {
      out.add(value);
    }
  }
  return [...out];
}
