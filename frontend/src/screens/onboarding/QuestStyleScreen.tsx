// 05b How do you want to play? The player picks a quest style and one or two
// attributes to explore (FR-1.8). Both are required to continue.

import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { ATTRIBUTE_IDS, type AttributeId } from '../../game/attributes';
import type { QuestStyle } from '../../storage/playerSetup';
import { TEXT } from '../../text';

const STYLES: QuestStyle[] = ['comfort', 'explore'];
const MAX_FOCUS = 2;

interface QuestStyleScreenProps {
  onBack: () => void;
  onFinish: (questStyle: QuestStyle, focusAttributes: AttributeId[]) => void;
}

export function QuestStyleScreen({ onBack, onFinish }: QuestStyleScreenProps) {
  const [questStyle, setQuestStyle] = useState<QuestStyle | null>(null);
  const [focus, setFocus] = useState<AttributeId[]>([]);

  // Tapping a selected attribute removes it; a third pick is ignored.
  function toggleFocus(attribute: AttributeId) {
    setFocus((prev) => {
      if (prev.includes(attribute)) {
        return prev.filter((item) => item !== attribute);
      }
      return prev.length < MAX_FOCUS ? [...prev, attribute] : prev;
    });
  }

  return (
    <div className="page">
      <PageHeader title={TEXT.questStyle.title} onBack={onBack} />

      <div className="page-body">
        <h2 className="section-heading">{TEXT.questStyle.styleQuestion}</h2>
        <div className="options" role="radiogroup">
          {STYLES.map((style) => (
            <label key={style} className={style === questStyle ? 'option option-selected' : 'option'}>
              <input
                type="radio"
                name="quest-style"
                checked={style === questStyle}
                onChange={() => setQuestStyle(style)}
              />
              <span>
                <span className="option-title">{TEXT.questStyle.options[style].title}</span>
                <span className="hint">{TEXT.questStyle.options[style].description}</span>
              </span>
            </label>
          ))}
        </div>

        <h2 className="section-heading focus-heading">{TEXT.questStyle.focusQuestion}</h2>
        <p className="hint">{TEXT.questStyle.focusHint}</p>
        <div className="chip-row">
          {ATTRIBUTE_IDS.map((attribute) => (
            <button
              key={attribute}
              type="button"
              className={focus.includes(attribute) ? 'chip chip-selected' : 'chip'}
              aria-pressed={focus.includes(attribute)}
              onClick={() => toggleFocus(attribute)}
            >
              {TEXT.attributeNames[attribute]}
            </button>
          ))}
        </div>
      </div>

      <div className="page-footer">
        <button
          type="button"
          className="button-primary"
          disabled={!questStyle || focus.length === 0}
          onClick={() => questStyle && onFinish(questStyle, focus)}
        >
          {TEXT.questStyle.start}
        </button>
      </div>
    </div>
  );
}
