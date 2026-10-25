// 06a Quest detail: the full quest from the quest bank, opened by tapping a
// card on the Today tab. Shows how to do it and how to know it is done.
// The category tag from the wireframe is left out for now.

import { CircleCheck, Clock, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import type { QuestKind } from '../../game/questPicker';
import type { Quest } from '../../game/quests';
import { TEXT } from '../../text';

interface QuestDetailProps {
  quest: Quest;
  kind: QuestKind;
  done: boolean;
  canSwap: boolean;
  swapUsed: boolean;
  onBack: () => void;
  onCheckIn: () => void;
  onSwap: () => void;
}

export function QuestDetail(props: QuestDetailProps) {
  const { quest, kind, done, canSwap, swapUsed, onBack, onCheckIn, onSwap } = props;

  return (
    <div className="page">
      <PageHeader title={TEXT.questDetail.title} onBack={onBack} />

      <div className="page-body">
        <div className="quest-card quest-detail">
          <div className="quest-card-meta">
            <span className={kind === 'stretch' ? 'tag tag-stretch' : 'tag'}>{TEXT.questKind[kind]}</span>
            <span className="tag">{TEXT.attributeNames[quest.attribute]}</span>
            <span className="quest-card-time">
              <Clock size={16} aria-hidden="true" />
              {TEXT.todayTab.minutes(quest.minutes)}
            </span>
          </div>
          <h2 className="quest-detail-title">{quest.title.zh}</h2>
          <hr className="divider" />

          <p className="detail-label">{TEXT.questDetail.howTo}</p>
          <p className="detail-text">{quest.description.zh}</p>

          <p className="detail-label">{TEXT.questDetail.doneWhen}</p>
          <p className="detail-text done-when">
            <CircleCheck size={20} aria-hidden="true" />
            {quest.doneWhen.zh}
          </p>
        </div>
      </div>

      <div className="page-footer detail-footer">
        {done ? (
          <button type="button" className="button-primary" disabled>
            ✓ {TEXT.todayTab.done}
          </button>
        ) : (
          <>
            <button type="button" className="button-primary" onClick={onCheckIn}>
              {TEXT.questDetail.checkIn}
            </button>
            <button type="button" className="swap-button" disabled={!canSwap} onClick={onSwap}>
              <RefreshCw size={16} aria-hidden="true" />
              {swapUsed ? TEXT.todayTab.swapDisabled : TEXT.todayTab.swap}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
