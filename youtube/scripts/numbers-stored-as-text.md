# Script: Why Excel treats your numbers as text (and how to fix it)

Topic 2 from `youtube/topics.md` (Series A). Screen recording, own voice, about 6 minutes.
Draft: the steps are written from my knowledge of Excel and must be checked on your Excel version while you record (see Notes).

## Titles (pick one)
1. Excel Numbers Stored as Text: 4 Fixes That Work — clear / list
2. Why your Excel total says 0 (and how to fix it) — curiosity
3. Convert Text to Numbers in Excel — keyword
4. Stop "fixing" this Excel problem one cell at a time — contrarian
5. 4 Ways to Fix Numbers Stored as Text in Excel — number

Keep each title only if the video delivers it. Title 1 or 3 is the safest.

## Thumbnail brief
One idea: a SUM cell showing 0 under a column of numbers, with a green triangle in a corner. Text: "TOTAL = 0?" (2 words and a symbol). High contrast, no face.

## Sample data to prepare (yours, not real data)
A column of about 10 invented sales amounts that Excel treats as text. Build it so you can show different causes:
- Some values typed after formatting the cells as Text.
- Some values with a leading apostrophe.
- A few "imported" values with a trailing space, and one with a non-breaking space (paste from a web page to get one).
Do not use real company or personal data.

## Script

| time | narration | visual |
| --- | --- | --- |
| 0:00 | You add up a column of numbers and Excel says zero. The numbers look fine, but Excel thinks they're text. Here are four ways to fix it. | Column of numbers, SUM cell showing 0 |
| 0:15 | First, how to spot the problem. Text usually lines up on the left of the cell and numbers on the right. You may also see a small green triangle in the corner. | Left-aligned values; zoom on green triangle |
| 0:40 | You can check any cell with a formula. ISNUMBER returns TRUE for a real number and FALSE for text. | Type =ISNUMBER(A2), fill down, TRUE/FALSE results |
| 1:05 | Fix one, the quickest: select the cells, click the warning icon that appears, and choose Convert to Number. | Select range, click the yellow warning icon, choose Convert to Number; SUM updates |
| 1:35 | If there's no warning icon, use fix two: Text to Columns. Select the column, go to the Data tab, click Text to Columns, and click Finish. | Data tab, Text to Columns wizard, click Finish; values turn right-aligned |
| 2:10 | It looks like it does nothing, but Excel re-reads each cell and turns the text into numbers. | Before and after, SUM updates |
| 2:30 | Fix three works inside a formula. Put equals VALUE, then the cell, to turn text into a number. | Type =VALUE(A2), fill down |
| 2:55 | Or add zero, or multiply by one. Same result, shorter. | Type =A2*1 next to it, show same result |
| 3:15 | Then copy those results and paste them as values over the originals. | Copy, Paste Special, Values |
| 3:40 | Why does Excel do this? One common cause is formatting the cells as Text before typing. Changing the format afterwards doesn't convert what's already there: you have to re-enter the values, or use one of these fixes. | Format Cells dialog, Text category; change to General; value stays left-aligned until re-entered |
| 4:15 | A leading apostrophe makes Excel store the cell as text too. You can see it in the formula bar, not in the cell. | Click a cell with an apostrophe, show formula bar |
| 4:35 | Fix four is for imported data that still won't convert. A trailing space can be the culprit: use TRIM. A web page can also put in a non-breaking space, which TRIM doesn't remove. | Type =TRIM(A2); then a cell where it fails |
| 5:05 | For that one, use SUBSTITUTE to replace the character 160 with nothing, then convert it to a number. | Type =VALUE(SUBSTITUTE(A2,CHAR(160),"")), fill down |
| 5:35 | Quick recap: warning icon, Text to Columns, VALUE or times one, and SUBSTITUTE for stubborn imports. | Four-item text card |
| 5:50 | Next video: how to split a full name into first and last name. | End card pointing to topic 3 |

## Notes (verify before publishing)
- Check every menu name and dialog on your Excel version while recording; wording differs between Windows and Mac and between versions. Say which version you use at the start or in the description.
- Confirm on your own data, in the recording: the green triangle and warning icon appear, SUM ignores text values, Text to Columns > Finish converts them, and changing a cell's format to General does not convert existing text.
- Confirm that TRIM does not remove the non-breaking space and that SUBSTITUTE with CHAR(160) does. If your test shows otherwise, change the script.
- The title says "formula" in the topic list; this script covers numbers stored as text, the common cause of a SUM showing 0. A formula that displays as text (cell formatted as Text before typing a formula) could be a short extra beat or its own video. Decide before recording.
- Link the Microsoft Support pages for "Fix text-formatted numbers" and Text to Columns in the description after checking them.
- Trim: the apostrophe beat (4:15) is the first to cut if the video passes 7 minutes.

## Description draft
Line 1: Numbers stored as text in Excel: why your SUM shows 0, and four ways to fix it.
Line 2: Covers the warning icon, Text to Columns, VALUE, and TRIM and SUBSTITUTE for imported data.
Chapters (confirm timestamps after editing): 0:00 Intro, 0:15 Spot the problem, 1:05 Convert to Number, 1:35 Text to Columns, 2:30 VALUE, 4:35 Imported data, 5:35 Recap.
Links: Microsoft Support pages (add after checking).
