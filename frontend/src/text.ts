// All interface text in one place. Sprint 1 is Chinese only; keeping the
// text here means adding English later only touches this file (PRD FR-8).
// Wording follows the Sprint 1 wireframes.

import type { AttributeId, Pole } from './game/attributes';

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

  // The two poles of each attribute, low then high.
  attributePoles: {
    curiosity: { low: '保守', high: '开放' },
    discipline: { low: '随性', high: '尽责' },
    socialEnergy: { low: '内向', high: '外向' },
    warmth: { low: '独立', high: '宜人' },
    calm: { low: '敏感', high: '稳定' },
  } satisfies Record<AttributeId, Record<Pole, string>>,

  // Shown instead of a percentage when a score is exactly 50 at the start.
  neutral: '中立',

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

  // 04 Quiz item. Answer labels come from the official scale in game/quiz.ts.
  quiz: {
    title: '角色测验',
    progress: (current: number, total: number) => `第 ${current} / ${total} 题`,
    // Each item completes this sentence, as in the Chinese BFI-2 form.
    stem: '我是一个……的人',
    previous: '上一题',
    next: '下一题',
    finish: '完成',
  },

  // 05 Initial character
  result: {
    title: '你的初始角色',
    note: '两边没有好坏，只是不同的风格。这是游戏起点，不是诊断。',
    next: '下一步',
  },

  // 05a Does this sound like you?
  selfCheck: {
    title: '这像你吗？',
    intro: '看看这些结果，和你对自己的感觉一样吗？',
    options: { yes: '很像我', partly: '有点像', no: '不太像' },
    next: '下一步',
  },

  // 05b How do you want to play?
  questStyle: {
    title: '接下来想怎么玩？',
    styleQuestion: '你更想做哪种任务？',
    options: {
      comfort: { title: '多做顺手的事', description: '发挥你已经擅长的一面，轻松积累' },
      explore: { title: '试试新的一面', description: '去做平时不太会做的事，看看感觉如何' },
    },
    focusQuestion: '最想了解自己哪一方面？',
    focusHint: '选 1–2 个，之后的挑战任务会多从这里出',
    start: '开始今天的任务',
  },

  // 06-08 Today tab
  todayTab: {
    progress: (done: number, total: number) => `${done} / ${total} 已完成`,
    refreshNote: '每天 4:00 刷新',
    swapsLeft: '今天还能换 1 次',
    swapUsed: '今天已经换过了',
    minutes: (minutes: number) => `约 ${minutes} 分钟`,
    checkIn: '我做到了',
    done: '已完成',
    swap: '换一个',
    swapDisabled: '今天已换过',
    allDoneTitle: '今天的任务都完成了',
    allDoneNote: '明天 4:00 会有新的三个任务',
    viewHistory: '看看今天的记录',
  },

  // 06a Quest detail
  questDetail: {
    title: '任务详情',
    howTo: '具体怎么做',
    doneWhen: '怎样算完成',
    checkIn: '我做到了，去打卡',
  },

  // 09 Check-in
  checkIn: {
    title: '打卡',
    feeling: '感觉怎么样？',
    reactions: { liked: '喜欢', okay: '还行', disliked: '不喜欢' },
    why: '为什么？（选填）',
    notePlaceholder: '写一句就好……',
    tags: '标签（最多 3 个，选填）',
    addTag: '添加',
    removeTag: (tag: string) => `删除标签 ${tag}`,
    save: '保存打卡',
  },

  // 13 Character tab
  characterTab: {
    checkInCount: (count: number) => `累计打卡 ${count} 次`,
    questStyle: (styleTitle: string) => `任务方向：${styleTitle}`,
    focus: (attributeNames: string) => `想多了解：${attributeNames}`,
  },
} as const;
