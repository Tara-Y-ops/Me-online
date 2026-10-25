import { describe, expect, it } from 'vitest';
import { checkInCharacter, cleanNote, cleanTags } from './checkIn';
import { findQuest } from './quests';
import type { Character } from '../storage/character';

// Leans low on Social Energy (35), so a high-pole social quest is a stretch.
const character: Character = {
  scores: { curiosity: 70, discipline: 50, socialEnergy: 35, warmth: 60, calm: 55 },
  sides: { curiosity: 'high', discipline: 'neutral', socialEnergy: 'low', warmth: 'high', calm: 'high' },
  createdAt: '2026-10-20T00:00:00Z',
};
const socialHigh = findQuest('soc-01');
const WEEK = '2026-10-19';

describe('checkInCharacter', () => {
  it('moves only the quest’s attribute', () => {
    expect(socialHigh.attribute).toBe('socialEnergy');
    expect(socialHigh.pole).toBe('high');
    const { character: next, result } = checkInCharacter(character, socialHigh, 'liked', WEEK);
    expect(next.scores.socialEnergy).toBe(35.5);
    expect(result.movedToward).toBe('high');
    expect({ ...next.scores, socialEnergy: 35 }).toEqual(character.scores);
  });

  it('records the week’s starting scores on the first check-in of the week', () => {
    const { character: next } = checkInCharacter(character, socialHigh, 'liked', WEEK);
    expect(next.weekStart).toEqual({ week: WEEK, scores: character.scores });
  });

  it('caps the change at 1 point from the week’s start', () => {
    let current = character;
    for (let i = 0; i < 3; i++) {
      current = checkInCharacter(current, socialHigh, 'liked', WEEK).character;
    }
    // Three likes would be +1.5, but the cap stops at +1.
    expect(current.scores.socialEnergy).toBe(36);
    const { result } = checkInCharacter(current, socialHigh, 'liked', WEEK);
    expect(result.capped).toBe(true);
    expect(result.amount).toBe(0);
  });

  it('starts a new cap in a new week', () => {
    let current = character;
    for (let i = 0; i < 3; i++) {
      current = checkInCharacter(current, socialHigh, 'liked', WEEK).character;
    }
    const nextWeek = checkInCharacter(current, socialHigh, 'liked', '2026-10-26');
    expect(nextWeek.character.weekStart?.scores.socialEnergy).toBe(36);
    expect(nextWeek.character.scores.socialEnergy).toBe(36.5);
  });

  it('updates the side when the score crosses 50', () => {
    const nearMiddle: Character = {
      ...character,
      scores: { ...character.scores, socialEnergy: 49.8 },
    };
    const { character: next, result } = checkInCharacter(nearMiddle, socialHigh, 'liked', WEEK);
    expect(next.sides.socialEnergy).toBe('high');
    expect(result.flipped).toBe(true);
  });

  it('does not change the character when the reaction is okay', () => {
    const { character: next } = checkInCharacter(character, socialHigh, 'okay', WEEK);
    expect(next.scores).toEqual(character.scores);
    expect(next.sides).toEqual(character.sides);
  });
});

describe('cleanNote', () => {
  it('trims spaces and cuts long notes', () => {
    expect(cleanNote('  聊得很开心  ')).toBe('聊得很开心');
    expect(cleanNote('好'.repeat(250))).toHaveLength(200);
  });
});

describe('cleanTags', () => {
  it('drops empty and repeated tags and keeps at most three', () => {
    expect(cleanTags([' 聊天 ', '', '新朋友', '聊天', '食堂', '安静'])).toEqual(['聊天', '新朋友', '食堂']);
  });

  it('cuts tags longer than ten characters', () => {
    expect(cleanTags(['一二三四五六七八九十十一'])).toEqual(['一二三四五六七八九十']);
  });
});
