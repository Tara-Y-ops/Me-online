import { describe, expect, it } from 'vitest';
import { authProblem, signUpProblem } from './authForm';

const good = { email: 'ling@example.com', password: 'abcd1234', confirm: 'abcd1234' };

describe('signUpProblem', () => {
  it('accepts a valid form', () => {
    expect(signUpProblem(good)).toBeNull();
    expect(signUpProblem({ ...good, email: '  ling@example.com ' })).toBeNull();
  });

  it('rejects an email without @ or domain', () => {
    expect(signUpProblem({ ...good, email: 'ling' })).toBe('invalidEmail');
    expect(signUpProblem({ ...good, email: 'ling@example' })).toBe('invalidEmail');
    expect(signUpProblem({ ...good, email: 'li ng@example.com' })).toBe('invalidEmail');
  });

  it('needs at least 8 characters in the password', () => {
    expect(signUpProblem({ ...good, password: 'abc1234', confirm: 'abc1234' })).toBe('shortPassword');
  });

  it('needs both passwords to match', () => {
    expect(signUpProblem({ ...good, confirm: 'abcd12345' })).toBe('mismatch');
  });

  it('reports the email first when several fields are wrong', () => {
    expect(signUpProblem({ email: '', password: '1', confirm: '2' })).toBe('invalidEmail');
  });
});

describe('authProblem', () => {
  it('maps Supabase error codes', () => {
    expect(authProblem('email_exists')).toBe('emailTaken');
    expect(authProblem('user_already_exists')).toBe('emailTaken');
    expect(authProblem('invalid_credentials')).toBe('wrongCredentials');
    expect(authProblem('weak_password')).toBe('shortPassword');
    expect(authProblem('over_request_rate_limit')).toBe('unknown');
  });

  it('treats a missing code as a network problem', () => {
    expect(authProblem('')).toBe('network');
    expect(authProblem(null)).toBe('network');
    expect(authProblem(undefined)).toBe('network');
  });
});
