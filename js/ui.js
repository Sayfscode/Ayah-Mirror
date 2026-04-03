/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — UI & Core Logic
   Theme, navigation, screens, emotion matching, result display,
   history, notes, passcode, streak, daily ayah, and toast.
   ═══════════════════════════════════════════════════════════════════ */


/* ────────────────────────────────────────────────────────────────
   2. STATE
   ──────────────────────────────────────────────────────────────── */

let selectedEmotion = null;
let currentEntry    = null;

/*
 * Non-repeating tracker (now SEQUENTIAL for progression).
 * Structure: { "Anxiety": 0, "Sadness": 1 }
 * Meaning: next ayah for Anxiety is index 0, for Sadness index 1.
 */
const progressionIndex = {};

/* localStorage keys */
const STORAGE_KEY       = 'ayah_mirror_history';
const STREAK_KEY        = 'ayah_mirror_streak';
const THEME_KEY         = 'ayah_mirror_theme';
const NOTES_KEY         = 'ayah_mirror_notes';
const PASSCODE_KEY      = 'ayah_mirror_passcode';


/* ────────────────────────────────────────────────────────────────
   3. LOCAL STORAGE HELPERS
   ──────────────────────────────────────────────────────────────── */

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > 100) history.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  } catch { return []; }
}

function saveNote(text) {
  const notes = loadNotes();
  notes.unshift({ date: new Date().toISOString(), text });
  if (notes.length > 200) notes.length = 200;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function deleteNote(index) {
  const notes = loadNotes();
  notes.splice(index, 1);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getPasscode()  { return localStorage.getItem(PASSCODE_KEY); }
function setPasscode(p) { localStorage.setItem(PASSCODE_KEY, p); }
function removePasscode(){ localStorage.removeItem(PASSCODE_KEY); }


/* ────────────────────────────────────────────────────────────────
   4. THEME SYSTEM
   Reads saved preference or defaults to light.
   Toggle switches between light/dark and saves to localStorage.
   ──────────────────────────────────────────────────────────────── */

const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  /* Update meta theme-color for mobile browsers */
  document.querySelector('meta[name="theme-color"]')
    .setAttribute('content', theme === 'dark' ? '#0d1210' : '#f0f7f2');
  localStorage.setItem(THEME_KEY, theme);
}

/* Load saved theme on startup */
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ────────────────────────────────────────────────────────────────
   5. STREAK SYSTEM
   Tracks consecutive days the user opens the app and interacts.
   Stored as { count, lastDate } in localStorage.
   ──────────────────────────────────────────────────────────────── */

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: '' };
  } catch { return { count: 0, lastDate: '' }; }
}

function updateStreak() {
  const streak = loadStreak();
  const today  = todayStr();

  if (streak.lastDate === today) return streak; // already counted today

  /* Calculate difference in days */
  const last = streak.lastDate ? new Date(streak.lastDate) : null;
  const now  = new Date(today);

  if (last) {
    const diffMs  = now - last;
    const diffDay = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDay === 1) {
      streak.count += 1; // consecutive day
    } else {
      streak.count = 1;  // gap — reset streak
    }
  } else {
    streak.count = 1;    // first ever visit
  }

  streak.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
}

function renderStreak() {
  const streak  = updateStreak();
  const display = document.getElementById('streakDisplay');

  if (streak.count < 1) {
    display.innerHTML = '';
    return;
  }

  const messages = [
    "You've returned to the Qur'an today",                     // 1 day
    `${streak.count} days with the Qur'an — keep it going`,   // 2-6
    `${streak.count}-day streak — MashaAllah, stay consistent`, // 7+
  ];

  let msg;
  if (streak.count === 1) msg = messages[0];
  else if (streak.count < 7) msg = messages[1];
  else msg = messages[2];

  display.innerHTML = `
    <div class="streak-badge fade-up">
      <span class="streak-fire">🔥</span>
      <span class="streak-msg">${msg}</span>
    </div>
  `;
}


/* ────────────────────────────────────────────────────────────────
   6. NAVIGATION
   ──────────────────────────────────────────────────────────────── */

const navButtons = document.querySelectorAll('.nav-btn');
const screens    = document.querySelectorAll('.screen');

