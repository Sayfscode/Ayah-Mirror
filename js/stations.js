/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Qur'an Stations
   Spotify-like continuous Qur'an recitation with reciter selection,
   surah/ayah picker, and streaming from AlQuran Cloud CDN.
   ═══════════════════════════════════════════════════════════════════ */

/* RECITERS, TOTAL_AYAHS, SURAH_NAMES — defined in data.js */
/* surahAyahToAbsolute — defined in audio.js */

/* Station state */
let stationReciter  = 'ar.alafasy';
let stationSurahNum = 1;       // selected surah (1–114)
let stationStartAyah = 1;     // starting ayah within surah
let stationAyah     = 1;       // absolute ayah number (1–6236)
let stationPlaying  = false;
let stationAudio    = null;
let stationLoading  = false;
let stationCache    = {};      // cache ayah text: { [num]: { arabic, translation, surah, ayahInSurah } }

/* DOM refs */
const stationPlayBtn       = document.getElementById('stationPlayBtn');
const stationPrevBtn       = document.getElementById('stationPrev');
const stationNextBtn       = document.getElementById('stationNext');
const stationIdleEl        = document.getElementById('stationIdle');
const stationPlayingEl     = document.getElementById('stationPlaying');
const stationArabicEl      = document.getElementById('stationArabic');
const stationTranslationEl = document.getElementById('stationTranslation');
const stationSurahEl       = document.getElementById('stationSurah');
const stationRefEl         = document.getElementById('stationRef');
const stationStatusEl      = document.getElementById('stationStatus');
const stationProgressFill  = document.getElementById('stationProgressFill');
const stationProgressLabel = document.getElementById('stationProgressLabel');
const stationStopRow       = document.getElementById('stationStopRow');
const stationSurahSelect  = document.getElementById('stationSurahSelect');
const stationAyahInput    = document.getElementById('stationAyahInput');
const stationAyahHint     = document.getElementById('stationAyahHint');

/* ── Populate surah dropdown ──────────────────────────────────────── */
(function populateSurahDropdown() {
  let html = '';
  for (let i = 1; i <= 114; i++) {
    html += `<option value="${i}">${i}. ${SURAH_NAMES[i]} (${SURAH_VERSES[i]} ayat)</option>`;
  }
  stationSurahSelect.innerHTML = html;
})();

/* ── Surah selection — update ayah range ──────────────────────────── */
stationSurahSelect.addEventListener('change', () => {
  stationSurahNum = parseInt(stationSurahSelect.value, 10);
  const maxAyah = SURAH_VERSES[stationSurahNum];
  stationAyahInput.max = maxAyah;
  stationAyahInput.value = 1;
  stationStartAyah = 1;
  stationAyahHint.textContent = `of ${maxAyah}`;

  /* If playing, jump to new surah */
  if (stationPlaying) {
    stationAyah = surahAyahToAbsolute(stationSurahNum, 1);
    stationPlayAyah(stationAyah);
  }
});

/* ── Ayah input — clamp and update starting ayah ──────────────────── */
stationAyahInput.addEventListener('change', () => {
  const maxAyah = SURAH_VERSES[stationSurahNum];
  let val = parseInt(stationAyahInput.value, 10) || 1;
  val = Math.max(1, Math.min(val, maxAyah));
  stationAyahInput.value = val;
  stationStartAyah = val;

  /* If playing, jump to this ayah */
  if (stationPlaying) {
    stationAyah = surahAyahToAbsolute(stationSurahNum, val);
    stationPlayAyah(stationAyah);
  }
});

/* ── Reciter selection ──────────────────────────────────────────── */
document.getElementById('reciterGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.reciter-card');
  if (!card) return;
  document.querySelectorAll('.reciter-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  stationReciter = card.dataset.reciter;

  /* If already playing, restart with new reciter on same ayah */
  if (stationPlaying) {
    stationPlayAyah(stationAyah);
  }
});

