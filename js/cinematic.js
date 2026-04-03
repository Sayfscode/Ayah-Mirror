/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Cinematic Ayah Experience
   Fullscreen nature video + ambient audio + Qur'an recitation.
   Passive, non-interactive flow with staged reveal.
   ═══════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   10. CINEMATIC AYAH EXPERIENCE
   A calm, passive fullscreen experience with real nature video,
   high-quality ambient audio, optional Quran recitation,
   and a gentle cinematic flow (no forced interaction).
   ════════════════════════════════════════════════════════════════ */

/* ── DOM references ───────────────────────────────────────────── */
const cinematicOverlay  = document.getElementById('cinematicOverlay');
const cinematicVideo    = document.getElementById('cinematicVideo');
const cinematicContent  = document.getElementById('cinematicContent');
const cinematicProgress = document.getElementById('cinematicProgress');
const cinematicCloseBtn = document.getElementById('cinematicClose');
const cinematicMuteBtn  = document.getElementById('cinematicMuteBtn');
const cinematicVolumeEl = document.getElementById('cinematicVolume');
const cinReciteBtn      = document.getElementById('cinReciteBtn');

/* ── Cinematic state ──────────────────────────────────────────── */
let cinematicInterval   = null;   // countdown timer
let cinematicTimers     = [];     // setTimeout chain for staged reveals
let selectedEnv         = 'rain';
let selectedSound       = 'rain';
let selectedDuration    = 30;     // seconds (0 = infinite)
let wantRecitation      = false;  // user toggled recitation on
let isMuted             = false;


/* ════════════════════════════════════════════════════════════════
   10c. CONTROLS — Volume, Mute, Selectors
   ════════════════════════════════════════════════════════════════ */

cinematicVolumeEl.addEventListener('input', updateAmbientVolume);

cinematicMuteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  cinematicMuteBtn.textContent = isMuted ? '🔇' : '🔊';
  updateAmbientVolume();
  /* Also mute/unmute recitation */
  if (recitationAudio && !recitationAudio.paused) {
    recitationAudio.volume = isMuted ? 0 : 0.7;
  }
});

/* Environment cards */
document.getElementById('envGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.env-card');
  if (!card) return;
  document.querySelectorAll('.env-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedEnv = card.dataset.env;
});

/* Sound pills */
document.getElementById('soundPills').addEventListener('click', (e) => {
  const pill = e.target.closest('.sound-pill');
  if (!pill) return;
  document.querySelectorAll('.sound-pill').forEach(p => p.classList.remove('selected'));
  pill.classList.add('selected');
  selectedSound = pill.dataset.sound;
});

/* Duration pills */
document.getElementById('durationPills').addEventListener('click', (e) => {
  const pill = e.target.closest('.duration-pill');
  if (!pill) return;
  document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('selected'));
  pill.classList.add('selected');
  selectedDuration = parseInt(pill.dataset.dur, 10);
});

/* Recitation toggle */
document.getElementById('recitationToggle').addEventListener('click', function() {
  wantRecitation = !wantRecitation;
  this.classList.toggle('on', wantRecitation);
});


/* ════════════════════════════════════════════════════════════════
   10d. CINEMATIC FLOW — PASSIVE EXPERIENCE
   A calm, non-interactive flow:
     0s   — overlay + video fade in
     1s   — ayah arabic appears
     3s   — translation fades in
     4.5s — verse reference
     6s   — recitation starts (if enabled)
     ~60% — wisdom line fades in
     end  — "Take this with you" + auto-fade-out
   No reflection prompts. No forced interaction.
   ════════════════════════════════════════════════════════════════ */

/**
 * startFocusMode — main entry point.
 * Called from Focus screen, Result screen, and Daily screen.
 * Name kept for backward compatibility.
 */
