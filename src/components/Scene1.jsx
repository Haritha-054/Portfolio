import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import harithaPortrait from '../assets/haritha_portrait.png';

const Scene1 = ({ onComplete }) => {
  const portraitRef = useRef(null);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    // Master timeline for Scene 1 reveal sequence
    const tl = gsap.timeline();

    // Reset initial text line states before tweening to prevent flashes
    gsap.set(['#ct0', '#ct1', '#ct2', '#ct3', '#ct-rule', '#ct4', '#ct5', '#ct6'], {
      y: 40,
      opacity: 0,
      filter: 'blur(10px)'
    });
    gsap.set('#ct-rule', { width: 0 });
    gsap.set('#scroll-ind', { opacity: 0 });

    // 1. Reveal Portrait image first
    // opacity: 0 -> 1, scale: 1.08 -> 1, translateX: 80px -> 0, duration: 1.8s, ease: power4.out
    tl.fromTo(portraitRef.current,
      { opacity: 0, scale: 1.08, x: 80 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.8,
        ease: 'power4.out',
        onComplete: () => setRevealComplete(true)
      },
      0.1
    );

    // Animate background zoom in sync
    tl.to('#s1-photo', {
      opacity: 1,
      scale: 1,
      duration: 1.6,
      ease: 'power3.out'
    }, 0.1);

    tl.to('#s1-leak', {
      opacity: 0.7,
      duration: 1.2
    }, 0.2);

    // 2. Reveal hero content staggered (after portrait animation finishes / near the end of it)
    // y: 40px -> 0, opacity: 0 -> 1, blur: 10px -> 0, stagger: 0.15s
    tl.to(['#ct0', '#ct1', '#ct2', '#ct3', '#ct-rule', '#ct4', '#ct5', '#ct6'],
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.15
      },
      1.2 // Starts 1.2s into timeline (slightly overlapping with the 1.8s portrait reveal)
    );

    // Animate the rule width expansion in sync with its stagger position (index 4 of array)
    tl.to('#ct-rule', {
      width: '220px',
      duration: 1.1,
      ease: 'power2.out'
    }, 1.2 + 4 * 0.15);

    // Reveal scroll indicator
    tl.to('#scroll-ind', {
      opacity: 1,
      duration: 0.8
    }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, []);

  // Parallax cursor move tracking
  useEffect(() => {
    if (!revealComplete) return;

    const handleMouseMove = (e) => {
      if (!portraitRef.current) return;
      
      // Calculate normalized coordinates (-0.5 to 0.5)
      const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      // Subtle parallax movement offsets
      const moveX = mouseX * 24;
      const moveY = mouseY * 18;

      gsap.to(portraitRef.current, {
        x: moveX,
        y: moveY,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [revealComplete]);

  return (
    <section id="s1" className="on">
      {/* Full bleed background photo */}
      <img
        src="/mnt/user-data/uploads/linkedin_profile_pic.jpeg"
        id="s1-photo"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          opacity: 0,
          transform: 'scale(1.08)',
          filter: 'brightness(.55) contrast(1.08) saturate(.85)',
          pointerEvents: 'none'
        }}
      />
      <div id="s1-overlay" />
      <div id="s1-vignette" />
      <div id="s1-leak" />

      {/* Cinematic Portrait Overlay (Subject cut-out on the right side) */}
      <img
        ref={portraitRef}
        src={harithaPortrait}
        id="haritha-portrait-main"
        alt="Haritha Reddy Portrait"
        style={{
          position: 'absolute',
          bottom: 0,
          right: '8%', // positioned off-center to the right
          height: '100vh',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom',
          zIndex: 4, // layered above vignette overlay (3), below hero text layers (5)
          pointerEvents: 'none',
          opacity: 0, // initially hidden for GSAP reveal
          filter: 'drop-shadow(0 0 12px rgba(201, 168, 76, 0.35)) drop-shadow(0 0 35px rgba(201, 168, 76, 0.15))',
          maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
          willChange: 'transform, opacity'
        }}
      />

      {/* Cinematic subtitle text */}
      <div id="s1-text">
        {/* Label */}
        <div
          id="ct0"
          className="cin-fade"
          style={{ marginBottom: '.8rem' }}
        >
          <span className="label-txt">⸻ &nbsp; Hyderabad, India &nbsp;·&nbsp; MVSR Engineering &nbsp; ⸻</span>
        </div>

        {/* Hi, I'm */}
        <div id="ct1" className="cin-line">
          <span className="cin-inner hi-txt">Hi, I'm</span>
        </div>

        {/* HARITHA */}
        <div id="ct2" className="cin-line">
          <span className="cin-inner name-txt">HARITHA</span>
        </div>

        {/* REDDY */}
        <div id="ct3" className="cin-line">
          <span
            className="cin-inner name-txt"
            style={{ color: 'var(--gold)', textShadow: '0 0 60px var(--glow)' }}
          >
            REDDY
          </span>
        </div>

        {/* Divider line */}
        <div id="ct-rule" className="cin-rule" />

        {/* Role */}
        <div id="ct4" className="cin-line">
          <span className="cin-inner role-txt">
            Full Stack Developer &amp; <span>AI Builder</span>
          </span>
        </div>

        {/* Description */}
        <div
          id="ct5"
          className="cin-fade"
          style={{ marginTop: '.6rem' }}
        >
          <p className="desc-txt">
            I build interfaces people love,<br />
            systems that think, and I've won hackathons doing it.
          </p>
        </div>

        {/* CTA buttons */}
        <div id="ct6" className="cin-fade cin-ctas">
          <button
            className="btn-p interactive"
            onClick={() => document.querySelector('#scene-6')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work →
          </button>
          <button
            className="btn-g interactive"
            onClick={() => document.querySelector('#scene-8')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div id="scroll-ind">
        <div className="s-line" />
        <span className="s-txt">Scroll</span>
      </div>
    </section>
  );
};

export default Scene1;
