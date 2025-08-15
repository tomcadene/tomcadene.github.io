/* ============================
   THEME-SWITCHING SCRIPT
   ============================ */

/* ---------- CONSTANTS ---------- */
// Keys and values used throughout the script
const LIGHT_THEME   = 'light';                 // Light-mode key
const DARK_THEME    = 'dark';                  // Dark-mode key
const THEME_KEY     = 'theme';                 // localStorage key
const CONSENT_KEY   = 'cookie_consent';        // localStorage key for GDPR banner

/* ---------- HELPER: save to storage (only if consent) ---------- */
function saveTheme(theme) {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
        localStorage.setItem(THEME_KEY, theme);          // Persist only with consent
        console.log('[Theme] Saved to localStorage:', theme);
    } else {
        console.log('[Theme] Not saved (no consent):', theme);
    }
}

/* ---------- CORE: Apply the theme ---------- */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme); // Change <html> attribute
    saveTheme(theme);                                           // Try to persist the choice
    console.log('[Theme] Applied:', theme);
}

/* ---------- CORE: Toggle between light and dark ---------- */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme);
}

/* ---------- INITIALISE: Always default to dark if no saved preference ---------- */
function initializeTheme() {
    // 1. Try saved preference (requires consent) ------------------------
    const savedTheme = localStorage.getItem(THEME_KEY);

    // 2. Default to dark if no saved theme ------------------------------
    const initialTheme = savedTheme || DARK_THEME;

    // 3. Apply the chosen theme -----------------------------------------
    setTheme(initialTheme);
}

/* ---------- DOM READY: hook up the button and kick things off ---------- */
document.addEventListener('DOMContentLoaded', () => {
    /* Attach click handler to any element that should toggle the theme */
    const themeButton = document.querySelector('.newThemeButton');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
        console.log('[Theme] Toggle button initialised');
    } else {
        console.log('[Theme] No toggle button found');
    }

    /* Always set an initial theme – even before cookie consent.
       Persistence will happen later if/when the user consents. */
    initializeTheme();
});
