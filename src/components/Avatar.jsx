import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import avatarIdle from '../assets/avatar-idle.png';
import avatarPoint from '../assets/avatar-point.png';
import avatarWave from '../assets/avatar-wave.png';
import avatarCelebrate from '../assets/avatar-celebrate.png';
import avatarFold from '../assets/avatar-fold.png';

gsap.registerPlugin(ScrollTrigger);

const Avatar = ({ active }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const bubbleRef = useRef(null);
  
  const [imgSrc, setImgSrc] = useState(avatarIdle);
  const [bubbleText, setBubbleText] = useState("Welcome to my world. Scroll down — I'll show you around 👇");
  const [isBreathing, setIsBreathing] = useState(false);
  const [pose, setPose] = useState('idle');

  const hasLandedRef = useRef(false);
  const bubbleTimeoutRef = useRef(null);
  const idleTimerRef = useRef(null);
  const spokenTextsRef = useRef(new Set());
  const breatheTweenRef = useRef(null);
  const activeUtteranceRef = useRef(null); // Ref to hold the active utterance and prevent garbage collection

  // Refs to avoid stale closures in event listeners
  const poseRef = useRef('idle');
  const activeSectionStateRef = useRef('idle');
  const activeSectionTextRef = useRef("Welcome to my world. Scroll down — I'll show you around 👇");
  const imgSrcRef = useRef(avatarIdle);

  const setAvatarImgSrc = (src) => {
    imgSrcRef.current = src;
    setImgSrc(src);
  };

  // Pose mapping helper
  const poseMap = {
    idle: avatarIdle,
    point: avatarPoint,
    wave: avatarWave,
    celebrate: avatarCelebrate,
    fold: avatarFold
  };

  // Timer to transition to arms folded pose and hide bubble (as fallback)
  const startFoldTimer = (currentState, isAlreadySpoken = false) => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    // If it was already spoken, we fold quickly (3.5 seconds) so the user sees the pose/bubble briefly then folds.
    // Otherwise, we fold after standard durations (idle: 30s, active pose: 15s) or speech end.
    const delayToFold = isAlreadySpoken ? 3500 : (currentState === 'idle' ? 30000 : 15000);

    idleTimerRef.current = setTimeout(() => {
      triggerFoldArms();
    }, delayToFold);
  };

  // Voice speech preloader
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
      };
    }
  }, []);

  // Gentle breathing animation driven by GSAP to prevent CSS keyframe override issues
  useEffect(() => {
    if (isBreathing && imgRef.current) {
      breatheTweenRef.current = gsap.to(imgRef.current, {
        y: -4,
        scaleY: 1.01,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
        overwrite: 'auto'
      });
    } else {
      if (breatheTweenRef.current) {
        breatheTweenRef.current.kill();
        breatheTweenRef.current = null;
      }
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          y: 0,
          scaleY: 1,
          duration: 0.4,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
    }
    return () => {
      if (breatheTweenRef.current) {
        breatheTweenRef.current.kill();
      }
    };
  }, [isBreathing]);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      startFoldTimer(poseRef.current);
      return;
    }

    // Cancel current speaking
    window.speechSynthesis.cancel();

    // Clean text of emojis and special characters for a clean vocal synthesis
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]|👇|→|🔥|✉️|📄|📥|💼|🐙|😄/g, '').trim();

    // Only read once per scene. If already read, fold quickly (3.5s)
    if (spokenTextsRef.current.has(cleanText)) {
      startFoldTimer(poseRef.current, true);
      return;
    }

    // Mark as read
    spokenTextsRef.current.add(cleanText);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    activeUtteranceRef.current = utterance; // Retain reference to prevent garbage collection bug (ensures onend fires)

    // Pick a sweet, soft female English voice with high priority keywords
    const voices = window.speechSynthesis.getVoices();
    const priorityKeywords = [
      'aria',         // Edge Natural Female
      'natasha',      // Edge Natural Female
      'sonia',        // Edge Natural Female
      'samantha',     // Apple Samantha
      'siri',         // Apple Siri
      'google us english', // Chrome Female
      'google uk english female',
      'zira',         // Windows Desktop Female
      'hazel',        // Windows UK Female
      'susan',        // Windows Female
      'female'        // Generic fallback female
    ];

    let voice = null;
    for (const keyword of priorityKeywords) {
      voice = voices.find(v => 
        v.lang.toLowerCase().includes('en') && 
        v.name.toLowerCase().includes(keyword)
      );
      if (voice) break;
    }
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().includes('en')) || voices[0];
    }
      
    if (voice) {
      utterance.voice = voice;
    }

    // Adjust rate and pitch to sound sweet, warm, soft, and realistic
    utterance.rate = 0.88;   // slightly slower rate for soft, sweet delivery
    utterance.pitch = 1.25;  // higher pitch for sweet, soft voice
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };

    utterance.onend = () => {
      // Transition to arms folded pose when speech completes
      triggerFoldArms();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      startFoldTimer(poseRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  const triggerFoldArms = () => {
    setPose('fold');
    poseRef.current = 'fold';
    setIsBreathing(false); // Pause breathing during state change transition

    if (imgRef.current) {
      if (imgSrcRef.current !== avatarFold) {
        setAvatarImgSrc(avatarFold);
        
        // Dynamic GSAP transition from the recent previous transform state
        gsap.killTweensOf(imgRef.current);
        const currentScale = gsap.getProperty(imgRef.current, "scale") || 1;
        
        gsap.timeline({
          onComplete: () => {
            setIsBreathing(true);
          }
        })
        .to(imgRef.current, {
          scale: currentScale * 0.92,
          duration: 0.12,
          ease: 'power1.out'
        })
        .to(imgRef.current, {
          scale: 1,
          duration: 0.28,
          ease: 'back.out(1.8)'
        });
      } else {
        setIsBreathing(true);
      }
    }

    // Hide speech bubble 2 seconds after arms are folded
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    bubbleTimeoutRef.current = setTimeout(() => {
      if (bubbleRef.current) {
        gsap.to(bubbleRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power2.in'
        });
      }
    }, 2000);
  };

  // State switcher function
  const setAvatarState = (state, text) => {
    const targetSrc = poseMap[state];
    if (!targetSrc) return;

    // Update active state refs
    activeSectionStateRef.current = state;
    activeSectionTextRef.current = text;

    // Clear idle arms-fold timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Set pose name
    setPose(state);
    poseRef.current = state;

    // Pause breathing animation smoothly during transition
    setIsBreathing(false);

    // 1. Image Switch Animation (Swap instantly and transition from current scale state)
    if (imgRef.current) {
      if (imgSrcRef.current !== targetSrc) {
        setAvatarImgSrc(targetSrc);
        
        gsap.killTweensOf(imgRef.current);
        const currentScale = gsap.getProperty(imgRef.current, "scale") || 1;
        
        gsap.timeline()
          .to(imgRef.current, {
            scale: currentScale * 0.92,
            duration: 0.12,
            ease: 'power1.out'
          })
          .to(imgRef.current, {
            scale: 1,
            duration: 0.28,
            ease: 'back.out(1.8)',
            onComplete: () => {
              if (state === 'idle') {
                setIsBreathing(true);
              }
              if (text) {
                speakText(text);
              } else {
                startFoldTimer(state);
              }
            }
          });
      } else {
        if (state === 'idle') {
          setIsBreathing(true);
        }
        if (text) {
          speakText(text);
        } else {
          startFoldTimer(state);
        }
      }
    }

    // 2. Speech Bubble System
    if (text && bubbleRef.current && hasLandedRef.current) {
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }

      setBubbleText(text);

      gsap.killTweensOf(bubbleRef.current);
      gsap.to(bubbleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Trigger Landing Sequence (detaches from hero portrait region)
  const triggerLanding = () => {
    if (hasLandedRef.current) return;
    hasLandedRef.current = true;
    setIsBreathing(false);
    poseRef.current = 'idle';
    activeSectionStateRef.current = 'idle';
    activeSectionTextRef.current = "Welcome to my world. Scroll down — I'll show you around 👇";

    // Clear any active timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    gsap.killTweensOf([imgRef.current, bubbleRef.current]);

    const tl = gsap.timeline();

    // 1. Fall out from the hero image coordinates down to the bottom-right pinned destination
    // Animates smoothly from its current mid-animation coordinates instead of hard resetting
    tl.to(imgRef.current,
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
    tl.to(imgRef.current, {
      y: 0,
      scaleY: 0.8,
      scaleX: 1.15,
      duration: 0.1,
      ease: 'power1.out'
    });

    // 3. Bounce up slightly with vertical stretch
    tl.to(imgRef.current, {
      y: -18,
      scaleY: 1.08,
      scaleX: 0.93,
      duration: 0.14,
      ease: 'power1.inOut'
    });

    // 4. Land back and squash again (smaller impact)
    tl.to(imgRef.current, {
      y: 0,
      scaleY: 0.9,
      scaleX: 1.08,
      duration: 0.12,
      ease: 'power1.in'
    });

    // 5. Settle elastically back to idle
    tl.to(imgRef.current, {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      duration: 0.2,
      ease: 'elastic.out(1, 0.4)',
      onComplete: () => {
        setIsBreathing(true);
      }
    });

    // 6. Delayed speech bubble appearance and welcome greeting read
    tl.to(bubbleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        speakText(activeSectionTextRef.current);
      }
    }, '+=0.6');
  };

  // Reset landing state on scroll back to top of Scene 1
  const resetAvatar = () => {
    if (!hasLandedRef.current) return;
    hasLandedRef.current = false;
    setIsBreathing(false);
    poseRef.current = 'idle';
    activeSectionStateRef.current = 'idle';
    activeSectionTextRef.current = "Welcome to my world. Scroll down — I'll show you around 👇";

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    gsap.killTweensOf([imgRef.current, bubbleRef.current]);
    
    // Smoothly retract back into the hero portrait location and fade
    gsap.to(imgRef.current, {
      opacity: 0,
      x: -180,
      y: -350,
      scale: 0.6,
      rotation: -20,
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => {
        // Reset src back to idle for next entrance
        setAvatarImgSrc(avatarIdle);
        setPose('idle');
      }
    });

    gsap.to(bubbleRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  // Scroll triggers setup
  useEffect(() => {
    if (!active) return;

    // Reset coordinates instantly
    gsap.set(imgRef.current, { opacity: 0, x: -180, y: -350, scale: 0.6, rotation: -20 });
    gsap.set(bubbleRef.current, { opacity: 0, scale: 0.8 });
    hasLandedRef.current = false;
    poseRef.current = 'idle';
    activeSectionStateRef.current = 'idle';
    activeSectionTextRef.current = "Welcome to my world. Scroll down — I'll show you around 👇";
    setIsBreathing(false);

    let scrollTriggers = [];

    const handleAvatarStateEvent = (e) => {
      if (e.detail && e.detail.state) {
        setAvatarState(e.detail.state, e.detail.text);
      }
    };
    window.addEventListener('set-avatar-state', handleAvatarStateEvent);

    const timer = setTimeout(() => {
      // 1. Detection trigger for entering Scene 2 (scrolling down, when s1 has scrolled 60% up)
      const landingTrigger = ScrollTrigger.create({
        trigger: '#s1',
        start: 'bottom 40%', // Fires when bottom of s1 is at 40% viewport (60% scrolled up)
        onEnter: () => triggerLanding(),
      });

      // 2. Detection trigger for scrolling back to top (when s1 is less than 60% scrolled up)
      const resetTrigger = ScrollTrigger.create({
        trigger: '#s1',
        start: 'bottom 40%',
        onLeaveBack: () => resetAvatar(),
      });

      // 3. Trigger mappings for avatar state modifications on each section
      const triggers = [
        { id: '#scene-2', start: 'top 40%', state: 'idle', text: "Welcome to my world. Scroll down — I'll show you around 👇" },
        { id: '#scene-3', start: 'top 50%', state: 'point', text: "This is where it all started →" },
        { id: '#scene-4', start: 'top 50%', state: 'celebrate', text: "Every achievement is a stepping stone." },
        { id: '#scene-5', start: 'top 50%', state: 'point', text: "Here's what I know and love →" },
        { id: '#scene-6', start: 'top 50%', state: 'point', text: "Real products. Real impact 🔥" },
        { id: '#scene-7', start: 'top 50%', state: 'point', text: "Watch this. Type your email. →" },
        { id: '#scene-8', start: 'top 50%', state: 'wave', text: "That's my story. Let's build yours 😄" }
      ];

      scrollTriggers.push(landingTrigger, resetTrigger);

      triggers.forEach(t => {
        const el = document.querySelector(t.id);
        if (el) {
          const trigger = ScrollTrigger.create({
            trigger: el,
            start: t.start || 'top 50%',
            end: 'bottom 50%',
            onEnter: () => {
              if (hasLandedRef.current && t.id !== '#scene-2') {
                setAvatarState(t.state, t.text);
              }
            },
            onEnterBack: () => {
              if (hasLandedRef.current) {
                setAvatarState(t.state, t.text);
              }
            },
          });
          scrollTriggers.push(trigger);
        }
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('set-avatar-state', handleAvatarStateEvent);
      scrollTriggers.forEach(st => st.kill());
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div id="avatar-container" ref={containerRef}>
      {/* Avatar character */}
      <img
        id="avatar-img"
        ref={imgRef}
        src={imgSrc}
        alt="Avatar Guide"
        className={`pose-${pose}`}
      />

      {/* Speech Bubble — floats above avatar head */}
      <div id="speech-bubble" ref={bubbleRef}>
        {bubbleText}
      </div>
    </div>
  );
};

export default Avatar;
