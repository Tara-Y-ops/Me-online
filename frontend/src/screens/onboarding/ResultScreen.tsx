// 05 Initial character: the five starting attributes after the quiz.
// Shown as starting game values, not a personality assessment (FR-1.5).

import { AttributeBar } from '../../components/AttributeBar';
import { ATTRIBUTE_IDS } from '../../game/attributes';
import type { Character } from '../../storage/character';
import { TEXT } from '../../text';

interface ResultScreenProps {
  character: Character;
  onNext: () => void;
}

export function ResultScreen({ character, onNext }: ResultScreenProps) {
  return (
    <div className="page">
      <div className="page-body">
        <h1 className="screen-title">{TEXT.result.title}</h1>
        <p className="hint">{TEXT.result.note}</p>

        <div className="attribute-list">
          {ATTRIBUTE_IDS.map((attribute) => (
            <AttributeBar
              key={attribute}
              attribute={attribute}
              score={character.scores[attribute]}
              side={character.sides[attribute]}
            />
          ))}
        </div>
      </div>

      <div className="page-footer">
        <button type="button" className="button-primary" onClick={onNext}>
          {TEXT.result.next}
        </button>
      </div>
    </div>
  );
}
