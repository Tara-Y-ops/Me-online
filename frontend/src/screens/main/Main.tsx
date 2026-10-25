// The app after onboarding: the four tabs with the bottom navigation bar,
// and the full-screen pages opened from the Today tab (quest detail, check-in,
// and the check-in result card).
// Today's quests and the check-ins live here so all these pages share them.

import { useState } from 'react';
import { BottomNav, type Tab } from '../../components/BottomNav';
import type { Side } from '../../game/attributeChange';
import { findQuest } from '../../game/quests';
import { canSwap } from '../../game/today';
import type { Character } from '../../storage/character';
import { loadCheckIns, submitCheckIn, type CheckIn, type CheckInForm } from '../../storage/checkIns';
import type { PlayerSetup } from '../../storage/playerSetup';
import type { Profile } from '../../storage/profile';
import { openToday, swapTodayQuest } from '../../storage/todayQuests';
import { TEXT } from '../../text';
import { CharacterTab } from './CharacterTab';
import { CheckInResultCard } from './CheckInResultCard';
import { CheckInScreen } from './CheckInScreen';
import { HistoryTab } from './HistoryTab';
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
          />
        )}
        {tab === 'history' && <HistoryTab checkIns={checkIns} onGoToday={() => setTab('today')} />}
        {tab === 'map' && <h1 className="screen-title">{TEXT.screenTitles.map}</h1>}
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </>
  );
}
