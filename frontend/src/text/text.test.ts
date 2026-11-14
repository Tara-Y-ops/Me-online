import { describe, expect, it } from 'vitest';
import { EN } from './en';
import { ZH } from './zh';

// Every plain string in a text object, with its path, e.g. "auth.errors.mismatch".
function strings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') {
    return [[path, value]];
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => strings(child, path ? `${path}.${key}` : key));
  }
  return []; // Functions are checked by their own tests below
}

const CHINESE = /[一-鿿]/;

describe('English text', () => {
  it('has no Chinese left in it, except the button that switches back', () => {
    const untranslated = strings(EN).filter(
      ([path, text]) => CHINESE.test(text) && !path.startsWith('languageSwitch.'),
    );
    expect(untranslated).toEqual([]);
  });

  it('has no empty strings', () => {
    expect(strings(EN).filter(([, text]) => text.trim() === '')).toEqual([]);
  });

  it('uses singular and plural correctly', () => {
    expect(EN.mapTab.locked(1)).toBe('1 more check-in to unlock');
    expect(EN.mapTab.locked(4)).toBe('4 more check-ins to unlock');
    expect(EN.mapTab.likedCount(1)).toBe('Liked 1 time');
    expect(EN.characterTab.checkInCount(0)).toBe('0 check-ins so far');
  });

  it('formats dates and lists in English', () => {
    expect(EN.historyTab.date(11, 14)).toBe('Nov 14');
    expect(EN.characterTab.focus(['Openness', 'Agreeableness'])).toBe('Exploring: Openness, Agreeableness');
  });
});

describe('Chinese text', () => {
  it('labels the language button in English', () => {
    expect(ZH.languageSwitch.label).toBe('Translate');
    expect(EN.languageSwitch.label).toBe('翻译');
  });

  it('joins a list with the Chinese comma', () => {
    expect(ZH.characterTab.focus(['开放性', '宜人性'])).toBe('想多了解：开放性、宜人性');
  });
});
