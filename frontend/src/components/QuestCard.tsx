// One quest on the Today board: kind and attribute tags, estimated time,
// the title, and the check-in and swap buttons (wireframes 06, 07).
// Tapping the top of the card opens the quest detail page.
// Sprint 1 shows only the Chinese text.

import { Check, RefreshCw } from 'lucide-react';
import type { QuestKind } from '../game/questPicker';
import type { Quest } from '../game/quests';
import { TEXT } from '../text';

interface QuestCardProps {
  quest: Quest;
  kind: QuestKind;
  done: boolean;
  canSwap: boolean;
  swapUsed: boolean; // Shows "今天已换过" instead of the swap button
  onOpen: () => void; // Opens the quest detail page (06a)
  onCheckIn: () => void;
  onSwap: () => void;
}

export function QuestCard(props: QuestCardProps) {
  const { quest, kind, done, canSwap, swapUsed, onOpen, onCheckIn, onSwap } = props;

  return (
    <div className={done ? 'quest-card quest-card-done' : 'quest-card'}>
      {/* The top of the card is one big button that opens the detail page. */}
      <button type="button" className="quest-card-open" onClick={onOpen}>
        <span className="quest-card-meta">
          <span className={kind === 'stretch' ? 'tag tag-stretch' : 'tag'}>{TEXT.questKind[kind]}</span>
          <span className="tag">{TEXT.attributeNames[quest.attribute]}</span>
          <span className="quest-card-time">{TEXT.todayTab.minutes(quest.minutes)}</span>
        </span>
        <span className="quest-card-title">{quest.title.zh}</span>
      </button>

      <div className="quest-card-actions">
        {done ? (
          <span className="quest-done-badge">
            <Check size={18} aria-hidden="true" />
            {TEXT.todayTab.done}
          </span>
        ) : (
          <>
            <button type="button" className="button-small" onClick={onCheckIn}>
              {TEXT.todayTab.checkIn}
            </button>
            <button type="button" className="swap-button" disabled={!canSwap} onClick={onSwap}>
              <RefreshCw size={18} aria-hidden="true" />
              {swapUsed ? TEXT.todayTab.swapDisabled : TEXT.todayTab.swap}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
