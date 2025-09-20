
/* ===== Carousel Class ===== */
class Carousel {
    constructor(element) {
        // Root element for this carousel
        this.carousel = element;                                     // Save the carousel root element
        // Elements
        this.mainImage = this.carousel.querySelector('.carousel-image');         // Main image element
        this.leftNav = this.carousel.querySelector('.carousel-nav.left');        // Left nav button
        this.rightNav = this.carousel.querySelector('.carousel-nav.right');      // Right nav button
        this.thumbnails = Array.from(this.carousel.querySelectorAll('.carousel-thumb')); // List of thumbs
        // Settings
        this.autoplay = this.carousel.dataset.autoplay === 'true';   // Autoplay flag from data attribute
        this.interval = parseInt(this.carousel.dataset.interval) || 5000; // Interval in ms
        // State
        this.currentIndex = 0;                                       // Current slide index
        this.timer = null;                                           // Interval timer id
        this.touchStartX = 0;                                        // Touch start X for swipe
        this.touchEndX = 0;                                          // Touch end X for swipe
        this.images = this.thumbnails.map(thumb => thumb.getAttribute('data-full')); // Full image list
        this.isAutoplayActive = this.autoplay;                       // Tracks autoplay state before modal

        // Bind methods to preserve "this"
        this.prevImage = this.prevImage.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
        this.handleModalPrev = this.handleModalPrev.bind(this);
        this.handleModalNext = this.handleModalNext.bind(this);
        this.handleModalKeyDown = this.handleModalKeyDown.bind(this);

        // Init
        this.init();                                                 // Initialize the carousel now
    }

    init() {
        // Set initial image and active thumbnail
        this.updateMainImage(this.currentIndex, false);              // Set first image without announcing
        logEvent("Initialized with images", this.images);            // Log images loaded

        // Button listeners
        this.leftNav.addEventListener('click', () => {               // When left arrow is clicked
            logEvent("Left arrow clicked");                            // Log the click
            this.prevImage();                                          // Go to previous image
            this.resetAutoplay();                                      // Reset autoplay timer
        });
        this.rightNav.addEventListener('click', () => {              // When right arrow is clicked
            logEvent("Right arrow clicked");                           // Log the click
            this.nextImage();                                          // Go to next image
            this.resetAutoplay();                                      // Reset autoplay timer
        });

        // Thumbnail listeners
        this.thumbnails.forEach(thumb => {                           // For each thumbnail
            thumb.addEventListener('click', this.handleThumbnailClick);// Handle click
        });

        // Autoplay
        if (this.autoplay) {                                         // If autoplay is enabled
            this.startAutoplay();                                      // Start autoplay
            this.carousel.addEventListener('mouseenter', this.handleMouseEnter); // Pause on hover
            this.carousel.addEventListener('mouseleave', this.handleMouseLeave); // Resume on leave
        }

        // Touch swipe
        this.carousel.addEventListener('touchstart', this.handleTouchStart, false); // Start touch
        this.carousel.addEventListener('touchend', this.handleTouchEnd, false);     // End touch

        // Keyboard nav
        this.carousel.setAttribute('tabindex', '0');                 // Make focusable for key events
        this.carousel.addEventListener('keydown', this.handleKeyDown);// Listen for arrow/Escape keys

        // Click to open modal
        this.mainImage.style.cursor = 'pointer';                     // Show clickable cursor
        this.mainImage.addEventListener('click', this.openModal);    // Open modal on click
    }

    isModalOpen() {
        // Returns true when modal is visible
        const modal = document.getElementById('image-modal');        // Get modal element
        return modal && modal.style.display === 'block';             // Check if display is block
    }

    updateMainImage(index, announce = true) {
        // Wrap index
        if (index < 0) index = this.images.length - 1;               // If below zero, wrap to last
        if (index >= this.images.length) index = 0;                  // If past end, wrap to first

        // Swap image
        this.mainImage.src = this.images[index];                     // Set new image src
        this.mainImage.alt = `Carousel Image ${index + 1}`;          // Set accessible alt
        this.currentIndex = index;                                   // Save index
        this.updateActiveThumbnail();                                 // Update active thumb
        logEvent("Image changed", { index });                        // Log change

        // Announce politely for screen readers
        if (announce) this.carousel.setAttribute('aria-live', 'polite'); // Set aria-live

        // Sync modal image if open
        const modal = document.getElementById('image-modal');        // Get modal element
        if (modal && modal.style.display === 'block') {              // If modal is open
            this.updateModalImage();                                   // Update modal image too
        }
    }

