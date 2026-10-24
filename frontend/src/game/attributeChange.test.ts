import { describe, expect, it } from 'vitest';
import { applyCheckIn, initialSide, type CheckInInput } from './attributeChange';

// A typical starting point: score 35 (leans low), unchanged since Monday.
const base: CheckInInput = {
  score: 35,
  side: 'low',
  weekStartScore: 35,
  questPole: 'high',
  reaction: 'liked',
};

// Starts from another score that has not moved yet this week.
function from(score: number): CheckInInput {
  return { ...base, score, weekStartScore: score };
}

describe('initialSide', () => {
  it('uses the side the score is on, and neutral at exactly 50', () => {
    expect(initialSide(35)).toBe('low');
    expect(initialSide(65)).toBe('high');
    expect(initialSide(50)).toBe('neutral');
  });
});

describe('applyCheckIn', () => {
  it('moves 0.5 toward the quest pole when liked', () => {
    const result = applyCheckIn(base);
    expect(result.score).toBe(35.5);
    expect(result.movedToward).toBe('high');
    expect(result.amount).toBe(0.5);
  });

  it('moves 0.1 toward the opposite pole when disliked', () => {
    // PRD example: disliking a party quest is "Recharge alone +0.1%".
    const result = applyCheckIn({ ...base, reaction: 'disliked' });
    expect(result.score).toBe(34.9);
    expect(result.movedToward).toBe('low');
    expect(result.amount).toBe(0.1);
  });

  it('leaves the score unchanged when okay', () => {
    const result = applyCheckIn({ ...base, reaction: 'okay' });
    expect(result.score).toBe(35);
    expect(result.movedToward).toBeNull();
    expect(result.amount).toBe(0);
  });

  it('stops at +1 from the week-start score', () => {
    // Already +0.8 this week: only 0.2 of the 0.5 is allowed.
    const partly = applyCheckIn({ ...base, score: 35.8 });
    expect(partly.score).toBe(36);
    expect(partly.amount).toBe(0.2);
    expect(partly.capped).toBe(true);

    // Already +1: nothing moves.
    const blocked = applyCheckIn({ ...base, score: 36 });
    expect(blocked.score).toBe(36);
    expect(blocked.movedToward).toBeNull();
    expect(blocked.capped).toBe(true);
  });

  it('stops at -1 from the week-start score', () => {
    const blocked = applyCheckIn({ ...base, score: 34, reaction: 'disliked' });
    expect(blocked.score).toBe(34);
    expect(blocked.capped).toBe(true);
  });

  it('counts net change, so moving back frees up room', () => {
    // +0.5, then -0.1 (net +0.4), then +0.5 (net +0.9): all within the cap.
    let score = 35;
    for (const reaction of ['liked', 'disliked', 'liked'] as const) {
      score = applyCheckIn({ ...base, score, reaction }).score;
    }
    expect(score).toBe(35.9);

    // At the +1 limit, a move back down is still allowed.
    const back = applyCheckIn({ ...base, score: 36, reaction: 'disliked' });
    expect(back.score).toBe(35.9);
    expect(back.capped).toBe(false);
  });

  it('keeps scores within 0 to 100', () => {
    const result = applyCheckIn({ ...from(99.8), side: 'high' });
    expect(result.score).toBe(100);
    expect(result.amount).toBeCloseTo(0.2);
  });

  it('flips the side when the score crosses 50', () => {
    const result = applyCheckIn(from(49.8));
    expect(result.score).toBe(50.3);
    expect(result.side).toBe('high');
    expect(result.flipped).toBe(true);
  });

  it('landing exactly on 50 counts as the side the score moved toward', () => {
    const up = applyCheckIn({ ...from(49.9), reaction: 'disliked', questPole: 'low' });
    expect(up.score).toBe(50);
    expect(up.side).toBe('high');
    expect(up.flipped).toBe(true);

    const down = applyCheckIn({ ...from(50.1), side: 'high', reaction: 'disliked' });
    expect(down.score).toBe(50);
    expect(down.side).toBe('low');
    expect(down.flipped).toBe(true);
  });

  it('leaving neutral picks a side but does not count as a flip', () => {
    const result = applyCheckIn({ ...from(50), side: 'neutral', reaction: 'disliked' });
    expect(result.score).toBe(49.9);
    expect(result.side).toBe('low');
    expect(result.flipped).toBe(false);
  });

  it('stays neutral when nothing moves', () => {
    const result = applyCheckIn({ ...from(50), side: 'neutral', reaction: 'okay' });
    expect(result.side).toBe('neutral');
  });
});
