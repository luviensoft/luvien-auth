import { describe, it, expect } from 'vitest';
import {
  codeChallengeFromVerifier,
  generateCodeVerifier,
  generateState,
} from './oidc.pkce.js';

describe('PKCE', () => {
  it('verifier is url-safe', () => {
    const v = generateCodeVerifier();
    expect(v).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(v.length).toBeGreaterThan(20);
  });

  it('challenge is deterministic', () => {
    const v = generateCodeVerifier();
    expect(codeChallengeFromVerifier(v)).toBe(codeChallengeFromVerifier(v));
  });

  it('state is unique', () => {
    expect(generateState()).not.toBe(generateState());
  });
});
