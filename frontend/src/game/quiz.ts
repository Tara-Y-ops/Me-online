// The personality quiz: which items to ask and how to score them.
// See PRD FR-1.2 (short form), FR-1.4 (scoring), and FR-1.6 (full test).
// The item text and scoring key live in bfi2Items.ts.

import type { AttributeId } from './attributes';
import { BFI2_ITEMS, SHORT_FORM_ITEM_IDS, type QuizItem } from './bfi2Items';

// Answer scale: 1 = strongly disagree ... 5 = strongly agree.
export type Answer = 1 | 2 | 3 | 4 | 5;

export const ANSWER_LABELS: Record<Answer, string> = {
  1: '非常不同意',
  2: '不太同意',
  3: '态度中立',
  4: '比较同意',
  5: '非常同意',
};

// The player's answers, keyed by BFI-2 item number (1 to 60).
export type QuizAnswers = Record<number, Answer>;

// The 15 items asked first, in BFI-2-XS order.
export const SHORT_FORM_ITEMS: QuizItem[] = SHORT_FORM_ITEM_IDS.map((id) => {
  const item = BFI2_ITEMS.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Short-form item ${id} is missing from BFI2_ITEMS`);
  }
  return item;
});

// All 60 items, for players who continue to the full test.
export const FULL_FORM_ITEMS: QuizItem[] = BFI2_ITEMS;

// Turns answers to a set of items into the five attribute scores (0 to 100).
// Pass SHORT_FORM_ITEMS or FULL_FORM_ITEMS.
//
// Steps, following the BFI-2 scoring key:
// 1. Reverse-keyed answers are flipped: 1<->5, 2<->4, 3 stays 3.
// 2. Each attribute's score is the mean of its items (1 to 5).
// 3. The mean is converted to 0 to 100 (POMP, Cohen et al., 1999):
//    1 -> 0, 3 -> 50, 5 -> 100.
//
// Throws if any item is unanswered, because the quiz cannot be skipped (FR-1.3).
export function scoreQuiz(items: QuizItem[], answers: QuizAnswers): Record<AttributeId, number> {
  const totals: Record<AttributeId, number> = {
    curiosity: 0,
    discipline: 0,
    socialEnergy: 0,
    warmth: 0,
    calm: 0,
  };
  const counts: Record<AttributeId, number> = { ...totals };

  for (const item of items) {
    const answer = answers[item.id];
    if (answer === undefined) {
      throw new Error(`Quiz item ${item.id} is unanswered`);
    }
    const keyed = item.reverse ? 6 - answer : answer;
    totals[item.attribute] += keyed;
    counts[item.attribute] += 1;
  }

  const scores = { ...totals };
  for (const attribute of Object.keys(scores) as AttributeId[]) {
    const mean = totals[attribute] / counts[attribute];
    scores[attribute] = ((mean - 1) / 4) * 100;
  }
  return scores;
}
