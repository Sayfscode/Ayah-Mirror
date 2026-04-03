/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Qur'an Stations
   Continuous Qur'an recitation with reciter selection,
   surah/ayah picker, mini-player, and streaming from AlQuran Cloud CDN.
   ═══════════════════════════════════════════════════════════════════ */

/* Station state */
var stationReciter    = 'ar.alafasy';
var stationSurahNum   = 1;
var stationStartAyah  = 1;
var stationAyah       = 1;
var stationPlaying    = false;
var stationAudio      = null;
var stationLoading    = false;
var stationCache      = {};
var STATION_SAVE_KEY  = 'ayah_mirror_station';

/* DOM refs */
var stationPlayBtn       = document.getElementById('stationPlayBtn');
var stationPrevBtn       = document.getElementById('stationPrev');
var stationNextBtn       = document.getElementById('stationNext');
var stationIdleEl        = document.getElementById('stationIdle');
var stationPlayingEl     = document.getElementById('stationPlaying');
var stationArabicEl      = document.getElementById('stationArabic');
var stationTranslationEl = document.getElementById('stationTranslation');
var stationSurahEl       = document.getElementById('stationSurah');
var stationRefEl         = document.getElementById('stationRef');
var stationStatusEl      = document.getElementById('stationStatus');
var stationProgressFill  = document.getElementById('stationProgressFill');
var stationProgressLabel = document.getElementById('stationProgressLabel');
var stationStopRow       = document.getElementById('stationStopRow');
var stationSurahSelect   = document.getElementById('stationSurahSelect');
var stationAyahInput     = document.getElementById('stationAyahInput');
var stationAyahHint      = document.getElementById('stationAyahHint');

/* Mini-player refs */
var miniPlayer      = document.getElementById('miniPlayer');
var miniPlayerSurah = document.getElementById('miniPlayerSurah');
var miniPlayerRef   = document.getElementById('miniPlayerRef');
var miniPlayerBtn   = document.getElementById('miniPlayerBtn');
var miniPlayerClose = document.getElementById('miniPlayerClose');

/* Continue Listening refs */
var continueListeningEl = document.getElementById('continueListening');
var continueBtn         = document.getElementById('continueBtn');

/* ── Populate surah dropdown ──────────────────────────────────── */
(function populateSurahDropdown() {
  var html = '';
  for (var i = 1; i <= 114; i++) {
    html += '<option value="' + i + '">' + i + '. ' + SURAH_NAMES[i] + ' (' + SURAH_VERSES[i] + ' ayat)</option>';
  }
  stationSurahSelect.innerHTML = html;
})();

/* ── Load saved position ──────────────────────────────────────── */
function loadStationPosition() {
  try {
    return JSON.parse(localStorage.getItem(STATION_SAVE_KEY));
  } catch(e) { return null; }
}

function saveStationPosition() {
  localStorage.setItem(STATION_SAVE_KEY, JSON.stringify({
    surah: stationSurahNum,
    ayah: stationStartAyah,
    reciter: stationReciter
  }));
}

/* Show "Continue Listening" if there's a saved position */
function checkContinueListening() {
  var saved = loadStationPosition();
  if (saved && continueListeningEl) {
    var surahName = SURAH_NAMES[saved.surah] || 'Unknown';
    continueBtn.textContent = '▶ Continue: ' + surahName + ' ' + saved.surah + ':' + saved.ayah;
    continueListeningEl.style.display = '';
  }
}

/* ── Surah selection ──────────────────────────────────────────── */
stationSurahSelect.addEventListener('change', function() {
  stationSurahNum = parseInt(stationSurahSelect.value, 10);
  var maxAyah = SURAH_VERSES[stationSurahNum];
  stationAyahInput.max = maxAyah;
  stationAyahInput.value = 1;
  stationStartAyah = 1;
  stationAyahHint.textContent = 'of ' + maxAyah;

  if (stationPlaying) {
    stationAyah = surahAyahToAbsolute(stationSurahNum, 1);
    stationPlayAyah(stationAyah);
  }
});

/* ── Ayah input ───────────────────────────────────────────────── */
stationAyahInput.addEventListener('change', function() {
  var maxAyah = SURAH_VERSES[stationSurahNum];
  var val = parseInt(stationAyahInput.value, 10) || 1;
  val = Math.max(1, Math.min(val, maxAyah));
  stationAyahInput.value = val;
  stationStartAyah = val;

  if (stationPlaying) {
    stationAyah = surahAyahToAbsolute(stationSurahNum, val);
    stationPlayAyah(stationAyah);
  }
});

/* ── Reciter selection ────────────────────────────────────────── */
document.getElementById('reciterGrid').addEventListener('click', function(e) {
  var card = e.target.closest('.reciter-card');
  if (!card) return;
  document.querySelectorAll('.reciter-card').forEach(function(c) { c.classList.remove('selected'); });
  card.classList.add('selected');
  stationReciter = card.dataset.reciter;

  if (stationPlaying) {
    stationPlayAyah(stationAyah);
  }
});

