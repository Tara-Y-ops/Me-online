import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS, type AttributeId } from './attributes';
import { BFI2_ITEMS, type QuizItem } from './bfi2Items';
import {
  FULL_FORM_ITEMS,
  SHORT_FORM_ITEMS,
  scoreQuiz,
  type Answer,
  type QuizAnswers,
} from './quiz';

// Published scoring keys, copied from the PDFs. "R" marks reverse-keyed items.
// Negative Emotionality is listed under 'calm' as published; the test flips it.
const PUBLISHED_BFI2_KEY: Record<AttributeId, string> = {
  socialEnergy: '1, 6, 11R, 16R, 21, 26R, 31R, 36R, 41, 46, 51R, 56',
  warmth: '2, 7, 12R, 17R, 22R, 27, 32, 37R, 42R, 47R, 52, 57',
  discipline: '3R, 8R, 13, 18, 23R, 28R, 33, 38, 43, 48R, 53, 58R',
  calm: '4R, 9R, 14, 19, 24R, 29R, 34, 39, 44R, 49R, 54, 59',
  curiosity: '5R, 10, 15, 20, 25R, 30R, 35, 40, 45R, 50R, 55R, 60',
};

// BFI-2-XS key, written with each item's 60-item BFI-2 number.
// XS order: 1=16, 2=2, 3=3, 4=34, 5=20, 6=21, 7=37, 8=23, 9=54, 10=55,
// 11=41, 12=57, 13=43, 14=29, 15=60.
const PUBLISHED_XS_KEY: Record<AttributeId, string> = {
  socialEnergy: '16R, 21, 41', // XS 1R, 6, 11
  warmth: '2, 37R, 57', // XS 2, 7R, 12
  discipline: '3R, 23R, 43', // XS 3R, 8R, 13
  calm: '34, 54, 29R', // XS 4, 9, 14R (Negative Emotionality)
  curiosity: '20, 55R, 60', // XS 5, 10R, 15
};

// Checks that the items match a published key exactly.
function expectMatchesKey(items: QuizItem[], key: Record<AttributeId, string>) {
  for (const attribute of ATTRIBUTE_IDS) {
    const actual = items
      .filter((item) => item.attribute === attribute)
      .map((item) => {
        // Calm is the opposite of Negative Emotionality, so flip back.
        const publishedReverse = attribute === 'calm' ? !item.reverse : item.reverse;
        return `${item.id}${publishedReverse ? 'R' : ''}`;
      })
      .sort();
    const expected = key[attribute].split(', ').sort();
    expect(actual, attribute).toEqual(expected);
  }
}

// Gives the same answer to every item in a set.
function answerAll(items: QuizItem[], answer: Answer): QuizAnswers {
  return Object.fromEntries(items.map((item) => [item.id, answer]));
}

describe('item lists', () => {
  it('has 60 full-form items numbered 1 to 60', () => {
    expect(BFI2_ITEMS.map((item) => item.id)).toEqual(
      Array.from({ length: 60 }, (_, index) => index + 1),
    );
  });

  it('matches the published BFI-2 scoring key', () => {
    expectMatchesKey(FULL_FORM_ITEMS, PUBLISHED_BFI2_KEY);
  });

  it('matches the published BFI-2-XS scoring key', () => {
    expect(SHORT_FORM_ITEMS).toHaveLength(15);
    expectMatchesKey(SHORT_FORM_ITEMS, PUBLISHED_XS_KEY);
  });
});

describe('scoreQuiz', () => {
  it('scores all-neutral answers as 50 on every attribute', () => {
    for (const items of [SHORT_FORM_ITEMS, FULL_FORM_ITEMS]) {
      const scores = scoreQuiz(items, answerAll(items, 3));
      for (const attribute of ATTRIBUTE_IDS) {
        expect(scores[attribute]).toBe(50);
      }
    }
  });

  it('scores 100 when every answer points to the high pole', () => {
    for (const items of [SHORT_FORM_ITEMS, FULL_FORM_ITEMS]) {
      const answers: QuizAnswers = Object.fromEntries(
        items.map((item) => [item.id, item.reverse ? 1 : 5] as const),
      );
      const scores = scoreQuiz(items, answers);
      for (const attribute of ATTRIBUTE_IDS) {
        expect(scores[attribute]).toBe(100);
      }
    }
  });

  it('applies reverse keying (Social Energy example)', () => {
    // Item 16 "比较安静" is reversed: 2 counts as 4.
    // Mean of 4, 4, 5 is 13/3, which is 83.33 on 0 to 100.
    const answers = { ...answerAll(SHORT_FORM_ITEMS, 3), 16: 2, 21: 4, 41: 5 } as QuizAnswers;
    expect(scoreQuiz(SHORT_FORM_ITEMS, answers).socialEnergy).toBeCloseTo(83.33, 2);
  });

  it('scores Calm as the opposite of Negative Emotionality', () => {
    // Negative Emotionality XS items: 34, 54, 29R. Answers 5, 4, 2 give a
    // mean of 13/3 (83.33), so Calm is 100 - 83.33 = 16.67.
    const answers = { ...answerAll(SHORT_FORM_ITEMS, 3), 34: 5, 54: 4, 29: 2 } as QuizAnswers;
    expect(scoreQuiz(SHORT_FORM_ITEMS, answers).calm).toBeCloseTo(16.67, 2);
  });

  it('reuses short-form answers for the full test', () => {
    // Only the 15 short-form items are answered, so the full test is incomplete.
    const shortAnswers = answerAll(SHORT_FORM_ITEMS, 4);
    expect(() => scoreQuiz(FULL_FORM_ITEMS, shortAnswers)).toThrow('unanswered');
    // Answering the other 45 completes it without asking the first 15 again.
    const fullAnswers = { ...answerAll(FULL_FORM_ITEMS, 3), ...shortAnswers };
    expect(() => scoreQuiz(FULL_FORM_ITEMS, fullAnswers)).not.toThrow();
  });

  it('throws when an item is unanswered', () => {
    const answers = answerAll(SHORT_FORM_ITEMS, 3);
    delete answers[37];
    expect(() => scoreQuiz(SHORT_FORM_ITEMS, answers)).toThrow('Quiz item 37 is unanswered');
  });
});
