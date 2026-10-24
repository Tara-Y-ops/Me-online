// First-time player flow: Welcome -> Consent -> Name (docs/user-flows.md, Flow 1).
// Once the profile is saved, App shows the quiz next.

import { useState } from 'react';
import type { Profile } from '../../storage/profile';
import { ConsentScreen } from './ConsentScreen';
import { NameScreen } from './NameScreen';
import { WelcomeScreen } from './WelcomeScreen';

type Step = 'welcome' | 'consent' | 'name';

interface OnboardingProps {
  onFinish: (profile: Profile) => void;
}

export function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  // Recorded when the player taps "agree", saved with the name at the end.
  const [consentedAt, setConsentedAt] = useState('');

  switch (step) {
    case 'welcome':
      return <WelcomeScreen onStart={() => setStep('consent')} />;
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
