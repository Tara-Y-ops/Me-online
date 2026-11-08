// 18, 19 Sign in and sign up, opened from the welcome screen or the
// Character tab (FR-9.1).
// Signing up upgrades the device's anonymous user, so nothing is lost.
// Signing in to an account with data replaces the device's data and reloads
// the app (see remote/auth.ts).
// No "forgot password" in Sprint 1: it needs email, which is unreliable on
// Supabase's free plan and with mainland Chinese inboxes.

import { useState, type FormEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { signIn, signUp } from '../../remote/auth';
import { TEXT } from '../../text';
import { authProblem, signInProblem, signUpProblem, type AuthProblem } from './authForm';

export type AuthTab = 'signIn' | 'signUp';

interface AuthScreenProps {
  initialTab: AuthTab;
  onBack: () => void;
  onSkip: () => void; // "暂时不登录，继续使用"
  // After signing up, or signing in to an account with no data yet. The
  // device keeps its data in both cases.
  onSignedIn: (email: string) => void;
}

export function AuthScreen({ initialTab, onBack, onSkip, onSignedIn }: AuthScreenProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [problem, setProblem] = useState<AuthProblem | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const formProblem =
      tab === 'signUp' ? signUpProblem({ email, password, confirm }) : signInProblem(email, password);
    if (formProblem) {
      setProblem(formProblem);
      return;
    }
    setProblem(null);
    setSending(true);
    if (tab === 'signUp') {
      const code = await signUp(email, password);
      setSending(false);
      if (code === null) {
        onSignedIn(email.trim());
      } else {
        setProblem(authProblem(code));
      }
    } else {
      const result = await signIn(email, password);
      if ('error' in result) {
        setSending(false);
        setProblem(authProblem(result.error));
      } else if (!result.restored) {
        setSending(false);
        onSignedIn(email.trim());
      }
      // When restored, the app is reloading; the button stays on "请稍候".
    }
  }

  function switchTab(value: AuthTab) {
    setTab(value);
    setProblem(null);
  }

  return (
    <form className="page" onSubmit={handleSubmit} noValidate>
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
              onClick={() => switchTab(value)}
            >
              {TEXT.auth.tabs[value]}
            </button>
          ))}
        </div>

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
          {tab === 'signUp' ? TEXT.auth.newPassword : TEXT.auth.password}
        </label>
        <input
          id="auth-password"
          className="text-input"
          type="password"
          autoComplete={tab === 'signUp' ? 'new-password' : 'current-password'}
          value={password}
          placeholder={TEXT.auth.passwordPlaceholder}
          onChange={(event) => setPassword(event.target.value)}
        />

        {tab === 'signUp' && (
          <>
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
          </>
        )}

        {problem && (
          <p className="form-error" role="alert">
            {TEXT.auth.errors[problem]}
          </p>
        )}

        <button type="submit" className="button-primary auth-submit" disabled={sending}>
          {sending ? TEXT.auth.sending : tab === 'signUp' ? TEXT.auth.signUp : TEXT.auth.signIn}
        </button>

        <button type="button" className="text-button" onClick={onSkip}>
          {TEXT.auth.skip}
        </button>
      </div>
    </form>
  );
}
