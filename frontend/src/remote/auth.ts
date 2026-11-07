// Email accounts (PRD FR-9.1). Signing up upgrades this device's anonymous
// Supabase user to an email account, so the user ID and everything already
// uploaded stay the same. Signing out clears the device.

import { syncToServer } from './sync';
import { ensureSignedIn, supabase } from './supabase';

// The signed-in email, or null for an anonymous player or when Supabase is
// not set up. Reads the saved session, so it works offline.
export async function getAccountEmail(): Promise<string | null> {
  if (!supabase) {
    return null;
  }
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  return user && !user.is_anonymous ? (user.email ?? null) : null;
}

// Adds an email and password to the anonymous user. Returns null on success,
// or the Supabase error code ('' if Supabase could not be reached). Email
// confirmation is off in this project, so the account works right away.
export async function signUp(email: string, password: string): Promise<string | null> {
  if (!supabase || !(await ensureSignedIn())) {
    return '';
  }
  try {
    const { error } = await supabase.auth.updateUser({ email: email.trim(), password });
    if (error) {
      return error.code ?? 'unknown';
    }
  } catch {
    return '';
  }
  // Uploads anything still waiting, now under the account.
  syncToServer();
  return null;
}

// Signs out and clears every saved value on the device, then reloads so the
// app starts again at the welcome screen. The data stays in the account.
export async function signOut(): Promise<void> {
  try {
    await supabase?.auth.signOut({ scope: 'local' });
  } finally {
    localStorage.clear();
    window.location.reload();
  }
}