function navigateTo(screenName) {
  screens.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screenName}`);
  if (target) target.classList.add('active');

  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenName);
  });

  if (screenName === 'journal')  { renderHistory(); renderNotes(); }
  if (screenName === 'daily')    renderDaily();
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

/* Journal tab switching */
document.querySelectorAll('.journal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.journal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.journal-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.panel}`).classList.add('active');

    /* If switching to notes and passcode is set, require it */
    if (tab.dataset.panel === 'notes' && getPasscode()) {
      showPasscodePrompt('unlock');
    }
  });
});


/* ────────────────────────────────────────────────────────────────
   7. EMOTION GRID
   ──────────────────────────────────────────────────────────────── */

const emotionGrid = document.getElementById('emotionGrid');
const customInput = document.getElementById('customEmotion');
const findBtn     = document.getElementById('findAyahBtn');

function renderEmotionGrid() {
  emotionGrid.innerHTML = AYAH_DATA.map(a => `
    <button class="emotion-chip" data-emotion="${a.emotion}">
      <span class="emoji">${a.emoji}</span>
      ${a.emotion}
    </button>
  `).join('');

  emotionGrid.querySelectorAll('.emotion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      emotionGrid.querySelectorAll('.emotion-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedEmotion = chip.dataset.emotion;
      customInput.value = '';
      findBtn.disabled = false;
    });
  });
}

renderEmotionGrid();

customInput.addEventListener('input', () => {
  if (customInput.value.trim()) {
    emotionGrid.querySelectorAll('.emotion-chip').forEach(c => c.classList.remove('selected'));
    selectedEmotion = null;
    findBtn.disabled = false;
  } else {
    findBtn.disabled = !selectedEmotion;
  }
});


/* ────────────────────────────────────────────────────────────────
   8. AYAH MATCHING — PROGRESSION SYSTEM
   Instead of random picks, ayahs are shown sequentially:
   1st request = comfort (index 0)
   2nd request = patience (index 1)
   3rd request = action (index 2)
   Then the cycle resets.
   ──────────────────────────────────────────────────────────────── */

/**
 * Pick the next ayah in the progression for a given emotion group.
 * Returns the entry, its phase label, and counter info.
 */
function pickProgressionEntry(group) {
  const key   = group.emotion;
  const total = group.entries.length;

  /* Initialise to 0 if this emotion hasn't been visited yet */
  if (progressionIndex[key] === undefined) {
    progressionIndex[key] = 0;
  }

  const idx = progressionIndex[key];

  /* Advance for next time (wraps around) */
  progressionIndex[key] = (idx + 1) % total;

  return {
    entry: group.entries[idx],
    index: idx,
    shown: idx + 1,
    total: total,
    phase: group.entries[idx].phase || ['comfort', 'patience', 'action'][idx]
  };
}

/**
 * Find the best matching emotion group and pick next progression ayah.
 */
