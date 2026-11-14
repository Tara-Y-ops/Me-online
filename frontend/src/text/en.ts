// English interface text. Typed as Text, so it must have every key in zh.ts.
// Attribute names are the Big Five domains, matching the Chinese names.
// Calm is shown as Emotional Stability, since higher means calmer.

import type { Text } from './zh';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "1 check-in", "2 check-ins".
function count(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export const EN: Text = {
  appName: 'Me Online',

  back: 'Back',

  languageSwitch: {
    label: '翻译',
    ariaLabel: '切换到中文',
  },

  tabs: {
    today: 'Today',
    character: 'Character',
    map: 'Map',
    history: 'History',
  },
  screenTitles: {
    today: "Today's Quests",
    character: 'Character',
    map: 'Preference Map',
    history: 'History',
  },

  attributeNames: {
    curiosity: 'Openness',
    discipline: 'Conscientiousness',
    socialEnergy: 'Extraversion',
    warmth: 'Agreeableness',
    calm: 'Emotional Stability',
  },

  attributePoles: {
    curiosity: { low: 'Conventional', high: 'Open' },
    discipline: { low: 'Easygoing', high: 'Conscientious' },
    socialEnergy: { low: 'Introverted', high: 'Extraverted' },
    warmth: { low: 'Independent', high: 'Agreeable' },
    calm: { low: 'Sensitive', high: 'Stable' },
  },

  neutral: 'Neutral',

  questKind: {
    stretch: 'Stretch',
    home: 'Comfort zone',
  },

  welcome: {
    tagline: [
      'Three small real-world quests a day. Try one, then say how it felt.',
      'Over time, find out what you really like and dislike.',
    ],
    sampleLabel: 'Sample quest',
    sampleQuestTitle: "Order something new at a place you've never been",
    sampleQuestTime: 'About 30 min',
    signUp: 'Sign up',
    signIn: 'Sign in',
    guest: 'Continue as a guest',
  },

  consent: {
    title: 'Before you start',
    heading: 'This is a one-week test',
    paragraphs: [
      'Only you and the researcher can see your check-ins, notes, and tags. They are never made public or shared.',
      'After the test, you can ask for all your data to be deleted at any time.',
      'The results are game values, not a personality diagnosis.',
    ],
    checkbox: 'I understand and agree to take part',
    continue: 'Agree and continue',
  },

  name: {
    title: 'Name your character',
    examples: 'For example: Bell, Teddy, Moss',
    quizIntro: "Next come 15 questions that set your character's starting values.",
    start: 'Start the quiz',
  },

  quiz: {
    title: 'Character quiz',
    progress: (current, total) => `Question ${current} of ${total}`,
    stem: 'I am someone who…',
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
  },

  fullTest: {
    title: 'Full test',
    resultCardTitle: 'Want more accuracy? Take the full 60-item test',
    resultCardNote: "The 15 you've answered won't repeat. About 8 minutes.",
    characterCard: 'Take the full 60-item test for more accurate values',
  },

  result: {
    title: 'Your starting character',
    note: "Neither side is better, just a different style. This is where the game starts, not a diagnosis.",
    next: 'Next',
  },

  selfCheck: {
    title: 'Does this sound like you?',
    intro: 'Look at these results. Do they match how you see yourself?',
    options: { yes: 'Very much', partly: 'Somewhat', no: 'Not really' },
    next: 'Next',
  },

  questStyle: {
    title: 'How do you want to play?',
    styleQuestion: 'Which quests do you want more of?',
    options: {
      comfort: { title: 'Play to your strengths', description: 'Lean into the side you already know, at an easy pace' },
      explore: { title: 'Try a new side', description: "Do things you usually wouldn't and see how they feel" },
    },
    focusQuestion: 'What do you most want to learn about yourself?',
    focusHint: 'Pick 1–2. More stretch quests will come from these.',
    start: "Start today's quests",
    editTitle: 'Change quest style',
    editNote: "Changes apply from the next quest refresh. Today's quests stay the same.",
    save: 'Save',
  },

  todayTab: {
    progress: (done, total) => `${done} / ${total} done`,
    refreshNote: 'New quests daily at 4:00',
    swapsLeft: '1 swap left today',
    swapUsed: 'Swap used today',
    minutes: (minutes) => `About ${minutes} min`,
    checkIn: 'I did it',
    done: 'Done',
    swap: 'Swap',
    swapDisabled: 'Swapped today',
    allDoneTitle: "All of today's quests are done",
    allDoneNote: 'Three new quests arrive tomorrow at 4:00',
    viewHistory: "See today's check-ins",
  },

  questDetail: {
    title: 'Quest details',
    howTo: 'What to do',
    doneWhen: 'Done when',
    checkIn: 'I did it, check in',
  },

  checkIn: {
    title: 'Check in',
    feeling: 'How did it feel?',
    reactions: { liked: 'Liked', okay: 'Okay', disliked: 'Disliked' },
    why: 'Why? (optional)',
    notePlaceholder: 'One sentence is enough…',
    tags: 'Tags (up to 3, optional)',
    addTag: 'Add',
    removeTag: (tag) => `Remove tag ${tag}`,
    save: 'Save check-in',
  },

  checkInResult: {
    title: 'Checked in!',
    gain: (pole, percent) => `${pole} +${percent}`,
    recorded: 'Saved',
    basedOnFeeling: 'Based on how this one felt',
    bothFine: 'Both sides are good styles. This just records how you felt.',
    nowLeaning: (pole) => `You now lean toward ${pole}`,
    startLeaning: (pole) => `You're starting to lean toward ${pole}`,
    capped: 'This one has changed enough this week',
    cappedNote: 'It will keep adding up next week',
    okay: 'You chose "Okay", so nothing moves this time',
    okayNote: 'Your check-in is saved and counts toward the Preference Map',
    done: 'Done',
  },

  mapTab: {
    locked: (left) => `${count(left, 'more check-in')} to unlock`,
    progress: (done, total) => `${done} / ${total}`,
    lockedNote: 'The more you check in, the clearer your likes and dislikes become.',
    goToday: "Go to today's quests",
    energizers: 'Energizes you',
    drainers: 'Drains you',
    noEnergizers: 'No liked quests yet',
    noDrainers: 'No disliked quests yet',
    groupName: (attributeName, poleName) => `${attributeName} · ${poleName}`,
    tags: (tags) => `Tags: ${tags.join(' · ')}`,
    likedCount: (n) => `Liked ${count(n, 'time')}`,
    dislikedCount: (n) => `Disliked ${count(n, 'time')}`,
    table: 'How each kind of quest felt',
    unit: 'Number of check-ins',
  },

  historyTab: {
    date: (month, day) => `${MONTHS[month - 1]} ${day}`,
    note: (note) => `“${note}”`,
    emptyTitle: 'No check-ins yet',
    emptyNote: 'Finish a quest and it will show up here',
    goToday: "Go to today's quests",
    yourCheckIn: 'Your check-in',
  },

  auth: {
    title: 'Sign in to save progress',
    signInIntro: 'Sign in with email to keep your progress on any phone',
    signUpIntro: 'Create an account to keep your progress on any phone',
    tabs: { signIn: 'Sign in', signUp: 'Sign up' },
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    newPassword: 'Create a password',
    passwordPlaceholder: 'At least 8 characters',
    confirmPassword: 'Enter it again',
    confirmPlaceholder: 'Same as above',
    signIn: 'Sign in',
    signUp: 'Sign up and save progress',
    sending: 'Please wait…',
    skip: 'Not now, keep playing',
    errors: {
      invalidEmail: 'Enter a valid email',
      shortPassword: 'Use at least 8 characters',
      mismatch: "The passwords don't match",
      emailTaken: 'This email is already registered',
      wrongCredentials: 'Wrong email or password',
      network: "Couldn't connect. Please try again later.",
      unknown: 'Something went wrong. Please try again later.',
    },
  },

  characterTab: {
    checkInCount: (n) => `${count(n, 'check-in')} so far`,
    questStyle: (styleTitle) => `Quest style: ${styleTitle}`,
    focus: (attributeNames) => `Exploring: ${attributeNames.join(', ')}`,
    edit: 'Edit',
    signIn: 'Sign in to save progress',
    signOut: 'Sign out',
  },
};
