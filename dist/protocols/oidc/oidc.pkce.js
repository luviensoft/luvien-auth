import { randomBytes, createHash } from 'node:crypto';
export function generateCodeVerifier() {
    return base64UrlEncode(randomBytes(32));
}
export function codeChallengeFromVerifier(verifier) {
    const digest = createHash('sha256').update(verifier).digest();
    return base64UrlEncode(digest);
}
export function generateState() {
    return base64UrlEncode(randomBytes(16));
}
export function generateNonce() {
    return base64UrlEncode(randomBytes(16));
}
function base64UrlEncode(buf) {
    return buf
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
//# sourceMappingURL=oidc.pkce.js.map