function matchEmotion(emotionStr) {
  const lower = emotionStr.toLowerCase().trim();

  let group = AYAH_DATA.find(a => a.emotion.toLowerCase() === lower);

  /* Synonym lookup */
  if (!group) {
    const keywords = lower.split(/\s+/);
    const synonyms = {
      anxious: 'anxiety', worried: 'anxiety', nervous: 'anxiety', stressed: 'anxiety', stress: 'anxiety', panic: 'anxiety',
      sad: 'sadness', depressed: 'sadness', down: 'sadness', unhappy: 'sadness', miserable: 'sadness', blue: 'sadness',
      unmotivated: 'lack of motivation', lazy: 'lack of motivation', tired: 'lack of motivation', exhausted: 'lack of motivation', burnout: 'lack of motivation',
      grateful: 'gratitude', thankful: 'thankfulness', blessed: 'thankfulness', appreciative: 'gratitude',
      angry: 'anger', furious: 'anger', frustrated: 'anger', mad: 'anger', irritated: 'anger', rage: 'anger',
      lost: 'feeling lost', confused: 'confusion', directionless: 'feeling lost', aimless: 'feeling lost', stuck: 'feeling lost',
      afraid: 'fear', scared: 'fear', terrified: 'fear', frightened: 'fear',
      alone: 'loneliness', lonely: 'loneliness', isolated: 'loneliness',
      grieving: 'grief', mourning: 'grief', loss: 'grief', bereaved: 'grief',
      hopeless: 'hopelessness', despair: 'hopelessness', desperate: 'hopelessness', worthless: 'hopelessness',
      impatient: 'impatience', restless: 'impatience', waiting: 'impatience',
      insecure: 'self-doubt', unworthy: 'self-doubt', inadequate: 'self-doubt', 'not enough': 'self-doubt', imposter: 'self-doubt',
      overwhelmed: 'overwhelmed', drowning: 'overwhelmed', 'too much': 'overwhelmed',
      jealous: 'jealousy', envious: 'jealousy', envy: 'jealousy',
      guilty: 'guilt', ashamed: 'guilt', shame: 'guilt', regret: 'guilt', remorse: 'guilt',
      heartbroken: 'heartbreak', rejected: 'heartbreak', betrayed: 'heartbreak', hurt: 'heartbreak', broken: 'heartbreak',
      happy: 'thankfulness', joyful: 'thankfulness', content: 'thankfulness',
    };

    for (const kw of keywords) {
      if (synonyms[kw]) {
        group = AYAH_DATA.find(a => a.emotion.toLowerCase() === synonyms[kw]);
        if (group) break;
      }
    }

    /* Partial match */
    if (!group) {
      for (const a of AYAH_DATA) {
        const emotionLower = a.emotion.toLowerCase();
        for (const kw of keywords) {
          if (emotionLower.includes(kw) || kw.includes(emotionLower)) {
            group = a;
            break;
          }
        }
        if (group) break;
      }
    }
  }

  /* Fallback: random group */
  if (!group) {
    group = AYAH_DATA[Math.floor(Math.random() * AYAH_DATA.length)];
  }

  const result = pickProgressionEntry(group);
  return {
    emotion: group.emotion,
    emoji:   group.emoji,
    entry:   result.entry,
    shown:   result.shown,
    total:   result.total,
    phase:   result.phase,
    index:   result.index
  };
}


/* ────────────────────────────────────────────────────────────────
   9. RESULT SCREEN
   Shows the matched ayah with progression badge, action step,
   and reflection prompts.
   ──────────────────────────────────────────────────────────────── */

const resultContent = document.getElementById('resultContent');

function getPhaseLabel(phase) {
  const labels = {
    comfort:  { icon: '🤲', text: 'Comfort', cls: 'comfort' },
    patience: { icon: '⏳', text: 'Patience', cls: 'patience' },
    action:   { icon: '⚡', text: 'Action', cls: 'action' }
  };
  return labels[phase] || labels.comfort;
}

