# Me Online PRD (Sprint 1)

Version 1.0, October 5, 2026

Owner: Tiantong Yang

Status: Draft for Sprint 1 (Weeks 5-9)

## Overview

Me Online is a web app for undergraduates in mainland China. Each day, it gives users three small real-world quests. After trying one, the user writes feedback on how they feel. Each check-in updates a character panel based on the Big Five personality traits, and shows a Preference Map of activities the user tends to like or dislike.

The goal is to help users learn what they like and dislike from their own experience rather than from personality labels or others’ advice.

## Problem

Many undergraduates in mainland China have spent most of their school years following plans set by teachers and parents. A Ministry of Education survey found nearly 70% of students knew little about the major they applied for (D. Wu, 2016). Psychologists call committing to a path chosen by others without exploring alternatives identity foreclosure (Marcia, 1966). When these students reach university and can finally choose, many have little sense of what they like or dislike.

Existing tools do not fill this gap. The Myers-Briggs Type Indicator (MBTI), a questionnaire that sorts people into 16 personality types (Myers et al., 1998), has become a popular social label among Chinese youth (W. Wu et al., 2024), but it gives students another external answer. Journaling apps require a lot of writing and only record existing routines, while habit apps reward tasks users have already chosen.

Me Online solves the problem that students rarely get a low-pressure chance to test their reactions in real life.

## Target Users

The primary users are university students in mainland China who are not yet sure what they like or dislike.

**The follower.** Chose a major on parents’ and teachers’ advice and does well in class. Cannot say what they enjoy, and a blank journal feels hard to start. Needs small, clear tasks that still ask for their own reaction.

**The overthinker.** Reflects a lot and reads self-help content online. Thinks a lot but rarely acts, and more thinking makes things less clear. Needs a low-effort push to try things instead of only thinking.

Sprint 1 testers are friends and their classmates at universities in mainland China, recruited online.

## Goals and Success Metrics

### Product goals for Sprint 1

- A student can play the full daily loop (get quests, try one, check in, see the result) without help.
- The loop is fun and light enough that testers come back on most days of a one-week test.
- Testers finish the week able to name at least one thing they learned about their likes or dislikes.

### Success metrics (Weeks 8-9 user test, 5-8 testers, 7 days)

| Metric | How it is measured | Target |
|---|---|---|
| Active days | Days with at least one check-in, per tester | 4 or more of 7 days on average |
| Quest completion | Check-ins divided by days the tester opened the app | 60% or higher |
| Stretch share | Share of check-ins that are stretch quests | 30% or higher |
| Reflection rate | Share of check-ins that include written feedback | 50% or higher |
| Self-insight | Testers who can name one new like or dislike in the exit interview | 50% or higher |

## Scope

### In scope for Sprint 1

- A 15-question personality quiz that creates the player’s character.
- Three quests a day, at least one of them a stretch quest. The player can swap one each day.
- Check-in, where the player picks Liked, Okay, or Disliked and can add a short note. Each check-in moves an attribute slightly.
- A Character screen showing the five attributes.
- A Preference Map showing which kinds of quests the player liked and disliked.
- A history of past check-ins.
- Chinese and English side by side, in both the interface and the quests.
- About 40 bilingual quests, about four for each pole. Quest content and writing rules live in a separate document.
- A mobile web app that testers open in their phone browser for the test week. No native app is planned for now.
- Email sign-up and login, built last. Until they work, data is saved on the device under an anonymous ID.

## Core Loop and User Flows

The daily loop and the three user flows (first-time player, daily play, reflection) are in user-flows.md.

## Functional Requirements

### FR-1 Character creation

- **FR-1.1** The player picks a display name before the quiz.
- **FR-1.2** The quiz is the 15-item BFI-2-XS (Soto & John, 2017b) in Chinese and English (Zhang et al., 2022), shown one item per screen with a progress bar.
- **FR-1.3** The player can go back but cannot skip an item. An unfinished quiz resumes where it stopped.
- **FR-1.4** The answers are scored with the BFI-2 key and turned into five attributes from 0 to 100 (Cohen et al., 1999). Each attribute’s home pole is the side the player scores on.
- **FR-1.5** The result screen shows the five scores and poles as starting game values, not a personality assessment.
- **FR-1.6** The player can choose to continue to the full 60-item BFI-2 (Soto & John, 2017a). Answered items are not repeated, and the attributes are rescored from the full test.

**Attribute poles**

- **Curiosity**, from Familiar (low) to Explorer (high)
- **Discipline**, from Free-flowing (low) to Planner (high)
- **Social Energy**, from Recharge alone (low) to Recharge with people (high)
- **Warmth**, from Independent (low) to Caring (high)
- **Calm**, from Sensitive (low) to Steady (high)

### FR-2 Daily quests

- **FR-2.1** Each day the player gets three quests. At least one is a stretch quest on a randomly chosen attribute, and together they cover at least two attributes.
- **FR-2.2** No quest repeats during the one-week test. AI-generated quests in later sprints will not repeat either.
- **FR-2.3** The player can swap one quest a day, and the replacement follows the same rules.
- **FR-2.4** Quests refresh at 4:00 a.m. China time (UTC+8). Unfinished quests do not carry over, and reloading the page does not reshuffle the day’s set.

### FR-3 Check-in

