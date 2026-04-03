# Ayah Mirror — Development Guide

## Purpose

Ayah Mirror is a Qur'an reflection web app that matches verses to the user's emotional state. It includes a cinematic nature experience, continuous Qur'an streaming (Stations), and speech-based ayah detection.

## Architecture

Single-page app with no build tools, no frameworks, no dependencies. All files are plain HTML, CSS, and JS loaded via `<script>` tags (not ES modules) sharing a global scope.

### File Responsibilities

| File | Role |
|---|---|
| `js/data.js` | All static data constants. Loaded first. No DOM access. |
| `js/audio.js` | Audio engine: fade, ambient, recitation, mobile priming. Declares shared audio state (`ambientAudio`, `recitationAudio`, `isMuted`). |
| `js/ui.js` | Core app logic: theme, navigation, emotion matching, result screen, history, notes, passcode, streak, daily ayah, toast. Declares `navigateTo`. |
| `js/cinematic.js` | Cinematic fullscreen mode. Uses functions from `audio.js`. Declares `startFocusMode`. |
| `js/stations.js` | Qur'an Stations player. Overrides `navigateTo` (wraps it). |
| `js/detect.js` | Detection mode. Overrides `navigateTo` again (wraps the stations wrapper). |
| `js/app.js` | Initialization. Calls `renderStreak()` and `renderDaily()`. Loaded last. |

### Load Order (critical)

```html
<script src="js/data.js"></script>
<script src="js/audio.js"></script>
<script src="js/ui.js"></script>
<script src="js/cinematic.js"></script>
<script src="js/stations.js"></script>
<script src="js/detect.js"></script>
<script src="js/app.js"></script>
```

This order matters because:
1. `data.js` must load before any module that reads constants
2. `audio.js` must load before `cinematic.js` and `stations.js` (they call `fadeAudioTo`, `startAmbientAudio`, etc.)
3. `ui.js` must load before `cinematic.js` (which calls `saveToHistory`)
4. `ui.js` declares `navigateTo`, which `stations.js` wraps, which `detect.js` wraps again
5. `app.js` runs last to initialize the UI

## Rules

- **Keep UI minimal** — no heavy frameworks, no build step
- **Do not break the audio system** — mobile audio priming is fragile; test on iOS Safari and Chrome Android
- **Maintain modular structure** — keep each file focused on its domain
- **All data in data.js** — static constants go there, not scattered across modules
- **No ES modules** — all files use global scope via `<script>` tags (for GitHub Pages simplicity)
- **Test with `node --check`** — extract JS and verify syntax before committing

## External Dependencies

- AlQuran Cloud API (`api.alquran.cloud`) — ayah text and translation
- Islamic Network CDN (`cdn.islamic.network`) — recitation audio
- Pexels videos — cinematic backgrounds
- GitHub raw audio — ambient sound loops
- UI Avatars API — reciter card avatars

## Deployment

Static files served from GitHub Pages (`main` branch root). No build step needed.