function showResult(emotionStr) {
  const match = matchEmotion(emotionStr);
  if (!match) return;

  currentEntry = match;
  const { emotion, emoji, entry, shown, total, phase, index } = match;
  const phaseInfo   = getPhaseLabel(phase);
  const actionSteps = ACTION_STEPS[emotion] || ACTION_STEPS['Anxiety'];
  const actionStep  = actionSteps[index] || actionSteps[0];
  const guidance    = (GUIDANCE_STACK[emotion] || GUIDANCE_STACK['Anxiety'])[index] || (GUIDANCE_STACK[emotion] || GUIDANCE_STACK['Anxiety'])[0];

  resultContent.innerHTML = `
    <!-- Matched emotion label -->
    <div class="daily-banner fade-up">
      ${emoji} Showing ayah for: <strong>${emotion}</strong>
    </div>

    <!-- The ayah card -->
    <div class="ayah-card fade-up fade-up-delay-1" id="ayahDisplay">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <span class="progression-badge ${phaseInfo.cls}">
          ${phaseInfo.icon} ${phaseInfo.text}
        </span>
        <span class="ayah-counter">${shown} of ${total}</span>
      </div>
      <div class="arabic">${entry.ayah}</div>
      <div class="verse-ref">${entry.reference}</div>
      <p class="translation">"${entry.translation}"</p>
      <div class="explanation">
        <strong>Why this ayah speaks to you:</strong><br />
        ${entry.reason}
      </div>
      <div class="divider"></div>
      <p style="font-size:12px;color:var(--text-muted);">${entry.explanation}</p>
    </div>

    <!-- Hadith card -->
    <div class="hadith-card fade-up fade-up-delay-2" id="hadithDisplay">
      <div class="hadith-card-label">📖 Related Hadith</div>
      <div class="hadith-card-text">"${guidance.hadith}"</div>
      <div class="hadith-card-source">— ${guidance.hadithSource}</div>
    </div>

    <!-- Scholar wisdom -->
    <div class="scholar-card fade-up fade-up-delay-3" id="scholarDisplay">
      <div class="scholar-card-label">✨ Words of Wisdom</div>
      <div class="scholar-card-text">"${guidance.wisdom}"</div>
      <div class="scholar-card-name">— ${guidance.scholar}</div>
    </div>

    <!-- Action step -->
    <div class="action-step fade-up fade-up-delay-4">
      <div class="action-step-icon">🕋</div>
      <div>
        <div class="action-step-label">Act on this now</div>
        <div class="action-step-text">${actionStep}</div>
      </div>
    </div>

    <!-- Reflection section -->
    <div class="card fade-up fade-up-delay-4">
      <div class="section-title">Reflect</div>
      <label style="font-size:13px;color:var(--text-muted);display:block;margin-bottom:6px;">
        What did you learn from this ayah?
      </label>
      <textarea class="text-input" id="learnedInput" placeholder="Write your thoughts..." rows="3"></textarea>

      <label style="font-size:13px;color:var(--text-muted);display:block;margin:14px 0 6px;">
        What action will you take?
      </label>
      <textarea class="text-input" id="actionInput" placeholder="One small step..." rows="2"></textarea>

      <div style="margin-top:16px;display:flex;gap:10px;">
        <button class="btn-primary" id="saveReflectionBtn" style="flex:1;">
          Save Reflection
        </button>
        <button class="btn-ghost" id="skipSaveBtn">
          Skip
        </button>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="fade-up fade-up-delay-5" style="text-align:center;margin-top:8px;padding-bottom:20px;">
      <button class="btn-ghost" id="anotherAyahBtn" style="margin-right:8px;">
        Show Another Ayah
      </button>
      <button class="btn-ghost" id="enterFocusFromResult">
        🎬 Cinematic Ayah
      </button>
      <div style="margin-top:10px;">
        <button class="btn-ghost" id="backHomeBtn">
          Back to Home
        </button>
      </div>
    </div>
  `;

  /* Wire up Save button */
  document.getElementById('saveReflectionBtn').addEventListener('click', () => {
    const learned = document.getElementById('learnedInput').value.trim();
    const action  = document.getElementById('actionInput').value.trim();
    saveToHistory({
      date: new Date().toISOString(),
      emotion,
      reference: entry.reference,
      translation: entry.translation,
      learnedText: learned || '',
      actionText: action || ''
    });
    showToast('Reflection saved!');
    setTimeout(() => navigateTo('home'), 800);
    resetHomeSelection();
  });

  /* Skip — save without reflection */
  document.getElementById('skipSaveBtn').addEventListener('click', () => {
    saveToHistory({
      date: new Date().toISOString(),
      emotion,
      reference: entry.reference,
      translation: entry.translation,
      learnedText: '',
      actionText: ''
    });
    navigateTo('home');
    resetHomeSelection();
  });

  /*
   * "Show Another Ayah" — smooth fade-out/fade-in swap.
   * Now follows the progression system (comfort → patience → action).
   */
  document.getElementById('anotherAyahBtn').addEventListener('click', () => {
    const ayahCard = document.getElementById('ayahDisplay');
    ayahCard.style.opacity = '0';
    ayahCard.style.transform = 'translateY(10px)';
    ayahCard.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(() => {
      const newMatch   = matchEmotion(emotionStr);
      currentEntry     = newMatch;
      const newPhase   = getPhaseLabel(newMatch.phase);
      const newActions = ACTION_STEPS[newMatch.emotion] || ACTION_STEPS['Anxiety'];
      const newAction  = newActions[newMatch.index] || newActions[0];

      ayahCard.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span class="progression-badge ${newPhase.cls}">
            ${newPhase.icon} ${newPhase.text}
          </span>
          <span class="ayah-counter">${newMatch.shown} of ${newMatch.total}</span>
        </div>
        <div class="arabic">${newMatch.entry.ayah}</div>
        <div class="verse-ref">${newMatch.entry.reference}</div>
        <p class="translation">"${newMatch.entry.translation}"</p>
        <div class="explanation">
          <strong>Why this ayah speaks to you:</strong><br />
          ${newMatch.entry.reason}
        </div>
        <div class="divider"></div>
        <p style="font-size:12px;color:var(--text-muted);">${newMatch.entry.explanation}</p>
      `;

      /* Also update the action step */
      const actionEl = document.querySelector('.action-step-text');
      if (actionEl) actionEl.textContent = newAction;

      /* Update guidance stack */
      const newGuidance = (GUIDANCE_STACK[newMatch.emotion] || GUIDANCE_STACK['Anxiety'])[newMatch.index] || (GUIDANCE_STACK[newMatch.emotion] || GUIDANCE_STACK['Anxiety'])[0];
      const hadithEl = document.getElementById('hadithDisplay');
      if (hadithEl) {
        hadithEl.querySelector('.hadith-card-text').textContent = '"' + newGuidance.hadith + '"';
        hadithEl.querySelector('.hadith-card-source').textContent = '— ' + newGuidance.hadithSource;
      }
      const scholarEl = document.getElementById('scholarDisplay');
      if (scholarEl) {
        scholarEl.querySelector('.scholar-card-text').textContent = '"' + newGuidance.wisdom + '"';
        scholarEl.querySelector('.scholar-card-name').textContent = '— ' + newGuidance.scholar;
      }

      requestAnimationFrame(() => {
        ayahCard.style.opacity = '1';
        ayahCard.style.transform = 'translateY(0)';
      });
    }, 250);
  });

  /* Deep reflect from result screen */
  document.getElementById('enterFocusFromResult').addEventListener('click', () => {
    startFocusMode(entry);
  });

  /* Back to Home */
  document.getElementById('backHomeBtn').addEventListener('click', () => {
    navigateTo('home');
    resetHomeSelection();
  });

  navigateTo('result');
}

function resetHomeSelection() {
  selectedEmotion = null;
  customInput.value = '';
  findBtn.disabled = true;
  emotionGrid.querySelectorAll('.emotion-chip').forEach(c => c.classList.remove('selected'));
}

/* Find Ayah button */
findBtn.addEventListener('click', () => {
  const emotion = selectedEmotion || customInput.value.trim();
  if (emotion) showResult(emotion);
});

/* Enter key in custom input */
customInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && customInput.value.trim()) {
    showResult(customInput.value.trim());
  }
});


/* ────────────────────────────────────────────────────────────────
   11. HISTORY SCREEN
   ──────────────────────────────────────────────────────────────── */

function renderHistory() {
  const list    = document.getElementById('historyList');
  const history = loadHistory();

  if (history.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">📖</div>
        <p>No reflections yet.</p>
        <p style="font-size:12px;margin-top:4px;">Your journey begins on the home screen.</p>
      </div>`;
    return;
  }

  list.innerHTML = history.map(h => {
    const date = new Date(h.date);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const hasReflection = h.learnedText || h.actionText;
    return `
      <div class="history-item">
        <div class="history-date">${dateStr}</div>
        <div class="history-emotion">${h.emotion}</div>
        <div class="history-verse">"${h.translation}" — ${h.reference}</div>
        ${hasReflection ? `<div class="history-reflection">
          ${h.learnedText ? `Learned: ${h.learnedText}` : ''}
          ${h.actionText ? `${h.learnedText ? '<br/>' : ''}Action: ${h.actionText}` : ''}
        </div>` : ''}
      </div>`;
  }).join('');
}

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  if (confirm('Clear all history? This cannot be undone.')) {
    clearHistory();
    renderHistory();
    showToast('History cleared');
  }
});


/* ────────────────────────────────────────────────────────────────
   12. PRIVATE NOTES with optional passcode lock
   ──────────────────────────────────────────────────────────────── */

const lockToggle   = document.getElementById('lockToggle');
const noteInput    = document.getElementById('noteInput');
const saveNoteBtn  = document.getElementById('saveNoteBtn');
const notesList    = document.getElementById('notesList');
const notesPanel   = document.getElementById('panel-notes');

/* Initialise lock toggle state */
if (getPasscode()) lockToggle.classList.add('on');

lockToggle.addEventListener('click', () => {
  if (getPasscode()) {
    /* Remove passcode */
    if (confirm('Remove passcode lock from notes?')) {
      removePasscode();
      lockToggle.classList.remove('on');
      showToast('Lock removed');
    }
  } else {
    /* Set new passcode */
    showPasscodePrompt('set');
  }
});

saveNoteBtn.addEventListener('click', () => {
  const text = noteInput.value.trim();
  if (!text) return;
  saveNote(text);
  noteInput.value = '';
  renderNotes();
  showToast('Note saved');
});

function renderNotes() {
  const notes = loadNotes();

  if (notes.length === 0) {
    notesList.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔐</div>
        <p>No private notes yet.</p>
        <p style="font-size:12px;margin-top:4px;">Your reflections stay on this device only.</p>
      </div>`;
    return;
  }

  notesList.innerHTML = notes.map((n, i) => {
    const date = new Date(n.date);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="note-item">
        <div class="note-date">${dateStr}</div>
        <div class="note-text">${escapeHtml(n.text)}</div>
        <button class="note-delete" onclick="handleDeleteNote(${i})">Delete</button>
      </div>`;
  }).join('');
}

