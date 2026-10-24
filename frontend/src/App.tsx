// Root component. Shows one of four stages, based on what is saved:
// 1. No profile yet: onboarding (Welcome, Consent, Name).
// 2. Profile but no character: the quiz, resuming where it stopped.
// 3. Character but no player setup: initial character, self-check, quest style.
// 4. Setup saved: the main pages with the bottom navigation bar.
// The Character tab is built; the other tabs only show their title for now.
// Navigation is plain React state (no router library) to keep it simple.
import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { scoreQuiz, SHORT_FORM_ITEMS, type QuizAnswers } from './game/quiz';
import { CharacterTab } from './screens/main/CharacterTab';
import { CharacterSetup } from './screens/onboarding/CharacterSetup';
import { Onboarding } from './screens/onboarding/Onboarding';
import { QuizScreen } from './screens/onboarding/QuizScreen';
import { createCharacter, loadCharacter, saveCharacter, type Character } from './storage/character';
import { loadPlayerSetup, savePlayerSetup, type PlayerSetup } from './storage/playerSetup';
import { loadProfile, saveProfile, type Profile } from './storage/profile';
import { TEXT } from './text';

function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [character, setCharacter] = useState<Character | null>(() => loadCharacter());
  const [setup, setSetup] = useState<PlayerSetup | null>(() => loadPlayerSetup());
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

  function finishSetup(newSetup: PlayerSetup) {
    savePlayerSetup(newSetup);
    setSetup(newSetup);
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

  if (!setup) {
    return (
      <div className="app">
        <CharacterSetup character={character} onFinish={finishSetup} />
      </div>
    );
  }

  return (
    <div className="app">
      <main className="screen">
        {tab === 'character' ? (
          // Check-ins don't exist yet, so the count is 0 until the check-in PR.
          <CharacterTab profile={profile} character={character} setup={setup} checkInCount={0} />
        ) : (
          <h1 className="screen-title">{TEXT.screenTitles[tab]}</h1>
        )}
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}

export default App;
