// Get reference to floating image
const cursorImage = document.getElementById('cursorImage');

// Get all hover targets
const hoverTargets = document.querySelectorAll('.hover-target');

// Screen width for checking boundaries
let screenWidth = window.innerWidth;

// Update screen width if window resizes
window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
});

// Loop through each hover target
hoverTargets.forEach(target => {
    // When mouse enters a target
    target.addEventListener('mouseenter', () => {
        console.log("Mouse entered:", target.textContent);
        // Set the image source from data attribute
        cursorImage.src = target.getAttribute('data-image');
        cursorImage.style.display = 'block';
    });

    // When mouse leaves a target
    target.addEventListener('mouseleave', () => {
        console.log("Mouse left:", target.textContent);
        cursorImage.style.display = 'none';
    });

    // Track mouse movement for each target
    // Track mouse movement for each target
    target.addEventListener('mousemove', (e) => {
        console.log(`Mouse: X=${e.clientX}, Y=${e.clientY}`);

        const imgWidth = cursorImage.offsetWidth;
        const imgHeight = cursorImage.offsetHeight;
        const offset = 15; // Gap from cursor
        const screenHeight = window.innerHeight;

        // Horizontal positioning
        if (e.clientX + imgWidth + offset > screenWidth) {
            cursorImage.style.left = (e.clientX - imgWidth - offset) + 'px'; // Left side
        } else if (e.clientX - imgWidth - offset < 0) {
            cursorImage.style.left = (e.clientX + offset) + 'px'; // Right side
        } else {
            cursorImage.style.left = (e.clientX + offset) + 'px'; // Default right
        }

        // Vertical positioning
        if (e.clientY + imgHeight + offset > screenHeight) {
            cursorImage.style.top = (e.clientY - imgHeight - offset) + 'px'; // Above cursor
        } else if (e.clientY - imgHeight - offset < 0) {
            cursorImage.style.top = (e.clientY + offset) + 'px'; // Below cursor
        } else {
            cursorImage.style.top = (e.clientY + offset) + 'px'; // Default below
        }
    });

});
