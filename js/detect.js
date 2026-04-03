/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Qur'an Detection Mode
   Speech recognition + fuzzy matching to identify recited ayahs.
   Uses Web Speech API (Arabic) and AlQuran Cloud for text data.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Check browser support ─────────────────────────────────────── */
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  document.getElementById('detectSection').innerHTML =
    '<div class="detect-unsupported">' +
      '<p>Speech recognition is not supported in this browser.</p>' +
      '<p style="margin-top:6px;font-size:11px;">Please use Chrome, Edge, or Samsung Internet.</p>' +
    '</div>';
}

/* ── DOM refs ──────────────────────────────────────────────────── */
var detectStage        = document.getElementById('detectStage');
var detectMicBtn       = document.getElementById('detectMicBtn');
var detectBtnIcon      = document.getElementById('detectBtnIcon');
var detectStatusEl     = document.getElementById('detectStatus');
var detectTranscriptEl = document.getElementById('detectTranscript');
var detectTranscriptTx = document.getElementById('detectTranscriptText');
var detectResultEl     = document.getElementById('detectResult');
var detectResultSurah  = document.getElementById('detectResultSurah');
var detectResultArabic = document.getElementById('detectResultArabic');
var detectResultTrans  = document.getElementById('detectResultTranslation');
var detectResultRefTx  = document.getElementById('detectResultRefText');
var detectResultConf   = document.getElementById('detectResultConfidence');
var detectTimerCircle  = document.getElementById('detectTimerCircle');

/* ── State ─────────────────────────────────────────────────────── */
var detectState    = 'idle';
var detectRange    = 'juz30';
var detectMatch    = null;
var detectAudio    = null;
var quranIndex     = {};
var quranIndexReady = false;
var quranIndexLoading = false;

/* Detection duration in seconds */
var DETECT_DURATION = 8;

/* Timer ring circumference for animation */
var TIMER_CIRCUMFERENCE = 2 * Math.PI * 54; // r=54 from SVG

/* ── Arabic text normalization ─────────────────────────────────── */
function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0629/g, '\u0647')
    .replace(/\u0640/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ── Fetch Qur'an index for surah range ────────────────────────── */
function loadQuranIndex(fromSurah, toSurah) {
  var needed = [];
  for (var s = fromSurah; s <= toSurah; s++) {
    if (!quranIndex[s]) needed.push(s);
  }
  if (needed.length === 0) return Promise.resolve();

  var batches = [];
  for (var i = 0; i < needed.length; i += 10) {
    batches.push(needed.slice(i, i + 10));
  }

  return batches.reduce(function(chain, batch) {
    return chain.then(function() {
      return Promise.all(
        batch.map(function(s) {
          return fetch('https://api.alquran.cloud/v1/surah/' + s + '/editions/quran-uthmani,en.sahih')
            .then(function(r) { return r.ok ? r.json() : null; })
            .catch(function() { return null; });
        })
      ).then(function(results) {
        results.forEach(function(json, idx) {
          if (!json || json.code !== 200) return;
          var arabicData  = json.data[0];
          var englishData = json.data[1];
          var surahNum    = batch[idx];

          quranIndex[surahNum] = arabicData.ayahs.map(function(a, ai) {
            return {
              ayahNum:     a.numberInSurah,
              absAyah:     a.number,
              text:        a.text,
              normalized:  normalizeArabic(a.text),
              translation: englishData.ayahs[ai] ? englishData.ayahs[ai].text : '',
              surahName:   arabicData.englishName,
              surahArabic: arabicData.name,
              surahNumber: surahNum
            };
          });
        });
      });
    });
  }, Promise.resolve());
}

/* ── Word-level similarity scoring ─────────────────────────────── */

function getBigrams(words) {
  var bg = [];
  for (var i = 0; i < words.length - 1; i++) {
    bg.push(words[i] + ' ' + words[i + 1]);
  }
  return bg;
}

function lcsLength(a, b) {
  var m = a.length, n = b.length;
  if (m === 0 || n === 0) return 0;
  var prev = new Array(n + 1).fill(0);
  var curr = new Array(n + 1).fill(0);
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    var tmp = prev;
    prev = curr;
    curr = tmp;
    curr.fill(0);
  }
  return prev[n];
}

