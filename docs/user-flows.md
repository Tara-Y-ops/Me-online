# Me Online User Flows (Sprint 1)

## The daily loop

The player opens the app and sees three quests. They can swap one, pick one to do in real life, and come back to check in. Each check-in moves an attribute a little. The player can also add a short tag of their own to say what exactly they liked or disliked, such as “prefer groups of four or fewer” after a party quest. Over time the Preference Map shows the patterns.

## Navigation

The app opens on the Today board. A bottom navigation bar links the four pages, Today, Character, Preference Map, and History.

## Flow 1, first-time player

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    A([Open the app for the first time]) --> B[Welcome screen with a sample quest]
    B --> C[Pick a display name]
    C --> D[15-question quiz]
    D --> E[Meet the character]
    E --> F([Today board with the first three quests])
```

- The player lands on a welcome screen that explains the idea in two sentences and shows a sample quest.
- They pick a display name.
- They take the 15-question quiz, one question per screen with a progress bar.
- They meet their new character with five attributes and a short note that these are starting game values, not a personality assessment.
- They land on the Today board with their first three quests.

## Flow 2, daily play

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    A([Open the Today board]) --> B{Swap a quest?}
    B -->|Yes, once a day| C[Replacement quest appears]
    B -->|No| D[Try a quest in real life]
    C --> D
    D --> E[Tap I did it]
    E --> F[Pick Liked, Okay, or Disliked]
    F --> G{Add a note or tags?}
    G -->|Yes| H[Write a note, add up to three tags]
    G -->|No| I[Result card shows the attribute change]
    H --> I
    I --> J([Card marked done on the Today board])
```

- The player opens the Today board and sees three quest cards. Each card shows whether it is a home or stretch quest, the attribute, and an estimated time.
- They can swap one card per day.
- After trying a quest, they tap “I did it.”
- They pick Liked, Okay, or Disliked and can write a short note about how it went.
- They can add tags of their own to make the reaction more specific, such as “prefer groups of four or fewer.”
- A short result card shows how the attribute moved.
- Back on the Today board, the finished card is marked done. The player can check in on more quests that day.

## Flow 3, reflection

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    A([Bottom navigation bar]) --> B[Character screen with five attribute bars]
    A --> C{5 or more check-ins?}
    A --> D[History of past check-ins]
    C -->|Yes| E[Preference Map]
    C -->|No| F[Page shows how many more check-ins are needed]
```

- The player opens the Character screen to see their five attribute bars.
- Once there are enough check-ins, they open the Preference Map to see which kinds of quests they liked or disliked, along with the tags they added.
- They open history to reread past check-ins, notes, and tags.
