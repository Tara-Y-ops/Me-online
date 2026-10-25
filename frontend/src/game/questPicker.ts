// Picks the day's three quests and the replacement when a quest is swapped.
// See PRD FR-2.1 to FR-2.3.
//
// - A stretch quest is on the pole opposite the player's current side.
//   A home quest is on the player's side.
// - Comfort players get 1 stretch quest a day, Explore players get 2.
// - Stretch quests come from the focus attributes first. When those are used
//   up, they come from the other attributes' opposite poles.
// - A neutral attribute has no opposite side: both poles count as home, and
//   if it is a focus attribute, either pole can also be a stretch quest.
// - The three quests cover at least two attributes.
// - Quests shown earlier in the test week are not repeated.

import type { AttributeId } from './attributes';
import type { Side } from './attributeChange';
import { findQuest, QUESTS, type Quest } from './quests';
import type { QuestStyle } from '../storage/playerSetup';

export const QUESTS_PER_DAY = 3;

const STRETCH_PER_DAY: Record<QuestStyle, number> = { comfort: 1, explore: 2 };

export type QuestKind = 'stretch' | 'home';

// One of the day's quests, as saved for the day.
export interface DailyQuest {
  questId: string;
  kind: QuestKind;
}

// What the picker needs to know about the player.
export interface PickContext {
  sides: Record<AttributeId, Side>;
  questStyle: QuestStyle;
  focusAttributes: AttributeId[];
  usedQuestIds: string[]; // Shown earlier in the test week
}

// Returns a random number from 0 (inclusive) to 1 (exclusive), like Math.random.
// Tests pass their own so results are predictable.
type Random = () => number;

// Picks the day's quests: stretch quests first, then home quests.
export function pickDailyQuests(context: PickContext, random: Random = Math.random): DailyQuest[] {
  const daily: DailyQuest[] = [];
  const stretchCount = STRETCH_PER_DAY[context.questStyle];

  while (daily.length < QUESTS_PER_DAY) {
    const kind: QuestKind = daily.length < stretchCount ? 'stretch' : 'home';
    const chosen = daily.map((item) => findQuest(item.questId));
    // On the last slot, make sure the day covers at least two attributes.
    const isLastSlot = daily.length === QUESTS_PER_DAY - 1;
    const avoid = isLastSlot ? sharedAttribute(chosen) : undefined;
    const quest = chooseQuest(poolsFor(kind, context), chosen, context, avoid, random);
    daily.push({ questId: quest.id, kind });
  }
  return daily;
}

// Picks a replacement for the quest at `index`, of the same kind.
// The day keeps covering at least two attributes.
export function swapQuest(
  daily: DailyQuest[],
  index: number,
  context: PickContext,
  random: Random = Math.random,
): DailyQuest {
  const { kind } = daily[index];
  // Today's quests, including the one being swapped out, are never picked again.
  const today = daily.map((item) => findQuest(item.questId));
  const others = today.filter((_, i) => i !== index);
  const quest = chooseQuest(poolsFor(kind, context), today, context, sharedAttribute(others), random);
  return { questId: quest.id, kind };
}

// Candidate lists for a kind of quest, in order of preference.
function poolsFor(kind: QuestKind, context: PickContext): Quest[][] {
  const { sides, focusAttributes } = context;
  const isNeutral = (q: Quest) => sides[q.attribute] === 'neutral';
  const isOpposite = (q: Quest) => !isNeutral(q) && q.pole !== sides[q.attribute];
  const isFocus = (q: Quest) => focusAttributes.includes(q.attribute);

  if (kind === 'home') {
    return [QUESTS.filter((q) => isNeutral(q) || q.pole === sides[q.attribute])];
  }
  return [
    // Focus attributes: the opposite pole, or either pole if neutral.
    QUESTS.filter((q) => isFocus(q) && (isNeutral(q) || isOpposite(q))),
    // Fallback: the opposite pole of the other attributes.
    QUESTS.filter((q) => !isFocus(q) && isOpposite(q)),
  ];
}

// Picks one quest at random, trying in this order:
// 1. Not used this week, and not of the attribute to avoid.
// 2. Not used this week.
// 3. Last resort, if the bank runs out: any quest not already picked today.
// Within each step, earlier pools are preferred.
function chooseQuest(
  pools: Quest[][],
  today: Quest[],
  context: PickContext,
  avoid: AttributeId | undefined,
  random: Random,
): Quest {
  const todayIds = new Set(today.map((q) => q.id));
  const usedIds = new Set(context.usedQuestIds);
  const isFresh = (q: Quest) => !todayIds.has(q.id) && !usedIds.has(q.id);

  const steps = [
    (q: Quest) => isFresh(q) && q.attribute !== avoid,
    isFresh,
    (q: Quest) => !todayIds.has(q.id),
  ];
  for (const step of steps) {
    for (const pool of pools) {
      const candidates = pool.filter(step);
      if (candidates.length > 0) {
        return candidates[Math.floor(random() * candidates.length)];
      }
    }
  }
  throw new Error('No quest available');
}

// The attribute all given quests share, or undefined if they differ (or none).
function sharedAttribute(quests: Quest[]): AttributeId | undefined {
  const attributes = new Set(quests.map((q) => q.attribute));
  return attributes.size === 1 ? quests[0].attribute : undefined;
}
