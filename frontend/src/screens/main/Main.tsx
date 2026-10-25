// The app after onboarding: the four tabs with the bottom navigation bar,
// and the full-screen quest detail page opened from the Today tab.
// Today's quests live here so the tab and the detail page share them.

import { useState } from 'react';
import { BottomNav, type Tab } from '../../components/BottomNav';
import { findQuest } from '../../game/quests';
import { canSwap } from '../../game/today';
import type { Character } from '../../storage/character';
import type { PlayerSetup } from '../../storage/playerSetup';
import type { Profile } from '../../storage/profile';
import { completeTodayQuest, openToday, swapTodayQuest } from '../../storage/todayQuests';
import { TEXT } from '../../text';
import { CharacterTab } from './CharacterTab';
import { QuestDetail } from './QuestDetail';
import { TodayTab } from './TodayTab';

interface MainProps {
  profile: Profile;
  character: Character;
  setup: PlayerSetup;
}

export function Main({ profile, character, setup }: MainProps) {
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');
  // Loads today's saved quests, or picks a new set on a new game day.
  const [today, setToday] = useState(() => openToday(character, setup));
  // Position of the quest whose detail page is open, or null for the tabs.
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  // Temporary: marks the quest done right away. The check-in PR will open
  // the check-in screen here instead.
  function checkIn(index: number) {
    setToday(completeTodayQuest(today, today.quests[index].questId));
  }

  function swap(index: number) {
    setToday(swapTodayQuest(today, index, character, setup));
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
        onCheckIn={() => checkIn(detailIndex)}
        onSwap={() => swap(detailIndex)}
      />
    );
  }

  return (
    <>
      <main className="screen">
        {tab === 'today' && (
          <TodayTab
            today={today}
            onOpen={setDetailIndex}
            onCheckIn={checkIn}
            onSwap={swap}
            onViewHistory={() => setTab('history')}
          />
        )}
        {tab === 'character' && (
          // Check-ins don't exist yet, so the count is 0 until the check-in PR.
          <CharacterTab profile={profile} character={character} setup={setup} checkInCount={0} />
        )}
        {(tab === 'map' || tab === 'history') && (
          <h1 className="screen-title">{TEXT.screenTitles[tab]}</h1>
        )}
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </>
  );
}
