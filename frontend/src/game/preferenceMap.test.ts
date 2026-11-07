import { describe, expect, it } from 'vitest';
import type { Reaction } from './attributeChange';
import { buildPreferenceMap, checkInsToUnlock, type MapCheckIn } from './preferenceMap';

// Quests used below: cur-01, cur-02 are Curiosity high; cur-05 is Curiosity
// low; soc-01, soc-02 are Social Energy high; dis-01 is Discipline high;
// dis-05 is Discipline low; cal-05 is Calm low.
function checkIn(questId: string, reaction: Reaction, tags: string[] = []): MapCheckIn {
  return { questId, reaction, tags };
}

// Short labels like "socialEnergy-high", in list order.
function labels(groups: { attribute: string; pole: string }[]): string[] {
  return groups.map((group) => `${group.attribute}-${group.pole}`);
}

describe('checkInsToUnlock', () => {
  it('counts down to 0 at 5 check-ins', () => {
    expect(checkInsToUnlock(0)).toBe(5);
    expect(checkInsToUnlock(2)).toBe(3);
    expect(checkInsToUnlock(5)).toBe(0);
    expect(checkInsToUnlock(9)).toBe(0);
  });
});

describe('buildPreferenceMap', () => {
  it('is empty with no check-ins', () => {
    expect(buildPreferenceMap([])).toEqual({ energizers: [], drainers: [], groups: [] });
  });

  it('counts each reaction per attribute and pole', () => {
    const map = buildPreferenceMap([
      checkIn('cur-01', 'liked'),
      checkIn('cur-02', 'okay'),
      checkIn('cur-01', 'liked'),
      checkIn('cur-05', 'disliked'),
    ]);
    expect(labels(map.groups)).toEqual(['curiosity-high', 'curiosity-low']);
    expect(map.groups[0].counts).toEqual({ liked: 2, okay: 1, disliked: 0 });
    expect(map.groups[1].counts).toEqual({ liked: 0, okay: 0, disliked: 1 });
  });

  it('counts a disliked quest toward its own pole, not the opposite one', () => {
    const map = buildPreferenceMap([checkIn('soc-01', 'disliked')]);
    expect(labels(map.groups)).toEqual(['socialEnergy-high']);
    expect(labels(map.drainers)).toEqual(['socialEnergy-high']);
  });

  it('lists energizers by likes and drainers by dislikes', () => {
    const map = buildPreferenceMap([
      checkIn('soc-01', 'liked'),
      checkIn('cur-01', 'liked'),
      checkIn('soc-02', 'liked'),
      checkIn('dis-01', 'disliked'),
      checkIn('cal-05', 'disliked'),
      checkIn('dis-01', 'disliked'),
    ]);
    expect(labels(map.energizers)).toEqual(['socialEnergy-high', 'curiosity-high']);
    expect(labels(map.drainers)).toEqual(['discipline-high', 'calm-low']);
  });

  it('leaves out groups with no like or no dislike', () => {
    const map = buildPreferenceMap([checkIn('cur-01', 'okay'), checkIn('soc-01', 'liked')]);
    expect(labels(map.energizers)).toEqual(['socialEnergy-high']);
    expect(map.drainers).toEqual([]);
    expect(map.groups).toHaveLength(2);
  });

  it('shows a group on both sides when it has likes and dislikes', () => {
    const map = buildPreferenceMap([checkIn('cur-01', 'liked'), checkIn('cur-02', 'disliked')]);
    expect(labels(map.energizers)).toEqual(['curiosity-high']);
    expect(labels(map.drainers)).toEqual(['curiosity-high']);
  });

  it('breaks ties by the most recent check-in', () => {
    const map = buildPreferenceMap([
      checkIn('cur-01', 'liked'),
      checkIn('soc-01', 'liked'),
      checkIn('dis-01', 'liked'),
      checkIn('cur-02', 'okay'), // Makes Curiosity high the most recent group
    ]);
    expect(labels(map.energizers)).toEqual(['curiosity-high', 'discipline-high', 'socialEnergy-high']);
  });

  it('lists at most three energizers', () => {
    const map = buildPreferenceMap([
      checkIn('cur-01', 'liked'),
      checkIn('cur-05', 'liked'),
      checkIn('soc-01', 'liked'),
      checkIn('dis-01', 'liked'),
    ]);
    expect(map.energizers).toHaveLength(3);
    expect(map.groups).toHaveLength(4);
  });

  it('keeps liked and disliked tags apart and ignores tags on okay', () => {
    const map = buildPreferenceMap([
      checkIn('soc-01', 'liked', ['聊天']),
      checkIn('soc-02', 'disliked', ['尴尬']),
      checkIn('soc-01', 'okay', ['一般']),
    ]);
    expect(map.groups[0].likedTags).toEqual(['聊天']);
    expect(map.groups[0].dislikedTags).toEqual(['尴尬']);
  });

  it('shows the three most used tags, newest first on ties', () => {
    const map = buildPreferenceMap([
      checkIn('soc-01', 'liked', ['聊天', '新朋友']),
      checkIn('soc-02', 'liked', ['聊天', '吃饭']),
      checkIn('soc-01', 'liked', ['音乐', '吃饭']),
      checkIn('soc-02', 'liked', ['紧张']),
    ]);
    // 聊天 and 吃饭 are used twice; 吃饭 was used more recently. Of the tags
    // used once, 紧张 is the newest.
    expect(map.groups[0].likedTags).toEqual(['吃饭', '聊天', '紧张']);
  });

  it('orders the table like the Character tab, high pole first', () => {
    const map = buildPreferenceMap([
      checkIn('cal-05', 'liked'),
      checkIn('dis-05', 'liked'),
      checkIn('cur-05', 'liked'),
      checkIn('dis-01', 'liked'),
      checkIn('cur-01', 'liked'),
    ]);
    expect(labels(map.groups)).toEqual([
      'curiosity-high',
      'curiosity-low',
      'discipline-high',
      'discipline-low',
      'calm-low',
    ]);
  });
});
