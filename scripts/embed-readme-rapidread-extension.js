// embed-readme.js

// Constants for theme keys
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const THEME_KEY = 'theme';

// Function to set the theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme); // Save the theme to localStorage
    console.log('Theme set to:', theme);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme); // Toggle between light and dark
}

// Function to get the preferred system theme
function getSystemThemePreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
}

// Initialize theme
function initializeTheme() {
    // Get the saved theme from localStorage or fallback to system preference
    const savedTheme = localStorage.getItem(THEME_KEY) || getSystemThemePreference();
    setTheme(savedTheme); // Apply the theme
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.querySelector('.theme-toggle-button');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Initialize theme when the page loads
    initializeTheme();

    // Fetch and display the README
    fetchAndDisplayReadme();
});

// Configuration: Replace these with your GitHub details
const owner = 'tomcadene';       // e.g., 'octocat'
const repo = 'rapidread-extension';      // e.g., 'Hello-World'

// GitHub API URL to fetch the README
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

// Function to fetch and display the README
async function fetchAndDisplayReadme() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw' // Fetch raw Markdown
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();

        // Convert Markdown to HTML
        let htmlContent = marked.parse(markdown);

        // Sanitize the HTML to prevent XSS attacks
        htmlContent = DOMPurify.sanitize(htmlContent);

        // Insert the sanitized HTML into the page
        document.getElementById('readme').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error fetching README:', error);
        document.getElementById('readme').innerText = 'Failed to load README.';
    }
}
