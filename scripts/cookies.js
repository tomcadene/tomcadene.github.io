// Constants for cookie consent
const COOKIE_CONSENT_KEY = 'cookie_consent';

// Function to check if cookie consent is already set
function hasCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

// Function to get cookie consent value
function getCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
}

// Function to set cookie consent
function setCookieConsent(consent) {
    localStorage.setItem(COOKIE_CONSENT_KEY, consent);
}

// Function to show the cookie consent popup
function showCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    if (popup) {
        popup.classList.remove('hidden');
    }
}

// Function to hide the cookie consent popup
function hideCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

// Function to handle acceptance of cookies
function acceptCookies() {
    setCookieConsent('accepted');
    hideCookiePopup();
    // Initialize theme as the user has accepted cookies
    initializeTheme();
}

// Function to handle decline of cookies
function declineCookies() {
    setCookieConsent('declined');
    hideCookiePopup();
    // Optionally, you can disable theme toggling or other functionalities here
}

// Initialize cookie consent
function initializeCookies() {
    if (!hasCookieConsent()) {
        showCookiePopup();
    } else {
        const consent = getCookieConsent();
        if (consent === 'accepted') {
            initializeTheme();
        }
        // If declined, you can restrict functionalities as needed
    }
}

// Add event listeners to the Accept and Decline buttons
document.addEventListener('DOMContentLoaded', () => {
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');

    if (acceptButton) {
        acceptButton.addEventListener('click', acceptCookies);
    }

    if (declineButton) {
        declineButton.addEventListener('click', declineCookies);
    }

    // Initialize cookies on page load
    initializeCookies();
});