function wordSimilarity(transcriptNorm, ayahNorm) {
  var tWords = transcriptNorm.split(' ').filter(function(w) { return w.length > 1; });
  var aWords = ayahNorm.split(' ').filter(function(w) { return w.length > 1; });

  if (tWords.length === 0 || aWords.length === 0) return 0;

  var aWordBag = {};
  aWords.forEach(function(w) { aWordBag[w] = (aWordBag[w] || 0) + 1; });
  var tWordBag = {};
  tWords.forEach(function(w) { tWordBag[w] = (tWordBag[w] || 0) + 1; });

  var matchCount = 0;
  for (var w in tWordBag) {
    if (aWordBag[w]) matchCount += Math.min(tWordBag[w], aWordBag[w]);
  }

  var coverage = matchCount / tWords.length;
  var precision = matchCount / Math.max(tWords.length, aWords.length);

  var tBigrams = getBigrams(tWords);
  var aBigrams = getBigrams(aWords);
  var bigramMatches = 0;
  var usedBigrams = {};
  for (var bi = 0; bi < tBigrams.length; bi++) {
    for (var bj = 0; bj < aBigrams.length; bj++) {
      if (tBigrams[bi] === aBigrams[bj] && !usedBigrams[bj]) {
        bigramMatches++;
        usedBigrams[bj] = true;
        break;
      }
    }
  }
  var bigramScore = tBigrams.length > 0 ? bigramMatches / tBigrams.length : 0;

  var lcs = lcsLength(tWords, aWords);
  var lcsScore = lcs / Math.max(tWords.length, aWords.length);

  var substringBonus = 0;
  if (ayahNorm.includes(transcriptNorm)) substringBonus = 0.25;
  else if (transcriptNorm.includes(ayahNorm)) substringBonus = 0.2;

  var score = (coverage * 0.3) + (precision * 0.15) + (bigramScore * 0.3) + (lcsScore * 0.25) + substringBonus;
  return Math.min(1, score);
}

/* ── Find best matching ayah ───────────────────────────────────── */
function findBestMatch(transcript) {
  var transcriptNorm = normalizeArabic(transcript);
  var range = DETECT_RANGES[detectRange];
  var bestScore = 0;
  var bestMatch = null;

  for (var s = range.from; s <= range.to; s++) {
    var ayahs = quranIndex[s];
    if (!ayahs) continue;

    for (var a = 0; a < ayahs.length; a++) {
      var score = wordSimilarity(transcriptNorm, ayahs[a].normalized);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = ayahs[a];
      }
    }
  }

  return { match: bestMatch, confidence: bestScore };
}

/* ── UI state management ───────────────────────────────────────── */
function setDetectState(state, statusText, statusClass) {
  detectState = state;

  if (detectStage) {
    detectStage.classList.remove('listening', 'processing');
    if (state === 'listening')  detectStage.classList.add('listening');
    if (state === 'processing') detectStage.classList.add('processing');
  }

  if (detectStatusEl) {
    var mainLabel = detectStatusEl.querySelector('.detect-label-main');
    var subLabel  = detectStatusEl.querySelector('.detect-label-sub');

    if (state === 'idle' && !statusText) {
      if (mainLabel) mainLabel.textContent = 'Detect Recitation';
      if (subLabel) { subLabel.textContent = 'Tap to begin listening'; subLabel.style.display = ''; }
    } else if (state === 'listening') {
      if (mainLabel) mainLabel.textContent = 'Listening...';
      if (subLabel) { subLabel.textContent = 'Hold phone close and recite clearly'; subLabel.style.display = ''; }
    } else if (state === 'processing') {
      if (mainLabel) mainLabel.textContent = 'Analyzing...';
      if (subLabel) { subLabel.textContent = 'Finding your ayah'; subLabel.style.display = ''; }
    } else if (statusText) {
      if (mainLabel) mainLabel.textContent = statusText;
      if (subLabel) { subLabel.textContent = ''; subLabel.style.display = 'none'; }
    }

    detectStatusEl.className = 'detect-label' + (statusClass ? ' ' + statusClass : '');
  }
}

