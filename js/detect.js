/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Qur'an Detection Mode
   Speech recognition + fuzzy matching to identify recited ayahs.
   Uses Web Speech API (Arabic) and AlQuran Cloud for text data.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Check browser support ──────────────────────────────────────── */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  document.getElementById('detectSection').innerHTML = `
    <div class="detect-unsupported">
      <p>Speech recognition is not supported in this browser.</p>
      <p style="margin-top:6px;font-size:11px;">Please use Chrome, Edge, or Samsung Internet.</p>
    </div>`;
}

/* ── DOM refs ───────────────────────────────────────────────────── */
const detectStage        = document.getElementById('detectStage');
const detectMicBtn       = document.getElementById('detectMicBtn');
const detectBtnIcon      = document.getElementById('detectBtnIcon');
const detectStatusEl     = document.getElementById('detectStatus');
const detectTranscriptEl = document.getElementById('detectTranscript');
const detectTranscriptTx = document.getElementById('detectTranscriptText');
const detectResultEl     = document.getElementById('detectResult');
const detectResultSurah  = document.getElementById('detectResultSurah');
const detectResultArabic = document.getElementById('detectResultArabic');
const detectResultTrans  = document.getElementById('detectResultTranslation');
const detectResultRefTx  = document.getElementById('detectResultRefText');
const detectResultConf   = document.getElementById('detectResultConfidence');

/* ── State ──────────────────────────────────────────────────────── */
let detectState    = 'idle'; // idle | listening | processing
let detectRange    = 'juz30';
let detectMatch    = null;   // stored result from last detection
let detectAudio    = null;   // dedicated Audio element for detect playback
let quranIndex     = {};     // { surahNum: [{ ayah, text, normalized }] }
let quranIndexReady = false;
let quranIndexLoading = false;

/* ── Surah ranges for each search scope (defined in data.js) ───── */
// DETECT_RANGES is loaded from js/data.js

/* ── Arabic text normalization ──────────────────────────────────── */
function normalizeArabic(text) {
  return text
    /* Remove tashkeel (diacritics) */
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    /* Normalize alef variants → bare alef */
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    /* Normalize taa marbuta → haa */
    .replace(/\u0629/g, '\u0647')
    /* Remove tatweel */
    .replace(/\u0640/g, '')
    /* Collapse whitespace */
    .replace(/\s+/g, ' ')
    .trim();
}

/* ── Fetch Qur'an index for a surah range ───────────────────────── */
async function loadQuranIndex(fromSurah, toSurah) {
  const needed = [];
  for (let s = fromSurah; s <= toSurah; s++) {
    if (!quranIndex[s]) needed.push(s);
  }
  if (needed.length === 0) return;

  /* Fetch surahs in parallel batches of 10 */
  for (let i = 0; i < needed.length; i += 10) {
    const batch = needed.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(s =>
        fetch(`https://api.alquran.cloud/v1/surah/${s}/editions/quran-uthmani,en.sahih`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    );

    results.forEach((json, idx) => {
      if (!json || json.code !== 200) return;
      const arabicData  = json.data[0];
      const englishData = json.data[1];
      const surahNum    = batch[idx];

      quranIndex[surahNum] = arabicData.ayahs.map((a, ai) => ({
        ayahNum:     a.numberInSurah,
        absAyah:     a.number,
        text:        a.text,
        normalized:  normalizeArabic(a.text),
        translation: englishData.ayahs[ai]?.text || '',
        surahName:   arabicData.englishName,
        surahArabic: arabicData.name,
        surahNumber: surahNum
      }));
    });
  }
}

/* ── Word-level similarity scoring (improved) ─────────────────── */

/** Build bigrams (word pairs) from a word array */
function getBigrams(words) {
  const bg = [];
  for (let i = 0; i < words.length - 1; i++) {
    bg.push(words[i] + ' ' + words[i + 1]);
  }
  return bg;
}

/** Longest common subsequence length for word arrays (order-aware) */
function lcsLength(a, b) {
  const m = a.length, n = b.length;
  if (m === 0 || n === 0) return 0;
  /* Space-optimized: only two rows */
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
    curr.fill(0);
  }
  return prev[n];
}

