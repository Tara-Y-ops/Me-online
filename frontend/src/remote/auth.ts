// Email accounts (PRD FR-9.1). Signing up upgrades this device's anonymous
// Supabase user to an email account, so the user ID and everything already
// uploaded stay the same. Signing in replaces the device's data with the
// account's. Signing out clears the device.

import { saveCharacter } from '../storage/character';
import { saveCheckIns } from '../storage/checkIns';
import { saveFullTestProgress } from '../storage/fullTest';
import { clearAppData, getAnonymousId } from '../storage/localStore';
import { savePlayerSetup } from '../storage/playerSetup';
import { saveProfile } from '../storage/profile';
import { saveQuizProgress } from '../storage/quizProgress';
import { saveShownQuestIds } from '../storage/todayQuests';
import { restoredData, type CheckInRow, type RestoredData, type SavedPlayerRow } from './rows';
import { markUploaded, syncToServer } from './sync';
import { createTemporaryClient, ensureSignedIn, supabase } from './supabase';

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

// What signing in did: an error code ('' if Supabase could not be reached),
// or whether the account's data replaced the device's.
export type SignInResult = { error: string } | { restored: boolean };

// Signs in and, if the account has data, replaces the device's data with it
// and reloads the app. An account with no data yet (signed up but never got
// past Name) keeps the device's data, which is then uploaded to it.
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const client = createTemporaryClient();
  if (!supabase || !client) {
    return { error: '' };
  }
  try {
    const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.session) {
      return { error: error?.code ?? '' };
    }
    const userId = data.session.user.id;
    const [player, checkIns] = await Promise.all([
      client.from('players').select('*').eq('user_id', userId).maybeSingle<SavedPlayerRow>(),
      client.from('check_ins').select('*').eq('user_id', userId).returns<CheckInRow[]>(),
    ]);
    if (player.error || checkIns.error) {
      return { error: '' };
    }

    if (player.data) {
      writeDeviceData(restoredData(player.data, checkIns.data ?? []), userId);
    }
    // Switches the app to the account. The old anonymous user is left behind.
    const { error: sessionError } = await supabase.auth.setSession(data.session);
    if (sessionError) {
      return { error: sessionError.code ?? '' };
    }
    if (player.data) {
      window.location.reload();
      return { restored: true };
    }
    syncToServer();
    return { restored: false };
  } catch {
    return { error: '' };
  }
}

// Replaces everything this app saved on the device with the account's data.
function writeDeviceData(data: RestoredData, userId: string): void {
  clearAppData();
  getAnonymousId();
  saveProfile(data.profile);
  saveQuizProgress(data.quizProgress);
  if (data.fullTestProgress) {
    saveFullTestProgress(data.fullTestProgress);
  }
  if (data.character) {
    saveCharacter(data.character);
  }
  if (data.setup) {
    savePlayerSetup(data.setup);
  }
  saveCheckIns(data.checkIns);
  saveShownQuestIds(data.shownQuestIds);
  // The check-ins just came from the server, so they are not uploaded again.
  markUploaded(userId, data.checkIns.length);
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
