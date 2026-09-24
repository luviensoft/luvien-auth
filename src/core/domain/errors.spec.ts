import { describe, it, expect } from 'vitest';
import { AuthenticationError } from './errors.js';

describe('AuthenticationError', () => {
  it('carries code and context', () => {
    const err = new AuthenticationError('nope', { a: 1 });
    expect(err.code).toBe('AUTHENTICATION_ERROR');
    expect(err.context).toEqual({ a: 1 });
    expect(err.name).toBe('AuthenticationError');
  });
});
