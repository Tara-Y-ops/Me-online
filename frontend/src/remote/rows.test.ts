import { describe, expect, it } from 'vitest';
import type { CheckIn } from '../storage/checkIns';
import { checkInRow, pendingCheckIns, playerRow, type PlayerData } from './rows';

const NOW = new Date('2026-11-08T02:00:00Z');

function checkIn(questId: string): CheckIn {
  return {
    questId,
    kind: 'stretch',
    day: '2026-11-07',
    createdAt: `2026-11-07T10:00:00.000Z`,
    reaction: 'disliked',
    note: '有点累',
    tags: ['太赶'],
    attribute: 'socialEnergy',
    movedToward: 'low',
    amount: 0.1,
    capped: false,
    flipped: false,
  };
}

describe('playerRow', () => {
  const base: PlayerData = {
    userId: 'user-1',
    anonymousId: 'device-1',
    profile: { name: '铃铛', consentedAt: '2026-11-01T00:00:00.000Z' },
    answers: { 16: 4, 2: 3 },
    character: null,
    setup: null,
  };

  it('leaves later parts empty before the player reaches them', () => {
    expect(playerRow(base, NOW)).toEqual({
      user_id: 'user-1',
      anonymous_id: 'device-1',
      name: '铃铛',
      consented_at: '2026-11-01T00:00:00.000Z',
      quiz_answers: { 16: 4, 2: 3 },
      full_test_at: null,
      scores: null,
      sides: null,
      self_check: null,
      quest_style: null,
      focus_attributes: null,
      updated_at: NOW.toISOString(),
    });
  });

  it('includes the character and setup once saved', () => {
    const scores = { curiosity: 60, discipline: 40, socialEnergy: 35.5, warmth: 70, calm: 50 };
    const sides = { curiosity: 'high', discipline: 'low', socialEnergy: 'low', warmth: 'high', calm: 'neutral' } as const;
    const selfCheck = { curiosity: 'yes', discipline: 'no', socialEnergy: 'partly', warmth: 'yes', calm: 'yes' } as const;
    const row = playerRow(
      {
        ...base,
        character: { scores, sides, createdAt: NOW.toISOString(), fullTestAt: '2026-11-03T00:00:00.000Z' },
        setup: { selfCheck, questStyle: 'explore', focusAttributes: ['socialEnergy'], completedAt: NOW.toISOString() },
      },
      NOW,
    );
    expect(row.scores).toEqual(scores);
    expect(row.sides).toEqual(sides);
    expect(row.full_test_at).toBe('2026-11-03T00:00:00.000Z');
    expect(row.self_check).toEqual(selfCheck);
    expect(row.quest_style).toBe('explore');
    expect(row.focus_attributes).toEqual(['socialEnergy']);
  });
});

describe('checkInRow', () => {
  it('maps every field to its column', () => {
    expect(checkInRow('user-1', checkIn('soc-01'))).toEqual({
      user_id: 'user-1',
      quest_id: 'soc-01',
      created_at: '2026-11-07T10:00:00.000Z',
      kind: 'stretch',
      day: '2026-11-07',
      reaction: 'disliked',
      note: '有点累',
      tags: ['太赶'],
      attribute: 'socialEnergy',
      moved_toward: 'low',
      amount: 0.1,
      capped: false,
      flipped: false,
    });
  });
});

describe('pendingCheckIns', () => {
  const all = [checkIn('soc-01'), checkIn('cur-01'), checkIn('dis-01')];

  it('returns everything before the first upload', () => {
    expect(pendingCheckIns(all, null, 'user-1')).toEqual(all);
  });

  it('skips check-ins already uploaded for this user', () => {
    expect(pendingCheckIns(all, { userId: 'user-1', checkInsUploaded: 2 }, 'user-1')).toEqual([all[2]]);
    expect(pendingCheckIns(all, { userId: 'user-1', checkInsUploaded: 3 }, 'user-1')).toEqual([]);
  });

  it('uploads everything again under a new user', () => {
    expect(pendingCheckIns(all, { userId: 'old-user', checkInsUploaded: 3 }, 'user-1')).toEqual(all);
  });
});
