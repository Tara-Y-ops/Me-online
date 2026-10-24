// After the quiz: Initial character -> Does this sound like you? -> How to play
// (docs/user-flows.md, Flow 1). Nothing is saved until the last step, so
// closing the app midway starts again from the initial character.

import { useState } from 'react';
import type { AttributeId } from '../../game/attributes';
import type { Character } from '../../storage/character';
import type { PlayerSetup, SelfCheck } from '../../storage/playerSetup';
import { QuestStyleScreen } from './QuestStyleScreen';
import { ResultScreen } from './ResultScreen';
import { SelfCheckScreen } from './SelfCheckScreen';

type Step = 'result' | 'selfCheck' | 'questStyle';

interface CharacterSetupProps {
  character: Character;
  onFinish: (setup: PlayerSetup) => void;
}

export function CharacterSetup({ character, onFinish }: CharacterSetupProps) {
  const [step, setStep] = useState<Step>('result');
  // Kept until the last step, then saved together with the quest style.
  const [selfCheck, setSelfCheck] = useState<Record<AttributeId, SelfCheck> | null>(null);

  switch (step) {
    case 'result':
      return <ResultScreen character={character} onNext={() => setStep('selfCheck')} />;
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
