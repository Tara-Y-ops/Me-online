// Root component. Shows one of three stages, based on what is saved:
// 1. No profile yet: onboarding (Welcome, Consent, Name).
// 2. Profile but no character: the quiz, resuming where it stopped.
// 3. Character created: the main pages with the bottom navigation bar.
// Each tab only shows its title for now; the real pages come in later PRs.
// Navigation is plain React state (no router library) to keep it simple.
import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { scoreQuiz, SHORT_FORM_ITEMS, type QuizAnswers } from './game/quiz';
import { Onboarding } from './screens/onboarding/Onboarding';
import { QuizScreen } from './screens/onboarding/QuizScreen';
import { createCharacter, loadCharacter, saveCharacter, type Character } from './storage/character';
import { loadProfile, saveProfile, type Profile } from './storage/profile';
import { TEXT } from './text';

function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [character, setCharacter] = useState<Character | null>(() => loadCharacter());
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');

  // Saved right after Name, so closing the app during the quiz keeps the name.
  function finishOnboarding(newProfile: Profile) {
    saveProfile(newProfile);
    setProfile(newProfile);
  }

  function finishQuiz(answers: QuizAnswers) {
    const newCharacter = createCharacter(scoreQuiz(SHORT_FORM_ITEMS, answers));
    saveCharacter(newCharacter);
    setCharacter(newCharacter);
  }

  if (!profile) {
    return (
      <div className="app">
        <Onboarding onFinish={finishOnboarding} />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="app">
        <QuizScreen onFinish={finishQuiz} />
      </div>
    );
  }

  return (
    <div className="app">
      <main className="screen">
        <h1 className="screen-title">{TEXT.screenTitles[tab]}</h1>
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}

export default App;