function startFocusMode(entry) {
  /* Pick a random ayah if none provided */
  if (!entry) {
    const group = AYAH_DATA[Math.floor(Math.random() * AYAH_DATA.length)];
    entry = group.entries[Math.floor(Math.random() * group.entries.length)];
  }

  /* Find the emotion for this entry (for wisdom lookup) */
  let entryEmotion = 'Anxiety';
  for (const g of AYAH_DATA) {
    if (g.entries.some(e => e.ayah === entry.ayah)) {
      entryEmotion = g.emotion;
      break;
    }
  }

  /* ── Load and start video ───────────────────────────────────── */
  cinematicVideo.src = VIDEO_SOURCES[selectedEnv] || VIDEO_SOURCES.rain;
  cinematicVideo.load();
  cinematicVideo.play().catch(() => {});

  /* ── Start ambient audio ────────────────────────────────────── */
  startAmbientAudio(selectedSound);
  isMuted = false;
  cinematicMuteBtn.textContent = '🔊';

  /* ── Show/hide recitation button ────────────────────────────── */
  cinReciteBtn.style.display = wantRecitation ? 'flex' : 'none';
  setReciteUI('idle');

  /* Prime the audio element NOW (inside user click) for mobile compatibility */
  if (wantRecitation) primeRecitationAudio();

  /* ── Build cinematic content (minimal, passive) ─────────────── */
  cinematicContent.innerHTML = `
    <div class="cinematic-ayah" id="cinAyah">
      <div class="arabic">${entry.ayah}</div>
      <p class="translation" id="cinTranslation">"${entry.translation}"</p>
      <div class="verse-ref" id="cinRef">${entry.reference}</div>
    </div>

    <div class="cinematic-wisdom" id="cinWisdom">
      <div class="cinematic-wisdom-label">Remember this</div>
      <div class="cinematic-wisdom-text">${WISDOM_LINES[entryEmotion] || WISDOM_LINES['Anxiety']}</div>
    </div>

    <div class="cinematic-farewell" id="cinFarewell">
      <div class="cinematic-farewell-text">Take this with you.</div>
    </div>
  `;

  /* ── Show overlay ───────────────────────────────────────────── */
  cinematicOverlay.classList.remove('fade-exit');
  cinematicOverlay.classList.add('active');
  cinematicProgress.style.width = '0%';
  cinematicProgress.style.transition = 'none';

  /* ── Duration and progress ──────────────────────────────────── */
  const totalSec = selectedDuration || 0; // 0 = infinite
  let elapsed = 0;
  let farewellShown = false;

  /* Start progress bar animation after a small delay */
  if (totalSec > 0) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cinematicProgress.style.transition = `width ${totalSec}s linear`;
        cinematicProgress.style.width = '100%';
      });
    });
  }

  /* Timer tick every second */
  cinematicInterval = setInterval(() => {
    elapsed++;
    if (totalSec > 0 && elapsed >= totalSec) {
      clearInterval(cinematicInterval);
      cinematicInterval = null;
      showFarewell();
      /* Auto-exit 3 seconds after farewell */
      const exitTimer = setTimeout(() => endCinematicMode(), 3000);
      cinematicTimers.push(exitTimer);
    }
  }, 1000);

  /* ── Staged reveal timeline ─────────────────────────────────── */
  function scheduleStep(fn, ms) {
    const t = setTimeout(fn, ms);
    cinematicTimers.push(t);
  }

  /* Step 1: 1s — fade in ayah */
  scheduleStep(() => {
    const el = document.getElementById('cinAyah');
    if (el) el.classList.add('visible');
  }, 1000);

  /* Step 2: 3s — translation */
  scheduleStep(() => {
    const el = document.getElementById('cinTranslation');
    if (el) el.classList.add('visible');
  }, 3000);

  /* Step 3: 4.5s — verse reference */
  scheduleStep(() => {
    const el = document.getElementById('cinRef');
    if (el) el.classList.add('visible');
  }, 4500);

  /* Step 4: 6s — pulse recitation button to invite user to tap (no autoplay) */
  if (wantRecitation) {
    scheduleStep(() => {
      cinReciteBtn.style.animation = 'recitePulse 1.5s ease-in-out 3';
      setTimeout(() => { cinReciteBtn.style.animation = ''; }, 4500);
    }, 6000);
  }

  /* Step 5: ~60% through — show wisdom */
  const wisdomTime = totalSec > 0
    ? Math.max(8000, totalSec * 600) // 60% of duration, min 8s
    : 15000; // infinite mode: show at 15s
  scheduleStep(() => {
    const el = document.getElementById('cinWisdom');
    if (el) el.classList.add('visible');
  }, wisdomTime);

  /** Show farewell */
  function showFarewell() {
    if (farewellShown) return;
    farewellShown = true;
    const el = document.getElementById('cinFarewell');
    if (el) el.classList.add('visible');
  }

  /* ── Recitation button toggle ───────────────────────────────── */
  cinReciteBtn.onclick = () => toggleRecitation(entry.reference);

  /* ── Save session to history ────────────────────────────────── */
  saveToHistory({
    date: new Date().toISOString(),
    emotion: entryEmotion,
    reference: entry.reference,
    translation: entry.translation,
    learnedText: '',
    actionText: '(Cinematic Ayah)'
  });
}


/** Clean up and close the cinematic overlay with smooth fade-out */
function endCinematicMode() {
  /* Clear all timers */
  if (cinematicInterval) { clearInterval(cinematicInterval); cinematicInterval = null; }
  cinematicTimers.forEach(t => clearTimeout(t));
  cinematicTimers = [];

  /* Fade out audio */
  stopAmbientAudio();
  stopRecitation();

  /* Fade out overlay */
  cinematicOverlay.classList.add('fade-exit');

  /* After fade completes, fully clean up */
  setTimeout(() => {
    cinematicOverlay.classList.remove('active', 'fade-exit');
    cinematicContent.innerHTML = '';
    cinematicProgress.style.width = '0%';
    cinematicProgress.style.transition = 'none';

    /* Unload video to free memory */
    cinematicVideo.pause();
    cinematicVideo.removeAttribute('src');
    cinematicVideo.load();
  }, 1600);
}

/* ── X close button ───────────────────────────────────────────── */
cinematicCloseBtn.addEventListener('click', endCinematicMode);

/* ── Start from Focus screen button ───────────────────────────── */
document.getElementById('startFocusBtn').addEventListener('click', () => {
  startFocusMode(null);
});
