import { describe, expect, it } from 'vitest';
import { getAnonymousId, loadJson, saveJson } from './localStore';

// In-memory stand-in for the browser's localStorage.
class MemoryStorage implements Storage {
  private items = new Map<string, string>();
  get length() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
  }
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

describe('loadJson and saveJson', () => {
  it('saves a value and reads it back', () => {
    const storage = new MemoryStorage();
    expect(saveJson('profile', { name: '小明', checkIns: 3 }, storage)).toBe(true);
    expect(loadJson('profile', storage)).toEqual({ name: '小明', checkIns: 3 });
  });

  it('returns null when nothing is saved', () => {
    expect(loadJson('profile', new MemoryStorage())).toBeNull();
  });

  it('returns null instead of crashing on damaged data', () => {
    const storage = new MemoryStorage();
    storage.setItem('me-online:profile', '{not json');
    expect(loadJson('profile', storage)).toBeNull();
  });

  it('returns false when the browser refuses to save', () => {
    const storage = new MemoryStorage();
    storage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    expect(saveJson('profile', { name: '小明' }, storage)).toBe(false);
  });
});

describe('getAnonymousId', () => {
  it('creates a 32-character hex ID on first use', () => {
    expect(getAnonymousId(new MemoryStorage())).toMatch(/^[0-9a-f]{32}$/);
  });

  it('returns the same ID on later calls', () => {
    const storage = new MemoryStorage();
    expect(getAnonymousId(storage)).toBe(getAnonymousId(storage));
  });

  it('gives different devices different IDs', () => {
    expect(getAnonymousId(new MemoryStorage())).not.toBe(getAnonymousId(new MemoryStorage()));
  });
});