/* ── Timer ring animation ──────────────────────────────────────── */
function startTimerRing() {
  if (!detectTimerCircle) return;
  detectTimerCircle.style.strokeDasharray = TIMER_CIRCUMFERENCE;
  detectTimerCircle.style.strokeDashoffset = TIMER_CIRCUMFERENCE;

  var startTime = Date.now();
  var duration = DETECT_DURATION * 1000;

  function animate() {
    if (detectState !== 'listening') return;
    var elapsed = Date.now() - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var offset = TIMER_CIRCUMFERENCE * (1 - progress);
    detectTimerCircle.style.strokeDashoffset = offset;
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function resetTimerRing() {
  if (!detectTimerCircle) return;
  detectTimerCircle.style.strokeDashoffset = TIMER_CIRCUMFERENCE;
}

/* ── Show result ───────────────────────────────────────────────── */
function showDetectResult(result) {
  if (!result.match) {
    setDetectState('idle', 'Could not identify recitation. Try again.', 'error');
    return;
  }

  detectMatch = result.match;
  var m = result.match;
  var confPct = Math.round(result.confidence * 100);

  detectResultSurah.textContent = m.surahName + ' (' + m.surahArabic + ')';
  detectResultArabic.textContent = m.text;
  detectResultTrans.textContent = '"' + m.translation + '"';
  detectResultRefTx.textContent = m.surahNumber + ':' + m.ayahNum;

  var confLabel, confClass;
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

  if (result.confidence >= 0.25) {
    setDetectState('idle', 'Match found!', 'success');
  } else {
    setDetectState('idle', 'Possible match — try in quieter environment', 'success');
  }
}

/* ── Speech Recognition ────────────────────────────────────────── */
function startDetection() {
  if (!SpeechRecognition) return;
  if (detectState !== 'idle') return;

  detectResultEl.style.display = 'none';
  detectTranscriptEl.style.display = 'none';
  resetTimerRing();

  var recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  var finalTranscript = '';
  var interimTranscript = '';

  recognition.onstart = function() {
    setDetectState('listening');
    startTimerRing();
  };

  recognition.onresult = function(event) {
    interimTranscript = '';
    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    var liveText = (finalTranscript + interimTranscript).trim();
    if (liveText) {
      detectTranscriptEl.style.display = 'block';
      detectTranscriptTx.textContent = liveText;
    }
  };

  recognition.onend = function() {
    resetTimerRing();
    var transcript = finalTranscript.trim() || interimTranscript.trim();

    if (!transcript) {
      setDetectState('idle', 'No speech detected. Tap to try again.', 'error');
      return;
    }

    detectTranscriptEl.style.display = 'block';
    detectTranscriptTx.textContent = transcript;

    setDetectState('processing');

    var range = DETECT_RANGES[detectRange];
    loadQuranIndex(range.from, range.to).then(function() {
      var result = findBestMatch(transcript);

      if (result.confidence >= 0.12) {
        showDetectResult(result);
      } else {
        setDetectState('idle', 'Could not identify. Try in quieter environment.', 'error');
      }
    });
  };

  recognition.onerror = function(event) {
    resetTimerRing();
    if (event.error === 'not-allowed') {
      setDetectState('idle', 'Microphone access denied', 'error');
    } else if (event.error === 'no-speech') {
      setDetectState('idle', 'No speech detected. Tap to try again.', 'error');
    } else {
      setDetectState('idle', 'Error — try again', 'error');
    }
  };

  /* Auto-stop after DETECT_DURATION seconds */
  setTimeout(function() {
    try { recognition.stop(); } catch(e) {}
  }, DETECT_DURATION * 1000);

  recognition.start();
}

/* ── Wire up mic button ────────────────────────────────────────── */
if (detectMicBtn && SpeechRecognition) {
  detectMicBtn.addEventListener('click', startDetection);
}

/* ── Range pills ───────────────────────────────────────────────── */
var detectRangeEl = document.getElementById('detectRange');
if (detectRangeEl) {
  detectRangeEl.addEventListener('click', function(e) {
    var pill = e.target.closest('.detect-range-pill');
    if (!pill) return;
    detectRangeEl.querySelectorAll('.detect-range-pill').forEach(function(p) { p.classList.remove('selected'); });
    pill.classList.add('selected');
    detectRange = pill.dataset.range;
  });
}

/* ── Play button helpers ──────────────────────────────────────── */
var _playIcon  = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>';
var _pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';

function setPlayBtnLabel(label, icon) {
  if (!detectPlayBtn) return;
  detectPlayBtn.innerHTML = (icon || _playIcon) + ' ' + label;
}

/* ── "Play This Ayah" — uses EXACT stored match data ──────────── */
var detectPlayBtn = document.getElementById('detectPlayResult');
if (detectPlayBtn) {
  detectPlayBtn.addEventListener('click', function() {
    if (!detectMatch) return;

    if (detectAudio && !detectAudio.paused) {
      detectAudio.pause();
      setPlayBtnLabel('Resume', _playIcon);
      return;
    }

    if (detectAudio && detectAudio.paused && detectAudio.src && detectAudio.currentTime > 0) {
      detectAudio.play().then(function() {
        setPlayBtnLabel('Playing', _pauseIcon);
      }).catch(function() {});
      return;
    }

    var m = detectMatch;

    /* Stop any other audio */
    if (detectAudio) {
      detectAudio.pause();
      detectAudio.removeAttribute('src');
      detectAudio.load();
    }
    if (typeof stationStop === 'function' && stationPlaying) stationStop();
    if (typeof stopRecitation === 'function') stopRecitation();
    if (typeof stopAmbientAudio === 'function') stopAmbientAudio();

    /* Build URL using EXACT absAyah from stored match */
    var bitrate = RECITERS[stationReciter] ? RECITERS[stationReciter].bitrate : 128;
    var url = 'https://cdn.islamic.network/quran/audio/' + bitrate + '/' + stationReciter + '/' + m.absAyah + '.mp3';

    detectAudio = new Audio();
    detectAudio.setAttribute('playsinline', '');
    detectAudio.src = url;
    detectAudio.volume = 0;
    detectAudio.load();

    setPlayBtnLabel('Loading...');
    detectPlayBtn.disabled = true;

    var onCanPlay = function() {
      detectAudio.removeEventListener('canplaythrough', onCanPlay);
      detectAudio.removeEventListener('error', onError);
      detectAudio.play().then(function() {
        setPlayBtnLabel('Playing', _pauseIcon);
        detectPlayBtn.disabled = false;
        fadeAudioTo(detectAudio, 0.8, 500);
      }).catch(function() {
        setPlayBtnLabel('Play Ayah');
        detectPlayBtn.disabled = false;
      });
    };

    var onError = function() {
      detectAudio.removeEventListener('canplaythrough', onCanPlay);
      detectAudio.removeEventListener('error', onError);
      setPlayBtnLabel('Play Ayah');
      detectPlayBtn.disabled = false;
    };

    detectAudio.addEventListener('canplaythrough', onCanPlay);
    detectAudio.addEventListener('error', onError);

    detectAudio.onended = function() {
      setPlayBtnLabel('Play Ayah');
      detectPlayBtn.disabled = false;
      detectAudio = null;
    };
  });
}

/* ── "Try Again" ───────────────────────────────────────────────── */
var detectTryAgainBtn = document.getElementById('detectTryAgain');
if (detectTryAgainBtn) {
  detectTryAgainBtn.addEventListener('click', function() {
    if (detectAudio) {
      detectAudio.pause();
      detectAudio.removeAttribute('src');
      detectAudio.load();
      detectAudio = null;
    }
    detectMatch = null;
    setPlayBtnLabel('Play Ayah');
    if (detectPlayBtn) detectPlayBtn.disabled = false;
    detectResultEl.style.display = 'none';
    detectTranscriptEl.style.display = 'none';
    setDetectState('idle');
    startDetection();
  });
}

/* ── Preload Juz 30 when visiting stations ─────────────────────── */
var _origNavigateToV2 = navigateTo;
navigateTo = function(screenName) {
  _origNavigateToV2(screenName);
  if (screenName === 'stations' && !quranIndex[78]) {
    loadQuranIndex(78, 114);
  }
};