    updateActiveThumbnail() {
        // Toggle active class on thumbnails
        this.thumbnails.forEach(thumb => thumb.classList.remove('active')); // Clear all
        if (this.thumbnails[this.currentIndex]) {                   // If current thumb exists
            this.thumbnails[this.currentIndex].classList.add('active'); // Mark active
        }
    }

    prevImage() { this.updateMainImage(this.currentIndex - 1); }    // Go to previous
    nextImage() { this.updateMainImage(this.currentIndex + 1); }    // Go to next

    startAutoplay() {
        // Guard multiple timers
        if (this.timer) return;                                      // If already running, skip
        this.timer = setInterval(() => {                             // Create interval
            this.nextImage();                                          // Advance image
        }, this.interval);                                           // Use configured interval
        logEvent("Autoplay started", { interval: this.interval });   // Log start
    }

    stopAutoplay() {
        // Stop timer if present
        if (this.timer) {                                            // If timer exists
            clearInterval(this.timer);                                 // Clear interval
            this.timer = null;                                         // Reset ref
            logEvent("Autoplay stopped");                              // Log stop
        }
    }

    resetAutoplay() {
        // Only when autoplay is enabled and modal is closed
        if (!this.autoplay) return;                                  // If not enabled, skip
        if (this.isModalOpen()) return;                              // If modal open, skip
        this.stopAutoplay();                                         // Stop current timer
        this.startAutoplay();                                        // Start again
    }

    handleThumbnailClick(e) {
        // Jump to clicked thumbnail index
        const index = parseInt(e.target.getAttribute('data-index')); // Get index from data
        if (!isNaN(index)) {                                         // If valid number
            logEvent("Thumbnail clicked", { index });                  // Log click
            this.updateMainImage(index);                               // Update image
            this.resetAutoplay();                                      // Reset autoplay
        }
    }

    handleMouseEnter() {
        // Pause on hover when modal is closed
        if (!this.isModalOpen()) this.stopAutoplay();                // Stop autoplay
    }

    handleMouseLeave() {
        // Resume on mouse leave when allowed
        if (this.autoplay && !this.isModalOpen()) this.startAutoplay(); // Start autoplay
    }

    handleTouchStart(e) { this.touchStartX = e.changedTouches[0].screenX; } // Save start X
    handleTouchEnd(e) { this.touchEndX = e.changedTouches[0].screenX; this.handleGesture(); } // Save end X and gesture

    handleGesture() {
        // Simple horizontal swipe detection
        const deltaX = this.touchEndX - this.touchStartX;            // Compute delta
        if (Math.abs(deltaX) > 50) {                                 // Threshold
            if (deltaX > 0) this.prevImage(); else this.nextImage();   // Prev or next
            this.resetAutoplay();                                      // Reset autoplay
        }
    }

    handleKeyDown(e) {
        // Keyboard navigation inside carousel
        switch (e.key) {
            case 'ArrowLeft':
                this.prevImage(); this.resetAutoplay(); break;           // Left arrow
            case 'ArrowRight':
                this.nextImage(); this.resetAutoplay(); break;           // Right arrow
            case 'Escape':
                if (this.isModalOpen()) this.closeModal();               // Close modal
                break;
            default: break;
        }
    }

