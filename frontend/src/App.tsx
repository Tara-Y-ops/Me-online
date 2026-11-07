// Root component. Shows one of four stages, based on what is saved:
// 1. No profile yet: onboarding (Welcome, Consent, Name).
// 2. Profile but no character: the quiz, resuming where it stopped.
// 3. Character but no player setup: initial character, self-check, quest style.
// 4. Setup saved: the main pages (see screens/main/Main.tsx).
// Navigation is plain React state (no router library) to keep it simple.
import { useEffect, useState } from 'react';
import { scoreQuiz, SHORT_FORM_ITEMS, type QuizAnswers } from './game/quiz';
import { syncToServer } from './remote/sync';
import { Main } from './screens/main/Main';
import { CharacterSetup } from './screens/onboarding/CharacterSetup';
import { Onboarding } from './screens/onboarding/Onboarding';
import { QuizScreen } from './screens/onboarding/QuizScreen';
import { createCharacter, loadCharacter, saveCharacter, type Character } from './storage/character';
import { loadPlayerSetup, savePlayerSetup, type PlayerSetup } from './storage/playerSetup';
import { loadProfile, saveProfile, type Profile } from './storage/profile';
import { loadQuizProgress, saveQuizProgress } from './storage/quizProgress';
import { TEXT } from './text';

function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [character, setCharacter] = useState<Character | null>(() => loadCharacter());
  const [setup, setSetup] = useState<PlayerSetup | null>(() => loadPlayerSetup());

  // Uploads the player's data whenever it changes: after Name, the quiz, the
  // setup, the full test, and check-ins that move a score.
  useEffect(() => {
    syncToServer();
  }, [profile, character, setup]);

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

  function saveSetup(newSetup: PlayerSetup) {
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
        <QuizScreen
          title={TEXT.quiz.title}
          items={SHORT_FORM_ITEMS}
          loadProgress={loadQuizProgress}
          saveProgress={saveQuizProgress}
          onFinish={finishQuiz}
        />
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="app">
        <CharacterSetup character={character} onCharacterChange={setCharacter} onFinish={saveSetup} />
      </div>
    );
  }

  return (
    <div className="app">
      <Main
        profile={profile}
        character={character}
        setup={setup}
        onCharacterChange={setCharacter}
        onSetupChange={saveSetup}
      />
    </div>
  );
}

export default App;