function wordSimilarity(transcriptNorm, ayahNorm) {
  const tWords = transcriptNorm.split(' ').filter(w => w.length > 1);
  const aWords = ayahNorm.split(' ').filter(w => w.length > 1);

  if (tWords.length === 0 || aWords.length === 0) return 0;

  /* 1. Word overlap (handles duplicates via multiset) */
  const aWordBag = {};
  aWords.forEach(w => { aWordBag[w] = (aWordBag[w] || 0) + 1; });
  const tWordBag = {};
  tWords.forEach(w => { tWordBag[w] = (tWordBag[w] || 0) + 1; });

  let matchCount = 0;
  for (const w of Object.keys(tWordBag)) {
    if (aWordBag[w]) matchCount += Math.min(tWordBag[w], aWordBag[w]);
  }

  /* Coverage: what fraction of the transcript words appear in the ayah */
  const coverage = matchCount / tWords.length;
  /* Precision: penalize if ayah is much longer than transcript */
  const precision = matchCount / Math.max(tWords.length, aWords.length);

  /* 2. Bigram overlap (consecutive word pairs) */
  const tBigrams = getBigrams(tWords);
  const aBigrams = getBigrams(aWords);
  let bigramMatches = 0;
  const usedBigrams = {};
  for (const tb of tBigrams) {
    const idx = aBigrams.findIndex((b, i) => b === tb && !usedBigrams[i]);
    if (idx !== -1) {
      bigramMatches++;
      usedBigrams[idx] = true;
    }
  }
  const bigramScore = tBigrams.length > 0 ? bigramMatches / tBigrams.length : 0;

  /* 3. Longest common subsequence (order preservation) */
  const lcs = lcsLength(tWords, aWords);
  const lcsScore = lcs / Math.max(tWords.length, aWords.length);

  /* 4. Substring containment bonus */
  let substringBonus = 0;
  if (ayahNorm.includes(transcriptNorm)) substringBonus = 0.25;
  else if (transcriptNorm.includes(ayahNorm)) substringBonus = 0.2;

  /* Weighted combination */
  const score = (coverage * 0.3) + (precision * 0.15) + (bigramScore * 0.3) + (lcsScore * 0.25) + substringBonus;

  return Math.min(1, score);
}

/* ── Find best matching ayah ────────────────────────────────────── */
function findBestMatch(transcript) {
  const transcriptNorm = normalizeArabic(transcript);
  const range = DETECT_RANGES[detectRange];
  let bestScore = 0;
  let bestMatch = null;

  for (let s = range.from; s <= range.to; s++) {
    const ayahs = quranIndex[s];
    if (!ayahs) continue;

    for (const ayah of ayahs) {
      const score = wordSimilarity(transcriptNorm, ayah.normalized);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = ayah;
      }
    }
  }

  return { match: bestMatch, confidence: bestScore };
}

/* ── UI state management ────────────────────────────────────────── */
function setDetectState(state, statusText, statusClass) {
  detectState = state;

  /* Drive all animations from the stage class */
  if (detectStage) {
    detectStage.classList.remove('listening', 'processing');
    if (state === 'listening')  detectStage.classList.add('listening');
    if (state === 'processing') detectStage.classList.add('processing');
  }

  /* Update label text */
  if (detectStatusEl) {
    const mainLabel = detectStatusEl.querySelector('.detect-label-main');
    const subLabel  = detectStatusEl.querySelector('.detect-label-sub');

    if (state === 'idle' && !statusText) {
      if (mainLabel) mainLabel.textContent = 'Detect Recitation';
      if (subLabel) { subLabel.textContent = 'Tap to begin'; subLabel.style.display = ''; }
    } else if (state === 'listening') {
      if (mainLabel) mainLabel.textContent = 'Listening...';
      if (subLabel) { subLabel.textContent = 'Hold your phone closer'; subLabel.style.display = ''; }
    } else if (state === 'processing') {
      if (mainLabel) mainLabel.textContent = 'Analyzing...';
      if (subLabel) { subLabel.textContent = ''; subLabel.style.display = 'none'; }
    } else if (statusText) {
      if (mainLabel) mainLabel.textContent = statusText;
      if (subLabel) { subLabel.textContent = ''; subLabel.style.display = 'none'; }
    }

    detectStatusEl.className = 'detect-label' + (statusClass ? ' ' + statusClass : '');
  }
}

