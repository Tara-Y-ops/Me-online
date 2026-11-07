// The Preference Map: which kinds of quests the player liked and disliked.
// See PRD FR-6. These functions only compute; the Preference Map tab shows
// the result.

import { ATTRIBUTE_IDS, type AttributeId, type Pole } from './attributes';
import type { Reaction } from './attributeChange';
import { findQuest } from './quests';
import type { CheckIn } from '../storage/checkIns';

// The map unlocks after this many check-ins of any reaction (FR-6.1).
export const UNLOCK_CHECK_INS = 5;
// At most this many energizers and drainers are listed (FR-6.3).
export const MAX_LISTED_GROUPS = 3;
// At most this many tags are shown for each energizer or drainer.
export const MAX_GROUP_TAGS = 3;

// The parts of a check-in the map needs.
export type MapCheckIn = Pick<CheckIn, 'questId' | 'reaction' | 'tags'>;

// All check-ins for quests of one attribute and pole, such as
// "外向性 · 外向". A check-in counts toward the quest's own pole, even when
// the player disliked it.
export interface PreferenceGroup {
  attribute: AttributeId;
  pole: Pole;
  counts: Record<Reaction, number>;
  likedTags: string[]; // From Liked check-ins, most used first
  dislikedTags: string[]; // From Disliked check-ins, most used first
  latest: number; // Position of the group's newest check-in, to break ties
}

export interface PreferenceMap {
  energizers: PreferenceGroup[]; // Most likes first, only groups with a like
  drainers: PreferenceGroup[]; // Most dislikes first, only groups with a dislike
  groups: PreferenceGroup[]; // Every group with a check-in, in display order
}

// How many more check-ins unlock the map, or 0 once it is unlocked.
export function checkInsToUnlock(checkInCount: number): number {
  return Math.max(0, UNLOCK_CHECK_INS - checkInCount);
}

// Builds the map from check-ins saved oldest first.
export function buildPreferenceMap(checkIns: MapCheckIn[]): PreferenceMap {
  const groups = new Map<string, PreferenceGroup>();
  // Tag counts per group and reaction. Filled newest first, so among tags
  // used equally often the most recent comes first after sorting.
  const tagCounts = new Map<string, Map<string, number>>();

  for (let index = checkIns.length - 1; index >= 0; index--) {
    const checkIn = checkIns[index];
    const { attribute, pole } = findQuest(checkIn.questId);
    const key = `${attribute}-${pole}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        attribute,
        pole,
        counts: { liked: 0, okay: 0, disliked: 0 },
        likedTags: [],
        dislikedTags: [],
        latest: index,
      };
      groups.set(key, group);
    }
    group.counts[checkIn.reaction] += 1;

    // "还行" only counts in the table, so its tags are not listed.
    if (checkIn.reaction !== 'okay') {
      const tagKey = `${key}-${checkIn.reaction}`;
      const counts = tagCounts.get(tagKey) ?? new Map<string, number>();
      for (const tag of checkIn.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
      tagCounts.set(tagKey, counts);
    }
  }

  for (const [key, group] of groups) {
    group.likedTags = topTags(tagCounts.get(`${key}-liked`));
    group.dislikedTags = topTags(tagCounts.get(`${key}-disliked`));
  }

  const all = [...groups.values()];
  return {
    energizers: topGroups(all, 'liked'),
    drainers: topGroups(all, 'disliked'),
    groups: all.sort((a, b) => displayOrder(a) - displayOrder(b)),
  };
}

// The groups with at least one of the reaction, most first. Ties go to the
// group checked in most recently.
function topGroups(groups: PreferenceGroup[], reaction: 'liked' | 'disliked'): PreferenceGroup[] {
  return groups
    .filter((group) => group.counts[reaction] > 0)
    .sort((a, b) => b.counts[reaction] - a.counts[reaction] || b.latest - a.latest)
    .slice(0, MAX_LISTED_GROUPS);
}

// The most used tags. The sort is stable, so ties keep the newest-first order.
function topTags(counts: Map<string, number> | undefined): string[] {
  if (!counts) {
    return [];
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_GROUP_TAGS)
    .map(([tag]) => tag);
}

// The Character tab's attribute order, with the high pole before the low.
function displayOrder(group: PreferenceGroup): number {
  return ATTRIBUTE_IDS.indexOf(group.attribute) * 2 + (group.pole === 'high' ? 0 : 1);
}
