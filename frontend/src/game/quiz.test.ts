import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS } from './attributes';
import { QUIZ_ITEMS, scoreQuiz, type Answer, type QuizAnswers } from './quiz';

// Gives the same answer to every item.
function answerAll(answer: Answer): QuizAnswers {
  return Object.fromEntries(QUIZ_ITEMS.map((item) => [item.id, answer]));
}

describe('QUIZ_ITEMS', () => {
  it('has 15 items, three per attribute', () => {
    expect(QUIZ_ITEMS).toHaveLength(15);
    for (const attribute of ATTRIBUTE_IDS) {
      expect(QUIZ_ITEMS.filter((item) => item.attribute === attribute)).toHaveLength(3);
    }
  });
});

describe('scoreQuiz', () => {
  it('scores all-neutral answers as 50 on every attribute', () => {
    const scores = scoreQuiz(answerAll(3));
    for (const attribute of ATTRIBUTE_IDS) {
      expect(scores[attribute]).toBe(50);
    }
  });

  it('scores 100 when every answer points to the high pole', () => {
    const answers: QuizAnswers = Object.fromEntries(
      QUIZ_ITEMS.map((item) => [item.id, item.reverse ? 1 : 5] as const),
    );
    const scores = scoreQuiz(answers);
    for (const attribute of ATTRIBUTE_IDS) {
      expect(scores[attribute]).toBe(100);
    }
  });

  it('applies reverse keying (Social Energy example)', () => {
    // Item 1 "比较安静" is reversed: 2 counts as 4.
    // Mean of 4, 4, 5 is 13/3, which is 83.33 on 0 to 100.
    const answers = { ...answerAll(3), 1: 2, 6: 4, 11: 5 } as QuizAnswers;
    expect(scoreQuiz(answers).socialEnergy).toBeCloseTo(83.33, 2);
  });

  it('scores Calm as the opposite of Negative Emotionality', () => {
    // Negative Emotionality key: 4, 9, 14R. Answers 5, 4, 2 give a mean of
    // 13/3 (83.33), so Calm is 100 - 83.33 = 16.67.
    const answers = { ...answerAll(3), 4: 5, 9: 4, 14: 2 } as QuizAnswers;
    expect(scoreQuiz(answers).calm).toBeCloseTo(16.67, 2);
  });

  it('throws when an item is unanswered', () => {
    const answers = answerAll(3);
    delete answers[7];
    expect(() => scoreQuiz(answers)).toThrow('Quiz item 7 is unanswered');
  });
});
