/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Cinematic Ayah Experience
   Fullscreen nature video + ambient audio + Qur'an recitation.
   Passive, non-interactive flow with staged reveal.
   ═══════════════════════════════════════════════════════════════════ */

/* ── DOM references ───────────────────────────────────────────── */
var cinematicOverlay  = document.getElementById('cinematicOverlay');
var cinematicVideo    = document.getElementById('cinematicVideo');
var cinematicContent  = document.getElementById('cinematicContent');
var cinematicProgress = document.getElementById('cinematicProgress');
var cinematicCloseBtn = document.getElementById('cinematicClose');
var cinematicMuteBtn  = document.getElementById('cinematicMuteBtn');

/* Populate shared audio refs declared in audio.js */
cinematicVolumeEl = document.getElementById('cinematicVolume');
cinReciteBtn      = document.getElementById('cinReciteBtn');
cinReciteIcon     = document.getElementById('cinReciteIcon');
cinReciteSpinner  = document.getElementById('cinReciteSpinner');

/* ── Cinematic state ──────────────────────────────────────────── */
var cinematicInterval   = null;
var cinematicTimers     = [];
var selectedEnv         = 'rain';
var selectedSound       = 'rain';
var selectedDuration    = 30;
var wantRecitation      = false;
/* isMuted is declared in audio.js as a shared global */


/* ════════════════════════════════════════════════════════════════
   CONTROLS — Volume, Mute, Selectors
   ════════════════════════════════════════════════════════════════ */

cinematicVolumeEl.addEventListener('input', updateAmbientVolume);

cinematicMuteBtn.addEventListener('click', function() {
  isMuted = !isMuted;
  cinematicMuteBtn.textContent = isMuted ? '🔇' : '🔊';
  updateAmbientVolume();
  if (recitationAudio && !recitationAudio.paused) {
    recitationAudio.volume = isMuted ? 0 : 0.7;
  }
});

/* Environment cards */
document.getElementById('envGrid').addEventListener('click', function(e) {
  var card = e.target.closest('.env-card');
  if (!card) return;
  document.querySelectorAll('.env-card').forEach(function(c) { c.classList.remove('selected'); });
  card.classList.add('selected');
  selectedEnv = card.dataset.env;
});

/* Sound pills */
document.getElementById('soundPills').addEventListener('click', function(e) {
  var pill = e.target.closest('.sound-pill');
  if (!pill) return;
  document.querySelectorAll('.sound-pill').forEach(function(p) { p.classList.remove('selected'); });
  pill.classList.add('selected');
  selectedSound = pill.dataset.sound;
});

/* Duration pills */
document.getElementById('durationPills').addEventListener('click', function(e) {
  var pill = e.target.closest('.duration-pill');
  if (!pill) return;
  document.querySelectorAll('.duration-pill').forEach(function(p) { p.classList.remove('selected'); });
  pill.classList.add('selected');
  selectedDuration = parseInt(pill.dataset.dur, 10);
});

/* Recitation toggle */
document.getElementById('recitationToggle').addEventListener('click', function() {
  wantRecitation = !wantRecitation;
  this.classList.toggle('on', wantRecitation);
});


/* ════════════════════════════════════════════════════════════════
   CINEMATIC FLOW — PASSIVE EXPERIENCE
   Calm, non-interactive staged reveal:
     0s   — overlay + video fade in
     1.5s — ayah arabic appears (blur-to-sharp)
     3.5s — translation fades in
     5s   — verse reference
     6.5s — recitation auto-starts if enabled
     ~60% — wisdom line fades in
     end  — "Take this with you" + auto-fade-out
   ════════════════════════════════════════════════════════════════ */