    /* ===== Modal Controls ===== */
    openModal() {
        // Show modal and wire events
        const modal = document.getElementById('image-modal');        // Get modal
        const modalImg = document.getElementById('modal-image');     // Modal image
        const captionText = document.getElementById('modal-caption');// Modal caption

        modal.style.display = 'block';                               // Make modal visible
        modal.setAttribute('aria-hidden', 'false');                  // Update aria
        modalImg.src = this.mainImage.src;                           // Set image src
        modalImg.alt = this.mainImage.alt;                           // Set image alt
        captionText.innerHTML = this.mainImage.alt || `Carousel Image ${this.currentIndex + 1}`; // Set caption
        document.body.style.overflow = 'hidden';                     // Prevent body scroll
        logEvent("Modal opened", { index: this.currentIndex });      // Log open

        const closeBtn = modal.querySelector('.modal-close');        // Close button
        const modalPrev = modal.querySelector('.modal-left');        // Modal left arrow
        const modalNext = modal.querySelector('.modal-right');       // Modal right arrow

        closeBtn.addEventListener('click', this.closeModal);         // Bind close click
        modal.addEventListener('click', this.handleModalClick);      // Close on backdrop
        modalPrev.addEventListener('click', this.handleModalPrev);   // Prev handler
        modalNext.addEventListener('click', this.handleModalNext);   // Next handler
        document.addEventListener('keydown', this.handleModalKeyDown);// Key handlers

        // Pause autoplay and remember state
        if (this.autoplay) { this.isAutoplayActive = true; this.stopAutoplay(); } else { this.isAutoplayActive = false; }
    }

    closeModal() {
        // Hide modal and clean up
        const modal = document.getElementById('image-modal');        // Get modal
        modal.style.display = 'none';                                // Hide modal
        modal.setAttribute('aria-hidden', 'true');                   // Update aria
        document.body.style.overflow = '';                           // Restore scroll
        logEvent("Modal closed");                                    // Log close

        const closeBtn = modal.querySelector('.modal-close');        // Close button
        const modalPrev = modal.querySelector('.modal-left');        // Modal left arrow
        const modalNext = modal.querySelector('.modal-right');       // Modal right arrow

        closeBtn.removeEventListener('click', this.closeModal);      // Unbind close click
        modal.removeEventListener('click', this.handleModalClick);   // Unbind backdrop
        modalPrev.removeEventListener('click', this.handleModalPrev);// Unbind prev
        modalNext.removeEventListener('click', this.handleModalNext);// Unbind next
        document.removeEventListener('keydown', this.handleModalKeyDown); // Unbind keys

        // Resume autoplay if it was active before opening modal
        if (this.autoplay && this.isAutoplayActive) this.startAutoplay(); // Restart autoplay
    }

    handleModalClick(e) {
        // Close when clicking backdrop only
        const modalImg = document.getElementById('modal-image');     // Modal image
        if (e.target === modalImg) return;                           // Ignore clicks on image
        this.closeModal();                                           // Close otherwise
    }

    handleModalPrev(e) {
        // Navigate previous inside modal
        e.stopPropagation();                                         // Prevent bubbling
        logEvent("Modal left arrow clicked");                        // Log click
        this.prevImage();                                            // Go previous
    }

    handleModalNext(e) {
        // Navigate next inside modal
        e.stopPropagation();                                         // Prevent bubbling
        logEvent("Modal right arrow clicked");                       // Log click
        this.nextImage();                                            // Go next
    }

    handleModalKeyDown(e) {
        // Keyboard navigation while modal open
        const modal = document.getElementById('image-modal');        // Get modal
        if (!modal || modal.style.display !== 'block') return;       // If not open, skip
        switch (e.key) {
            case 'ArrowLeft': this.handleModalPrev(e); break;          // Left key
            case 'ArrowRight': this.handleModalNext(e); break;         // Right key
            case 'Escape': this.closeModal(); break;                   // Escape key
            default: break;
        }
    }

    updateModalImage() {
        // Sync modal image with current index
        const modalImg = document.getElementById('modal-image');     // Modal image
        const captionText = document.getElementById('modal-caption');// Caption
        modalImg.src = this.images[this.currentIndex];               // Set image src
        modalImg.alt = `Carousel Image ${this.currentIndex + 1}`;    // Set image alt
        captionText.innerHTML = `Carousel Image ${this.currentIndex + 1}`; // Set caption
    }
}

/* ===== Bootstrapping ===== */
document.addEventListener('DOMContentLoaded', () => {
    // Find all carousels and instantiate
    const carousels = document.querySelectorAll('.carousel');      // All carousel roots
    carousels.forEach(el => { new Carousel(el); });                // Create a Carousel for each
    logEvent("All carousels initialized", { count: carousels.length }); // Log count
});
