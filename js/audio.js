/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Audio System
   Handles ambient audio, Qur'an recitation, volume fading,
   and mobile audio priming.
   ═══════════════════════════════════════════════════════════════════ */

/* Shared audio state (used by cinematic.js, stations.js, detect.js)
   Using var for true globals accessible across all script files. */
var ambientAudio    = null;
var recitationAudio = null;
var isMuted         = false;

/* Shared DOM refs used by audio functions — declared here (loads first),
   populated by cinematic.js but referenced in audio callbacks at runtime. */
var cinematicVolumeEl = null; // set by cinematic.js on load
var cinReciteBtn      = null; // set by cinematic.js on load
var cinReciteIcon     = null; // set by cinematic.js on load
var cinReciteSpinner  = null; // set by cinematic.js on load

/* Default ambient volume (0–1 scale). Used when cinematicVolumeEl not ready. */
var AMBIENT_BASE_VOLUME = 0.20;


/* ════════════════════════════════════════════════════════════════
   refToAbsoluteAyah — Convert display reference to absolute ayah
   ════════════════════════════════════════════════════════════════ */

/**
 * Convert a reference string like "Surah Ar-Ra'd (13:28)" to an absolute
 * ayah number (1–6236) for the recitation audio API.
 * For range references like "Surah Al-Baqarah (2:155-156)", uses the FIRST ayah.
 */
function refToAbsoluteAyah(ref) {
  var m = ref.match(/\((\d+):(\d+)(?:-\d+)?\)$/);
  if (!m) return null;
  var surah = parseInt(m[1], 10);
  var verse = parseInt(m[2], 10);
  if (surah < 1 || surah > 114 || !SURAH_VERSES[surah]) return null;
  var abs = 0;
  for (var i = 1; i < surah; i++) abs += SURAH_VERSES[i];
  return abs + verse;
}

/** Convert surah number + ayah-in-surah to absolute ayah number (1–6236) */
function surahAyahToAbsolute(surah, ayah) {
  var abs = 0;
  for (var i = 1; i < surah; i++) abs += SURAH_VERSES[i];
  return abs + ayah;
}


/* ════════════════════════════════════════════════════════════════
   AMBIENT AUDIO — Smooth fade-in/out with looping
   ════════════════════════════════════════════════════════════════ */

/** Get the current base ambient volume from slider or default */
function getAmbientBaseVolume() {
  if (cinematicVolumeEl) {
    return (cinematicVolumeEl.value / 100) * 0.5;
  }
  return AMBIENT_BASE_VOLUME;
}

/** Start ambient audio with a gentle 1.5s fade-in */
function startAmbientAudio(type) {
  stopAmbientAudio();
  var src = SOUND_SOURCES[type];
  if (!src) return;

  ambientAudio = new Audio(src);
  ambientAudio.loop = true;
  ambientAudio.volume = 0;
  ambientAudio.play().catch(function() {});

  var targetVol = getAmbientBaseVolume();
  fadeAudioTo(ambientAudio, isMuted ? 0 : targetVol, 1500);
}

/** Stop ambient audio with a gentle 1s fade-out */
function stopAmbientAudio() {
  if (!ambientAudio) return;
  var audio = ambientAudio;
  ambientAudio = null;
  fadeAudioTo(audio, 0, 1000, function() {
    audio.pause();
    audio.src = '';
  });
}

/** Smoothly fade an Audio element's volume */
function fadeAudioTo(audio, target, durationMs, onDone) {
  if (!audio) return;
  var start = audio.volume;
  var diff  = target - start;
  var steps = Math.max(1, Math.round(durationMs / 50));
  var step = 0;
  var interval = setInterval(function() {
    step++;
    try {
      audio.volume = Math.max(0, Math.min(1, start + diff * (step / steps)));
    } catch(e) { clearInterval(interval); return; }
    if (step >= steps) {
      clearInterval(interval);
      try { audio.volume = Math.max(0, Math.min(1, target)); } catch(e) {}
      if (onDone) onDone();
    }
  }, 50);
}

/** Update ambient volume when slider moves */
function updateAmbientVolume() {
  if (!ambientAudio) return;
  var vol = getAmbientBaseVolume();
  ambientAudio.volume = isMuted ? 0 : vol;
}


/* ════════════════════════════════════════════════════════════════
   QURAN RECITATION AUDIO
   Uses cdn.islamic.network for recitation.
   Mobile-safe: Audio element is pre-created during user gesture.
   Ambient audio ducks when recitation plays.
   ════════════════════════════════════════════════════════════════ */

var recitationState = 'idle'; // idle | loading | playing | paused

function setReciteUI(state) {
  recitationState = state;
  if (!cinReciteIcon || !cinReciteSpinner || !cinReciteBtn) return;

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
  var baseVol = getAmbientBaseVolume();
  /* Duck to 5% of base when recitation plays (was 20%, now calmer) */
  var target  = duck ? baseVol * 0.05 : baseVol;
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
  recitationAudio.play().catch(function() {});
}

/** Start Quran recitation for a given ayah reference */
function startRecitation(ref) {
  var absAyah = refToAbsoluteAyah(ref);
  if (!absAyah) return;

  if (recitationAudio && !recitationAudio.paused) {
    recitationAudio.pause();
    recitationAudio.removeAttribute('src');
    recitationAudio.load();
  }

  if (!recitationAudio) primeRecitationAudio();

  var url = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + absAyah + '.mp3';
  setReciteUI('loading');

  recitationAudio.src = url;
  recitationAudio.volume = 0;
  recitationAudio.load();

  var onCanPlay = function() {
    recitationAudio.removeEventListener('canplaythrough', onCanPlay);
    recitationAudio.removeEventListener('error', onError);
    recitationAudio.play().then(function() {
      setReciteUI('playing');
      duckAmbient(true);
      fadeAudioTo(recitationAudio, isMuted ? 0 : 0.7, 800);
    }).catch(function() {
      setReciteUI('idle');
    });
  };

  var onError = function() {
    recitationAudio.removeEventListener('canplaythrough', onCanPlay);
    recitationAudio.removeEventListener('error', onError);
    setReciteUI('idle');
  };

  recitationAudio.addEventListener('canplaythrough', onCanPlay);
  recitationAudio.addEventListener('error', onError);

  recitationAudio.onended = function() {
    setReciteUI('idle');
    duckAmbient(false);
  };
}

/** Stop recitation with fade-out and restore ambient */
function stopRecitation() {
  if (!recitationAudio) return;
  var audio = recitationAudio;
  recitationAudio = null;
  setReciteUI('idle');
  duckAmbient(false);
  fadeAudioTo(audio, 0, 800, function() {
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
  recitationAudio.play().then(function() {
    setReciteUI('playing');
    duckAmbient(true);
  }).catch(function() {
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
}
