// 05a Does this sound like you? The player rates each attribute as
// 很像我 / 有点像 / 不太像. All five are required; there is no skip (FR-1.7).

import { useState } from 'react';
import { leaningLabel } from '../../components/AttributeBar';
import { PageHeader } from '../../components/PageHeader';
import { ATTRIBUTE_IDS, type AttributeId } from '../../game/attributes';
import type { Character } from '../../storage/character';
import type { SelfCheck } from '../../storage/playerSetup';
import { TEXT } from '../../text';

const OPTIONS: SelfCheck[] = ['yes', 'partly', 'no'];

interface SelfCheckScreenProps {
  character: Character;
  onBack: () => void;
  onNext: (selfCheck: Record<AttributeId, SelfCheck>) => void;
}

export function SelfCheckScreen({ character, onBack, onNext }: SelfCheckScreenProps) {
  const [answers, setAnswers] = useState<Partial<Record<AttributeId, SelfCheck>>>({});
  const allAnswered = ATTRIBUTE_IDS.every((attribute) => answers[attribute]);

  return (
    <div className="page">
      <PageHeader title={TEXT.selfCheck.title} onBack={onBack} />

      <div className="page-body">
        <p className="body-text">{TEXT.selfCheck.intro}</p>

        {ATTRIBUTE_IDS.map((attribute) => (
          <div key={attribute} className="self-check-row">
            <p className="self-check-heading">
              <strong>{TEXT.attributeNames[attribute]}</strong>
              <span className="hint">
                {leaningLabel(attribute, character.scores[attribute], character.sides[attribute])}
              </span>
            </p>
            <div className="chip-row">
              {OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={answers[attribute] === option ? 'chip chip-selected' : 'chip'}
                  aria-pressed={answers[attribute] === option}
                  onClick={() => setAnswers((prev) => ({ ...prev, [attribute]: option }))}
                >
                  {TEXT.selfCheck.options[option]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="page-footer">
        <button
          type="button"
          className="button-primary"
          disabled={!allAnswered}
          onClick={() => onNext(answers as Record<AttributeId, SelfCheck>)}
        >
          {TEXT.selfCheck.next}
        </button>
      </div>
    </div>
  );
}
