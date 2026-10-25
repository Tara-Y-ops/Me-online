import { describe, expect, it } from 'vitest';
import type { AttributeId } from './attributes';
import type { Side } from './attributeChange';
import { pickDailyQuests, swapQuest, type DailyQuest, type PickContext } from './questPicker';
import { findQuest, QUESTS } from './quests';

// A player who leans low on everything except Curiosity.
const SIDES: Record<AttributeId, Side> = {
  curiosity: 'high',
  discipline: 'low',
  socialEnergy: 'low',
  warmth: 'low',
  calm: 'low',
};

const explorer: PickContext = {
  sides: SIDES,
  questStyle: 'explore',
  focusAttributes: ['socialEnergy'],
  usedQuestIds: [],
};

// Small seeded random number generator (mulberry32), so each test run
// sees the same "random" picks.
function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Checks every rule that must hold for one day's quests.
function expectValidDay(daily: DailyQuest[], context: PickContext) {
  const quests = daily.map((item) => findQuest(item.questId));
  expect(new Set(daily.map((item) => item.questId)).size, 'no duplicates').toBe(3);
  expect(new Set(quests.map((q) => q.attribute)).size, 'two attributes').toBeGreaterThanOrEqual(2);
  for (const [i, item] of daily.entries()) {
    const quest = quests[i];
    const side = context.sides[quest.attribute];
    if (item.kind === 'home') {
      expect(side === 'neutral' || quest.pole === side, `${quest.id} is home`).toBe(true);
    } else if (side === 'neutral') {
      expect(context.focusAttributes, `${quest.id} neutral stretch`).toContain(quest.attribute);
    } else {
      expect(quest.pole, `${quest.id} is stretch`).not.toBe(side);
    }
  }
}

describe('pickDailyQuests', () => {
  it('gives Explore players 2 stretch quests and Comfort players 1', () => {
    const kinds = (context: PickContext) =>
      pickDailyQuests(context, seeded(1)).map((item) => item.kind);
    expect(kinds(explorer)).toEqual(['stretch', 'stretch', 'home']);
    expect(kinds({ ...explorer, questStyle: 'comfort' })).toEqual(['stretch', 'home', 'home']);
  });

  it('takes stretch quests from the focus attribute first', () => {
    const daily = pickDailyQuests(explorer, seeded(2));
    for (const item of daily.filter((i) => i.kind === 'stretch')) {
      const quest = findQuest(item.questId);
      expect(quest.attribute).toBe('socialEnergy');
      expect(quest.pole).toBe('high'); // The player leans low
    }
  });

  it('falls back to other attributes when the focus quests are used up', () => {
    const focusStretch = QUESTS.filter((q) => q.attribute === 'socialEnergy' && q.pole === 'high');
    const context = { ...explorer, usedQuestIds: focusStretch.map((q) => q.id) };
    const daily = pickDailyQuests(context, seeded(3));
    expectValidDay(daily, context);
    for (const item of daily.filter((i) => i.kind === 'stretch')) {
      expect(findQuest(item.questId).attribute).not.toBe('socialEnergy');
    }
  });

  it('treats both poles of a neutral attribute as home quests', () => {
    const context: PickContext = {
      sides: { curiosity: 'neutral', discipline: 'neutral', socialEnergy: 'neutral', warmth: 'neutral', calm: 'neutral' },
      questStyle: 'comfort',
      focusAttributes: ['warmth'],
      usedQuestIds: [],
    };
    for (let seed = 0; seed < 50; seed++) {
      const daily = pickDailyQuests(context, seeded(seed));
      expectValidDay(daily, context);
      // With every attribute neutral, stretch quests can only be from the focus attribute.
      expect(findQuest(daily[0].questId).attribute).toBe('warmth');
    }
  });

  it('follows every rule across many random days', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const questStyle of ['comfort', 'explore'] as const) {
        const context = { ...explorer, questStyle };
        expectValidDay(pickDailyQuests(context, seeded(seed)), context);
      }
    }
  });

  it('repeats no quest over a full test week, including one swap a day', () => {
    const random = seeded(7);
    const used: string[] = [];
    for (let day = 0; day < 7; day++) {
      const context = { ...explorer, usedQuestIds: [...used] };
      const daily = pickDailyQuests(context, random);
      const swapped = swapQuest(daily, 0, context, random);
      const shown = [...daily.map((item) => item.questId), swapped.questId];
      expect(shown.filter((id) => used.includes(id)), `day ${day + 1}`).toEqual([]);
      used.push(...shown);
    }
    expect(new Set(used).size).toBe(28);
  });

  it('still picks quests if the whole bank has been used', () => {
    const context = { ...explorer, usedQuestIds: QUESTS.map((q) => q.id) };
    expectValidDay(pickDailyQuests(context, seeded(4)), context);
  });
});

describe('swapQuest', () => {
  it('replaces a quest with a new one of the same kind', () => {
    for (let seed = 0; seed < 100; seed++) {
      const random = seeded(seed);
      const daily = pickDailyQuests(explorer, random);
      for (let index = 0; index < 3; index++) {
        const replacement = swapQuest(daily, index, explorer, random);
        expect(replacement.kind).toBe(daily[index].kind);
        expect(daily.map((item) => item.questId)).not.toContain(replacement.questId);
        const after = daily.map((item, i) => (i === index ? replacement : item));
        expectValidDay(after, explorer);
      }
    }
  });
});
