import { describe, expect, it } from 'vitest';
import { REMAINING_ITEMS } from '../game/fullTest';
import { SHORT_FORM_ITEMS, type QuizAnswers } from '../game/quiz';
import type { CheckIn } from '../game/types';
import {
  checkInRow,
  pendingCheckIns,
  playerRow,
  restoredData,
  type PlayerData,
  type SavedPlayerRow,
} from './rows';

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
    today: null,
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
      week_start: null,
      today: null,
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

describe('restoredData', () => {
  const DAY = '2026-11-07';
  const quizAnswers: QuizAnswers = {};
  SHORT_FORM_ITEMS.forEach((item) => (quizAnswers[item.id] = 4));
  const scores = { curiosity: 60, discipline: 40, socialEnergy: 35.5, warmth: 70, calm: 50 };
  const sides = { curiosity: 'high', discipline: 'low', socialEnergy: 'low', warmth: 'high', calm: 'neutral' } as const;
  const selfCheck = { curiosity: 'yes', discipline: 'no', socialEnergy: 'partly', warmth: 'yes', calm: 'yes' } as const;
  const weekStart = { week: '2026-11-02', scores: { ...scores, socialEnergy: 35 } };
  const player: SavedPlayerRow = {
    user_id: 'user-1',
    anonymous_id: 'device-1',
    name: '铃铛',
    consented_at: '2026-11-01T00:00:00.000Z',
    quiz_answers: quizAnswers,
    full_test_at: null,
    scores,
    sides,
    week_start: weekStart,
    today: {
      day: '2026-11-07',
      quests: [
        { questId: 'war-01', kind: 'home' },
        { questId: 'soc-03', kind: 'stretch' },
        { questId: 'dis-02', kind: 'home' },
      ],
      swapUsed: true,
      doneQuestIds: ['war-01'],
    },
    self_check: selfCheck,
    quest_style: 'comfort',
    focus_attributes: ['warmth'],
    created_at: '2026-11-01T00:05:00+00:00',
    updated_at: '2026-11-04T08:00:00+00:00',
  };
  const row = (questId: string, createdAt: string) => ({ ...checkInRow('user-1', checkIn(questId)), created_at: createdAt });

  it('restores a player who finished setup, with the weekly start scores', () => {
    const data = restoredData(player, [], DAY);
    expect(data.profile).toEqual({ name: '铃铛', consentedAt: '2026-11-01T00:00:00.000Z' });
    expect(data.character).toEqual({
      scores,
      sides,
      createdAt: '2026-11-01T00:05:00+00:00',
      weekStart,
    });
    expect(data.setup).toEqual({
      selfCheck,
      questStyle: 'comfort',
      focusAttributes: ['warmth'],
      completedAt: '2026-11-04T08:00:00+00:00',
    });
    expect(data.quizProgress).toEqual({ answers: quizAnswers, index: SHORT_FORM_ITEMS.length - 1 });
    expect(data.fullTestProgress).toBeNull();
  });

  it('puts check-ins oldest first and marks their quests as shown', () => {
    const data = restoredData(
      player,
      [
        row('cur-01', '2026-11-05T10:00:00+00:00'),
        row('soc-01', '2026-11-03T10:00:00+00:00'),
        { ...row('soc-01', '2026-11-04T10:00:00+00:00'), amount: '0.5' as unknown as number },
      ],
      DAY,
    );
    expect(data.checkIns.map((c) => c.questId)).toEqual(['soc-01', 'soc-01', 'cur-01']);
    expect(data.checkIns[0].createdAt).toBe('2026-11-03T10:00:00.000Z');
    expect(data.checkIns[1].amount).toBe(0.5);
    // Then today's quests, which count as shown too.
    expect(data.shownQuestIds).toEqual(['soc-01', 'cur-01', 'war-01', 'soc-03', 'dis-02']);
  });

  it('keeps today\'s quests on the same game day, with the swap and check-ins', () => {
    expect(restoredData(player, [], DAY).today).toEqual(player.today);
  });

  it('drops today\'s quests on a new game day, so a new set is picked', () => {
    const data = restoredData(player, [], '2026-11-08');
    expect(data.today).toBeNull();
    expect(data.shownQuestIds).toContain('soc-03');
  });

  it('resumes the quiz at the first unanswered item', () => {
    const partial = { ...quizAnswers };
    delete partial[SHORT_FORM_ITEMS[5].id];
    const data = restoredData({ ...player, quiz_answers: partial, scores: null, sides: null }, [], DAY);
    expect(data.character).toBeNull();
    expect(data.quizProgress.index).toBe(5);
  });

  it('resumes an unfinished full test, and keeps a finished one', () => {
    const started = { ...quizAnswers, [REMAINING_ITEMS[0].id]: 3, [REMAINING_ITEMS[1].id]: 2 } as QuizAnswers;
    expect(restoredData({ ...player, quiz_answers: started }, [], DAY).fullTestProgress?.index).toBe(2);

    const finished = restoredData({ ...player, full_test_at: '2026-11-03T00:00:00.000Z' }, [], DAY);
    expect(finished.character?.fullTestAt).toBe('2026-11-03T00:00:00.000Z');
  });

  it('leaves setup empty if it was not finished', () => {
    expect(restoredData({ ...player, quest_style: null }, [], DAY).setup).toBeNull();
  });
});
