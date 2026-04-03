/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Audio System
   Handles ambient audio, Qur'an recitation, volume fading,
   and mobile audio priming.
   ═══════════════════════════════════════════════════════════════════ */

/* Shared audio state (used by cinematic.js and other modules) */
let ambientAudio    = null;
let recitationAudio = null;
let isMuted         = false;


/* ════════════════════════════════════════════════════════════════
   refToAbsoluteAyah — Convert display reference to absolute ayah
   ════════════════════════════════════════════════════════════════ */

/**
 * Convert a reference string like "Surah Ar-Ra'd (13:28)" to an absolute
 * ayah number (1–6236) for the recitation audio API.
 * For range references like "Surah Al-Baqarah (2:155-156)", uses the FIRST ayah.
 */
function refToAbsoluteAyah(ref) {
  /* Match both single (13:28) and range (2:155-156) formats */
  const m = ref.match(/\((\d+):(\d+)(?:-\d+)?\)$/);
  if (!m) return null;
  const surah = parseInt(m[1], 10);
  const verse = parseInt(m[2], 10);
  if (surah < 1 || surah > 114 || !SURAH_VERSES[surah]) return null;
  /* Sum all verses in preceding surahs */
  let abs = 0;
  for (let i = 1; i < surah; i++) abs += SURAH_VERSES[i];
  return abs + verse;
}

/** Convert surah number + ayah-in-surah to absolute ayah number (1–6236) */
function surahAyahToAbsolute(surah, ayah) {
  let abs = 0;
  for (let i = 1; i < surah; i++) abs += SURAH_VERSES[i];
  return abs + ayah;
}


/* ════════════════════════════════════════════════════════════════
   10a. AMBIENT AUDIO — REAL HIGH-QUALITY FILES
   Uses HTML5 Audio with smooth fade-in/out and looping.
   ════════════════════════════════════════════════════════════════ */

/** Start ambient audio with a gentle 1.5s fade-in */
function startAmbientAudio(type) {
  stopAmbientAudio();
  const src = SOUND_SOURCES[type];
  if (!src) return; // silence

  ambientAudio = new Audio(src);
  ambientAudio.loop = true;
  ambientAudio.volume = 0; // start silent, fade in
  ambientAudio.play().catch(() => {}); // may need user gesture

  /* Smooth fade in over 1.5s */
  const targetVol = (cinematicVolumeEl.value / 100) * 0.5;
  fadeAudioTo(ambientAudio, isMuted ? 0 : targetVol, 1500);
}

/** Stop ambient audio with a gentle 1s fade-out */
function stopAmbientAudio() {
  if (!ambientAudio) return;
  const audio = ambientAudio;
  ambientAudio = null;
  fadeAudioTo(audio, 0, 1000, () => {
    audio.pause();
    audio.src = '';
  });
}

/** Smoothly fade an Audio element's volume */
function fadeAudioTo(audio, target, durationMs, onDone) {
  const start = audio.volume;
  const diff  = target - start;
  const steps = Math.max(1, Math.round(durationMs / 50));
  let step = 0;
  const interval = setInterval(() => {
    step++;
    audio.volume = Math.max(0, Math.min(1, start + diff * (step / steps)));
    if (step >= steps) {
      clearInterval(interval);
      audio.volume = Math.max(0, Math.min(1, target));
      if (onDone) onDone();
    }
  }, 50);
}

/** Update ambient volume when slider moves */
function updateAmbientVolume() {
  if (!ambientAudio) return;
  const vol = (cinematicVolumeEl.value / 100) * 0.5;
  ambientAudio.volume = isMuted ? 0 : vol;
}


/* ════════════════════════════════════════════════════════════════
   10b. QURAN RECITATION AUDIO
   Uses cdn.islamic.network for Mishary Alafasy recitation.
   Mobile-safe: Audio element is pre-created during user gesture.
   Ambient audio ducks when recitation plays.
   ════════════════════════════════════════════════════════════════ */

const cinReciteIcon    = document.getElementById('cinReciteIcon');
const cinReciteSpinner = document.getElementById('cinReciteSpinner');
let recitationState = 'idle'; // idle | loading | playing | paused

