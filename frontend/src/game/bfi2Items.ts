// The 60 BFI-2 statements in Chinese, with the attribute each one scores.
//
// Sources:
// - Items and scoring key: Soto & John (2017a), BFI-2.
// - Chinese wording: Zhang et al. (2022), Chinese BFI-2.
// BFI-2 items copyright 2015 by Oliver P. John and Christopher J. Soto.
//
// Domain to attribute mapping:
//   Extraversion -> socialEnergy, Agreeableness -> warmth,
//   Conscientiousness -> discipline, Open-Mindedness -> curiosity,
//   Negative Emotionality -> calm (its opposite, see below).
//
// The published key scores Negative Emotionality. The game shows Calm, so
// `reverse` is flipped for those 12 items (e.g. published 4R becomes 4 here).

import type { AttributeId } from './attributes';

// One quiz statement. The player rates how much it describes them.
export interface QuizItem {
  id: number; // Item number in the 60-item BFI-2 (1 to 60)
  text: string; // Chinese wording, completes "我是一个……的人"
  attribute: AttributeId;
  reverse: boolean; // true: agreeing moves the player toward the attribute's low pole
}

export const BFI2_ITEMS: QuizItem[] = [
  { id: 1, text: '性格外向，喜欢交际', attribute: 'socialEnergy', reverse: false },
  { id: 2, text: '心肠柔软，有同情心', attribute: 'warmth', reverse: false },
  { id: 3, text: '缺乏条理', attribute: 'discipline', reverse: true },
  { id: 4, text: '从容，善于处理压力', attribute: 'calm', reverse: false },
  { id: 5, text: '对艺术没有什么兴趣', attribute: 'curiosity', reverse: true },
  { id: 6, text: '性格坚定自信，敢于表达自己的观点', attribute: 'socialEnergy', reverse: false },
  { id: 7, text: '为人恭谦，尊重他人', attribute: 'warmth', reverse: false },
  { id: 8, text: '比较懒', attribute: 'discipline', reverse: true },
  { id: 9, text: '经历挫折后仍能保持积极心态', attribute: 'calm', reverse: false },
  { id: 10, text: '对许多不同的事物都感兴趣', attribute: 'curiosity', reverse: false },
  { id: 11, text: '很少觉得兴奋或者特别想要(做)什么', attribute: 'socialEnergy', reverse: true },
  { id: 12, text: '常常挑别人的毛病', attribute: 'warmth', reverse: true },
  { id: 13, text: '可信赖的，可靠的', attribute: 'discipline', reverse: false },
  { id: 14, text: '喜怒无常，情绪起伏较多', attribute: 'calm', reverse: true },
  { id: 15, text: '善于创造，能找到聪明的方法来做事', attribute: 'curiosity', reverse: false },
  { id: 16, text: '比较安静', attribute: 'socialEnergy', reverse: true },
  { id: 17, text: '对他人没有什么同情心', attribute: 'warmth', reverse: true },
  { id: 18, text: '做事有计划有条理', attribute: 'discipline', reverse: false },
  { id: 19, text: '容易紧张', attribute: 'calm', reverse: true },
  { id: 20, text: '着迷于艺术、音乐或文学', attribute: 'curiosity', reverse: false },
  { id: 21, text: '常常处于主导地位，像个领导一样', attribute: 'socialEnergy', reverse: false },
  { id: 22, text: '常与他人意见不和', attribute: 'warmth', reverse: true },
  { id: 23, text: '很难开始行动起来去完成一项任务', attribute: 'discipline', reverse: true },
  { id: 24, text: '觉得有安全感，对自己满意', attribute: 'calm', reverse: false },
  { id: 25, text: '不喜欢知识性或者哲学性强的讨论', attribute: 'curiosity', reverse: true },
  { id: 26, text: '不如别人有活力', attribute: 'socialEnergy', reverse: true },
  { id: 27, text: '宽宏大量', attribute: 'warmth', reverse: false },
  { id: 28, text: '有时比较没有责任心', attribute: 'discipline', reverse: true },
  { id: 29, text: '情绪稳定，不易生气', attribute: 'calm', reverse: false },
  { id: 30, text: '几乎没有什么创造性', attribute: 'curiosity', reverse: true },
  { id: 31, text: '有时会害羞，比较内向', attribute: 'socialEnergy', reverse: true },
  { id: 32, text: '乐于助人，待人无私', attribute: 'warmth', reverse: false },
  { id: 33, text: '习惯让事物保持整洁有序', attribute: 'discipline', reverse: false },
  { id: 34, text: '时常忧心忡忡，担心很多事情', attribute: 'calm', reverse: true },
  { id: 35, text: '重视艺术与审美', attribute: 'curiosity', reverse: false },
  { id: 36, text: '感觉自己很难对他人产生影响', attribute: 'socialEnergy', reverse: true },
  { id: 37, text: '有时对人比较粗鲁', attribute: 'warmth', reverse: true },
  { id: 38, text: '有效率，做事有始有终', attribute: 'discipline', reverse: false },
  { id: 39, text: '时常觉得悲伤', attribute: 'calm', reverse: true },
  { id: 40, text: '思想深刻', attribute: 'curiosity', reverse: false },
  { id: 41, text: '精力充沛', attribute: 'socialEnergy', reverse: false },
  { id: 42, text: '不相信别人，怀疑别人的意图', attribute: 'warmth', reverse: true },
  { id: 43, text: '可靠的，总是值得他人信赖', attribute: 'discipline', reverse: false },
  { id: 44, text: '能够控制自己的情绪', attribute: 'calm', reverse: false },
  { id: 45, text: '缺乏想象力', attribute: 'curiosity', reverse: true },
  { id: 46, text: '爱说话，健谈', attribute: 'socialEnergy', reverse: false },
  { id: 47, text: '有时对人冷淡，漠不关心', attribute: 'warmth', reverse: true },
  { id: 48, text: '乱糟糟的，不爱收拾', attribute: 'discipline', reverse: true },
  { id: 49, text: '很少觉得焦虑或者害怕', attribute: 'calm', reverse: false },
  { id: 50, text: '觉得诗歌、戏剧很无聊', attribute: 'curiosity', reverse: true },
  { id: 51, text: '更喜欢让别人来领头负责', attribute: 'socialEnergy', reverse: true },
  { id: 52, text: '待人谦逊礼让', attribute: 'warmth', reverse: false },
  { id: 53, text: '有恒心，能坚持把事情做完', attribute: 'discipline', reverse: false },
  { id: 54, text: '时常觉得郁郁寡欢', attribute: 'calm', reverse: true },
  { id: 55, text: '对抽象的概念和想法没什么兴趣', attribute: 'curiosity', reverse: true },
  { id: 56, text: '充满热情', attribute: 'socialEnergy', reverse: false },
  { id: 57, text: '把人往最好的方面想', attribute: 'warmth', reverse: false },
  { id: 58, text: '有时候会做出一些不负责任的行为', attribute: 'discipline', reverse: true },
  { id: 59, text: '情绪多变，容易愤怒', attribute: 'calm', reverse: true },
  { id: 60, text: '有创意，能想出新点子', attribute: 'curiosity', reverse: false },
];

// The 15-item BFI-2-XS (Soto & John, 2017b), in its own question order.
// Each entry is the same statement's number in the 60-item BFI-2, so short-form
// answers carry over when the player continues to the full test (FR-1.6).
// Its scoring key matches the BFI-2 key for these items.
export const SHORT_FORM_ITEM_IDS: number[] = [
  16, 2, 3, 34, 20, 21, 37, 23, 54, 55, 41, 57, 43, 29, 60,
];
