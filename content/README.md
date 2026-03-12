# Curriculum content – plug and play

Replace the files in these folders to change what the game shows. **Use the same filenames** so the game finds them. No code changes needed.

## Intro (one combined video)

**Folder:** `content/intro-pages/`

- **intro-all.mp4** – One combined intro video (e.g. export from Adobe with all 11 beats and voiceover). The game shows this on a single intro screen; students click Next when done to go to the scenario.
- **manifest.json** – Optional: defines the intro scene (label, narration). The game uses `intro-all.mp4` by default if the manifest isn't loaded.

**To update the intro:** Replace `intro-all.mp4` with your new combined video (same filename). Edit `manifest.json` only if you want to change the on-screen label or narration text.

## Scenario videos (Disruption, etc.)

**Folder:** `content/` (same folder as `intro-pages/`)

- **scenario-1-mechanic-1-normal-day.mp4** – Video for the first Disruption scene (Mechanic – A normal morning).
- **scenario-1-mechanic.mp4** – Video for the second Disruption scene (Complaint letter arrives).
- **scenario-1-mechanic-3-new-tech.mp4** – Video for the third Disruption scene (The pressure from new tech).
- You can add more scenario videos later (e.g. for other scenes) by giving a scene a `media` property in the code and placing the file in `content/`.
