// The full 60-item test (FR-1.6): asks the 45 items not in the short quiz,
// then rescores the character. Opened from the initial character screen or
// the Character tab; the back arrow returns there and progress is kept.

import { REMAINING_ITEMS } from '../../game/fullTest';
import { SHORT_FORM_ITEMS } from '../../game/quiz';
import type { Character } from '../../game/types';
import { finishFullTest, loadFullTestProgress, saveFullTestProgress } from '../../storage/fullTest';
import { TEXT } from '../../text';
import { QuizScreen } from '../onboarding/QuizScreen';

interface FullTestScreenProps {
  character: Character;
  onExit: () => void;
  onFinish: (character: Character) => void; // The rescored character, already saved
}

export function FullTestScreen({ character, onExit, onFinish }: FullTestScreenProps) {
  return (
    <QuizScreen
      title={TEXT.fullTest.title}
      items={REMAINING_ITEMS}
      answeredBefore={SHORT_FORM_ITEMS.length}
      loadProgress={loadFullTestProgress}
      saveProgress={saveFullTestProgress}
      onExit={onExit}
      onFinish={(answers) => onFinish(finishFullTest(character, answers))}
    />
  );
}