- **FR-3.1** The player can check in on any of the day’s quests before refresh, one check-in per quest.
- **FR-3.2** A check-in is one tap on Liked, Okay, or Disliked, with an optional short note on why.
- **FR-3.3** The player can also add up to three tags of their own to say what exactly they liked or disliked. Tags don’t change attributes.
- **FR-3.4** Saving a check-in applies the attribute change, and a result card shows it.

### FR-4 Attribute changes

- **FR-4.1** Each check-in moves the quest’s attribute by 0.5 points, and no attribute moves more than 1 point a week. Change in real personality is slow, about 0.37 SD after 24 weeks of intervention (Roberts et al., 2017), so the game keeps changes small. Scores stay within 0 to 100 and show one decimal place.
- **FR-4.2** Liked moves the score toward the quest’s pole and Disliked moves it toward the opposite pole. Okay leaves it unchanged.
- **FR-4.3** When a score crosses 50, the player’s home side switches, and FR-2 treats the other pole as stretch from then on.

### FR-5 Character screen

- **FR-5.1** The Character screen shows the display name, total check-ins, and five attribute bars, each with both pole labels and a marker at the player’s score.

### FR-6 Preference Map

- **FR-6.1** The Preference Map unlocks after 5 check-ins. Until then, the page shows how many more check-ins are needed.
- **FR-6.2** It groups check-ins by attribute and pole and counts Liked, Okay, and Disliked in each group.
- **FR-6.3** It lists up to three energizers (groups with the most likes) and three drainers (groups with the most dislikes), along with the tags the player added to those check-ins.

### FR-7 History

- **FR-7.1** History lists past check-ins newest first, with the date, quest, reaction, note, and tags.

### FR-8 Bilingual interface

- **FR-8.1** Every screen shows Chinese and English side by side, Chinese first.
- **FR-8.2** Each quest has its own Chinese and English text. The English is written for meaning, not translated word for word.

### FR-9 Data storage

- **FR-9.1** Sprint 1 aims to include email sign-up and login, built last. Until they work, the app runs without an account.
- **FR-9.2** Without an account, the device gets an anonymous ID on first open. Quiz answers, check-ins, and tags are saved on the device first and then uploaded to Supabase under that ID.

## Non-Functional Requirements

- **NFR-1 Privacy.** Check-ins, notes, and tags are visible only to the player and the researcher and are never shared. Testers give consent before the test.
- **NFR-2 Performance.** The Today board loads in under 2 seconds on a normal phone connection.
- **NFR-3 Reliability.** If an upload fails, the data stays on the device and nothing is lost.
- **NFR-4 Data deletion.** After the test, a tester’s data is deleted on request.

## Technical Approach

- **Front end.** React with TypeScript.
- **Back end and data.** Supabase (PostgreSQL, Auth, row-level security).
- **Hosting.** Vercel.
- **Internationalization.** Translation files with an i18n library.
- **Testing.** Unit tests for quiz scoring and attribute changes, plus one end-to-end test of the check-in flow.

Quest content, game rules, and database access live in separate modules, so adding AI-generated quests or a new language later changes only one place.

The tables and what each one stores are in data-model.md.

## References

Cohen, P., Cohen, J., Aiken, L. S., & West, S. G. (1999). The problem of units and the circumstance for POMP. *Multivariate Behavioral Research, 34*(3), 315-346. https://doi.org/10.1207/S15327906MBR3403_2

Marcia, J. E. (1966). Development and validation of ego-identity status. *Journal of Personality and Social Psychology, 3*(5), 551-558. https://doi.org/10.1037/h0023281

Myers, I. B., McCaulley, M. H., Quenk, N. L., & Hammer, A. L. (1998). *MBTI manual: A guide to the development and use of the Myers-Briggs Type Indicator* (3rd ed.). Consulting Psychologists Press.

Roberts, B. W., Luo, J., Briley, D. A., Chow, P. I., Su, R., & Hill, P. L. (2017). A systematic review of personality trait change through intervention. *Psychological Bulletin, 143*(2), 117-141. https://doi.org/10.1037/bul0000088

Soto, C. J., & John, O. P. (2017a). The next Big Five Inventory (BFI-2): Developing and assessing a hierarchical model with 15 facets to enhance bandwidth, fidelity, and predictive power. *Journal of Personality and Social Psychology, 113*(1), 117-143. https://doi.org/10.1037/pspp0000096

Soto, C. J., & John, O. P. (2017b). Short and extra-short forms of the Big Five Inventory-2: The BFI-2-S and BFI-2-XS. *Journal of Research in Personality, 68*, 69-81. https://doi.org/10.1016/j.jrp.2017.02.004

Wu, D. (2016, June 8). *Choosing college subjects in China is a major hassle*. Sixth Tone. https://www.sixthtone.com/news/923

Wu, W., Hao, W., Zeng, G., & Du, W. (2024). From personality types to social labels: The impact of using MBTI on social anxiety among Chinese youth. *Frontiers in Psychology, 15*, Article 1419492. https://doi.org/10.3389/fpsyg.2024.1419492

Zhang, B., Li, Y. M., Li, J., Luo, J., Ye, Y., Yin, L., Chen, Z., Soto, C. J., & John, O. P. (2022). The Big Five Inventory-2 in China: A comprehensive psychometric evaluation in four diverse samples. *Assessment, 29*(6), 1262-1284. https://doi.org/10.1177/10731911211008245

