// 10-12, 21 Check-in result: shown right after saving a check-in. Says which
// attribute moved, toward which pole and by how much (PRD FR-3.4, FR-4.3).
// The bar shows the new score, with an arrow on the side it moved toward.

import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Side } from '../../game/attributeChange';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';
import { resultMessage } from './resultMessage';

interface CheckInResultCardProps {
  checkIn: CheckIn;
  sideBefore: Side; // The attribute's side before this check-in
  score: number; // The attribute's score after this check-in
  side: Side; // The attribute's side after this check-in
  onDone: () => void;
}

export function CheckInResultCard({ checkIn, sideBefore, score, side, onDone }: CheckInResultCardProps) {
  const message = resultMessage(checkIn, sideBefore);
  const poles = TEXT.attributePoles[checkIn.attribute];

  return (
    <div className="result-backdrop">
      <div className="result-card">
        <span className="result-check">
          <Check size={28} aria-hidden="true" />
        </span>
        <h1 className="result-title">{TEXT.checkInResult.title}</h1>
        <p className="hint">{TEXT.attributeNames[checkIn.attribute]}</p>
        <p className="result-headline">{message.headline}</p>
        <p className="hint result-subtitle">{message.subtitle}</p>

        <div className="result-track">
          <span className="result-marker" style={{ left: `${score}%` }}>
            {checkIn.movedToward === 'low' && (
              <ChevronLeft className="result-arrow result-arrow-left" size={20} aria-hidden="true" />
            )}
            {checkIn.movedToward === 'high' && (
              <ChevronRight className="result-arrow result-arrow-right" size={20} aria-hidden="true" />
            )}
          </span>
        </div>
        <div className="result-poles">
          <span className={side === 'low' ? 'attribute-pole-active' : 'attribute-pole'}>{poles.low}</span>
          <span className={side === 'high' ? 'attribute-pole-active' : 'attribute-pole'}>{poles.high}</span>
        </div>

        <p className="hint result-footnote">{message.footnote}</p>
        <button type="button" className="button-primary" onClick={onDone}>
          {TEXT.checkInResult.done}
        </button>
      </div>
    </div>
  );
}
