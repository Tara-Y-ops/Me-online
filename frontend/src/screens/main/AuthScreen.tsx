// 18, 19 Sign in and sign up, opened from the Character tab (FR-9.1).
// Signing up upgrades the device's anonymous user, so nothing is lost.
// Sign-in comes in the next PR together with restoring data on a new phone;
// until then its tab shows a short note.
// No "forgot password" in Sprint 1: it needs email, which is unreliable on
// Supabase's free plan and with mainland Chinese inboxes.

import { useState, type FormEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { signUp } from '../../remote/auth';
import { TEXT } from '../../text';
import { authProblem, signUpProblem, type AuthProblem } from './authForm';

type AuthTab = 'signIn' | 'signUp';

interface AuthScreenProps {
  onBack: () => void;
  onSignedUp: (email: string) => void;
}

export function AuthScreen({ onBack, onSignedUp }: AuthScreenProps) {
  const [tab, setTab] = useState<AuthTab>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    const formProblem = signUpProblem({ email, password, confirm });
    if (formProblem) {
      setProblem(formProblem);
      return;
    }
    setProblem(null);
    setSending(true);
    const code = await signUp(email, password);
    setSending(false);
    if (code === null) {
      onSignedUp(email.trim());
    } else {
      setProblem(authProblem(code));
    }
  }

  return (
    <form className="page" onSubmit={handleSignUp} noValidate>
      <PageHeader title={TEXT.auth.title} onBack={onBack} />

      <div className="page-body">
        <p className="hint auth-intro">
          {tab === 'signUp' ? TEXT.auth.signUpIntro : TEXT.auth.signInIntro}
        </p>

        <div className="auth-tabs" role="tablist">
          {(['signIn', 'signUp'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              className={tab === value ? 'auth-tab auth-tab-selected' : 'auth-tab'}
              onClick={() => {
                setTab(value);
                setProblem(null);
              }}
            >
              {TEXT.auth.tabs[value]}
            </button>
          ))}
        </div>

        {tab === 'signIn' ? (
          <p className="hint">{TEXT.auth.signInSoon}</p>
        ) : (
          <>
            <label className="field-label" htmlFor="auth-email">
              {TEXT.auth.email}
            </label>
            <input
              id="auth-email"
              className="text-input"
              type="email"
              autoComplete="email"
              value={email}
              placeholder={TEXT.auth.emailPlaceholder}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label className="field-label" htmlFor="auth-password">
              {TEXT.auth.newPassword}
            </label>
            <input
              id="auth-password"
              className="text-input"
              type="password"
              autoComplete="new-password"
              value={password}
              placeholder={TEXT.auth.passwordPlaceholder}
              onChange={(event) => setPassword(event.target.value)}
            />

            <label className="field-label" htmlFor="auth-confirm">
              {TEXT.auth.confirmPassword}
            </label>
            <input
              id="auth-confirm"
              className="text-input"
              type="password"
              autoComplete="new-password"
              value={confirm}
              placeholder={TEXT.auth.confirmPlaceholder}
              onChange={(event) => setConfirm(event.target.value)}
            />

            {problem && (
              <p className="form-error" role="alert">
                {TEXT.auth.errors[problem]}
              </p>
            )}

            <button type="submit" className="button-primary auth-submit" disabled={sending}>
              {sending ? TEXT.auth.sending : TEXT.auth.signUp}
            </button>
          </>
        )}

        <button type="button" className="text-button" onClick={onBack}>
          {TEXT.auth.skip}
        </button>
      </div>
    </form>
  );
}
