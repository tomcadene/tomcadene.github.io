class Carousel {
    constructor(element) {
        this.carousel = element;
        this.mainImage = this.carousel.querySelector('.carousel-image');
        this.leftNav = this.carousel.querySelector('.carousel-nav.left');
        this.rightNav = this.carousel.querySelector('.carousel-nav.right');
        this.thumbnails = Array.from(this.carousel.querySelectorAll('.carousel-thumb'));
        this.autoplay = this.carousel.dataset.autoplay === 'true';
        this.interval = parseInt(this.carousel.dataset.interval) || 5000;
        this.currentIndex = 0;
        this.timer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Extract image sources from thumbnails using data-full
        this.images = this.thumbnails.map(thumb => thumb.getAttribute('data-full'));

        // Flag to track autoplay state before opening modal
        this.isAutoplayActive = this.autoplay;

        // Bind methods to ensure correct 'this' context
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

        // Initialize Carousel
        this.init();
    }

    init() {
        // Set initial image based on the first thumbnail
        this.updateMainImage(this.currentIndex, false);

        // Event Listeners for navigation buttons
        this.leftNav.addEventListener('click', () => {
            this.prevImage();
            this.resetAutoplay();
        });
        this.rightNav.addEventListener('click', () => {
            this.nextImage();
            this.resetAutoplay();
        });

        // Event Listeners for thumbnails
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', this.handleThumbnailClick);
        });

        // Autoplay Setup
        if (this.autoplay) {
            this.startAutoplay();

            // Pause on hover
            this.carousel.addEventListener('mouseenter', this.handleMouseEnter);
            this.carousel.addEventListener('mouseleave', this.handleMouseLeave);
        }

        // Swipe Gestures
        this.carousel.addEventListener('touchstart', this.handleTouchStart, false);
        this.carousel.addEventListener('touchend', this.handleTouchEnd, false);

        // Accessibility: Keyboard Navigation
        this.carousel.setAttribute('tabindex', '0'); // Make carousel focusable
        this.carousel.addEventListener('keydown', this.handleKeyDown);

        // Click event to open modal
        this.mainImage.style.cursor = 'pointer'; // Indicate clickability
        this.mainImage.addEventListener('click', this.openModal);
    }

    /**
     * Helper method to check if the modal is currently open.
     * @returns {boolean} True if modal is open, false otherwise.
     */
    isModalOpen() {
        const modal = document.getElementById('image-modal');
        return modal.style.display === 'block';
    }

    updateMainImage(index, announce = true) {
        // Ensure index is within bounds
        if (index < 0) index = this.images.length - 1;
        if (index >= this.images.length) index = 0;

        this.mainImage.src = this.images[index];
        this.mainImage.alt = `Carousel Image ${index + 1}`;
        this.currentIndex = index;
        this.updateActiveThumbnail();

        if (announce) {
            // Announce the change for accessibility
            this.carousel.setAttribute('aria-live', 'polite');
        }

        // If modal is open, update the modal image as well
        const modal = document.getElementById('image-modal');
        if (modal.style.display === 'block') {
            this.updateModalImage();
        }
    }

    updateActiveThumbnail() {
        this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
        if (this.thumbnails[this.currentIndex]) {
            this.thumbnails[this.currentIndex].classList.add('active');
        }
    }

    prevImage() {
        this.updateMainImage(this.currentIndex - 1);
    }

    nextImage() {
        this.updateMainImage(this.currentIndex + 1);
    }

    startAutoplay() {
        // Prevent multiple intervals
        if (this.timer) return;

        this.timer = setInterval(() => {
            this.nextImage();
        }, this.interval);
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetAutoplay() {
        if (!this.autoplay) return;

        // **Modification Start**
        if (this.isModalOpen()) {
            // Do not reset autoplay if modal is open
            return;
        }
        // **Modification End**

        this.stopAutoplay();
        this.startAutoplay();
    }

    handleThumbnailClick(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!isNaN(index)) {
            this.updateMainImage(index);
            this.resetAutoplay();
        }
    }

    handleMouseEnter() {
        // If modal is not open, stop autoplay
        if (!this.isModalOpen()) {
            this.stopAutoplay();
        }
    }

    handleMouseLeave() {
        // If autoplay is active and modal is not open, start autoplay
        if (this.autoplay && !this.isModalOpen()) {
            this.startAutoplay();
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleGesture();
    }

    handleGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        if (Math.abs(deltaX) > 50) { // Threshold
            if (deltaX > 0) {
                this.prevImage();
            } else {
                this.nextImage();
            }
            this.resetAutoplay();
        }
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                this.prevImage();
                this.resetAutoplay();
                break;
            case 'ArrowRight':
                this.nextImage();
                this.resetAutoplay();
                break;
            case 'Escape':
                // If modal is open, close it
                if (this.isModalOpen()) {
                    this.closeModal();
                }
                break;
            default:
                break;
        }
    }

    // Modal Functionality

    openModal() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('modal-caption');

        modal.style.display = 'block';
        modalImg.src = this.mainImage.src;
        modalImg.alt = this.mainImage.alt;
        captionText.innerHTML = this.mainImage.alt || `Carousel Image ${this.currentIndex + 1}`;

        // Add event listeners for closing the modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', this.closeModal);
        modal.addEventListener('click', this.handleModalClick);

        // Add event listeners for modal navigation
        const modalPrev = modal.querySelector('.modal-left');
        const modalNext = modal.querySelector('.modal-right');
        modalPrev.addEventListener('click', this.handleModalPrev);
        modalNext.addEventListener('click', this.handleModalNext);

        // Add keyboard navigation within modal
        document.addEventListener('keydown', this.handleModalKeyDown);

        // Prevent body from scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Pause autoplay when modal opens
        if (this.autoplay) {
            // Update the autoplay state flag
            this.isAutoplayActive = true;
            this.stopAutoplay();
        } else {
            this.isAutoplayActive = false;
        }
    }

    closeModal() {
        const modal = document.getElementById('image-modal');
        modal.style.display = 'none';

        // Remove event listeners to prevent multiple bindings
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.removeEventListener('click', this.closeModal);
        modal.removeEventListener('click', this.handleModalClick);

        const modalPrev = modal.querySelector('.modal-left');
        const modalNext = modal.querySelector('.modal-right');
        modalPrev.removeEventListener('click', this.handleModalPrev);
        modalNext.removeEventListener('click', this.handleModalNext);

        // Remove keyboard navigation listener
        document.removeEventListener('keydown', this.handleModalKeyDown);

        // Restore body scrolling
        document.body.style.overflow = '';

        // Resume autoplay if it was active before opening the modal
        if (this.autoplay && this.isAutoplayActive) {
            this.startAutoplay();
        }
    }

    handleModalClick(e) {
        const modalContent = document.getElementById('modal-image');
        if (e.target === modalContent) {
            // Clicked on the image itself; do not close
            return;
        }
        this.closeModal();
    }

    handleModalPrev(e) {
        e.stopPropagation(); // Prevent event from bubbling to modal
        this.prevImage();
        // **Modification Start**
        // Do NOT reset autoplay when modal is open
        // this.resetAutoplay(); // Removed
        // **Modification End**
    }

    handleModalNext(e) {
        e.stopPropagation(); // Prevent event from bubbling to modal
        this.nextImage();
        // **Modification Start**
        // Do NOT reset autoplay when modal is open
        // this.resetAutoplay(); // Removed
        // **Modification End**
    }

    handleModalKeyDown(e) {
        const modal = document.getElementById('image-modal');
        if (modal.style.display !== 'block') return;

        switch (e.key) {
            case 'ArrowLeft':
                this.handleModalPrev(e);
                break;
            case 'ArrowRight':
                this.handleModalNext(e);
                break;
            case 'Escape':
                this.closeModal();
                break;
            default:
                break;
        }
    }

    updateModalImage() {
        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('modal-caption');
        modalImg.src = this.images[this.currentIndex];
        modalImg.alt = `Carousel Image ${this.currentIndex + 1}`;
        captionText.innerHTML = `Carousel Image ${this.currentIndex + 1}`;
    }
}

// Initialize all carousel instances on the page
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carouselElement => {
        new Carousel(carouselElement);
    });
});
