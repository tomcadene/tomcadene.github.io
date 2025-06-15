document.addEventListener('keydown', function(event) {
    // Use a switch statement to handle different key presses
    switch (event.key) {
        case '1':
        case '!':
            event.preventDefault();
            console.log('Navigated to the index page via keyboard shortcut 1');
            window.location.href = 'https://tomcadene.com/index.html'; // Navigate to the index page
            break;
        case 'c':
        case 'C':
            event.preventDefault();
            console.log('Navigated to the contact page via keyboard shortcut /');
            window.location.href = 'https://tomcadene.com/contact.html'; // Navigate to the contact page
            break;
        case 'x':
        case 'X':
            event.preventDefault();
            const url = 'https://twitter.com/tomcadene';
            const newWindow = window.open(url, '_blank'); // Attempt to open a new tab
            if (newWindow) {
                newWindow.focus();
                console.log('Opened Twitter in a new tab via keyboard shortcut 7');
            } else {
                console.log('Pop-up was blocked. Navigating in the same window.');
                window.location.href = url; // Fallback: navigate in the same window
            }
            break;
        default:
            // If the key is not handled, do nothing
            break;
    }
});