/* Delete note handler (needs to be global for inline onclick) */
window.handleDeleteNote = function(index) {
  if (confirm('Delete this note?')) {
    deleteNote(index);
    renderNotes();
    showToast('Note deleted');
  }
};

/* Escape HTML to prevent XSS in user-entered notes */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


/* ────────────────────────────────────────────────────────────────
   13. PASSCODE SYSTEM
   Simple 4-digit PIN overlay.
   Modes: 'set' (create new passcode) or 'unlock' (verify).
   ──────────────────────────────────────────────────────────────── */

const passcodeOverlay = document.getElementById('passcodeOverlay');
const passcodeDots    = document.querySelectorAll('.passcode-dot');
const passcodeError   = document.getElementById('passcodeError');
const passcodeTitle   = document.getElementById('passcodeTitle');
const passcodeCancel  = document.getElementById('passcodeCancel');

let passcodeMode  = 'unlock'; // 'set' or 'unlock'
let passcodeInput = '';
let passcodeFirst = '';        // for confirm step when setting

function showPasscodePrompt(mode) {
  passcodeMode  = mode;
  passcodeInput = '';
  passcodeFirst = '';
  passcodeError.textContent = '';
  updatePasscodeDots();

  if (mode === 'set') {
    passcodeTitle.textContent = 'Create a 4-digit passcode';
  } else {
    passcodeTitle.textContent = 'Enter passcode to view notes';
  }

  passcodeOverlay.classList.add('active');
}

