// 16, 17 History tab: past check-ins, newest first, with the date, quest,
// reaction, note, and tags (PRD FR-7.1). Shows an empty state before the
// first check-in.

import { History } from 'lucide-react';
import { REACTION_ICONS } from '../../components/reactionIcons';
import { findQuest } from '../../game/quests';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';

interface HistoryTabProps {
  checkIns: CheckIn[]; // Oldest first, as saved
  onGoToday: () => void;
}

export function HistoryTab({ checkIns, onGoToday }: HistoryTabProps) {
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
          {[...checkIns].reverse().map((checkIn) => (
            <HistoryItem key={`${checkIn.createdAt}-${checkIn.questId}`} checkIn={checkIn} />
          ))}
        </div>
      )}
    </>
  );
}

function HistoryItem({ checkIn }: { checkIn: CheckIn }) {
  const Icon = REACTION_ICONS[checkIn.reaction];
  // The game day, so a check-in before 4:00 a.m. shows the previous day,
  // matching the Today tab.
  const [, month, day] = checkIn.day.split('-').map(Number);

  return (
    <div className="quest-card">
      <div className="history-meta">
        <span className="hint">{TEXT.historyTab.date(month, day)}</span>
        <span className="history-reaction">
          <Icon size={20} aria-hidden="true" />
          {TEXT.checkIn.reactions[checkIn.reaction]}
        </span>
      </div>
      <p className="quest-card-title">{findQuest(checkIn.questId).title.zh}</p>
      {checkIn.note && <p className="history-note">{TEXT.historyTab.note(checkIn.note)}</p>}
      {checkIn.tags.length > 0 && (
        <div className="chip-row">
          {checkIn.tags.map((tag) => (
            <span key={tag} className="chip chip-selected">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
