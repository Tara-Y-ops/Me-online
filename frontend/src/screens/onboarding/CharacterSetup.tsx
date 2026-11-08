// After the quiz: Initial character -> Does this sound like you? -> How to play
// (docs/user-flows.md, Flow 1). Nothing is saved until the last step, so
// closing the app midway starts again from the initial character.
// The initial character screen can also open the full 60-item test, which
// returns here with the rescored character.

import { useState } from 'react';
import type { AttributeId } from '../../game/attributes';
import type { Character, PlayerSetup, SelfCheck } from '../../game/types';
import { FullTestScreen } from '../character/FullTestScreen';
import { QuestStyleScreen } from './QuestStyleScreen';
import { ResultScreen } from './ResultScreen';
import { SelfCheckScreen } from './SelfCheckScreen';

type Step = 'result' | 'fullTest' | 'selfCheck' | 'questStyle';

interface CharacterSetupProps {
  character: Character;
  onCharacterChange: (character: Character) => void; // After the full test
  onFinish: (setup: PlayerSetup) => void;
}

export function CharacterSetup({ character, onCharacterChange, onFinish }: CharacterSetupProps) {
  const [step, setStep] = useState<Step>('result');
  // Kept until the last step, then saved together with the quest style.
  const [selfCheck, setSelfCheck] = useState<Record<AttributeId, SelfCheck> | null>(null);

  switch (step) {
    case 'result':
      return (
        <ResultScreen
          character={character}
          onFullTest={() => setStep('fullTest')}
          onNext={() => setStep('selfCheck')}
        />
      );
    case 'fullTest':
      return (
        <FullTestScreen
          character={character}
          onExit={() => setStep('result')}
          onFinish={(rescored) => {
            onCharacterChange(rescored);
            setStep('result');
          }}
        />
      );
    case 'selfCheck':
      return (
        <SelfCheckScreen
          character={character}
          onBack={() => setStep('result')}
          onNext={(answers) => {
            setSelfCheck(answers);
            setStep('questStyle');
          }}
        />
      );
    case 'questStyle':
      return (
        <QuestStyleScreen
          onBack={() => setStep('selfCheck')}
          onFinish={(questStyle, focusAttributes) =>
            selfCheck &&
            onFinish({
              selfCheck,
              questStyle,
              focusAttributes,
              completedAt: new Date().toISOString(),
            })
          }
        />
      );
  }
}