function showDetectResult(result) {
  if (!result.match) {
    setDetectState('idle', 'Could not identify recitation. Try again.', 'error');
    return;
  }

  /* Store the match so "Play This Ayah" uses exact same data */
  detectMatch = result.match;
  const m = result.match;
  const confPct = Math.round(result.confidence * 100);

  detectResultSurah.textContent = `${m.surahName} (${m.surahArabic})`;
  detectResultArabic.textContent = m.text;
  detectResultTrans.textContent = `"${m.translation}"`;
  detectResultRefTx.textContent = `${m.surahNumber}:${m.ayahNum}`;

  /* Confidence tier labels */
  let confLabel, confClass;
  if (result.confidence >= 0.5) {
    confLabel = 'High confidence · ' + confPct + '%';
    confClass = '';
  } else if (result.confidence >= 0.25) {
    confLabel = 'Possible match · ' + confPct + '%';
    confClass = 'possible';
  } else {
    confLabel = 'Low confidence · ' + confPct + '%';
    confClass = 'low';
  }
  detectResultConf.textContent = confLabel;
  detectResultConf.className = 'detect-result-badge' + (confClass ? ' conf-' + confClass : '');

  detectResultEl.style.display = 'block';

  console.log('[Detect] Stored match:', m.surahNumber + ':' + m.ayahNum, 'absAyah:', m.absAyah);

  if (result.confidence >= 0.25) {
    setDetectState('idle', 'Match found!', 'success');
  } else {
    setDetectState('idle', 'Possible match — try again in a quieter environment', 'success');
  }
}

/* ── Speech Recognition ─────────────────────────────────────────── */
function startDetection() {
  if (!SpeechRecognition) return;
  if (detectState !== 'idle') return;

  /* Hide previous results */
  detectResultEl.style.display = 'none';
  detectTranscriptEl.style.display = 'none';

  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = true;      // keep listening for full recitation
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;    // get alternative transcriptions

  let finalTranscript = '';
  let interimTranscript = '';

  recognition.onstart = () => {
    setDetectState('listening');
  };

  recognition.onresult = (event) => {
    interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    /* Show live transcript */
    const liveText = (finalTranscript + interimTranscript).trim();
    if (liveText) {
      detectTranscriptEl.style.display = 'block';
      detectTranscriptTx.textContent = liveText;
    }
  };

  recognition.onend = async () => {
    const transcript = finalTranscript.trim() || interimTranscript.trim();

    if (!transcript) {
      setDetectState('idle', 'No speech detected. Tap to try again.', 'error');
      return;
    }

    /* Show what we heard */
    detectTranscriptEl.style.display = 'block';
    detectTranscriptTx.textContent = transcript;

    /* Processing phase */
    setDetectState('processing');

    /* Load Qur'an index if needed */
    const range = DETECT_RANGES[detectRange];
    await loadQuranIndex(range.from, range.to);

    /* Find best match */
    const result = findBestMatch(transcript);
    console.log('[Detect] Transcript:', transcript);
    console.log('[Detect] Best match:', result.match?.surahNumber + ':' + result.match?.ayahNum, 'confidence:', result.confidence);

    /* Show result — show even low confidence (UI labels indicate certainty) */
    if (result.confidence >= 0.12) {
      showDetectResult(result);
    } else {
      setDetectState('idle', 'Could not identify recitation. Try again in a quieter environment.', 'error');
    }

  };

  recognition.onerror = (event) => {
    console.warn('[Detect] Speech error:', event.error);
    if (event.error === 'not-allowed') {
      setDetectState('idle', 'Microphone access denied', 'error');
    } else if (event.error === 'no-speech') {
      setDetectState('idle', 'No speech detected. Tap to try again.', 'error');
    } else {
      setDetectState('idle', 'Error — try again', 'error');
    }
  };

  /* Auto-stop after 10 seconds */
  setTimeout(() => {
    try { recognition.stop(); } catch (e) {}
  }, 10000);

  recognition.start();
}

/* ── Wire up mic button ─────────────────────────────────────────── */
if (detectMicBtn && SpeechRecognition) {
  detectMicBtn.addEventListener('click', startDetection);
}

