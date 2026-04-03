/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — App Initialization
   Entry point that boots up all modules after DOM is ready.
   ═══════════════════════════════════════════════════════════════════ */

/* Render initial UI */
renderStreak();
renderDaily();

/* Check for saved station position (Continue Listening) */
if (typeof checkContinueListening === 'function') {
  checkContinueListening();
}
