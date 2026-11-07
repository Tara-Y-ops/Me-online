// The app after onboarding: the four tabs with the bottom navigation bar,
// and the full-screen pages opened from the Today tab (quest detail, check-in,
// and the check-in result card), the History tab (history detail), and the
// Character tab (full 60-item test, sign in and sign up).
// Today's quests and the check-ins live here so all these pages share them.

import { useEffect, useState } from 'react';
import { BottomNav, type Tab } from '../../components/BottomNav';
import type { Side } from '../../game/attributeChange';
import { findQuest } from '../../game/quests';
import { canSwap } from '../../game/today';
import type { Character } from '../../storage/character';
import { loadCheckIns, submitCheckIn, type CheckIn, type CheckInForm } from '../../storage/checkIns';
import type { PlayerSetup } from '../../storage/playerSetup';
import type { Profile } from '../../storage/profile';
import { getAccountEmail, signOut } from '../../remote/auth';
import { syncToServer } from '../../remote/sync';
import { openToday, swapTodayQuest } from '../../storage/todayQuests';
import { FullTestScreen } from '../onboarding/FullTestScreen';
import { AuthScreen } from './AuthScreen';
import { CharacterTab } from './CharacterTab';
import { CheckInResultCard } from './CheckInResultCard';
import { CheckInScreen } from './CheckInScreen';
import { HistoryDetail } from './HistoryDetail';
import { HistoryTab } from './HistoryTab';
import { PreferenceMapTab } from './PreferenceMapTab';
import { QuestDetail } from './QuestDetail';
import { TodayTab } from './TodayTab';

interface MainProps {
  profile: Profile;
  character: Character;
  setup: PlayerSetup;
  onCharacterChange: (character: Character) => void; // After a check-in moves a score
}

export function Main({ profile, character, setup, onCharacterChange }: MainProps) {
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');
  // Loads today's saved quests, or picks a new set on a new game day.
  const [today, setToday] = useState(() => openToday(character, setup));
  const [checkIns, setCheckIns] = useState(loadCheckIns);
  // Position of the quest whose detail page is open, or null.
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  // Position of the quest being checked in, or null. Opened from a card or
  // the detail page; going back returns to where it was opened.
  const [checkInIndex, setCheckInIndex] = useState<number | null>(null);
  // Position in checkIns of the past check-in whose detail page is open, or null.
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  // Whether the full 60-item test is open, from the Character tab.
  const [fullTestOpen, setFullTestOpen] = useState(false);
  // Whether the sign-in and sign-up page is open, from the Character tab.
  const [authOpen, setAuthOpen] = useState(false);
  // The signed-in email, or null for an anonymous player.
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  useEffect(() => {
    getAccountEmail().then(setAccountEmail);
  }, []);

  // Uploads today's quests whenever they change: a new day's set, a swap, or
  // a check-in (including "还行", which leaves the scores unchanged).
  useEffect(() => {
    syncToServer();
  }, [today]);
  // The check-in just saved, shown on the result card until "完成" is tapped.
  const [result, setResult] = useState<{ checkIn: CheckIn; sideBefore: Side } | null>(null);

  function swap(index: number) {
    setToday(swapTodayQuest(today, index, character, setup));
  }

  // Saves the check-in and shows the result card.
  function saveCheckIn(index: number, form: CheckInForm) {
    const quest = findQuest(today.quests[index].questId);
    const sideBefore = character.sides[quest.attribute];
    const saved = submitCheckIn(character, today, quest.id, form);
    setToday(saved.today);
    setCheckIns([...checkIns, saved.checkIn]);
    onCharacterChange(saved.character);
    setResult({ checkIn: saved.checkIn, sideBefore });
  }

  // "完成" on the result card goes back to the Today tab.
  function closeResult() {
    setResult(null);
    setCheckInIndex(null);
    setDetailIndex(null);
    setTab('today');
  }

  if (result) {
    const { attribute } = result.checkIn;
    return (
      <CheckInResultCard
        checkIn={result.checkIn}
        sideBefore={result.sideBefore}
        score={character.scores[attribute]}
        side={character.sides[attribute]}
        onDone={closeResult}
      />
    );
  }

  if (checkInIndex !== null) {
    const item = today.quests[checkInIndex];
    return (
      <CheckInScreen
        quest={findQuest(item.questId)}
        kind={item.kind}
        onBack={() => setCheckInIndex(null)}
        onSave={(form) => saveCheckIn(checkInIndex, form)}
      />
    );
  }

  if (detailIndex !== null) {
    const item = today.quests[detailIndex];
    return (
      <QuestDetail
        quest={findQuest(item.questId)}
        kind={item.kind}
        done={today.doneQuestIds.includes(item.questId)}
        canSwap={canSwap(today, detailIndex)}
        swapUsed={today.swapUsed}
        onBack={() => setDetailIndex(null)}
        onCheckIn={() => setCheckInIndex(detailIndex)}
        onSwap={() => swap(detailIndex)}
      />
    );
  }

  if (authOpen) {
    return (
      <AuthScreen
        initialTab="signUp"
        onBack={() => setAuthOpen(false)}
        onSkip={() => setAuthOpen(false)}
        onSignedIn={(email) => {
          setAccountEmail(email);
          setAuthOpen(false);
        }}
      />
    );
  }

  if (fullTestOpen) {
    return (
      <FullTestScreen
        character={character}
        onExit={() => setFullTestOpen(false)}
        onFinish={(rescored) => {
          onCharacterChange(rescored);
          setFullTestOpen(false);
        }}
      />
    );
  }

  if (historyIndex !== null) {
    return <HistoryDetail checkIn={checkIns[historyIndex]} onBack={() => setHistoryIndex(null)} />;
  }

  return (
    <>
      <main className="screen">
        {tab === 'today' && (
          <TodayTab
            today={today}
            onOpen={setDetailIndex}
            onCheckIn={setCheckInIndex}
            onSwap={swap}
            onViewHistory={() => setTab('history')}
          />
        )}
        {tab === 'character' && (
          <CharacterTab
            profile={profile}
            character={character}
            setup={setup}
            checkInCount={checkIns.length}
            accountEmail={accountEmail}
            onFullTest={() => setFullTestOpen(true)}
            onSignIn={() => setAuthOpen(true)}
            onSignOut={signOut}
          />
        )}
        {tab === 'history' && (
          <HistoryTab checkIns={checkIns} onOpen={setHistoryIndex} onGoToday={() => setTab('today')} />
        )}
        {tab === 'map' && <PreferenceMapTab checkIns={checkIns} onGoToday={() => setTab('today')} />}
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </>
  );
}