function hidePasscodePrompt() {
  passcodeOverlay.classList.remove('active');
  passcodeInput = '';
  passcodeFirst = '';
}

function updatePasscodeDots() {
  passcodeDots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < passcodeInput.length);
  });
}

function handlePasscodeKey(val) {
  if (val === 'clear') {
    passcodeInput = '';
    passcodeError.textContent = '';
  } else if (val === 'back') {
    passcodeInput = passcodeInput.slice(0, -1);
  } else {
    if (passcodeInput.length >= 4) return;
    passcodeInput += val;
  }

  updatePasscodeDots();

  /* When 4 digits entered, process */
  if (passcodeInput.length === 4) {
    setTimeout(() => processPasscode(), 200);
  }
}

function processPasscode() {
  if (passcodeMode === 'set') {
    if (!passcodeFirst) {
      /* First entry — ask to confirm */
      passcodeFirst = passcodeInput;
      passcodeInput = '';
      passcodeTitle.textContent = 'Confirm your passcode';
      updatePasscodeDots();
    } else {
      /* Confirm entry */
      if (passcodeInput === passcodeFirst) {
        setPasscode(passcodeInput);
        lockToggle.classList.add('on');
        hidePasscodePrompt();
        showToast('Passcode set');
      } else {
        passcodeError.textContent = 'Passcodes don\'t match. Try again.';
        passcodeInput = '';
        passcodeFirst = '';
        passcodeTitle.textContent = 'Create a 4-digit passcode';
        updatePasscodeDots();
      }
    }
  } else {
    /* Unlock mode */
    if (passcodeInput === getPasscode()) {
      hidePasscodePrompt();
    } else {
      passcodeError.textContent = 'Wrong passcode. Try again.';
      passcodeInput = '';
      updatePasscodeDots();
    }
  }
}

/* Wire up keypad buttons */
document.querySelectorAll('.passcode-key').forEach(key => {
  key.addEventListener('click', () => handlePasscodeKey(key.dataset.val));
});

