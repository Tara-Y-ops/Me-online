// Checks data/quests.json, so a typo in the quest bank fails the tests
// instead of breaking the app.

import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_IDS } from './attributes';
import { QUESTS } from './quests';

describe('QUESTS', () => {
  it('has 60 quests with unique IDs', () => {
    expect(QUESTS).toHaveLength(60);
    expect(new Set(QUESTS.map((quest) => quest.id)).size).toBe(60);
  });

  it('has six quests for each pole of each attribute', () => {
    for (const attribute of ATTRIBUTE_IDS) {
      for (const pole of ['low', 'high']) {
        const count = QUESTS.filter((q) => q.attribute === attribute && q.pole === pole).length;
        expect(count, `${attribute} ${pole}`).toBe(6);
      }
    }
  });

  it('uses only known attributes and poles', () => {
    for (const quest of QUESTS) {
      expect(ATTRIBUTE_IDS, quest.id).toContain(quest.attribute);
      expect(['low', 'high'], quest.id).toContain(quest.pole);
    }
  });

  it('has a positive whole number of minutes', () => {
    for (const quest of QUESTS) {
      expect(Number.isInteger(quest.minutes) && quest.minutes > 0, quest.id).toBe(true);
    }
  });

  it('has Chinese and English text for every field', () => {
    for (const quest of QUESTS) {
      for (const field of [quest.title, quest.description, quest.doneWhen]) {
        expect(field.zh.trim(), quest.id).not.toBe('');
        expect(field.en.trim(), quest.id).not.toBe('');
      }
    }
  });
});