/* ── Audio URL builder ────────────────────────────────────────── */
function stationAudioUrl(ayahNum, reciterId) {
  var bitrate = RECITERS[reciterId] ? RECITERS[reciterId].bitrate : 128;
  return 'https://cdn.islamic.network/quran/audio/' + bitrate + '/' + reciterId + '/' + ayahNum + '.mp3';
}

/* ── Fetch ayah data from API ─────────────────────────────────── */
function fetchAyahData(ayahNum) {
  if (stationCache[ayahNum]) return Promise.resolve(stationCache[ayahNum]);

  return fetch('https://api.alquran.cloud/v1/ayah/' + ayahNum + '/editions/quran-uthmani,en.sahih')
    .then(function(res) {
      if (!res.ok) throw new Error('API error');
      return res.json();
    })
    .then(function(json) {
      var arabic = json.data[0];
      var english = json.data[1];
      var data = {
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
    })
    .catch(function() { return null; });
}

/* ── Update display ───────────────────────────────────────────── */
function stationUpdateDisplay(data) {
  if (!data) return;
  stationArabicEl.textContent = data.arabic;
  stationTranslationEl.textContent = '"' + data.translation + '"';
  stationSurahEl.textContent = data.surah + ' (' + data.surahArabic + ')';
  stationRefEl.textContent = data.surahNumber + ':' + data.ayahInSurah;

  var pct = (data.ayahInSurah / data.totalInSurah * 100).toFixed(1);
  stationProgressFill.style.width = pct + '%';
  stationProgressLabel.textContent = data.ayahInSurah + ' / ' + data.totalInSurah;

  if (data.surahNumber !== stationSurahNum) {
    stationSurahNum = data.surahNumber;
    stationSurahSelect.value = data.surahNumber;
    stationAyahInput.max = data.totalInSurah;
    stationAyahHint.textContent = 'of ' + data.totalInSurah;
  }
  stationAyahInput.value = data.ayahInSurah;
  stationStartAyah = data.ayahInSurah;

  /* Update mini-player */
  if (miniPlayerSurah) miniPlayerSurah.textContent = data.surah;
  if (miniPlayerRef) miniPlayerRef.textContent = data.surahNumber + ':' + data.ayahInSurah;

  /* Save position */
  saveStationPosition();
}

/* ── Status ───────────────────────────────────────────────────── */
function stationSetStatus(text, loading) {
  stationLoading = !!loading;
  stationStatusEl.innerHTML = loading
    ? '<span class="loading-dots">' + text + '</span>'
    : text;
}

/* ── Play a specific ayah ─────────────────────────────────────── */
function stationPlayAyah(ayahNum) {
  if (ayahNum < 1) ayahNum = TOTAL_AYAHS;
  if (ayahNum > TOTAL_AYAHS) ayahNum = 1;
  stationAyah = ayahNum;

  stationSetStatus('Loading', true);
  stationPrevBtn.disabled = false;
  stationNextBtn.disabled = false;

  if (stationAudio) {
    stationAudio.pause();
    stationAudio.removeAttribute('src');
    stationAudio.load();
  }

  fetchAyahData(ayahNum).then(function(data) {
    if (data) stationUpdateDisplay(data);

    /* Pre-fetch next */
    var nextNum = ayahNum < TOTAL_AYAHS ? ayahNum + 1 : 1;
    fetchAyahData(nextNum);

    var url = stationAudioUrl(ayahNum, stationReciter);

    if (!stationAudio) {
      stationAudio = new Audio();
      stationAudio.setAttribute('playsinline', '');
    }
    stationAudio.src = url;
    stationAudio.volume = 0;
    stationAudio.load();

    var onCanPlay = function() {
      stationAudio.removeEventListener('canplaythrough', onCanPlay);
      stationAudio.removeEventListener('error', onError);
      stationAudio.play().then(function() {
        stationSetStatus(RECITERS[stationReciter] ? RECITERS[stationReciter].name : 'Playing', false);
        fadeAudioTo(stationAudio, 0.8, 500);
      }).catch(function() {
        stationSetStatus('Tap play to start', false);
        stationPlaying = false;
        stationPlayBtn.textContent = '▶';
      });
    };

    var onError = function() {
      stationAudio.removeEventListener('canplaythrough', onCanPlay);
      stationAudio.removeEventListener('error', onError);
      stationSetStatus('Error — skipping', false);
      setTimeout(function() {
        if (stationPlaying) stationPlayAyah(ayahNum + 1);
      }, 1500);
    };

    stationAudio.addEventListener('canplaythrough', onCanPlay);
    stationAudio.addEventListener('error', onError);

    stationAudio.onended = function() {
      if (stationPlaying) stationPlayAyah(ayahNum + 1);
    };
  });
}

/* ── Stop station ─────────────────────────────────────────────── */
function stationStop() {
  stationPlaying = false;
  stationPlayBtn.textContent = '▶';
  stationPrevBtn.disabled = true;
  stationNextBtn.disabled = true;
  stationSetStatus('', false);

  if (stationAudio) {
    fadeAudioTo(stationAudio, 0, 600, function() {
      if (stationAudio) {
        stationAudio.pause();
        stationAudio.removeAttribute('src');
        stationAudio.load();
      }
    });
  }

  stationIdleEl.style.display = '';
  stationPlayingEl.style.display = 'none';
  stationStopRow.style.display = 'none';

  /* Hide mini-player */
  if (miniPlayer) miniPlayer.classList.remove('active');
}

/* ── Start station playback ───────────────────────────────────── */
function stationStart(surahNum, ayahNum, reciter) {
  stationSurahNum = surahNum || stationSurahNum;
  stationStartAyah = ayahNum || stationStartAyah;
  if (reciter) stationReciter = reciter;

  stationPlaying = true;
  stationPlayBtn.textContent = '⏸';

  stationAyah = surahAyahToAbsolute(stationSurahNum, stationStartAyah);

  if (typeof stopAmbientAudio === 'function') stopAmbientAudio();
  if (typeof stopRecitation === 'function') stopRecitation();

  stationIdleEl.style.display = 'none';
  stationPlayingEl.style.display = '';
  stationStopRow.style.display = '';

  stationAudio = new Audio();
  stationAudio.setAttribute('playsinline', '');
  stationAudio.volume = 0;
  stationAudio.play().catch(function() {});

  stationPlayAyah(stationAyah);

  /* Hide continue listening once playing */
  if (continueListeningEl) continueListeningEl.style.display = 'none';
}

/* ── Play / Pause button ──────────────────────────────────────── */
stationPlayBtn.addEventListener('click', function() {
  if (stationLoading) return;

  if (stationPlaying && stationAudio && !stationAudio.paused) {
    stationAudio.pause();
    stationPlayBtn.textContent = '▶';
    if (miniPlayerBtn) miniPlayerBtn.textContent = '▶';
    stationSetStatus('Paused', false);
  } else if (stationPlaying && stationAudio && stationAudio.paused) {
    stationAudio.play().then(function() {
      stationPlayBtn.textContent = '⏸';
      if (miniPlayerBtn) miniPlayerBtn.textContent = '⏸';
      stationSetStatus(RECITERS[stationReciter] ? RECITERS[stationReciter].name : 'Playing', false);
    }).catch(function() {});
  } else {
    stationStart();
  }
});

/* ── Prev / Next ──────────────────────────────────────────────── */
stationPrevBtn.addEventListener('click', function() {
  if (stationLoading) return;
  stationPlayAyah(stationAyah - 1);
});

stationNextBtn.addEventListener('click', function() {
  if (stationLoading) return;
  stationPlayAyah(stationAyah + 1);
});

/* ── Stop button ──────────────────────────────────────────────── */
document.getElementById('stationStopBtn').addEventListener('click', stationStop);

/* ── Continue Listening button ────────────────────────────────── */
if (continueBtn) {
  continueBtn.addEventListener('click', function() {
    var saved = loadStationPosition();
    if (saved) {
      stationSurahSelect.value = saved.surah;
      stationSurahNum = saved.surah;
      stationStartAyah = saved.ayah;
      stationAyahInput.value = saved.ayah;
      stationAyahInput.max = SURAH_VERSES[saved.surah];
      stationAyahHint.textContent = 'of ' + SURAH_VERSES[saved.surah];

      /* Set reciter if saved */
      if (saved.reciter) {
        stationReciter = saved.reciter;
        document.querySelectorAll('.reciter-card').forEach(function(c) {
          c.classList.toggle('selected', c.dataset.reciter === saved.reciter);
        });
      }

      stationStart(saved.surah, saved.ayah, saved.reciter);
    }
  });
}

/* ── Mini-player controls ─────────────────────────────────────── */
if (miniPlayerBtn) {
  miniPlayerBtn.addEventListener('click', function() {
    if (!stationPlaying) return;
    if (stationAudio && !stationAudio.paused) {
      stationAudio.pause();
      stationPlayBtn.textContent = '▶';
      miniPlayerBtn.textContent = '▶';
      stationSetStatus('Paused', false);
    } else if (stationAudio && stationAudio.paused) {
      stationAudio.play().then(function() {
        stationPlayBtn.textContent = '⏸';
        miniPlayerBtn.textContent = '⏸';
        stationSetStatus(RECITERS[stationReciter] ? RECITERS[stationReciter].name : 'Playing', false);
      }).catch(function() {});
    }
  });
}

if (miniPlayerClose) {
  miniPlayerClose.addEventListener('click', function() {
    stationStop();
  });
}

/* ── Stop station when navigating away — show mini-player instead ─ */
var _origNavigateTo = navigateTo;
navigateTo = function(screenName) {
  if (screenName !== 'stations' && stationPlaying) {
    /* Show mini-player instead of stopping */
    if (miniPlayer) {
      miniPlayer.classList.add('active');
      miniPlayerBtn.textContent = (stationAudio && !stationAudio.paused) ? '⏸' : '▶';
    }
  }
  if (screenName === 'stations' && stationPlaying) {
    /* Hide mini-player when back on stations */
    if (miniPlayer) miniPlayer.classList.remove('active');
  }
  _origNavigateTo(screenName);
};
