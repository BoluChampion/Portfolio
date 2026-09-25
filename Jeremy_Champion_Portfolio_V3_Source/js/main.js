(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const veil = document.querySelector('.transition-veil');
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const revealTargets = document.querySelectorAll(
    '.section-heading, .project-card, .case-intro, .case-statement, .motion-layout, .film-strip, .about-grid, .contact > *'
  );
  const imageTargets = document.querySelectorAll('.deck-strip, .full-bleed, .photo-grid, .portrait-grid');

  revealTargets.forEach(el => el.classList.add('reveal'));
  imageTargets.forEach(el => el.classList.add('image-reveal'));

  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('animations-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .image-reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .image-reveal').forEach(el => el.classList.add('is-visible'));
  }

  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    if (header) header.classList.toggle('compact', scrollY > 55);

    let current = 'work';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= innerHeight * .42) current = section.id;
    }
    navLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const grouped = id === 'work' && ['work','asos','nz','portrait-studies','pleaser','train'].includes(current);
      link.classList.toggle('active', id === current || grouped);
    });
  }

  addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {

        const href = anchor.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (!target || reduced) return;
      event.preventDefault();
      veil?.classList.add('flash');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        requestAnimationFrame(() => veil?.classList.remove('flash'));
      }, 240);
    });
  });

  if (!reduced) {
    const heroVisual = document.querySelector('.hero-visual');
    const heroImage = document.querySelector('.hero-image-wrap img');
    if (heroVisual && heroImage) {
      heroVisual.addEventListener('pointermove', (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        heroImage.style.transform = `scale(1.035) translate(${x * 8}px, ${y * 8}px)`;
      });
      heroVisual.addEventListener('pointerleave', () => {
        heroImage.style.transform = '';
      });
    }
  }
})();
const videoTriggers = document.querySelectorAll('.film-card, .motion-screen');

const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoModalPlayer');
const videoTitle = document.getElementById('videoModalTitle');

const closeButton = document.querySelector('.video-modal-close');
const modalBackdrop = document.querySelector('.video-modal-backdrop');

videoTriggers.forEach(trigger => {

    trigger.addEventListener('click', function(event) {

        event.preventDefault();

        const youtubeId = this.dataset.youtube;
        const title = this.dataset.title;

        videoPlayer.src =
            `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

        videoTitle.textContent = title;

        videoModal.classList.add('active');

        document.body.style.overflow = 'hidden';

    });

});
function closeVideoModal() {

    videoModal.classList.remove('active');

    videoPlayer.src = '';

    document.body.style.overflow = '';

}
closeButton.addEventListener('click', closeVideoModal);

modalBackdrop.addEventListener('click', closeVideoModal);
document.addEventListener('keydown', function(event) {

    if (event.key === 'Escape') {
        closeVideoModal();
    }

});
const galleryImages = document.querySelectorAll('.gallery-image');

const galleryModal = document.getElementById('galleryModal');
const galleryMainImage = document.getElementById('galleryMainImage');
const galleryCounter = document.getElementById('galleryCounter');

const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryClose = document.querySelector('.gallery-close');
const galleryBackdrop = document.querySelector('.gallery-backdrop');

let currentGallery = [];
let currentGalleryIndex = 0;
galleryImages.forEach(image => {

    image.addEventListener('click', function() {

        const galleryName = this.dataset.gallery;

        currentGallery = Array.from(
            document.querySelectorAll(
                `.gallery-image[data-gallery="${galleryName}"]`
            )
        );

        currentGalleryIndex = currentGallery.indexOf(this);

        openGallery();

    });

});
function updateGalleryImage() {

    const image = currentGallery[currentGalleryIndex];

    galleryMainImage.src = image.src;
    galleryMainImage.alt = image.alt;

    galleryCounter.textContent =
        `${currentGalleryIndex + 1} / ${currentGallery.length}`;

}
function openGallery() {

    updateGalleryImage();

    galleryModal.classList.add('active');

    document.body.style.overflow = 'hidden';

}
galleryNext.addEventListener('click', function() {

    currentGalleryIndex++;

    if (currentGalleryIndex >= currentGallery.length) {
        currentGalleryIndex = 0;
    }

    updateGalleryImage();

});
galleryPrev.addEventListener('click', function() {

    currentGalleryIndex--;

    if (currentGalleryIndex < 0) {
        currentGalleryIndex = currentGallery.length - 1;
    }

    updateGalleryImage();

});
function closeGallery() {

    galleryModal.classList.remove('active');

    document.body.style.overflow = '';

}
galleryClose.addEventListener('click', closeGallery);

galleryBackdrop.addEventListener('click', closeGallery);
document.addEventListener('keydown', function(event) {

    if (!galleryModal.classList.contains('active')) {
        return;
    }

    if (event.key === 'Escape') {
        closeGallery();
    }

    if (event.key === 'ArrowRight') {
        galleryNext.click();
    }

    if (event.key === 'ArrowLeft') {
        galleryPrev.click();
    }

});