// The 60 BFI-2 statements in Chinese and English, with the attribute each
// one scores.
//
// Sources:
// - Items, English wording, and scoring key: Soto & John (2017a), BFI-2.
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
import type { LocalizedText } from './quests';

// One quiz statement. The player rates how much it describes them.
export interface QuizItem {
  id: number; // Item number in the 60-item BFI-2 (1 to 60)
  text: LocalizedText; // Completes "我是一个……的人" / "I am someone who..."
  attribute: AttributeId;
  reverse: boolean; // true: agreeing moves the player toward the attribute's low pole
}

export const BFI2_ITEMS: QuizItem[] = [
  {
    id: 1,
    text: { zh: '性格外向，喜欢交际', en: 'Is outgoing, sociable.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 2,
    text: { zh: '心肠柔软，有同情心', en: 'Is compassionate, has a soft heart.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 3,
    text: { zh: '缺乏条理', en: 'Tends to be disorganized.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 4,
    text: { zh: '从容，善于处理压力', en: 'Is relaxed, handles stress well.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 5,
    text: { zh: '对艺术没有什么兴趣', en: 'Has few artistic interests.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 6,
    text: { zh: '性格坚定自信，敢于表达自己的观点', en: 'Has an assertive personality.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 7,
    text: { zh: '为人恭谦，尊重他人', en: 'Is respectful, treats others with respect.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 8,
    text: { zh: '比较懒', en: 'Tends to be lazy.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 9,
    text: { zh: '经历挫折后仍能保持积极心态', en: 'Stays optimistic after experiencing a setback.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 10,
    text: { zh: '对许多不同的事物都感兴趣', en: 'Is curious about many different things.' },
    attribute: 'curiosity',
    reverse: false,
  },
  {
    id: 11,
    text: { zh: '很少觉得兴奋或者特别想要(做)什么', en: 'Rarely feels excited or eager.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 12,
    text: { zh: '常常挑别人的毛病', en: 'Tends to find fault with others.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 13,
    text: { zh: '可信赖的，可靠的', en: 'Is dependable, steady.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 14,
    text: { zh: '喜怒无常，情绪起伏较多', en: 'Is moody, has up and down mood swings.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 15,
    text: { zh: '善于创造，能找到聪明的方法来做事', en: 'Is inventive, finds clever ways to do things.' },
    attribute: 'curiosity',
    reverse: false,
  },
  {
    id: 16,
    text: { zh: '比较安静', en: 'Tends to be quiet.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 17,
    text: { zh: '对他人没有什么同情心', en: 'Feels little sympathy for others.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 18,
    text: { zh: '做事有计划有条理', en: 'Is systematic, likes to keep things in order.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 19,
    text: { zh: '容易紧张', en: 'Can be tense.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 20,
    text: { zh: '着迷于艺术、音乐或文学', en: 'Is fascinated by art, music, or literature.' },
    attribute: 'curiosity',
    reverse: false,
  },
  {
    id: 21,
    text: { zh: '常常处于主导地位，像个领导一样', en: 'Is dominant, acts as a leader.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 22,
    text: { zh: '常与他人意见不和', en: 'Starts arguments with others.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 23,
    text: { zh: '很难开始行动起来去完成一项任务', en: 'Has difficulty getting started on tasks.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 24,
    text: { zh: '觉得有安全感，对自己满意', en: 'Feels secure, comfortable with self.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 25,
    text: { zh: '不喜欢知识性或者哲学性强的讨论', en: 'Avoids intellectual, philosophical discussions.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 26,
    text: { zh: '不如别人有活力', en: 'Is less active than other people.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 27,
    text: { zh: '宽宏大量', en: 'Has a forgiving nature.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 28,
    text: { zh: '有时比较没有责任心', en: 'Can be somewhat careless.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 29,
    text: { zh: '情绪稳定，不易生气', en: 'Is emotionally stable, not easily upset.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 30,
    text: { zh: '几乎没有什么创造性', en: 'Has little creativity.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 31,
    text: { zh: '有时会害羞，比较内向', en: 'Is sometimes shy, introverted.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 32,
    text: { zh: '乐于助人，待人无私', en: 'Is helpful and unselfish with others.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 33,
    text: { zh: '习惯让事物保持整洁有序', en: 'Keeps things neat and tidy.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 34,
    text: { zh: '时常忧心忡忡，担心很多事情', en: 'Worries a lot.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 35,
    text: { zh: '重视艺术与审美', en: 'Values art and beauty.' },
    attribute: 'curiosity',
    reverse: false,
  },
  {
    id: 36,
    text: { zh: '感觉自己很难对他人产生影响', en: 'Finds it hard to influence people.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 37,
    text: { zh: '有时对人比较粗鲁', en: 'Is sometimes rude to others.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 38,
    text: { zh: '有效率，做事有始有终', en: 'Is efficient, gets things done.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 39,
    text: { zh: '时常觉得悲伤', en: 'Often feels sad.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 40,
    text: { zh: '思想深刻', en: 'Is complex, a deep thinker.' },
    attribute: 'curiosity',
    reverse: false,
  },
  {
    id: 41,
    text: { zh: '精力充沛', en: 'Is full of energy.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 42,
    text: { zh: '不相信别人，怀疑别人的意图', en: 'Is suspicious of others’ intentions.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 43,
    text: { zh: '可靠的，总是值得他人信赖', en: 'Is reliable, can always be counted on.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 44,
    text: { zh: '能够控制自己的情绪', en: 'Keeps their emotions under control.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 45,
    text: { zh: '缺乏想象力', en: 'Has difficulty imagining things.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 46,
    text: { zh: '爱说话，健谈', en: 'Is talkative.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 47,
    text: { zh: '有时对人冷淡，漠不关心', en: 'Can be cold and uncaring.' },
    attribute: 'warmth',
    reverse: true,
  },
  {
    id: 48,
    text: { zh: '乱糟糟的，不爱收拾', en: 'Leaves a mess, doesn’t clean up.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 49,
    text: { zh: '很少觉得焦虑或者害怕', en: 'Rarely feels anxious or afraid.' },
    attribute: 'calm',
    reverse: false,
  },
  {
    id: 50,
    text: { zh: '觉得诗歌、戏剧很无聊', en: 'Thinks poetry and plays are boring.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 51,
    text: { zh: '更喜欢让别人来领头负责', en: 'Prefers to have others take charge.' },
    attribute: 'socialEnergy',
    reverse: true,
  },
  {
    id: 52,
    text: { zh: '待人谦逊礼让', en: 'Is polite, courteous to others.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 53,
    text: { zh: '有恒心，能坚持把事情做完', en: 'Is persistent, works until the task is finished.' },
    attribute: 'discipline',
    reverse: false,
  },
  {
    id: 54,
    text: { zh: '时常觉得郁郁寡欢', en: 'Tends to feel depressed, blue.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 55,
    text: { zh: '对抽象的概念和想法没什么兴趣', en: 'Has little interest in abstract ideas.' },
    attribute: 'curiosity',
    reverse: true,
  },
  {
    id: 56,
    text: { zh: '充满热情', en: 'Shows a lot of enthusiasm.' },
    attribute: 'socialEnergy',
    reverse: false,
  },
  {
    id: 57,
    text: { zh: '把人往最好的方面想', en: 'Assumes the best about people.' },
    attribute: 'warmth',
    reverse: false,
  },
  {
    id: 58,
    text: { zh: '有时候会做出一些不负责任的行为', en: 'Sometimes behaves irresponsibly.' },
    attribute: 'discipline',
    reverse: true,
  },
  {
    id: 59,
    text: { zh: '情绪多变，容易愤怒', en: 'Is temperamental, gets emotional easily.' },
    attribute: 'calm',
    reverse: true,
  },
  {
    id: 60,
    text: { zh: '有创意，能想出新点子', en: 'Is original, comes up with new ideas.' },
    attribute: 'curiosity',
    reverse: false,
  },
];

// The 15-item BFI-2-XS (Soto & John, 2017b), in its own question order.
// Each entry is the same statement's number in the 60-item BFI-2, so short-form
// answers carry over when the player continues to the full test (FR-1.6).
// Its scoring key matches the BFI-2 key for these items.
export const SHORT_FORM_ITEM_IDS: number[] = [
  16, 2, 3, 34, 20, 21, 37, 23, 54, 55, 41, 57, 43, 29, 60,
];
