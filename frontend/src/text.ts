// All interface text in one place. Sprint 1 is Chinese only; keeping the
// text here means adding English later only touches this file (PRD FR-8).
// Wording follows the Sprint 1 wireframes.

import type { AttributeId } from './game/attributes';

export const TEXT = {
  appName: 'Me Online',

  // Shared labels.
  back: '返回',

  // Labels in the bottom navigation bar.
  tabs: {
    today: '今日',
    character: '角色',
    map: '偏好地图',
    history: '历史',
  },
  // Page titles at the top of each tab.
  screenTitles: {
    today: '今日任务',
    character: '角色',
    map: '偏好地图',
    history: '历史',
  },

  // Attribute names as shown in the wireframes.
  attributeNames: {
    curiosity: '开放性',
    discipline: '尽责性',
    socialEnergy: '外向性',
    warmth: '宜人性',
    calm: '情绪稳定性',
  } satisfies Record<AttributeId, string>,

  // Quest card tags: a stretch quest or a home (comfort zone) quest.
  questKind: {
    stretch: '挑战',
    home: '舒适区',
  },

  // 01 Welcome
  welcome: {
    tagline: ['每天三个现实小任务，做完说说感受。', '慢慢发现你真正喜欢和不喜欢什么。'],
    sampleLabel: '示例任务',
    sampleQuestTitle: '去一家没去过的店点一样新东西',
    sampleQuestTime: '约 30 分钟',
    start: '开始',
  },

  // 02 Consent
  consent: {
    title: '参加测试前',
    heading: '这是一个为期一周的小测试',
    paragraphs: [
      '你的打卡、备注和标签只有你和研究者能看到，不会公开或分享给其他人。',
      '测试结束后，你可以随时要求删除全部数据。',
      '这些结果是游戏数值，不是人格诊断。',
    ],
    checkbox: '我已了解，并同意参加测试',
    continue: '同意并继续',
  },

  // 03 Name
  name: {
    title: '给角色起个名字',
    examples: '比如：铃铛、小熊、阿木',
    quizIntro: '接下来有 15 道题，用来生成角色的初始数值。',
    start: '开始测验',
  },
} as const;