function startFocusMode(entry) {
  /* Pick a random ayah if none provided */
  if (!entry) {
    var group = AYAH_DATA[Math.floor(Math.random() * AYAH_DATA.length)];
    entry = group.entries[Math.floor(Math.random() * group.entries.length)];
  }

  /* Find the emotion for this entry */
  var entryEmotion = 'Anxiety';
  for (var g = 0; g < AYAH_DATA.length; g++) {
    if (AYAH_DATA[g].entries.some(function(e) { return e.ayah === entry.ayah; })) {
      entryEmotion = AYAH_DATA[g].emotion;
      break;
    }
  }

  /* Load and start video */
  cinematicVideo.src = VIDEO_SOURCES[selectedEnv] || VIDEO_SOURCES.rain;
  cinematicVideo.load();
  cinematicVideo.play().catch(function() {});

  /* Start ambient audio */
  startAmbientAudio(selectedSound);
  isMuted = false;
  cinematicMuteBtn.textContent = '🔊';

  /* Show/hide recitation button */
  cinReciteBtn.style.display = wantRecitation ? 'flex' : 'none';
  setReciteUI('idle');

  /* Prime audio on user gesture for mobile */
  if (wantRecitation) primeRecitationAudio();

  /* Build cinematic content */
  cinematicContent.innerHTML =
    '<div class="cinematic-ayah" id="cinAyah">' +
      '<div class="arabic">' + entry.ayah + '</div>' +
      '<p class="translation" id="cinTranslation">"' + entry.translation + '"</p>' +
      '<div class="verse-ref" id="cinRef">' + entry.reference + '</div>' +
    '</div>' +
    '<div class="cinematic-wisdom" id="cinWisdom">' +
      '<div class="cinematic-wisdom-label">Remember this</div>' +
      '<div class="cinematic-wisdom-text">' + (WISDOM_LINES[entryEmotion] || WISDOM_LINES['Anxiety']) + '</div>' +
    '</div>' +
    '<div class="cinematic-farewell" id="cinFarewell">' +
      '<div class="cinematic-farewell-text">Take this with you.</div>' +
    '</div>';

  /* Show overlay */
  cinematicOverlay.classList.remove('fade-exit');
  cinematicOverlay.classList.add('active');
  cinematicProgress.style.width = '0%';
  cinematicProgress.style.transition = 'none';

  /* Duration and progress */
  var totalSec = selectedDuration || 0;
  var elapsed = 0;
  var farewellShown = false;

  if (totalSec > 0) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        cinematicProgress.style.transition = 'width ' + totalSec + 's linear';
        cinematicProgress.style.width = '100%';
      });
    });
  }

  cinematicInterval = setInterval(function() {
    elapsed++;
    if (totalSec > 0 && elapsed >= totalSec) {
      clearInterval(cinematicInterval);
      cinematicInterval = null;
      showFarewell();
      var exitTimer = setTimeout(function() { endCinematicMode(); }, 3000);
      cinematicTimers.push(exitTimer);
    }
  }, 1000);

  /* Staged reveal timeline */
  function scheduleStep(fn, ms) {
    var t = setTimeout(fn, ms);
    cinematicTimers.push(t);
  }

  /* Step 1: 1.5s — fade in ayah */
  scheduleStep(function() {
    var el = document.getElementById('cinAyah');
    if (el) el.classList.add('visible');
  }, 1500);

  /* Step 2: 3.5s — translation */
  scheduleStep(function() {
    var el = document.getElementById('cinTranslation');
    if (el) el.classList.add('visible');
  }, 3500);

  /* Step 3: 5s — verse reference */
  scheduleStep(function() {
    var el = document.getElementById('cinRef');
    if (el) el.classList.add('visible');
  }, 5000);

  /* Step 4: 6.5s — auto-start recitation if enabled (no manual tap needed) */
  if (wantRecitation) {
    scheduleStep(function() {
      startRecitation(entry.reference);
    }, 6500);
  }

  /* Step 5: ~60% through — show wisdom */
  var wisdomTime = totalSec > 0
    ? Math.max(8000, totalSec * 600)
    : 15000;
  scheduleStep(function() {
    var el = document.getElementById('cinWisdom');
    if (el) el.classList.add('visible');
  }, wisdomTime);

  function showFarewell() {
    if (farewellShown) return;
    farewellShown = true;
    var el = document.getElementById('cinFarewell');
    if (el) el.classList.add('visible');
  }

  /* Recitation button toggle (manual control if user taps) */
  cinReciteBtn.onclick = function() { toggleRecitation(entry.reference); };

  /* Save to history */
  saveToHistory({
    date: new Date().toISOString(),
    emotion: entryEmotion,
    reference: entry.reference,
    translation: entry.translation,
    learnedText: '',
    actionText: '(Cinematic Ayah)'
  });
}


/** Clean up and close the cinematic overlay */
function endCinematicMode() {
  if (cinematicInterval) { clearInterval(cinematicInterval); cinematicInterval = null; }
  cinematicTimers.forEach(function(t) { clearTimeout(t); });
  cinematicTimers = [];

  stopAmbientAudio();
  stopRecitation();

  cinematicOverlay.classList.add('fade-exit');

  setTimeout(function() {
    cinematicOverlay.classList.remove('active', 'fade-exit');
    cinematicContent.innerHTML = '';
    cinematicProgress.style.width = '0%';
    cinematicProgress.style.transition = 'none';
    cinematicVideo.pause();
    cinematicVideo.removeAttribute('src');
    cinematicVideo.load();
  }, 1600);
}

/* X close button */
cinematicCloseBtn.addEventListener('click', endCinematicMode);

/* Start from Focus screen button */
document.getElementById('startFocusBtn').addEventListener('click', function() {
  startFocusMode(null);
});