passcodeCancel.addEventListener('click', () => {
  hidePasscodePrompt();
  /* If cancelling unlock, switch back to history tab */
  if (passcodeMode === 'unlock') {
    document.querySelectorAll('.journal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.journal-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('.journal-tab[data-panel="history"]').classList.add('active');
    document.getElementById('panel-history').classList.add('active');
  }
});


/* ────────────────────────────────────────────────────────────────
   14. DAILY AYAH
   Picks a personalised ayah based on most frequent emotion.
   Date-seeded so it stays stable for the whole day.
   ──────────────────────────────────────────────────────────────── */

function renderDaily() {
  const content = document.getElementById('dailyContent');
  const history = loadHistory();

  let topEmotion = null;
  if (history.length > 0) {
    const freq = {};
    history.forEach(h => { freq[h.emotion] = (freq[h.emotion] || 0) + 1; });
    topEmotion = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  }

  const today   = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  let group;
  if (topEmotion) {
    group = AYAH_DATA.find(a => a.emotion.toLowerCase() === topEmotion.toLowerCase());
  }
  if (!group) {
    group = AYAH_DATA[daySeed % AYAH_DATA.length];
  }

  const entry = group.entries[daySeed % group.entries.length];
  const actionSteps = ACTION_STEPS[group.emotion] || ACTION_STEPS['Anxiety'];
  const actionStep  = actionSteps[daySeed % actionSteps.length];
  const dailyIdx = daySeed % (group.entries.length);
  const dailyGuidance = (GUIDANCE_STACK[group.emotion] || GUIDANCE_STACK['Anxiety'])[dailyIdx] || (GUIDANCE_STACK[group.emotion] || GUIDANCE_STACK['Anxiety'])[0];

  content.innerHTML = `
    ${topEmotion ? `<p style="text-align:center;font-size:12px;color:var(--text-muted);margin-bottom:16px;">
      Based on your reflections, you often feel <strong style="color:var(--green);">${topEmotion.toLowerCase()}</strong>.<br/>
      Here is today's ayah chosen for you.
    </p>` : `<p style="text-align:center;font-size:12px;color:var(--text-muted);margin-bottom:16px;">
      Start reflecting on the home screen to get personalised daily ayat.
    </p>`}

    <div class="ayah-card fade-up">
      <div class="arabic">${entry.ayah}</div>
      <div class="verse-ref">${entry.reference}</div>
      <p class="translation">"${entry.translation}"</p>
      <div class="divider"></div>
      <p style="font-size:13px;color:var(--text-muted);">${entry.explanation}</p>
    </div>

    <div class="hadith-card fade-up fade-up-delay-1">
      <div class="hadith-card-label">📖 Related Hadith</div>
      <div class="hadith-card-text">"${dailyGuidance.hadith}"</div>
      <div class="hadith-card-source">— ${dailyGuidance.hadithSource}</div>
    </div>

    <div class="scholar-card fade-up fade-up-delay-2">
      <div class="scholar-card-label">✨ Words of Wisdom</div>
      <div class="scholar-card-text">"${dailyGuidance.wisdom}"</div>
      <div class="scholar-card-name">— ${dailyGuidance.scholar}</div>
    </div>

    <div class="action-step fade-up fade-up-delay-3">
      <div class="action-step-icon">🕋</div>
      <div>
        <div class="action-step-label">Act on this now</div>
        <div class="action-step-text">${actionStep}</div>
      </div>
    </div>

    <div class="card fade-up fade-up-delay-4">
      <div class="explanation">
        <strong>Reflection prompt:</strong><br />
        ${entry.reason}
      </div>
    </div>

    <div style="text-align:center;margin-top:12px;" class="fade-up fade-up-delay-5">
      <button class="btn-ghost" id="dailyFocusBtn">
        🎬 Cinematic Ayah
      </button>
    </div>
  `;

  /* Wire up deep reflect button for daily */
  const dailyFocusBtn = document.getElementById('dailyFocusBtn');
  if (dailyFocusBtn) {
    dailyFocusBtn.addEventListener('click', () => startFocusMode(entry));
  }
}


/* ────────────────────────────────────────────────────────────────
   15. TOAST NOTIFICATION
   ──────────────────────────────────────────────────────────────── */

const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
