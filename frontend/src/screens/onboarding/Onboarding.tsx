// First-time player flow: Welcome -> Consent -> Name (docs/user-flows.md, Flow 1).
// From Welcome the player can sign up first, or continue as a guest; both
// then go on to Consent. Once the profile is saved, App shows the quiz next.

import { useState } from 'react';
import type { Profile } from '../../storage/profile';
import { AuthScreen, type AuthTab } from '../main/AuthScreen';
import { ConsentScreen } from './ConsentScreen';
import { NameScreen } from './NameScreen';
import { WelcomeScreen } from './WelcomeScreen';

type Step = 'welcome' | 'auth' | 'consent' | 'name';

interface OnboardingProps {
  onFinish: (profile: Profile) => void;
}

export function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  // Recorded when the player taps "agree", saved with the name at the end.
  const [consentedAt, setConsentedAt] = useState('');
  // Which tab the sign-in / sign-up page opens on.
  const [authTab, setAuthTab] = useState<AuthTab>('signUp');

  function openAuth(tab: AuthTab) {
    setAuthTab(tab);
    setStep('auth');
  }

  switch (step) {
    case 'welcome':
      return (
        <WelcomeScreen
          onSignUp={() => openAuth('signUp')}
          onSignIn={() => openAuth('signIn')}
          onGuest={() => setStep('consent')}
        />
      );
    case 'auth':
      return (
        <AuthScreen
          initialTab={authTab}
          onBack={() => setStep('welcome')}
          onSkip={() => setStep('consent')}
          onSignedIn={() => setStep('consent')}
        />
      );
    case 'consent':
      return (
        <ConsentScreen
          onBack={() => setStep('welcome')}
          onAgree={() => {
            setConsentedAt(new Date().toISOString());
            setStep('name');
          }}
        />
      );
    case 'name':
      return (
        <NameScreen
          onBack={() => setStep('consent')}
          onSubmit={(name) => onFinish({ name, consentedAt })}
        />
      );
  }
}
