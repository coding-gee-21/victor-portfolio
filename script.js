/**
 * Victor Nyaga - Engineering Portfolio Scripts
 * Features: Dynamic Lightbox, Top-Left Sidebar Navigation, 3-Phase Calculator, Metrics Counter
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. TOP-LEFT SIDEBAR NAVIGATION TOGGLE
  // ==========================================
  const navToggle = document.getElementById('drawer-toggle');
  const navMenu = document.getElementById('navMenu');

  // Create backdrop overlay for the sidebar drawer if it doesn't exist
  let navBackdrop = document.querySelector('.sidebar-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'sidebar-backdrop';
    document.body.appendChild(navBackdrop);
  }

  const openSidebar = () => {
    if (navToggle) navToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeSidebar = () => {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu && navMenu.classList.contains('active');
      if (isActive) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Close sidebar when clicking backdrop overlay
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking any navigation link
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }


  // ==========================================
  // 2. DYNAMIC PHOTO LIGHTBOX (PHOTO MAXIMIZER)
  // ==========================================
  // Automatically inject Lightbox Modal markup if not present in DOM
  let lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) {
    lightboxModal = document.createElement('div');
    lightboxModal.id = 'lightboxModal';
    lightboxModal.className = 'lightbox-overlay';
    lightboxModal.setAttribute('role', 'dialog');
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxModal.innerHTML = `
      <span class="lightbox-close" aria-label="Close maximized view">&times;</span>
      <div class="lightbox-container">
        <img id="lightboxImg" src="" alt="Maximized image view" />
        <div id="lightboxCaption" class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightboxModal);
  }

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = lightboxModal.querySelector('.lightbox-close');

  const openLightbox = (imageSrc, captionText) => {
    if (lightboxImg) lightboxImg.src = imageSrc;
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  // Attach event listeners to all triggers
  const attachLightboxTriggers = () => {
    const triggers = document.querySelectorAll('.lightbox-trigger, .spenza-gallery img');
    triggers.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const caption = img.getAttribute('data-caption') || img.alt || 'Field Photo View';
        openLightbox(img.src, caption);
      });
    });
  };

  attachLightboxTriggers();

  // Close event handlers
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });


  // ==========================================
  // 3. GLOBAL KEYBOARD ACCESSIBILITY (ESC KEY)
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
      if (navMenu && navMenu.classList.contains('active')) {
        closeSidebar();
      }
    }
  });


  // ==========================================
  // 4. 3-PHASE MOTOR & CABLE SIZING CALCULATOR
  // ==========================================
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const kw = parseFloat(document.getElementById('motorKw')?.value) || 0;
      const pf = parseFloat(document.getElementById('powerFactor')?.value) || 0.85;
      const eff = parseFloat(document.getElementById('efficiency')?.value) || 0.90;
      const voltage = 415;

      if (kw <= 0) {
        alert('Please enter a valid motor power rating (kW).');
        return;
      }

      // Calculation: I_FLC = P / (sqrt(3) * V * PF * eff)
      const powerWatts = kw * 1000;
      const current = powerWatts / (Math.sqrt(3) * voltage * pf * eff);
      const olrMax = current * 1.10;

      // Recommended minimum grounding cable sizing (mm²)
      let earthSize = "6 mm²";
      if (current > 100) {
        earthSize = "35 mm²";
      } else if (current > 60) {
        earthSize = "16 mm²";
      } else if (current > 30) {
        earthSize = "10 mm²";
      }

      const resCurrent = document.getElementById('resCurrent');
      const resOlr = document.getElementById('resOlr');
      const resEarth = document.getElementById('resEarth');

      if (resCurrent) resCurrent.innerText = `${current.toFixed(1)} A`;
      if (resOlr) resOlr.innerText = `${current.toFixed(1)} A - ${olrMax.toFixed(1)} A`;
      if (resEarth) resEarth.innerText = earthSize;
    });
  }


  // ==========================================
  // 5. ANIMATED INDUSTRIAL METRICS COUNTER
  // ==========================================
  const metricNums = document.querySelectorAll('.metric-num');
  const metricsSection = document.getElementById('metrics');
  let metricsAnimated = false;

  if (metricsSection && metricNums.length > 0) {
    const animateMetrics = () => {
      metricNums.forEach(num => {
        const target = +num.getAttribute('data-target');
        if (!target) return;
        
        const duration = 1600; // Time in ms
        const frameRate = 60;
        const totalFrames = Math.round((duration / 1000) * frameRate);
        const increment = target / totalFrames;
        let current = 0;
        let frame = 0;

        const counterInterval = setInterval(() => {
          frame++;
          current += increment;
          if (frame >= totalFrames) {
            num.innerText = target;
            clearInterval(counterInterval);
          } else {
            num.innerText = Math.ceil(current);
          }
        }, 1000 / frameRate);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateMetrics();
      }
    }, { threshold: 0.3 });

    observer.observe(metricsSection);
  }

});