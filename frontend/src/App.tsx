// Root component. Shows one of four stages, based on what is saved:
// 1. No profile yet: onboarding (Welcome, Consent, Name).
// 2. Profile but no character: the quiz, resuming where it stopped.
// 3. Character but no player setup: initial character, self-check, quest style.
// 4. Setup saved: the main pages (see screens/Main.tsx).
// Navigation is plain React state (no router library) to keep it simple.
// The language button sits above every stage.
import { useEffect, useState } from 'react';
import { LanguageButton } from './components/LanguageButton';
import { scoreQuiz, SHORT_FORM_ITEMS, type QuizAnswers } from './game/quiz';
import type { Character, Language, PlayerSetup, Profile } from './game/types';
import { syncToServer } from './remote/sync';
import { Main } from './screens/Main';
import { CharacterSetup } from './screens/onboarding/CharacterSetup';
import { Onboarding } from './screens/onboarding/Onboarding';
import { QuizScreen } from './screens/onboarding/QuizScreen';
import { createCharacter, loadCharacter, saveCharacter } from './storage/character';
import { loadLanguage, saveLanguage } from './storage/language';
import { loadPlayerSetup, savePlayerSetup } from './storage/playerSetup';
import { loadProfile, saveProfile } from './storage/profile';
import { loadQuizProgress, saveQuizProgress } from './storage/quizProgress';
import { setLanguage, TEXT } from './text';

function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [character, setCharacter] = useState<Character | null>(() => loadCharacter());
  const [setup, setSetup] = useState<PlayerSetup | null>(() => loadPlayerSetup());
  // main.tsx has already applied the saved language to TEXT.
  const [language, setLanguageState] = useState<Language>(loadLanguage);

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

  // Switches between Chinese and English. Changing this state re-renders
  // every screen with the new TEXT, without losing the player's place.
  function toggleLanguage() {
    const next = language === 'zh' ? 'en' : 'zh';
    saveLanguage(next);
    setLanguage(next);
    setLanguageState(next);
    syncToServer(); // The language is saved in the players row for the research
  }

  function currentScreen() {
    if (!profile) {
      return <Onboarding onFinish={finishOnboarding} />;
    }
    if (!character) {
      return (
        <QuizScreen
          title={TEXT.quiz.title}
          items={SHORT_FORM_ITEMS}
          loadProgress={loadQuizProgress}
          saveProgress={saveQuizProgress}
          onFinish={finishQuiz}
        />
      );
    }
    if (!setup) {
      return <CharacterSetup character={character} onCharacterChange={setCharacter} onFinish={saveSetup} />;
    }
    return (
      <Main
        profile={profile}
        character={character}
        setup={setup}
        onCharacterChange={setCharacter}
        onSetupChange={saveSetup}
      />
    );
  }

  return (
    <div className="app">
      <LanguageButton onClick={toggleLanguage} />
      {currentScreen()}
    </div>
  );
}

export default App;
