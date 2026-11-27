# Script: Split a full name into first and last name in Excel

Topic 3 from `youtube/topics.md` (Series A). Screen recording, own voice, about 6 minutes.
Draft: the steps are written from my knowledge of Excel and must be checked on your Excel version while you record (see Notes).

## Titles (pick one)
1. How to Split First and Last Name in Excel (3 Ways) — clear / number
2. Split names in Excel in 10 seconds — curiosity
3. Separate First and Last Name in Excel — keyword
4. Stop splitting names by hand in Excel — contrarian
5. Excel: One Name Column, Two Columns, 3 Methods — list

Keep each title only if the video delivers it. Title 1 or 3 is the safest.

## Thumbnail brief
One idea: one column "Anna Lee" with an arrow splitting into two columns "Anna" and "Lee". Text: "SPLIT NAMES" (2 words). High contrast, no face.

## Sample data to prepare (yours, not real people)
About 12 invented names in one column:
- Plain two-word names ("Anna Lee").
- A few with a middle name ("Anna Marie Lee").
- One with a two-word last name ("Maria de la Cruz").
- One with a suffix ("Sam Ortiz Jr.").
- One with a stray extra space.
Do not use real names or customer data.

## Script

| time | narration | visual |
| --- | --- | --- |
| 0:00 | You have one column of full names and you need first and last names in separate columns. Here are three ways to do it, and what each one gets wrong. | Column of full names |
| 0:15 | Method one is Text to Columns. Select the names, open the Data tab, click Text to Columns, choose Delimited, and tick Space. | Select range, Data tab, Text to Columns wizard, Delimited, Space ticked |
| 0:50 | Careful: by default this writes over your original column. On the last step, change the Destination to a blank cell nearby. | Wizard last step, change Destination cell, Finish |
| 1:20 | It works well for two-word names. But a middle name creates three columns, and a name like Maria de la Cruz spreads across four. | Show split results with the middle-name and multi-word rows highlighted |
| 1:55 | Method two is Flash Fill. In the next column, type the first name for the first row. Start typing the second one, and Excel suggests the rest. Press Enter to accept, or press Control E. | Type "Anna" in B2, start B3, grey suggestion appears, press Enter / Ctrl+E |
| 2:30 | Do the same in the next column for last names. Flash Fill guesses a pattern from your example, so check the odd rows: middle names and suffixes. | Last-name column; zoom on rows with middle name and "Jr." |
| 3:00 | Flash Fill doesn't update when your data changes. If you add names later, run it again. | Edit a name; the split column doesn't change |
| 3:20 | Method three is formulas, which do update. If you have Microsoft 365 or a recent version of Excel, use TEXTBEFORE and TEXTAFTER. For the first name, type equals TEXTBEFORE, the cell, then a space in quotes. | Type =TEXTBEFORE(A2," ") in B2, fill down |
| 3:55 | For the last name, equals TEXTAFTER, the cell, a space in quotes, and minus one as the instance number to take the part after the last space. | Type =TEXTAFTER(A2," ",-1) in C2, fill down |
| 4:25 | Don't have those functions? Use the older way: LEFT with FIND for the first name, and RIGHT with LEN and SUBSTITUTE for the last. It's longer, but it works in older versions. | Show the older formulas on screen as text; paste in and fill down |
| 4:55 | Clean up stray spaces first by wrapping the cell in TRIM, so an extra space doesn't break the split. | Type =TRIM(A2) in a helper column; use it as the source |
| 5:15 | Whichever method you pick, scan the results for middle names, two-word last names and suffixes like Junior. No formula is right for every name, so decide how you want those handled. | Highlight odd rows in the results |
| 5:40 | That's three ways: Text to Columns, Flash Fill, and formulas. Next video: SUMIFS, add up only what matches. | End card pointing to the next topic |

## Notes (verify before publishing)
- Check every menu name and dialog wording on your own Excel version while recording; labels differ between Windows and Mac and between versions. Say which version you use at the start or in the description.
- `TEXTBEFORE` and `TEXTAFTER` are newer functions: confirm in the current Microsoft Support pages which versions have them, and say so on screen. The negative instance number in `TEXTAFTER` (-1) takes the text after the last delimiter; confirm that in your recording.
- Confirm Flash Fill (Control E) works on your version, and what it does with the middle-name and suffix rows.
- Write and test the older LEFT/FIND and RIGHT/LEN/SUBSTITUTE formulas before recording; I haven't included exact versions here so you don't copy untested text. Add them to this file once tested.
- Use invented names only. Do not show real people's names on screen.
- Trim: the older-formula beat (4:25) is the first to cut if the video passes 7 minutes, but then say there's a longer-formula option in the description.

## Description draft
Line 1: Split a full name into first and last name in Excel: Text to Columns, Flash Fill and formulas.
Line 2: Covers middle names, multi-word last names, and which Excel versions have TEXTBEFORE and TEXTAFTER.
Chapters (confirm timestamps after editing): 0:00 Intro, 0:15 Text to Columns, 1:55 Flash Fill, 3:20 Formulas, 5:15 Checking odd names.
Links: Microsoft Support pages for Text to Columns, Flash Fill, TEXTBEFORE and TEXTAFTER (add after checking).
