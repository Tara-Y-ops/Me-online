// History detail: the full quest and the player's check-in for it, opened by
// tapping a card on the History tab. Read only, so there is no check-in or
// swap button.

import { PageHeader } from '../../components/PageHeader';
import { findQuest } from '../../game/quests';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';
import { CheckInFeedback, CheckInMeta } from './HistoryTab';
import { QuestDetailCard } from './QuestDetail';

interface HistoryDetailProps {
  checkIn: CheckIn;
  onBack: () => void;
}

export function HistoryDetail({ checkIn, onBack }: HistoryDetailProps) {
  return (
    <div className="page">
      <PageHeader title={TEXT.questDetail.title} onBack={onBack} />

      <div className="page-body">
        <QuestDetailCard quest={findQuest(checkIn.questId)} kind={checkIn.kind} />

        <h2 className="form-heading">{TEXT.historyTab.yourCheckIn}</h2>
        <div className="quest-card history-card">
          <CheckInMeta checkIn={checkIn} />
          <CheckInFeedback checkIn={checkIn} />
        </div>
      </div>
    </div>
  );
}
