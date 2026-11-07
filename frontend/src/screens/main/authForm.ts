// Checks on the sign-up form, and which message to show for each problem.
// Kept separate from the screen so the rules can be unit-tested.

export const MIN_PASSWORD_LENGTH = 8;

// Problems the screen can show. Keys of TEXT.auth.errors.
export type AuthProblem =
  | 'invalidEmail'
  | 'shortPassword'
  | 'mismatch'
  | 'emailTaken'
  | 'wrongCredentials'
  | 'network'
  | 'unknown';

export interface SignUpForm {
  email: string;
  password: string;
  confirm: string;
}

// Something before the @, a domain with a dot after it, and no spaces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The first problem with the form, or null if it can be sent.
export function signUpProblem(form: SignUpForm): AuthProblem | null {
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return 'invalidEmail';
  }
  if (form.password.length < MIN_PASSWORD_LENGTH) {
    return 'shortPassword';
  }
  if (form.password !== form.confirm) {
    return 'mismatch';
  }
  return null;
}

// Turns a Supabase Auth error code into a problem to show. An empty or
// missing code means the request never reached Supabase.
export function authProblem(code: string | null | undefined): AuthProblem {
  switch (code) {
    case '':
    case null:
    case undefined:
      return 'network';
    case 'email_exists':
    case 'user_already_exists':
      return 'emailTaken';
    case 'invalid_credentials':
      return 'wrongCredentials';
    case 'email_address_invalid':
      return 'invalidEmail';
    case 'weak_password':
      return 'shortPassword';
    default:
      return 'unknown';
  }
}
