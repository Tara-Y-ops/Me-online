import { describe, expect, it } from 'vitest';
import type { CheckIn } from '../../storage/checkIns';
import { resultMessage } from './resultMessage';

// A check-in on a Social Energy quest; each test changes what it needs.
const base: CheckIn = {
  questId: 'soc-01',
  kind: 'stretch',
  day: '2026-10-26',
  createdAt: '2026-10-26T04:00:00Z',
  reaction: 'disliked',
  note: '',
  tags: [],
  attribute: 'socialEnergy',
  movedToward: 'low',
  amount: 0.1,
  capped: false,
  flipped: false,
};

describe('resultMessage', () => {
  it('shows a normal move as a gain (wireframe 10)', () => {
    expect(resultMessage(base, 'low')).toEqual({
      headline: '内向 +0.1%',
      subtitle: '根据你这次的感受',
      footnote: '两边都是好的风格，这只是记录你的感受',
    });
  });

  it('says so when the side flips (wireframe 11)', () => {
    const flipped = { ...base, reaction: 'liked', movedToward: 'high', amount: 0.5, flipped: true } as const;
    const message = resultMessage(flipped, 'low');
    expect(message.headline).toBe('外向 +0.5%');
    expect(message.footnote).toBe('你现在更偏向外向了');
  });

  it('says the player starts leaning when leaving neutral', () => {
    expect(resultMessage(base, 'neutral').footnote).toBe('你开始偏向内向了');
  });

  it('shows "recorded" when the weekly cap stops the move (wireframe 12)', () => {
    const capped = { ...base, movedToward: null, amount: 0, capped: true };
    expect(resultMessage(capped, 'low')).toEqual({
      headline: '已记录',
      subtitle: '这一项本周已经变化够多了',
      footnote: '下周会继续累积',
    });
  });

  it('shows "recorded" for 还行 (wireframe 21)', () => {
    const okay = { ...base, reaction: 'okay', movedToward: null, amount: 0 } as const;
    expect(resultMessage(okay, 'low')).toEqual({
      headline: '已记录',
      subtitle: '你选了「还行」，这次不移动',
      footnote: '打卡已保存，会计入偏好地图',
    });
  });

  it('shows a partly capped move as a normal gain', () => {
    const partly = { ...base, reaction: 'liked', movedToward: 'high', amount: 0.2, capped: true } as const;
    expect(resultMessage(partly, 'low').headline).toBe('外向 +0.2%');
  });
});
