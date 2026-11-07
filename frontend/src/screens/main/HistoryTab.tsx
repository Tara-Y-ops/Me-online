// 16, 17 History tab: past check-ins, newest first, with the date, quest,
// reaction, note, and tags (PRD FR-7.1). Shows an empty state before the
// first check-in. Tapping a card opens the History detail page.

import { History } from 'lucide-react';
import { REACTION_ICONS } from '../../components/reactionIcons';
import { findQuest } from '../../game/quests';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';

interface HistoryTabProps {
  checkIns: CheckIn[]; // Oldest first, as saved
  onOpen: (index: number) => void; // Position in checkIns
  onGoToday: () => void;
}

export function HistoryTab({ checkIns, onOpen, onGoToday }: HistoryTabProps) {
  return (
    <>
      <h1 className="screen-title">{TEXT.screenTitles.history}</h1>

      {checkIns.length === 0 ? (
        <div className="all-done">
          <History size={64} strokeWidth={1.5} aria-hidden="true" />
          <h2 className="section-heading">{TEXT.historyTab.emptyTitle}</h2>
          <p className="hint">{TEXT.historyTab.emptyNote}</p>
          <button type="button" className="button-outline" onClick={onGoToday}>
            {TEXT.historyTab.goToday}
          </button>
        </div>
      ) : (
        <div className="quest-list">
          {checkIns
            .map((checkIn, index) => (
              <button
                key={`${checkIn.createdAt}-${checkIn.questId}`}
                type="button"
                className="quest-card history-card"
                onClick={() => onOpen(index)}
              >
                <CheckInMeta checkIn={checkIn} />
                <span className="quest-card-title">{findQuest(checkIn.questId).title.zh}</span>
                <CheckInFeedback checkIn={checkIn} />
              </button>
            ))
            .reverse()}
        </div>
      )}
    </>
  );
}

// The date and the reaction, on one row.
export function CheckInMeta({ checkIn }: { checkIn: CheckIn }) {
  const Icon = REACTION_ICONS[checkIn.reaction];
  // The game day, so a check-in before 4:00 a.m. shows the previous day,
  // matching the Today tab.
  const [, month, day] = checkIn.day.split('-').map(Number);

  return (
    <span className="history-meta">
      <span className="hint">{TEXT.historyTab.date(month, day)}</span>
      <span className="history-reaction">
        <Icon size={20} aria-hidden="true" />
        {TEXT.checkIn.reactions[checkIn.reaction]}
      </span>
    </span>
  );
}

// The player's note in quotes and their tags. Each is left out when empty.
export function CheckInFeedback({ checkIn }: { checkIn: CheckIn }) {
  return (
    <>
      {checkIn.note && <span className="history-note">{TEXT.historyTab.note(checkIn.note)}</span>}
      {checkIn.tags.length > 0 && (
        <span className="chip-row">
          {checkIn.tags.map((tag) => (
            <span key={tag} className="chip chip-selected">
              {tag}
            </span>
          ))}
        </span>
      )}
    </>
  );
}
