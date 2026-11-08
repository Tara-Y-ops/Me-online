// The app after onboarding: the four tabs with the bottom navigation bar,
// and the full-screen pages opened from them. Today's quests and the
// check-ins live here so all these pages share them.
// Each tab and its pages live in their own folder: today/, character/,
// map/, history/, and account/.

import { useEffect, useState } from 'react';
import { BottomNav, type Tab } from '../components/BottomNav';
import type { Side } from '../game/attributeChange';
import { findQuest } from '../game/quests';
import { canSwap } from '../game/today';
import type { Character, CheckIn, CheckInForm, PlayerSetup, Profile } from '../game/types';
import { getAccountEmail, signOut } from '../remote/auth';
import { syncToServer } from '../remote/sync';
import { loadCheckIns, submitCheckIn } from '../storage/checkIns';
import { openToday, swapTodayQuest } from '../storage/todayQuests';
import { AuthScreen } from './account/AuthScreen';
import { CharacterTab } from './character/CharacterTab';
import { FullTestScreen } from './character/FullTestScreen';
import { HistoryDetail } from './history/HistoryDetail';
import { HistoryTab } from './history/HistoryTab';
import { PreferenceMapTab } from './map/PreferenceMapTab';
import { QuestStyleScreen } from './onboarding/QuestStyleScreen';
import { CheckInResultCard } from './today/CheckInResultCard';
import { CheckInScreen } from './today/CheckInScreen';
import { QuestDetail } from './today/QuestDetail';
import { TodayTab } from './today/TodayTab';

// What fills the screen: the tabs, or one full-screen page on top of them.
// Quest positions are indexes into today's quests; historyDetail's index is
// into the check-ins.
type Page =
  | { name: 'tabs' }
  | { name: 'questDetail'; index: number }
  // Opened from a quest card or the detail page; back returns there.
  | { name: 'checkIn'; index: number; from: 'tabs' | 'questDetail' }
  // The check-in just saved, shown until "完成" is tapped.
  | { name: 'result'; checkIn: CheckIn; sideBefore: Side }
  | { name: 'historyDetail'; index: number }
  | { name: 'fullTest' }
  | { name: 'questStyle' }
  | { name: 'auth' };

const TABS: Page = { name: 'tabs' };

interface MainProps {
  profile: Profile;
  character: Character;
  setup: PlayerSetup;
  onCharacterChange: (character: Character) => void; // After a check-in moves a score
  onSetupChange: (setup: PlayerSetup) => void; // After changing the quest style
}

export function Main({ profile, character, setup, onCharacterChange, onSetupChange }: MainProps) {
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');
  const [page, setPage] = useState<Page>(TABS);
  // Loads today's saved quests, or picks a new set on a new game day.
  const [today, setToday] = useState(() => openToday(character, setup));
  const [checkIns, setCheckIns] = useState(loadCheckIns);
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
    setPage({ name: 'result', checkIn: saved.checkIn, sideBefore });
  }

  switch (page.name) {
    case 'result': {
      const { attribute } = page.checkIn;
      return (
        <CheckInResultCard
          checkIn={page.checkIn}
          sideBefore={page.sideBefore}
          score={character.scores[attribute]}
          side={character.sides[attribute]}
          // "完成" goes back to the Today tab.
          onDone={() => {
            setPage(TABS);
            setTab('today');
          }}
        />
      );
    }

    case 'checkIn': {
      const { index, from } = page;
      const item = today.quests[index];
      return (
        <CheckInScreen
          quest={findQuest(item.questId)}
          kind={item.kind}
          onBack={() => setPage(from === 'questDetail' ? { name: 'questDetail', index } : TABS)}
          onSave={(form) => saveCheckIn(index, form)}
        />
      );
    }

    case 'questDetail': {
      const { index } = page;
      const item = today.quests[index];
      return (
        <QuestDetail
          quest={findQuest(item.questId)}
          kind={item.kind}
          done={today.doneQuestIds.includes(item.questId)}
          canSwap={canSwap(today, index)}
          swapUsed={today.swapUsed}
          onBack={() => setPage(TABS)}
          onCheckIn={() => setPage({ name: 'checkIn', index, from: 'questDetail' })}
          onSwap={() => swap(index)}
        />
      );
    }

    case 'historyDetail':
      return <HistoryDetail checkIn={checkIns[page.index]} onBack={() => setPage(TABS)} />;

    case 'fullTest':
      return (
        <FullTestScreen
          character={character}
          onExit={() => setPage(TABS)}
          onFinish={(rescored) => {
            onCharacterChange(rescored);
            setPage(TABS);
          }}
        />
      );

    case 'questStyle':
      return (
        <QuestStyleScreen
          current={setup}
          onBack={() => setPage(TABS)}
          onFinish={(questStyle, focusAttributes) => {
            onSetupChange({ ...setup, questStyle, focusAttributes });
            setPage(TABS);
          }}
        />
      );

    case 'auth':
      return (
        <AuthScreen
          initialTab="signUp"
          onBack={() => setPage(TABS)}
          onSkip={() => setPage(TABS)}
          onSignedIn={(email) => {
            setAccountEmail(email);
            setPage(TABS);
          }}
        />
      );

    case 'tabs':
      return (
        <>
          <main className="screen">
            {tab === 'today' && (
              <TodayTab
                today={today}
                onOpen={(index) => setPage({ name: 'questDetail', index })}
                onCheckIn={(index) => setPage({ name: 'checkIn', index, from: 'tabs' })}
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
                onFullTest={() => setPage({ name: 'fullTest' })}
                onEditStyle={() => setPage({ name: 'questStyle' })}
                onSignIn={() => setPage({ name: 'auth' })}
                onSignOut={signOut}
              />
            )}
            {tab === 'history' && (
              <HistoryTab
                checkIns={checkIns}
                onOpen={(index) => setPage({ name: 'historyDetail', index })}
                onGoToday={() => setTab('today')}
              />
            )}
            {tab === 'map' && <PreferenceMapTab checkIns={checkIns} onGoToday={() => setTab('today')} />}
          </main>
          <BottomNav current={tab} onChange={setTab} />
        </>
      );
  }
}