/* ── Build audio URL for a given ayah and reciter ───────────────── */
function stationAudioUrl(ayahNum, reciterId) {
  const bitrate = RECITERS[reciterId]?.bitrate || 128;
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciterId}/${ayahNum}.mp3`;
}

/* ── Fetch ayah text + translation from API ─────────────────────── */
async function fetchAyahData(ayahNum) {
  if (stationCache[ayahNum]) return stationCache[ayahNum];

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    const arabic = json.data[0];
    const english = json.data[1];

    const data = {
      arabic: arabic.text,
      translation: english.text,
      surah: arabic.surah.englishName,
      surahArabic: arabic.surah.name,
      surahNumber: arabic.surah.number,
      ayahInSurah: arabic.numberInSurah,
      totalInSurah: arabic.surah.numberOfAyahs
    };
    stationCache[ayahNum] = data;
    return data;
  } catch (err) {
    return null;
  }
}

/* ── Update the display with ayah data ──────────────────────────── */
function stationUpdateDisplay(data) {
  if (!data) return;
  stationArabicEl.textContent = data.arabic;
  stationTranslationEl.textContent = `"${data.translation}"`;
  stationSurahEl.textContent = `${data.surah} (${data.surahArabic})`;
  stationRefEl.textContent = `${data.surahNumber}:${data.ayahInSurah}`;

  /* Progress within surah */
  const pct = (data.ayahInSurah / data.totalInSurah * 100).toFixed(1);
  stationProgressFill.style.width = pct + '%';
  stationProgressLabel.textContent = `${data.ayahInSurah} / ${data.totalInSurah}`;

  /* Sync surah/ayah selectors to follow playback */
  if (data.surahNumber !== stationSurahNum) {
    stationSurahNum = data.surahNumber;
    stationSurahSelect.value = data.surahNumber;
    stationAyahInput.max = data.totalInSurah;
    stationAyahHint.textContent = `of ${data.totalInSurah}`;
  }
  stationAyahInput.value = data.ayahInSurah;
  stationStartAyah = data.ayahInSurah;
}

/* ── Set status text ────────────────────────────────────────────── */
function stationSetStatus(text, loading) {
  stationLoading = !!loading;
  stationStatusEl.innerHTML = loading
    ? `<span class="loading-dots">${text}</span>`
    : text;
}

/* ── Play a specific ayah ───────────────────────────────────────── */
async function stationPlayAyah(ayahNum) {
  if (ayahNum < 1) ayahNum = TOTAL_AYAHS; // wrap to end
  if (ayahNum > TOTAL_AYAHS) ayahNum = 1;  // wrap to start
  stationAyah = ayahNum;

  console.log('[Station] Loading ayah', ayahNum, 'with reciter', stationReciter);
  stationSetStatus('Loading', true);
  stationPrevBtn.disabled = false;
  stationNextBtn.disabled = false;

  /* Stop any current playback */
  if (stationAudio) {
    stationAudio.pause();
    stationAudio.removeAttribute('src');
    stationAudio.load();
  }

  /* Fetch text + translation */
  const data = await fetchAyahData(ayahNum);
  if (data) {
    stationUpdateDisplay(data);
    console.log('[Station] Display:', data.surahNumber + ':' + data.ayahInSurah, '— Audio ayah:', ayahNum);
  }

  /* Pre-fetch next ayah text (not audio — just metadata) */
  const nextNum = ayahNum < TOTAL_AYAHS ? ayahNum + 1 : 1;
  fetchAyahData(nextNum);

  /* Create audio and play — same ayahNum used for BOTH text and audio */
  const url = stationAudioUrl(ayahNum, stationReciter);

  if (!stationAudio) {
    stationAudio = new Audio();
    stationAudio.setAttribute('playsinline', '');
  }
  stationAudio.src = url;
  stationAudio.volume = 0;
  stationAudio.load();

  const onCanPlay = () => {
    stationAudio.removeEventListener('canplaythrough', onCanPlay);
    stationAudio.removeEventListener('error', onError);
    stationAudio.play().then(() => {
      stationSetStatus(RECITERS[stationReciter]?.name || 'Playing', false);
      fadeAudioTo(stationAudio, 0.8, 500);
    }).catch(() => {
      stationSetStatus('Tap play to start', false);
      stationPlaying = false;
      stationPlayBtn.textContent = '▶';
    });
  };

  const onError = () => {
    stationAudio.removeEventListener('canplaythrough', onCanPlay);
    stationAudio.removeEventListener('error', onError);
    stationSetStatus('Error loading — skipping', false);
    /* Skip to next after a brief pause */
    setTimeout(() => {
      if (stationPlaying) stationPlayAyah(ayahNum + 1);
    }, 1500);
  };

  stationAudio.addEventListener('canplaythrough', onCanPlay);
  stationAudio.addEventListener('error', onError);

  /* Auto-advance when this ayah finishes */
  stationAudio.onended = () => {
    if (stationPlaying) stationPlayAyah(ayahNum + 1);
  };
}

/* ── Stop the station and clean up ──────────────────────────────── */
function stationStop() {
  stationPlaying = false;
  stationPlayBtn.textContent = '▶';
  stationPrevBtn.disabled = true;
  stationNextBtn.disabled = true;
  stationSetStatus('', false);

  if (stationAudio) {
    fadeAudioTo(stationAudio, 0, 600, () => {
      if (stationAudio) {
        stationAudio.pause();
        stationAudio.removeAttribute('src');
        stationAudio.load();
      }
    });
  }

  /* Show idle, hide playing */
  stationIdleEl.style.display = '';
  stationPlayingEl.style.display = 'none';
  stationStopRow.style.display = 'none';
}

/* ── Play / Pause button ────────────────────────────────────────── */
stationPlayBtn.addEventListener('click', () => {
  if (stationLoading) return;

  if (stationPlaying && stationAudio && !stationAudio.paused) {
    /* Pause */
    stationAudio.pause();
    stationPlayBtn.textContent = '▶';
    stationSetStatus('Paused', false);
  } else if (stationPlaying && stationAudio && stationAudio.paused) {
    /* Resume */
    stationAudio.play().then(() => {
      stationPlayBtn.textContent = '⏸';
      stationSetStatus(RECITERS[stationReciter]?.name || 'Playing', false);
    }).catch(() => {});
  } else {
    /* Start fresh — use the surah/ayah selection */
    stationPlaying = true;
    stationPlayBtn.textContent = '⏸';

    /* Calculate absolute ayah from surah + ayah selection */
    stationAyah = surahAyahToAbsolute(stationSurahNum, stationStartAyah);

    /* Stop any cinematic ambient audio */
    if (typeof stopAmbientAudio === 'function') stopAmbientAudio();
    if (typeof stopRecitation === 'function') stopRecitation();

    /* Show playing UI */
    stationIdleEl.style.display = 'none';
    stationPlayingEl.style.display = '';
    stationStopRow.style.display = '';

    /* Prime audio on user gesture for mobile */
    stationAudio = new Audio();
    stationAudio.setAttribute('playsinline', '');
    stationAudio.volume = 0;
    stationAudio.play().catch(() => {});

    stationPlayAyah(stationAyah);
  }
});

/* ── Prev / Next buttons ────────────────────────────────────────── */
stationPrevBtn.addEventListener('click', () => {
  if (stationLoading) return;
  stationPlayAyah(stationAyah - 1);
});

stationNextBtn.addEventListener('click', () => {
  if (stationLoading) return;
  stationPlayAyah(stationAyah + 1);
});

/* ── Stop button ────────────────────────────────────────────────── */
document.getElementById('stationStopBtn').addEventListener('click', stationStop);

/* ── Stop station when navigating away ──────────────────────────── */
const _origNavigateTo = navigateTo;
navigateTo = function(screenName) {
  if (screenName !== 'stations' && stationPlaying) {
    stationStop();
  }
  _origNavigateTo(screenName);
};
