# Script: Remove duplicates in Excel without losing data

Topic 1 from `youtube/topics.md` (Series A). Screen recording, own voice, about 6 minutes.
Draft: the steps are written from my knowledge of Excel and must be checked against your Excel version while you record (see Notes).

## Titles (pick one)
1. How to Remove Duplicates in Excel (Without Losing Your Data) — clear
2. The Excel duplicate mistake that deletes the wrong rows — curiosity
3. 3 Ways to Handle Duplicates in Excel — list
4. Don't use Remove Duplicates until you've watched this — contrarian
5. Remove Duplicates in Excel — keyword

Keep each title only if the video delivers it. Title 1 is the safest.

## Thumbnail brief
One idea: a table with two identical rows, one highlighted red, one crossed out. Text: "NO DATA LOST" (3 words). High contrast, no face.

## Sample data to prepare (yours, not real people)
A small table of about 15 invented rows: Name, Email, Order ID, with 3–4 exact duplicates and 2 near-duplicates (for example "Anna Lee" and "anna lee", and one name with a trailing space). Do not use real customer or company data.

## Script

| time | narration | visual |
| --- | --- | --- |
| 0:00 | Excel's Remove Duplicates button deletes rows for good, and it's easy to delete the wrong ones. Here's how to remove duplicates without losing anything you need. | Table with duplicates visible; cursor hovers over Data > Remove Duplicates |
| 0:15 | Three steps: back up your data, see what's duplicated, then remove only what you mean to. Six minutes, start to finish. | Three-item text card: 1 Back up, 2 See, 3 Remove |
| 0:30 | Step one: make a copy. Right-click the sheet tab, choose Move or Copy, tick Create a copy. Now if anything goes wrong, your original is safe. | Right-click tab, Move or Copy dialog, Create a copy ticked |
| 1:00 | Step two: see the duplicates before you delete them. Select your data, go to Home, Conditional Formatting, Highlight Cells Rules, Duplicate Values. | Select range, Home tab menu, Duplicate Values dialog, rows turn colored |
| 1:35 | This colors every value that appears more than once. Careful: it checks the cells in your selection. If you select one column, it only compares that column. | Select only the Name column, highlight; then select all columns, highlight; show the difference |
| 2:10 | Now step three. Select your table, go to the Data tab, and click Remove Duplicates. | Data tab, Remove Duplicates button |
| 2:25 | This box decides what counts as a duplicate. If every column is ticked, a row is only removed when all the values match. If you tick only Email, any row with a repeated email goes, even if the name differs. | Dialog: show all columns ticked, then only Email ticked |
| 3:00 | Leave "My data has headers" ticked so your header row isn't treated as data. Click OK. | Tick My data has headers, click OK |
| 3:15 | Excel tells you how many duplicates it found and removed, and how many unique values remain. Excel keeps the first occurrence and removes the later ones. | Result message box, then the table |
| 3:40 | Made a mistake? Press Control Z straight away. This only works right now, before you do anything else, so check the count first. | Press Ctrl+Z, rows return; Ctrl+Y to redo |
| 4:00 | Why did "Anna Lee" and "anna lee" count as the same, while "Anna Lee" with a space at the end didn't? Excel ignores capital letters here, but a hidden trailing space makes two values different. | Highlight the near-duplicate rows; click in the cell to show the trailing space |
| 4:30 | Fix that with the TRIM function. In a spare column, type equals TRIM, the cell, and fill down. Then remove duplicates using the clean column. | Type =TRIM(A2), fill down, show cleaned values |
| 5:00 | If you have Microsoft 365 or Excel 2021 or later, there's a way that never touches your original: the UNIQUE function. Type equals UNIQUE, select your range, press Enter. | Type =UNIQUE(A2:C16) in an empty area; spilled results appear |
| 5:30 | Your original stays untouched and you get a clean list beside it. Older versions of Excel don't have this function, so use the button instead. | Original and unique list side by side |
| 5:45 | That's it: back up, see, then remove. Next video: fix numbers that Excel thinks are text. | End card pointing to the next video (topic 2) |

## Notes (verify before publishing)
- Check every menu name and the dialog wording on your own Excel version while recording; labels differ slightly between versions, and Windows and Mac. Say which version you use at the start or in the description.
- Confirm in the recording: Remove Duplicates keeps the first occurrence, ignores case, and counts a trailing space as a difference. These are my understanding of how it works; if your test shows otherwise, change the script.
- UNIQUE requires Microsoft 365 or Excel 2021 or later. Check the current Microsoft Support page for Remove Duplicates and UNIQUE and link both in the description.
- Do not show real data on screen.
- Cut anything that runs long: the Ctrl+Z section and the TRIM section are the first to trim if the video passes 7 minutes.

## Description draft
Line 1: Remove duplicates in Excel without losing data: back up, highlight, then remove, in 6 minutes.
Line 2: Covers Remove Duplicates, Conditional Formatting, TRIM and the UNIQUE function (Microsoft 365 / Excel 2021+).
Chapters (confirm timestamps after editing): 0:00 Intro, 0:30 Back up, 1:00 See duplicates, 2:10 Remove Duplicates, 4:00 Hidden spaces, 5:00 UNIQUE function.
Links: Microsoft Support pages for Remove Duplicates and UNIQUE (add after checking).
