import { randomBytes, createHash } from 'node:crypto';

export function generateCodeVerifier(): string {
  return base64UrlEncode(randomBytes(32));
}

export function codeChallengeFromVerifier(verifier: string): string {
  const digest = createHash('sha256').update(verifier).digest();
  return base64UrlEncode(digest);
}

export function generateState(): string {
  return base64UrlEncode(randomBytes(16));
}

export function generateNonce(): string {
  return base64UrlEncode(randomBytes(16));
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
