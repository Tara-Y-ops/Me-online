// One attribute as a horizontal bar: low pole on the left, high pole on the
// right, and a marker at the score. Above the marker it shows how far the
// player leans, e.g. "65.0% 内向", or "中立" for a neutral start.
// Used on the initial character screen and later on the Character tab.

import { formatPercent, percentToward, type AttributeId } from '../game/attributes';
import type { Side } from '../game/attributeChange';
import { TEXT } from '../text';

// How far the player leans, e.g. "65.0% 内向", or "中立" for a neutral start.
export function leaningLabel(attribute: AttributeId, score: number, side: Side): string {
  if (side === 'neutral') {
    return TEXT.neutral;
  }
  return `${formatPercent(percentToward(score, side))} ${TEXT.attributePoles[attribute][side]}`;
}

interface AttributeBarProps {
  attribute: AttributeId;
  score: number; // 0 to 100
  side: Side;
}

export function AttributeBar({ attribute, score, side }: AttributeBarProps) {
  const poles = TEXT.attributePoles[attribute];
  const label = leaningLabel(attribute, score, side);

  return (
    <div className="attribute-bar" aria-label={`${TEXT.attributeNames[attribute]} ${label}`}>
      <span className={side === 'low' ? 'attribute-pole attribute-pole-active' : 'attribute-pole'}>
        {poles.low}
      </span>
      <div className="attribute-track">
        {/* Kept away from the edges so long labels stay on screen. */}
        <span
          className="attribute-label"
          style={{ left: `${Math.min(80, Math.max(20, score))}%` }}
        >
          {label}
        </span>
        <span className="attribute-marker" style={{ left: `${score}%` }} />
      </div>
      <span className={side === 'high' ? 'attribute-pole attribute-pole-active' : 'attribute-pole'}>
        {poles.high}
      </span>
    </div>
  );
}