/* ── Range pill selection ───────────────────────────────────────── */
const detectRangeEl = document.getElementById('detectRange');
if (detectRangeEl) {
  detectRangeEl.addEventListener('click', (e) => {
    const pill = e.target.closest('.detect-range-pill');
    if (!pill) return;
    detectRangeEl.querySelectorAll('.detect-range-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    detectRange = pill.dataset.range;
  });
}

/* ── Play button icon helpers ──────────────────────────────────── */
const _playIcon  = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>';
const _pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';

function setPlayBtnLabel(label, icon) {
  if (!detectPlayBtn) return;
  detectPlayBtn.innerHTML = (icon || _playIcon) + ' ' + label;
}

/* ── "Play This Ayah" button — plays DIRECTLY using stored match ──── */
const detectPlayBtn = document.getElementById('detectPlayResult');
if (detectPlayBtn) {
  detectPlayBtn.addEventListener('click', () => {
    if (!detectMatch) return;

    /* If currently playing — pause it */
    if (detectAudio && !detectAudio.paused) {
      detectAudio.pause();
      setPlayBtnLabel('Resume', _playIcon);
      return;
    }

    /* If paused — resume it */
    if (detectAudio && detectAudio.paused && detectAudio.src && detectAudio.currentTime > 0) {
      detectAudio.play().then(() => {
        setPlayBtnLabel('Playing', _pauseIcon);
      }).catch(() => {});
      return;
    }

    const m = detectMatch;
    console.log('[Detect Play] Playing surah', m.surahNumber, 'ayah', m.ayahNum, 'absAyah', m.absAyah);

    /* Stop any currently playing audio */
    if (detectAudio) {
      detectAudio.pause();
      detectAudio.removeAttribute('src');
      detectAudio.load();
    }
    if (stationPlaying) stationStop();
    if (typeof stopRecitation === 'function') stopRecitation();
    if (typeof stopAmbientAudio === 'function') stopAmbientAudio();

    /* Build URL using the EXACT absAyah from the stored match */
    const bitrate = RECITERS[stationReciter]?.bitrate || 128;
    const url = `https://cdn.islamic.network/quran/audio/${bitrate}/${stationReciter}/${m.absAyah}.mp3`;
    console.log('[Detect Play] Audio URL:', url);

    /* Create audio and play (user gesture context — inside click handler) */
    detectAudio = new Audio();
    detectAudio.setAttribute('playsinline', '');
    detectAudio.src = url;
    detectAudio.volume = 0;
    detectAudio.load();

    /* Update button to show loading state */
    setPlayBtnLabel('Loading...');
    detectPlayBtn.disabled = true;

    const onCanPlay = () => {
      detectAudio.removeEventListener('canplaythrough', onCanPlay);
      detectAudio.removeEventListener('error', onError);
      detectAudio.play().then(() => {
        setPlayBtnLabel('Playing', _pauseIcon);
        detectPlayBtn.disabled = false;
        fadeAudioTo(detectAudio, 0.8, 500);
      }).catch(() => {
        setPlayBtnLabel('Play Ayah');
        detectPlayBtn.disabled = false;
      });
    };

    const onError = () => {
      detectAudio.removeEventListener('canplaythrough', onCanPlay);
      detectAudio.removeEventListener('error', onError);
      setPlayBtnLabel('Play Ayah');
      detectPlayBtn.disabled = false;
    };

    detectAudio.addEventListener('canplaythrough', onCanPlay);
    detectAudio.addEventListener('error', onError);

    /* When finished — do NOT auto-continue, just reset button */
    detectAudio.onended = () => {
      setPlayBtnLabel('Play Ayah');
      detectPlayBtn.disabled = false;
      detectAudio = null;
    };
  });
}

/* ── "Try Again" button ─────────────────────────────────────────── */
const detectTryAgainBtn = document.getElementById('detectTryAgain');
if (detectTryAgainBtn) {
  detectTryAgainBtn.addEventListener('click', () => {
    /* Stop any playing detect audio */
    if (detectAudio) {
      detectAudio.pause();
      detectAudio.removeAttribute('src');
      detectAudio.load();
      detectAudio = null;
    }
    detectMatch = null;
    setPlayBtnLabel('Play Ayah');
    detectPlayBtn.disabled = false;
    detectResultEl.style.display = 'none';
    detectTranscriptEl.style.display = 'none';
    setDetectState('idle');
    startDetection();
  });
}

/* ── Preload Juz 30 index in background when visiting stations ──── */
const _origNavigateToV2 = navigateTo;
navigateTo = function(screenName) {
  _origNavigateToV2(screenName);
  if (screenName === 'stations' && !quranIndex[78]) {
    loadQuranIndex(78, 114);
  }
};
