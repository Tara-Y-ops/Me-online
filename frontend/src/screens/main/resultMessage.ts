// The three lines of text on the check-in result card, for each case in the
// wireframes. Kept separate from the card so the choice can be unit-tested.

import { formatPercent } from '../../game/attributes';
import type { Side } from '../../game/attributeChange';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';

export interface ResultMessage {
  headline: string; // Big text, e.g. "内向 +0.1%" or "已记录"
  subtitle: string;
  footnote: string;
}

// Picks the message for a saved check-in.
// sideBefore is the attribute's side before this check-in, to tell a first
// lean away from neutral apart from a normal move.
export function resultMessage(checkIn: CheckIn, sideBefore: Side): ResultMessage {
  const t = TEXT.checkInResult;

  // 21: "还行" never moves the score.
  if (checkIn.reaction === 'okay') {
    return { headline: t.recorded, subtitle: t.okay, footnote: t.okayNote };
  }

  // 12: the weekly cap stopped the move completely.
  if (checkIn.movedToward === null) {
    return { headline: t.recorded, subtitle: t.capped, footnote: t.cappedNote };
  }

  // 10 and 11: shown as a gain toward the pole the score moved to (FR-3.4).
  const pole = TEXT.attributePoles[checkIn.attribute][checkIn.movedToward];
  let footnote: string = t.bothFine;
  if (checkIn.flipped) {
    footnote = t.nowLeaning(pole);
  } else if (sideBefore === 'neutral') {
    footnote = t.startLeaning(pole);
  }
  return {
    headline: t.gain(pole, formatPercent(checkIn.amount)),
    subtitle: t.basedOnFeeling,
    footnote,
  };
}
