// 14, 15 Preference Map tab. Locked until 5 check-ins, showing how many are
// left (FR-6.1). Then lists what energizes and drains the player, and a table
// of reactions for each kind of quest (FR-6.2, FR-6.3).
// The numbers come from game/preferenceMap.ts.

import { Lock } from 'lucide-react';
import { REACTION_ICONS, REACTIONS } from '../../components/reactionIcons';
import {
  buildPreferenceMap,
  checkInsToUnlock,
  UNLOCK_CHECK_INS,
  type PreferenceGroup,
} from '../../game/preferenceMap';
import type { CheckIn } from '../../storage/checkIns';
import { TEXT } from '../../text';

interface PreferenceMapTabProps {
  checkIns: CheckIn[];
  onGoToday: () => void;
}

export function PreferenceMapTab({ checkIns, onGoToday }: PreferenceMapTabProps) {
  const left = checkInsToUnlock(checkIns.length);

  return (
    <>
      <h1 className="screen-title">{TEXT.screenTitles.map}</h1>
      {left > 0 ? (
        <LockedMap count={checkIns.length} left={left} onGoToday={onGoToday} />
      ) : (
        <UnlockedMap checkIns={checkIns} />
      )}
    </>
  );
}

// 14: how many more check-ins unlock the map.
function LockedMap({ count, left, onGoToday }: { count: number; left: number; onGoToday: () => void }) {
  return (
    <div className="all-done">
      <div className="map-lock">
        <Lock size={40} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="section-heading">{TEXT.mapTab.locked(left)}</h2>
      <div className="progress-bar map-progress">
        <div className="progress-bar-fill" style={{ width: `${(count / UNLOCK_CHECK_INS) * 100}%` }} />
      </div>
      <p className="hint">{TEXT.mapTab.progress(count, UNLOCK_CHECK_INS)}</p>
      <p className="hint map-locked-note">{TEXT.mapTab.lockedNote}</p>
      <button type="button" className="button-outline" onClick={onGoToday}>
        {TEXT.mapTab.goToday}
      </button>
    </div>
  );
}

// 15: energizers, drainers, and the reaction table.
function UnlockedMap({ checkIns }: { checkIns: CheckIn[] }) {
  const map = buildPreferenceMap(checkIns);

  return (
    <>
      <h2 className="form-heading map-heading">{TEXT.mapTab.energizers}</h2>
      {map.energizers.length === 0 ? (
        <p className="hint map-empty">{TEXT.mapTab.noEnergizers}</p>
      ) : (
        <div className="map-list">
          {map.energizers.map((group) => (
            <GroupCard
              key={groupKey(group)}
              group={group}
              tags={group.likedTags}
              count={TEXT.mapTab.likedCount(group.counts.liked)}
            />
          ))}
        </div>
      )}

      <h2 className="form-heading map-heading">{TEXT.mapTab.drainers}</h2>
      {map.drainers.length === 0 ? (
        <p className="hint map-empty">{TEXT.mapTab.noDrainers}</p>
      ) : (
        <div className="map-list">
          {map.drainers.map((group) => (
            <GroupCard
              key={groupKey(group)}
              group={group}
              tags={group.dislikedTags}
              count={TEXT.mapTab.dislikedCount(group.counts.disliked)}
              drainer
            />
          ))}
        </div>
      )}

      <div className="map-table-title">
        <h2 className="form-heading map-heading">{TEXT.mapTab.table}</h2>
        <span className="hint">{TEXT.mapTab.unit}</span>
      </div>
      <div className="map-table">
        {map.groups.map((group) => (
          <div key={groupKey(group)} className="map-row">
            <span className="map-row-name">{groupName(group)}</span>
            {REACTIONS.map((reaction) => {
              const Icon = REACTION_ICONS[reaction];
              const count = group.counts[reaction];
              return (
                <span
                  key={reaction}
                  className={count === 0 ? 'map-count map-count-zero' : 'map-count'}
                  title={TEXT.checkIn.reactions[reaction]}
                >
                  <Icon size={20} aria-label={TEXT.checkIn.reactions[reaction]} />
                  {count}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// One energizer or drainer: the kind of quest, its tags, and the count.
// Drainers have a dashed border, as in the wireframe.
function GroupCard(props: { group: PreferenceGroup; tags: string[]; count: string; drainer?: boolean }) {
  const { group, tags, count, drainer = false } = props;
  return (
    <div className={drainer ? 'map-card map-card-drainer' : 'map-card'}>
      <div>
        <p className="map-card-name">{groupName(group)}</p>
        {tags.length > 0 && <p className="hint">{TEXT.mapTab.tags(tags)}</p>}
      </div>
      <span className="map-card-count">{count}</span>
    </div>
  );
}

// e.g. "外向性 · 外向"
function groupName(group: PreferenceGroup): string {
  return TEXT.mapTab.groupName(
    TEXT.attributeNames[group.attribute],
    TEXT.attributePoles[group.attribute][group.pole],
  );
}

function groupKey(group: PreferenceGroup): string {
  return `${group.attribute}-${group.pole}`;
}
