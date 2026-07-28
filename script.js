document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Motor & Cable Sizing Calculator ---
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const kw = parseFloat(document.getElementById('motorKw').value) || 0;
      const pf = parseFloat(document.getElementById('powerFactor').value) || 0.85;
      const eff = parseFloat(document.getElementById('efficiency').value) || 0.90;
      const voltage = 415;

      if (kw <= 0) return;

      const powerWatts = kw * 1000;
      const current = powerWatts / (Math.sqrt(3) * voltage * pf * eff);
      const olrMax = current * 1.1;

      let earthSize = "6 mm²";
      if (current > 100) earthSize = "35 mm²";
      else if (current > 60) earthSize = "16 mm²";
      else if (current > 30) earthSize = "10 mm²";

      document.getElementById('resCurrent').innerText = `${current.toFixed(1)} A`;
      document.getElementById('resOlr').innerText = `${current.toFixed(1)} A - ${olrMax.toFixed(1)} A`;
      document.getElementById('resEarth').innerText = earthSize;
    });
  }

  // --- 2. Animated Industrial Metrics Counter ---
  const metricNums = document.querySelectorAll('.metric-num');
  let metricsAnimated = false;

  const animateMetrics = () => {
    metricNums.forEach(num => {
      const target = +num.getAttribute('data-target');
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;

      const updateCount = () => {
        current += step;
        if (current < target) {
          num.innerText = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          num.innerText = target;
        }
      };
      updateCount();
    });
  };

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateMetrics();
      }
    }, { threshold: 0.4 });
    observer.observe(metricsSection);
  }

  // --- 3. Interactive Photo Lightbox ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxCaption.innerText = img.getAttribute('data-caption') || img.alt;
      lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // --- 4. Live Code Copy Button ---
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeId = btn.getAttribute('data-code');
      const codeElem = document.getElementById(codeId);
      if (codeElem) {
        navigator.clipboard.writeText(codeElem.innerText).then(() => {
          btn.innerText = "Copied!";
          setTimeout(() => btn.innerText = "Copy Code", 2000);
        });
      }
    });
  });

});