// 06-08 Today tab: today's three quests with check-in and swap, or an
// "all done" message once every quest is checked in (PRD FR-2, FR-3.1).

import { CircleCheck, History } from 'lucide-react';
import { useState } from 'react';
import { QuestCard } from '../../components/QuestCard';
import { findQuest } from '../../game/quests';
import { canSwap } from '../../game/today';
import type { Character } from '../../storage/character';
import type { PlayerSetup } from '../../storage/playerSetup';
import { completeTodayQuest, openToday, swapTodayQuest } from '../../storage/todayQuests';
import { TEXT } from '../../text';

interface TodayTabProps {
  character: Character;
  setup: PlayerSetup;
  onViewHistory: () => void;
}

export function TodayTab({ character, setup, onViewHistory }: TodayTabProps) {
  // Loads today's saved quests, or picks a new set on a new game day.
  const [today, setToday] = useState(() => openToday(character, setup));
  const doneCount = today.doneQuestIds.length;
  const allDone = doneCount === today.quests.length;

  return (
    <>
      <div className="screen-title-row">
        <h1 className="screen-title">{TEXT.screenTitles.today}</h1>
        <span className="hint">{TEXT.todayTab.progress(doneCount, today.quests.length)}</span>
      </div>

      {allDone ? (
        <div className="all-done">
          <CircleCheck size={64} strokeWidth={1.5} aria-hidden="true" />
          <h2 className="section-heading">{TEXT.todayTab.allDoneTitle}</h2>
          <p className="hint">{TEXT.todayTab.allDoneNote}</p>
          <button type="button" className="button-outline" onClick={onViewHistory}>
            <History size={18} aria-hidden="true" />
            {TEXT.todayTab.viewHistory}
          </button>
        </div>
      ) : (
        <>
          <p className="hint">
            {TEXT.todayTab.refreshNote} · {today.swapUsed ? TEXT.todayTab.swapUsed : TEXT.todayTab.swapsLeft}
          </p>
          <div className="quest-list">
            {today.quests.map((item, index) => (
              <QuestCard
                key={item.questId}
                quest={findQuest(item.questId)}
                kind={item.kind}
                done={today.doneQuestIds.includes(item.questId)}
                canSwap={canSwap(today, index)}
                swapUsed={today.swapUsed}
                // Temporary: marks the quest done right away. The check-in PR
                // will open the check-in screen here instead.
                onCheckIn={() => setToday(completeTodayQuest(today, item.questId))}
                onSwap={() => setToday(swapTodayQuest(today, index, character, setup))}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
