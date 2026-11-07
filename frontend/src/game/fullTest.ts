// The full 60-item BFI-2 test, taken after the 15-item quiz (PRD FR-1.6).
// The player answers only the 45 items they have not seen, and the
// attributes are rescored from all 60. Check-in changes made since the quiz
// are kept. These functions only compute; storage/fullTest.ts saves.

import { ATTRIBUTE_IDS, clampScore, type AttributeId } from './attributes';
import { initialSide, roundScore, type Side } from './attributeChange';
import { SHORT_FORM_ITEM_IDS } from './bfi2Items';
import { FULL_FORM_ITEMS, scoreQuiz, SHORT_FORM_ITEMS, type QuizAnswers } from './quiz';
import type { Character } from '../storage/character';

// The 45 items not in the short form, in BFI-2 order.
export const REMAINING_ITEMS = FULL_FORM_ITEMS.filter(
  (item) => !SHORT_FORM_ITEM_IDS.includes(item.id),
);

// Rescores the character from all 60 answers.
// Each new score is the full-test score plus how far check-ins have moved the
// attribute since the 15-item quiz. Example: the quiz gave 35, check-ins
// moved it to 35.8, and the full test gives 42, so the new score is 42.8.
// Sides are set again as at the start, so a score of exactly 50 is neutral.
// The weekly cap restarts from the new scores, so the jump does not count
// toward this week's limit (FR-4.1).
export function applyFullTest(
  character: Character,
  answers: QuizAnswers,
  week: string, // Monday of the current game week (see chinaTime.ts)
  now: Date = new Date(),
): Character {
  const quizScores = scoreQuiz(SHORT_FORM_ITEMS, answers);
  const fullScores = scoreQuiz(FULL_FORM_ITEMS, answers);

  const scores = {} as Record<AttributeId, number>;
  const sides = {} as Record<AttributeId, Side>;
  for (const attribute of ATTRIBUTE_IDS) {
    const checkInChange = character.scores[attribute] - quizScores[attribute];
    scores[attribute] = roundScore(clampScore(fullScores[attribute] + checkInChange));
    sides[attribute] = initialSide(scores[attribute]);
  }

  return {
    ...character,
    scores,
    sides,
    weekStart: { week, scores: { ...scores } },
    fullTestAt: now.toISOString(),
  };
}
