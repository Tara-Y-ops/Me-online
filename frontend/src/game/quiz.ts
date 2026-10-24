// The 15-item BFI-2-XS quiz and its scoring. See PRD FR-1.2 and FR-1.4.
//
// Sources:
// - Items and scoring key: Soto & John (2017b), BFI-2-XS.
// - Chinese wording: Zhang et al. (2022), Chinese BFI-2. Every BFI-2-XS item
//   also appears in the 60-item BFI-2, so the official Chinese text is used.
// BFI-2 items copyright 2015 by Oliver P. John and Christopher J. Soto.

import type { AttributeId } from './attributes';

// One quiz statement. The player rates how much it describes them.
export interface QuizItem {
  id: number; // Item number in the BFI-2-XS (1 to 15), also the display order
  bfi2Item: number; // Same statement's number in the 60-item BFI-2, for tracing the source
  text: string; // Chinese wording, completes "我是一个……的人"
  attribute: AttributeId;
  reverse: boolean; // true: agreeing moves the player toward the attribute's low pole
}

// Answer scale: 1 = strongly disagree ... 5 = strongly agree.
export type Answer = 1 | 2 | 3 | 4 | 5;

export const ANSWER_LABELS: Record<Answer, string> = {
  1: '非常不同意',
  2: '不太同意',
  3: '态度中立',
  4: '比较同意',
  5: '非常同意',
};

// The published key scores Negative Emotionality. The game shows its
// opposite, Calm, so those three items have `reverse` flipped:
// published key 4, 9, 14R becomes 4R, 9R, 14 here.
export const QUIZ_ITEMS: QuizItem[] = [
  { id: 1, bfi2Item: 16, text: '比较安静', attribute: 'socialEnergy', reverse: true },
  { id: 2, bfi2Item: 2, text: '心肠柔软，有同情心', attribute: 'warmth', reverse: false },
  { id: 3, bfi2Item: 3, text: '缺乏条理', attribute: 'discipline', reverse: true },
  { id: 4, bfi2Item: 34, text: '时常忧心忡忡，担心很多事情', attribute: 'calm', reverse: true },
  { id: 5, bfi2Item: 20, text: '着迷于艺术、音乐或文学', attribute: 'curiosity', reverse: false },
  { id: 6, bfi2Item: 21, text: '常常处于主导地位，像个领导一样', attribute: 'socialEnergy', reverse: false },
  { id: 7, bfi2Item: 37, text: '有时对人比较粗鲁', attribute: 'warmth', reverse: true },
  { id: 8, bfi2Item: 23, text: '很难开始行动起来去完成一项任务', attribute: 'discipline', reverse: true },
  { id: 9, bfi2Item: 54, text: '时常觉得郁郁寡欢', attribute: 'calm', reverse: true },
  { id: 10, bfi2Item: 55, text: '对抽象的概念和想法没什么兴趣', attribute: 'curiosity', reverse: true },
  { id: 11, bfi2Item: 41, text: '精力充沛', attribute: 'socialEnergy', reverse: false },
  { id: 12, bfi2Item: 57, text: '把人往最好的方面想', attribute: 'warmth', reverse: false },
  { id: 13, bfi2Item: 43, text: '可靠的，总是值得他人信赖', attribute: 'discipline', reverse: false },
  { id: 14, bfi2Item: 29, text: '情绪稳定，不易生气', attribute: 'calm', reverse: false },
  { id: 15, bfi2Item: 60, text: '有创意，能想出新点子', attribute: 'curiosity', reverse: false },
];

// The player's answers, keyed by item id.
export type QuizAnswers = Record<number, Answer>;

// Turns quiz answers into the five starting attribute scores (0 to 100).
//
// Steps, following the BFI-2 scoring key:
// 1. Reverse-keyed answers are flipped: 1<->5, 2<->4, 3 stays 3.
// 2. Each attribute's score is the mean of its three items (1 to 5).
// 3. The mean is converted to 0 to 100 (POMP, Cohen et al., 1999):
//    1 -> 0, 3 -> 50, 5 -> 100.
//
// Throws if any item is unanswered, because the quiz cannot be skipped (FR-1.3).
export function scoreQuiz(answers: QuizAnswers): Record<AttributeId, number> {
  const totals: Record<AttributeId, number> = {
    curiosity: 0,
    discipline: 0,
    socialEnergy: 0,
    warmth: 0,
    calm: 0,
  };
  const counts: Record<AttributeId, number> = { ...totals };

  for (const item of QUIZ_ITEMS) {
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