function setReciteUI(state) {
  recitationState = state;
  cinReciteIcon.style.display    = state === 'loading' ? 'none' : '';
  cinReciteSpinner.style.display = state === 'loading' ? '' : 'none';

  cinReciteBtn.classList.toggle('active-ctrl',   state === 'playing');
  cinReciteBtn.classList.toggle('recite-loading', state === 'loading');

  if (state === 'idle')    cinReciteIcon.textContent = '🎙️';
  if (state === 'playing') cinReciteIcon.textContent = '⏸️';
  if (state === 'paused')  cinReciteIcon.textContent = '▶️';
}

/** Duck ambient volume when recitation plays, restore when it stops */
function duckAmbient(duck) {
  if (!ambientAudio) return;
  const baseVol = (cinematicVolumeEl.value / 100) * 0.5;
  const target  = duck ? baseVol * 0.2 : baseVol; // duck to 20%
  fadeAudioTo(ambientAudio, isMuted ? 0 : target, 600);
}

/**
 * Pre-create the recitation Audio element during user gesture.
 * On iOS/Android, calling new Audio() + play() inside a click handler
 * "unlocks" the element so it can play later even after src changes.
 */
function primeRecitationAudio() {
  if (recitationAudio) {
    recitationAudio.pause();
    recitationAudio.removeAttribute('src');
    recitationAudio.load();
  }
  recitationAudio = new Audio();
  recitationAudio.setAttribute('playsinline', '');
  recitationAudio.volume = 0;
  /* Unlock on iOS by calling play() with an empty src, then catching the error */
  recitationAudio.play().catch(() => {});
}

/** Start Quran recitation for a given ayah reference (must be called after primeRecitationAudio) */
function startRecitation(ref) {
  const absAyah = refToAbsoluteAyah(ref);
  console.log('[Recitation] Display ref:', ref, '→ absolute ayah:', absAyah);
  if (!absAyah) {
    console.warn('[Recitation] Could not map reference to ayah number:', ref);
    return;
  }

  /* Stop any currently playing recitation first */
  if (recitationAudio && !recitationAudio.paused) {
    recitationAudio.pause();
    recitationAudio.removeAttribute('src');
    recitationAudio.load();
  }

  /* If no primed audio, create one (won't work on mobile without gesture, but try) */
  if (!recitationAudio) primeRecitationAudio();

  const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${absAyah}.mp3`;
  console.log('[Recitation] Playing URL:', url);
  setReciteUI('loading');

  recitationAudio.src = url;
  recitationAudio.volume = 0;
  recitationAudio.load();

  /* Once enough data is buffered, start playback */
  const onCanPlay = () => {
    recitationAudio.removeEventListener('canplaythrough', onCanPlay);
    recitationAudio.removeEventListener('error', onError);
    recitationAudio.play().then(() => {
      setReciteUI('playing');
      duckAmbient(true);
      fadeAudioTo(recitationAudio, isMuted ? 0 : 0.7, 800);
    }).catch(() => {
      setReciteUI('idle');
    });
  };

  const onError = () => {
    recitationAudio.removeEventListener('canplaythrough', onCanPlay);
    recitationAudio.removeEventListener('error', onError);
    setReciteUI('idle');
  };

  recitationAudio.addEventListener('canplaythrough', onCanPlay);
  recitationAudio.addEventListener('error', onError);

  /* When recitation ends naturally — stop, do NOT auto-continue to next ayah */
  recitationAudio.onended = () => {
    console.log('[Recitation] Finished playing ayah', absAyah);
    setReciteUI('idle');
    duckAmbient(false);
  };
}

/** Stop recitation with fade-out and restore ambient */
function stopRecitation() {
  if (!recitationAudio) return;
  const audio = recitationAudio;
  recitationAudio = null;
  setReciteUI('idle');
  duckAmbient(false);
  fadeAudioTo(audio, 0, 800, () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  });
}

/** Pause recitation (keep audio element alive for resume) */
function pauseRecitation() {
  if (!recitationAudio || recitationAudio.paused) return;
  recitationAudio.pause();
  setReciteUI('paused');
  duckAmbient(false);
}

/** Resume paused recitation */
function resumeRecitation() {
  if (!recitationAudio) return;
  setReciteUI('loading');
  recitationAudio.play().then(() => {
    setReciteUI('playing');
    duckAmbient(true);
  }).catch(() => {
    setReciteUI('idle');
  });
}

/** Toggle recitation: play / pause / resume */
function toggleRecitation(ref) {
  if (recitationState === 'playing') {
    pauseRecitation();
  } else if (recitationState === 'paused') {
    resumeRecitation();
  } else if (recitationState === 'idle') {
    startRecitation(ref);
  }
  /* If loading, ignore tap */
}
