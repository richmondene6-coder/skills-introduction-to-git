---
name: youtube-faceless
description: Plans and writes content for a faceless YouTube channel (no on-camera host): niche and topic selection, titles and thumbnails, hooks, voiceover scripts, shot lists, descriptions and a weekly production routine. Use when the user says "faceless YouTube", "YouTube channel without showing my face", "video script", "title ideas", "thumbnail ideas", "YouTube content plan", or "voiceover script".
---

# youtube-faceless

Helps the user plan and produce videos for a channel where nobody appears on
camera: voiceover over stock or screen footage, animation, slides, text, or
screen recordings.

## Step 0: the channel file

Everything reads and writes `youtube/channel.md` in the user's project. If it is
missing, ask for the items below (at most three questions in one message), then
write the file. Do not invent a niche, audience, numbers or competitors.

```markdown
# <channel name or working name>

- Niche and promise: what the channel is about and what a viewer gets.
- Viewer: who watches, what they already know, what they want.
- Format: voiceover + stock / animation / screen recording / slides / text.
- Voice: who is speaking (narrator persona), tone, language.
- Length and cadence: typical video length, videos per week.
- Tools and budget: editing software, voice (own recording or text-to-speech), stock sources.
- Constraints: time per video, anything off limits.
```

## What to produce (pick the job the user asked for)

### 1. Topic list
- Give 10 topics as a table: working title, the viewer's question it answers,
  why they would click, and the format that fits.
- Group them into 2-3 repeatable series so production can be templated.
- Mark every claim about demand as **unverified**. Tell the user to check each
  topic against YouTube search suggestions and what already ranks. Never state
  search volumes, views or earnings as fact.

### 2. Title and thumbnail
- 5 title options per video: one clear, one curiosity, one number or list, one
  contrarian, one plain keyword. Keep each honest to what the video delivers.
- Thumbnail brief: one idea, 3 words or fewer of text, one focal subject, high
  contrast. Describe it so it can be made in an image tool; no faces needed.

### 3. Script (voiceover)
Write in a file `youtube/scripts/<slug>.md` with two columns, narration and
visual, one row per beat:

| time | narration | visual |
| --- | --- | --- |

Structure:
1. **Hook (first 15 s):** the promise or the question, stated in the first
   sentence. No logo sting, no "welcome back".
2. **Setup:** why it matters to this viewer, in one or two lines.
3. **Body:** 3-5 beats, each one point, one example, one visual. Reset
   attention every 20-30 s with a new visual or a new question.
4. **Payoff:** deliver exactly what the hook promised.
5. **Close:** one next step and a pointer to a related video. One call to
   action, not three.

Rules: spoken language, short sentences, read it aloud. Cut anything the
viewer would skip. Every factual claim gets a source in a notes section at the
bottom, or is removed. Do not fabricate statistics, quotes or studies.

### 4. Shot list and assets
- For each beat, name the visual: stock clip search terms, screen recording
  steps, slide text, or animation notes.
- Check licences before use: only footage, music and images the user may
  legally use. Say which sources need attribution. Do not assume anything is
  free to use.

### 5. Description, tags and chapters
- First two lines of the description carry the keyword and the promise.
- Chapters from the script's beats, with timestamps once the edit is final.
- Disclose sponsorships and affiliate links where required.

### 6. Weekly production routine
Lay out a repeatable week from the user's stated hours: research, script,
voiceover, edit, thumbnail, upload, review of the last video's results. Keep it
inside the time the user said they have.

## Honest limits
- Faceless channels depend on original value. Reused, mass-produced or
  unadapted material can fall foul of YouTube's policies on reused content and
  on disclosing altered or synthetic media. Tell the user to read the current
  policies and disclose AI-generated voice or visuals where YouTube requires it.
- Do not promise growth, views or income. Treat results as hypotheses to test
  with the first 10 videos.

## Output
Write files into `youtube/` (`channel.md`, `topics.md`, `scripts/`). Then say
what was written and suggest one next step: usually the first script, or, if
there is no topic list yet, the topic list.
