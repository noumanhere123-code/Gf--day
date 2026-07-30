document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     PASSWORD LOCK SCREEN
     ============================================ */
  const LOCK_PASSWORD = 'onlyyours';
  const lockScreen = document.getElementById('lock-screen');
  const lockForm = document.getElementById('lock-form');
  const passwordInput = document.getElementById('password-input');
  const lockError = document.getElementById('lock-error');
  const lockCard = document.querySelector('.lock-card');

  function unlockSite() {
    lockScreen.classList.add('unlocked');
    setTimeout(() => {
      lockScreen.style.display = 'none';
      document.body.classList.remove('is-locked');
      startExperience();
    }, 900);
  }

  function showWrongPassword() {
    lockError.classList.add('show');
    lockCard.classList.remove('shake');
    // force reflow so the shake animation can replay
    void lockCard.offsetWidth;
    lockCard.classList.add('shake');
    passwordInput.value = '';
    passwordInput.focus();
  }

  lockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();
    if (entered === LOCK_PASSWORD) {
      lockError.classList.remove('show');
      unlockSite();
    } else {
      showWrongPassword();
    }
  });

  /* ============================================
     LOADING SCREEN + WELCOME REVEAL
     (only starts once the correct password unlocks the site)
     ============================================ */
  const loader = document.getElementById('loader');

  function startExperience() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1200);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('hidden'), 3500);
    setTimeout(typeWriter, 1600);
  }

  /* ============================================
     TYPEWRITER ANIMATION
     ============================================ */
  const typewriterEl = document.getElementById('typewriter-text');
  const fullText = "For Barira ❤️";
  let twIndex = 0;

  function typeWriter() {
    if (twIndex <= fullText.length) {
      typewriterEl.textContent = fullText.slice(0, twIndex);
      twIndex++;
      setTimeout(typeWriter, 65);
    }
  }

  /* ============================================
     ENTER BUTTON -> SCROLL TO NEXT PAGE
     ============================================ */
  const enterBtn = document.getElementById('enter-btn');
  enterBtn.addEventListener('click', () => {
    document.getElementById('page-header').scrollIntoView({ behavior: 'smooth' });
  });

  /* ============================================
     FLOATING HEARTS
     ============================================ */
  const heartsContainer = document.getElementById('floating-hearts');
  const heartSymbols = ['❤', '💗', '💕', '💖'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    const size = 14 + Math.random() * 22;
    const startX = Math.random() * 100;
    const duration = 8 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 160;

    heart.style.left = startX + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.setProperty('--drift', drift + 'px');
    heart.style.animationDuration = duration + 's';

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000 + 200);
  }

  // Spawn hearts continuously at a gentle rate
  setInterval(spawnHeart, 900);
  for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 300);

  /* ============================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================
     SCROLL PROGRESS BAR
     ============================================ */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ============================================
     MUSIC PLAY / PAUSE
     ============================================ */
  const musicBtn = document.getElementById('music-toggle');
  const musicIcon = musicBtn.querySelector('.music-icon');
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIcon.textContent = '♪';
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {
        // Autoplay restrictions or missing file — fail silently
      });
      musicIcon.textContent = '❚❚';
      musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  /* ============================================
     COUNTDOWN — 20 DAYS LEFT
     ============================================ */
  const countdownEl = document.getElementById('countdown-number');
  const TOTAL_DAYS = 20;
  const COUNTDOWN_KEY = 'gfday-countdown-start';

  let startDate = localStorage.getItem(COUNTDOWN_KEY);
  if (!startDate) {
    startDate = Date.now().toString();
    localStorage.setItem(COUNTDOWN_KEY, startDate);
  }

  function getDaysLeft() {
    const elapsedMs = Date.now() - parseInt(startDate, 10);
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const remaining = TOTAL_DAYS - elapsedDays;
    return remaining > 0 ? remaining : 0;
  }

  function renderCountdown() {
    countdownEl.textContent = getDaysLeft();
  }
  renderCountdown();

  /* ============================================
     CONFETTI
     ============================================ */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#ff8fab', '#ff5d8f', '#e94f7c', '#ffd0e0', '#ffffff', '#c93866'];

  function createConfettiPiece() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 6 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    };
  }

  function launchConfetti(count = 140) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(createConfettiPiece());
    }
    if (!confettiAnimId) {
      animateConfetti();
    }
    // Stop adding new frames after pieces clear naturally
    setTimeout(() => {
      confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 40);
    }, 6000);
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 40);

    if (confettiPieces.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimId = null;
    }
  }

  const confettiBtn = document.getElementById('confetti-btn');
  confettiBtn.addEventListener('click', () => launchConfetti(160));

  const finalHeart = document.getElementById('final-heart');
  finalHeart.addEventListener('click', () => launchConfetti(80));

  // Auto celebrate a little when the final page comes into view
  const finalPage = document.getElementById('page-final');
  let hasCelebrated = false;
  const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCelebrated) {
        hasCelebrated = true;
        launchConfetti(120);
      }
    });
  }, { threshold: 0.4 });
  finalObserver.observe(finalPage);

});
