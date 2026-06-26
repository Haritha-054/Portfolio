/**
 * Avatar Guide System
 * Immersive Portfolio persistent avatar character with GSAP & ScrollTrigger.
 */

let currentPose = 'idle';
let bubbleTimeout = null;
let idleTimer = null;
let hasLanded = false;
let activeSectionState = 'idle';
let activeSectionText = "Welcome to my world. Scroll down — I'll show you around 👇";

const poseMap = {
  idle: './avatar-idle.png',
  point: './avatar-point.png',
  wave: './avatar-wave.png',
  celebrate: './avatar-celebrate.png',
  fold: './avatar-fold.png'
};

// Injects the avatar container and speech bubble into the DOM
function initAvatar() {
  // Prevent duplicate initialization
  if (document.getElementById('avatar-container')) return;

  const container = document.createElement('div');
  container.id = 'avatar-container';
  
  const bubble = document.createElement('div');
  bubble.id = 'speech-bubble';
  bubble.textContent = "Welcome to my world. Scroll down — I'll show you around 👇";
  
  const img = document.createElement('img');
  img.id = 'avatar-img';
  img.className = 'pose-idle';
  img.src = './avatar-idle.png';
  img.alt = 'Avatar Guide';
  
  container.appendChild(bubble);
  container.appendChild(img);
  document.body.appendChild(container);
  
  // Inject styling directly
  const style = document.createElement('style');
  style.textContent = `
    #avatar-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      left: auto;
      z-index: 1000;
      width: 240px;
      height: auto;
      pointer-events: none;
    }
    #avatar-img {
      width: 240px;
      height: auto;
      display: block;
      filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.5));
      transition: opacity 0.3s ease;
      will-change: transform, opacity;
      opacity: 0;
    }
    #avatar-img.breathing {
      animation: breathe 3s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      50% { transform: translateY(-4px) scaleY(1.01); }
    }
    #speech-bubble {
      position: absolute;
      bottom: 255px;
      right: 10px;
      left: auto;
      background: rgba(0,0,0,0.85);
      border: 1px solid #FFD700;
      border-radius: 12px 12px 0px 12px;
      padding: 10px 14px;
      color: #F5F5F5;
      font-family: Inter, sans-serif;
      font-size: 13px;
      max-width: 200px;
      box-shadow: 0 0 16px rgba(255,215,0,0.2);
      opacity: 0;
      transform: scale(0.8);
      transform-origin: bottom right;
      line-height: 1.4;
      z-index: 1001;
      pointer-events: none;
    }
    #speech-bubble::before {
      content: '';
      position: absolute;
      right: 0;
      bottom: -7px;
      width: 0;
      height: 0;
      border-right: 0px solid transparent;
      border-left: 10px solid transparent;
      border-top: 8px solid #FFD700;
    }
    #speech-bubble::after {
      content: '';
      position: absolute;
      right: 1px;
      bottom: -6px;
      width: 0;
      height: 0;
      border-right: 0px solid transparent;
      border-left: 9px solid transparent;
      border-top: 7px solid rgba(0, 0, 0, 0.85);
    }
    @media (max-width: 768px) {
      #avatar-container {
        bottom: 10px !important;
        right: 10px !important;
        left: auto !important;
        width: 120px !important;
      }
      #avatar-img {
        width: 120px !important;
      }
      #speech-bubble {
        max-width: 150px !important;
        font-size: 11px !important;
        bottom: 125px !important;
        right: 5px !important;
        left: auto !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Set initial coordinates matching portrait waist location
  gsap.set(img, { opacity: 0, x: -180, y: -350, scale: 0.6, rotation: -20 });
  gsap.set(bubble, { opacity: 0, scale: 0.8 });

  // Set up ScrollTrigger bindings
  setupScrollTriggers(img, bubble);
}

function startFoldTimer(currentState) {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  // Welcome page / idle triggers has a 30s gap, other scroll pages have a 15s gap
  const delay = (currentState === 'idle') ? 30000 : 15000;

  idleTimer = setTimeout(() => {
    const img = document.getElementById('avatar-img');
    if (!img) return;

    img.className = 'pose-fold breathing';
    gsap.to(img, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        img.src = poseMap.fold;
        currentPose = 'fold';
        gsap.to(img, {
          opacity: 1,
          duration: 0.2
        });
      }
    });
  }, delay);
}

function restoreActiveState() {
  const img = document.getElementById('avatar-img');
  const bubble = document.getElementById('speech-bubble');
  const targetSrc = poseMap[activeSectionState];
  
  if (!img || !targetSrc) return;

  img.className = 'pose-' + activeSectionState;
  
  gsap.to(img, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      img.src = targetSrc;
      currentPose = activeSectionState;
      gsap.to(img, {
        opacity: 1,
        duration: 0.2,
        onComplete: () => {
          if (activeSectionState === 'idle') {
            img.classList.add('breathing');
          }
          startFoldTimer(activeSectionState);
        }
      });
    }
  });

  if (activeSectionText && bubble) {
    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubble.textContent = activeSectionText;
    
    gsap.killTweensOf(bubble);
    gsap.to(bubble, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    bubbleTimeout = setTimeout(() => {
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in'
      });
    }, 3500);
  }
}

function handleScroll() {
  if (!hasLanded) return;

  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  if (currentPose === 'fold') {
    restoreActiveState();
  } else {
    startFoldTimer(activeSectionState);
  }
}

function setAvatarState(state, bubbleText) {
  const img = document.getElementById('avatar-img');
  const bubble = document.getElementById('speech-bubble');
  const targetSrc = poseMap[state];
  
  if (!img || !targetSrc) return;
  
  activeSectionState = state;
  activeSectionText = bubbleText;

  // Clear any fold timer
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  // Set pose class
  img.className = 'pose-' + state;
  
  // Fade out, change, fade in
  if (currentPose !== state) {
    gsap.to(img, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        img.src = targetSrc;
        currentPose = state;
        gsap.to(img, {
          opacity: 1,
          duration: 0.2,
          onComplete: () => {
            if (state === 'idle') {
              img.classList.add('breathing');
            }
            startFoldTimer(state);
          }
        });
      }
    });
  } else {
    if (state === 'idle') {
      img.classList.add('breathing');
    }
    startFoldTimer(state);
  }
  
  // Bubble presentation
  if (bubbleText && bubble && hasLanded) {
    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubble.textContent = bubbleText;
    
    gsap.killTweensOf(bubble);
    gsap.to(bubble, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    bubbleTimeout = setTimeout(() => {
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in'
      });
    }, 3500);
  }
}

function triggerLanding(img, bubble) {
  if (hasLanded) return;
  hasLanded = true;
  img.classList.remove('breathing');
  currentPose = 'idle';
  activeSectionState = 'idle';
  activeSectionText = "Welcome to my world. Scroll down — I'll show you around 👇";

  if (idleTimer) clearTimeout(idleTimer);
  gsap.killTweensOf([img, bubble]);

  const tl = gsap.timeline();

  // 1. Fall out from the hero image coordinates down to the bottom-right pinned destination
  tl.fromTo(img,
    {
      opacity: 0,
      x: -180,
      y: -350,
      scale: 0.6,
      rotation: -20
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: 'power2.in'
    }
  );

  // 2. Squash on initial impact
  tl.to(img, {
    y: 0,
    scaleY: 0.8,
    scaleX: 1.15,
    duration: 0.1,
    ease: 'power1.out'
  });

  // 3. Bounce up slightly with vertical stretch
  tl.to(img, {
    y: -18,
    scaleY: 1.08,
    scaleX: 0.93,
    duration: 0.14,
    ease: 'power1.inOut'
  });

  // 4. Land back and squash again (smaller impact)
  tl.to(img, {
    y: 0,
    scaleY: 0.9,
    scaleX: 1.08,
    duration: 0.12,
    ease: 'power1.in'
  });

  // 5. Settle elastically back to idle
  tl.to(img, {
    y: 0,
    scaleY: 1,
    scaleX: 1,
    duration: 0.2,
    ease: 'elastic.out(1, 0.4)',
    onComplete: () => {
      img.classList.add('breathing');
      startFoldTimer('idle'); // schedule initial 30s fold countdown
    }
  });

  // 6. delayed speech bubble appearance
  tl.to(bubble, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, '+=0.6');

  if (bubbleTimeout) clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => {
    gsap.to(bubble, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    });
  }, 5200);
}

function resetAvatar(img, bubble) {
  if (!hasLanded) return;
  hasLanded = false;
  img.classList.remove('breathing');
  currentPose = 'idle';
  activeSectionState = 'idle';
  activeSectionText = "Welcome to my world. Scroll down — I'll show you around 👇";

  if (idleTimer) clearTimeout(idleTimer);
  gsap.killTweensOf([img, bubble]);

  // Smoothly retract back into the hero portrait location and fade
  gsap.to(img, {
    opacity: 0,
    x: -180,
    y: -350,
    scale: 0.6,
    rotation: -20,
    duration: 0.45,
    ease: 'power2.out',
    onComplete: () => {
      img.src = poseMap.idle;
      img.className = 'pose-idle';
    }
  });

  gsap.to(bubble, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: 'power2.in'
  });
}

function setupScrollTriggers(img, bubble) {
  if (!window.ScrollTrigger) return;

  window.addEventListener('scroll', handleScroll);

  // 1. Detection trigger for entering Scene 2 (scrolling down, when s1 has scrolled 95% up)
  ScrollTrigger.create({
    trigger: '#s1',
    start: 'bottom 5%',
    onEnter: () => triggerLanding(img, bubble),
  });

  // 2. Detection trigger for scrolling back to top (when s1 is less than 95% scrolled up)
  ScrollTrigger.create({
    trigger: '#s1',
    start: 'bottom 5%',
    onLeaveBack: () => resetAvatar(img, bubble),
  });

  // 3. Trigger mappings for avatar state modifications on each section
  const triggers = [
    { id: '#scene-2', state: 'idle', text: "Welcome to my world. Scroll down 👇" },
    { id: '#scene-3', state: 'point', text: "This is where it all started →" },
    { id: '#scene-4', state: 'celebrate', text: "Pressure? That's my environment 🏆" },
    { id: '#scene-5', state: 'point', text: "Here's my toolkit →" },
    { id: '#scene-6', state: 'point', text: "Real products. Real impact 🔥" },
    { id: '#scene-7', state: 'point', text: "Watch the data flow →" },
    { id: '#scene-8', state: 'wave', text: "That's my story. Let's build yours 😄" }
  ];
  
  triggers.forEach(t => {
    const el = document.querySelector(t.id);
    if (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setAvatarState(t.state, t.text),
        onEnterBack: () => setAvatarState(t.state, t.text)
      });
    }
  });
}

// Automatically initialize when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) {
    initAvatar();
  } else {
    console.warn("Avatar Guide: GSAP is required for this system to run.");
  }
});
