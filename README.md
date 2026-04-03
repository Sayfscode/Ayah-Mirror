# Ayah Mirror

A Qur'an reflection app that matches verses to your emotional state. Built as a single-page web app with no frameworks or build tools.

**Live demo:** [sayfscode.github.io/Ayah-Mirror](https://sayfscode.github.io/Ayah-Mirror)

![Status](https://img.shields.io/badge/status-live-brightgreen) ![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue) ![No dependencies](https://img.shields.io/badge/dependencies-none-lightgrey)

---

## Features

### Emotion-Based Ayah Matching
- Select from 18 emotions or type a custom feeling
- 3-phase progression system: Comfort, Patience, Action
- Each ayah includes Arabic text, translation, explanation, and a practical action step
- Related hadith and scholar wisdom displayed alongside each ayah

### Cinematic Ayah Experience
- Fullscreen nature video backgrounds (rain, ocean, forest, night sky)
- Real ambient audio with smooth fade-in/fade-out
- Optional Qur'an recitation (Mishary Alafasy via AlQuran Cloud)
- Staged reveal: Arabic text, translation, verse reference, wisdom line
- Configurable duration (30s, 1 min, infinite)

### Qur'an Stations
- Continuous recitation streaming (like Spotify for Qur'an)
- 3 reciters: Mishary Alafasy, Abdul Rahman Al-Sudais, Abu Bakr Ash-Shatri
- Surah selector (all 114 surahs) with starting ayah picker
- Play/Pause, Previous, Next controls
- Live Arabic text + English translation from AlQuran Cloud API
- Surah progress bar

### Qur'an Detection Mode
- Speech recognition (Web Speech API, Arabic)
- Recite an ayah and the app identifies it
- Fuzzy matching engine with bigram + LCS scoring
- Confidence tiers: High, Possible, Low
- Configurable search range (Juz 30, Juz 29, Short Surahs, Full Qur'an)

### Journal
- Reflection history with saved notes
- Private notes with optional 4-digit passcode lock
- All data stored locally (localStorage)

### Other Features
- Daily personalized ayah based on reflection history
- Streak tracking (consecutive days of use)
- Light/dark theme with glassmorphism UI
- Animated gradient background with floating particles
- Fully responsive, mobile-first design

---

## Project Structure

```
ayah-mirror/
  index.html          # HTML structure (no inline CSS or JS)
  css/
    styles.css        # All styles — themes, layout, components, animations
  js/
    data.js           # Static data: ayah database, action steps, guidance stack,
                      #   wisdom lines, surah data, media URLs, reciters
    audio.js          # Audio system: ambient, recitation, fading, mobile priming
    ui.js             # Core UI: theme, navigation, emotion matching, result screen,
                      #   history, notes, passcode, streak, daily ayah, toast
    cinematic.js      # Cinematic mode: video, staged reveal, controls
    stations.js       # Qur'an Stations: streaming, reciter selection, playback
    detect.js         # Detection mode: speech recognition, fuzzy matching
    app.js            # Initialization entry point
  assets/
    images/           # (reserved for future use)
```

---

## Technologies

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic markup) |
| Styling | CSS3 — custom properties, grid, flexbox, keyframes, glassmorphism |
| Logic | Vanilla JavaScript — no frameworks, no build tools |
| Audio | HTML5 Audio API, Web Speech API |
| Qur'an Data | [AlQuran Cloud API](https://alquran.cloud/api) |
| Qur'an Audio | [Islamic Network CDN](https://cdn.islamic.network) |
| Deployment | GitHub Pages (static hosting) |

---

## Running Locally

No build step required:

```bash
git clone https://github.com/Sayfscode/Ayah-Mirror.git
cd Ayah-Mirror
open index.html        # macOS
# or: xdg-open index.html   (Linux)
# or: start index.html      (Windows)
```

> **Note:** Speech recognition (Detect Mode) requires Chrome/Edge. Qur'an Stations requires an internet connection for streaming.

---

## APIs Used

- **AlQuran Cloud API** — Ayah text (Uthmani script) and English translation (Saheeh International)
- **Islamic Network CDN** — Per-ayah recitation audio (Alafasy 128kbps, Al-Sudais 192kbps, Ash-Shatri 128kbps)
- **Pexels** — Royalty-free nature videos for cinematic mode
- **GitHub raw audio** — Ambient sound loops (rain, ocean, wind, night)

---

*Built by Sayf Siddique as part of a self-directed learning path.*
