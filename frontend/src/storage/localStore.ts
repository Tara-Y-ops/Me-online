// Saves player data on the device with the browser's localStorage.
// Sprint 1 has no account or server, so this is where all data lives
// (PRD FR-9.2, NFR-3).
//
// Every function takes the storage as an optional last argument. The app
// uses the browser's localStorage; tests pass an in-memory stand-in.

// All keys start with this prefix so they don't clash with other sites'
// data during local development.
const KEY_PREFIX = 'me-online:';

const ANONYMOUS_ID_KEY = 'anonymousId';

// Reads a saved value. Returns null if nothing is saved or the saved text
// is not valid JSON, so a damaged entry never crashes the app.
export function loadJson<T>(key: string, storage: Storage = localStorage): T | null {
  const raw = storage.getItem(KEY_PREFIX + key);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Saves a value as JSON. Returns false if the browser refused, for example
// when storage is full or blocked in a private window.
export function saveJson(key: string, value: unknown, storage: Storage = localStorage): boolean {
  try {
    storage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Returns this device's anonymous ID, creating it on first use.
// The same ID is returned on every later call, so a player's data stays
// linked to one ID until accounts arrive.
export function getAnonymousId(storage: Storage = localStorage): string {
  const saved = loadJson<string>(ANONYMOUS_ID_KEY, storage);
  if (saved) {
    return saved;
  }
  const id = createRandomId();
  saveJson(ANONYMOUS_ID_KEY, id, storage);
  return id;
}

// 32 random hex characters. Uses crypto.getRandomValues rather than
// crypto.randomUUID because randomUUID is missing on plain http pages,
// such as when a phone opens the dev server by its local IP address.
function createRandomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
