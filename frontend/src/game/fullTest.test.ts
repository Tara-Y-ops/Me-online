import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS } from './attributes';
import { SHORT_FORM_ITEM_IDS, type QuizItem } from './bfi2Items';
import { applyFullTest, REMAINING_ITEMS } from './fullTest';
import { FULL_FORM_ITEMS, scoreQuiz, SHORT_FORM_ITEMS, type Answer, type QuizAnswers } from './quiz';
import { createCharacter } from '../storage/character';
import type { Character } from './types';

const WEEK = '2026-11-02';
const NOW = new Date('2026-11-07T12:00:00Z');

// Answers every item with the value `pick` returns for it.
function answerAll(pick: (item: QuizItem) => Answer): QuizAnswers {
  const answers: QuizAnswers = {};
  for (const item of FULL_FORM_ITEMS) {
    answers[item.id] = pick(item);
  }
  return answers;
}

// The character right after the 15-item quiz, before any check-in.
function afterQuiz(answers: QuizAnswers): Character {
  return createCharacter(scoreQuiz(SHORT_FORM_ITEMS, answers));
}

// Varied answers so the quiz and full test give different scores.
const MIXED = answerAll((item) => ((item.id % 5) + 1) as Answer);

describe('REMAINING_ITEMS', () => {
  it('is the 45 items not in the short form', () => {
    expect(REMAINING_ITEMS).toHaveLength(45);
    expect(REMAINING_ITEMS.some((item) => SHORT_FORM_ITEM_IDS.includes(item.id))).toBe(false);
    expect(REMAINING_ITEMS.length + SHORT_FORM_ITEMS.length).toBe(FULL_FORM_ITEMS.length);
  });
});

describe('applyFullTest', () => {
  it('uses the full-test scores when there were no check-ins', () => {
    const next = applyFullTest(afterQuiz(MIXED), MIXED, WEEK, NOW);
    const full = scoreQuiz(FULL_FORM_ITEMS, MIXED);
    for (const attribute of ATTRIBUTE_IDS) {
      expect(next.scores[attribute]).toBeCloseTo(full[attribute], 6);
    }
  });

  it('keeps how far check-ins moved each score since the quiz', () => {
    const character = afterQuiz(MIXED);
    character.scores.socialEnergy += 0.8;
    character.scores.calm -= 0.3;
    const next = applyFullTest(character, MIXED, WEEK, NOW);
    const full = scoreQuiz(FULL_FORM_ITEMS, MIXED);
    expect(next.scores.socialEnergy).toBeCloseTo(full.socialEnergy + 0.8, 6);
    expect(next.scores.calm).toBeCloseTo(full.calm - 0.3, 6);
    expect(next.scores.warmth).toBeCloseTo(full.warmth, 6);
  });

  it('keeps scores within 0 to 100', () => {
    // Every item keyed fully toward the high pole: 100 on both tests.
    const answers = answerAll((item) => (item.reverse ? 1 : 5));
    const character = afterQuiz(answers);
    character.scores.curiosity = 99; // Check-ins moved it down by 1
    const next = applyFullTest({ ...character, scores: { ...character.scores, warmth: 101 } }, answers, WEEK, NOW);
    expect(next.scores.curiosity).toBe(99);
    expect(next.scores.warmth).toBe(100);
  });

  it('sets each side from the new score, with exactly 50 as neutral', () => {
    const answers = answerAll(() => 3); // Every attribute scores 50
    const character: Character = {
      ...afterQuiz(answers),
      sides: { curiosity: 'high', discipline: 'low', socialEnergy: 'high', warmth: 'low', calm: 'high' },
    };
    const next = applyFullTest(character, answers, WEEK, NOW);
    for (const attribute of ATTRIBUTE_IDS) {
      expect(next.sides[attribute]).toBe('neutral');
    }
  });

  it('switches side when the new score crosses 50', () => {
    // Short-form items keyed low, the other 45 keyed high.
    const answers = answerAll((item) => {
      const high = !SHORT_FORM_ITEM_IDS.includes(item.id);
      return (high !== item.reverse ? 5 : 1) as Answer;
    });
    const character = afterQuiz(answers);
    expect(character.sides.socialEnergy).toBe('low');
    const next = applyFullTest(character, answers, WEEK, NOW);
    expect(next.scores.socialEnergy).toBe(75);
    expect(next.sides.socialEnergy).toBe('high');
  });

  it('restarts the weekly cap from the new scores and marks the test done', () => {
    const character: Character = {
      ...afterQuiz(MIXED),
      weekStart: { week: WEEK, scores: { curiosity: 0, discipline: 0, socialEnergy: 0, warmth: 0, calm: 0 } },
    };
    const next = applyFullTest(character, MIXED, WEEK, NOW);
    expect(next.weekStart).toEqual({ week: WEEK, scores: next.scores });
    expect(next.fullTestAt).toBe(NOW.toISOString());
    expect(next.createdAt).toBe(character.createdAt);
  });

  it('throws if an item is unanswered', () => {
    const answers = { ...MIXED };
    delete answers[REMAINING_ITEMS[0].id];
    expect(() => applyFullTest(afterQuiz(MIXED), answers, WEEK, NOW)).toThrow();
  });
});
