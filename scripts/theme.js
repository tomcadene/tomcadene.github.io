/* ============================
   THEME-SWITCHING SCRIPT
   ============================ */

/* ---------- CONSTANTS ---------- */
// Keys and values used throughout the script
const LIGHT_THEME   = 'light';                 // Light-mode key
const DARK_THEME    = 'dark';                  // Dark-mode key
const THEME_KEY     = 'theme';                 // localStorage key

/* ---------- HELPER: save to storage ---------- */
function saveTheme(theme) {
    // Always save the theme preference
    localStorage.setItem(THEME_KEY, theme);          
    console.log('[Theme] Saved to localStorage:', theme);
}

/* ---------- CORE: Apply the theme ---------- */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme); // Change <html> attribute
    saveTheme(theme);                                           // Persist the choice
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
    // 1. Try saved preference ------------------------
    const savedTheme = localStorage.getItem(THEME_KEY);

    // 2. Default to dark if no saved theme ----------------
    const initialTheme = savedTheme || DARK_THEME;

    // 3. Apply the chosen theme -------------------------
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

    /* Always set an initial theme */
    initializeTheme();
});
