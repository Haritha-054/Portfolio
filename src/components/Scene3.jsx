import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Particle init function
function initParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.3,
    vy: -(Math.random() * 0.45 + 0.08),
    vx: (Math.random() - 0.5) * 0.18,
    a: Math.random() * 0.5 + 0.06,
    ph: Math.random() * Math.PI * 2,
    fr: Math.random() * 0.018 + 0.005,
  }));

  let t = 0, raf;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;
    pts.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      const tw = Math.sin(t * p.fr + p.ph) * 0.28 + 0.72;
      ctx.save();
      ctx.globalAlpha = p.a * tw;
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = 'rgba(255,215,0,0.7)';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
  window.addEventListener('resize', onResize);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
}

// Burst particles function
function burst(canvas, x, y, count = 40) {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, a: 1, r: Math.random() * 4 + 1 };
  });
  let frame;
  function drawBurst() {
    let active = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.a -= 0.02;
      if (p.a > 0) {
        active = true;
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 10; ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    if (active) {
      frame = requestAnimationFrame(drawBurst);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  drawBurst();
}

export default function Scene3() {
  const outerRef = useRef(null);
  const canvasRef = useRef(null);
  const burstRef = useRef(null);

  // Calendar
  const calendarRef = useRef(null);
  const calendarYearRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(2008);

  // Mobile Calendars (responsive sequence)
  const mobCal1Ref = useRef(null);
  const mobCal2Ref = useRef(null);
  const mobCal3Ref = useRef(null);
  const [mobYear1, setMobYear1] = useState(2008);
  const [mobYear2, setMobYear2] = useState(2021);
  const [mobYear3, setMobYear3] = useState(2023);

  // Cards
  const schoolCardRef = useRef(null);
  const juniorCardRef = useRef(null);
  const engCardRef = useRef(null);

  // Timeline
  const railFillRef = useRef(null);
  const node1Ref = useRef(null);
  const node2Ref = useRef(null);
  const node3Ref = useRef(null);


  useEffect(() => {
    if (canvasRef.current) return initParticles(canvasRef.current);
  }, []);

  useEffect(() => {
    const resize = () => {
      if (burstRef.current) {
        burstRef.current.width = window.innerWidth;
        burstRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // GSAP Animation Sequence
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP SCREEN LAYOUT ──
    mm.add("(min-width: 769px)", () => {
      // Initial resets
      gsap.set(schoolCardRef.current, { opacity: 0, x: '100%', y: 30, scale: 0.95 });
      gsap.set(juniorCardRef.current, { opacity: 0, x: '200%', y: 30, scale: 0.95 });
      gsap.set(engCardRef.current, { opacity: 0, x: '200%', y: 30, scale: 0.95 });
      gsap.set(calendarRef.current, { x: '0%', opacity: 1, scale: 1 });
      gsap.set(railFillRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set([node1Ref.current, node2Ref.current, node3Ref.current], { scale: 0 });

      const triggerBurst = (colIndex) => {
        if (!burstRef.current) return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        // Col centers: 16.6%, 50%, 83.3%
        const xPos = W * (0.166 + (0.333 * colIndex));
        const yPos = H * 0.4;
        burst(burstRef.current, xPos, yPos, 50);
      };

      const flipYears = (start, end, duration) => {
        return gsap.to({ val: start }, {
          val: end,
          duration: duration,
          ease: 'power1.inOut',
          onUpdate: function() {
            setCurrentYear(Math.round(this.targets()[0].val));
          }
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top 30%',
          once: true // Plays automatically once when entered
        }
      });

      // ── PHASE 1: SCHOOL ──
      tl.to(schoolCardRef.current, { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5);
      tl.add(flipYears(2008, 2021, 2.5), 0.5);

      // 2021 Reached: Burst, swap calendar and school card
      tl.call(() => triggerBurst(0));
      tl.to(calendarRef.current, { scale: 0.8, opacity: 0, duration: 0.3 }, 3.0);
      tl.to(schoolCardRef.current, {
        x: '0%', // Move to Col 1
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.inOut'
      }, 3.1);
      tl.to(node1Ref.current, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 3.4);
      tl.to(railFillRef.current, { scaleX: 0.33, duration: 0.8, ease: 'power2.inOut' }, 3.1);

      // ── PHASE 2: INTERMEDIATE ──
      tl.set(calendarRef.current, { x: '100%', scale: 0.8 });
      tl.to(calendarRef.current, { scale: 1, opacity: 1, duration: 0.5 }, 4.1);
      
      // Show Narayana preview in Col 3
      tl.to(juniorCardRef.current, { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out' }, 4.3);
      tl.add(flipYears(2021, 2023, 1.8), 4.3);

      // 2023 Reached: Burst, swap calendar and narayana card
      tl.call(() => triggerBurst(1));
      tl.to(calendarRef.current, { scale: 0.8, opacity: 0, duration: 0.3 }, 6.1);
      tl.to(juniorCardRef.current, {
        x: '100%', // Move to Col 2
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.inOut'
      }, 6.2);
      tl.to(node2Ref.current, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 6.5);
      tl.to(railFillRef.current, { scaleX: 0.66, duration: 0.8, ease: 'power2.inOut' }, 6.2);

      // ── PHASE 3: ENGINEERING ──
      tl.set(calendarRef.current, { x: '200%', scale: 0.8 });
      tl.to(calendarRef.current, { scale: 1, opacity: 1, duration: 0.5 }, 7.2);

      // Reveal MVSR directly behind calendar in Col 3
      tl.to(engCardRef.current, { opacity: 0.4, y: 0, duration: 0.8, ease: 'power2.out' }, 7.4);
      tl.add(flipYears(2023, 2027, 2.5), 7.4);

      // 2027 Reached: Huge Burst, dissolve calendar, full reveal MVSR
      tl.call(() => triggerBurst(2));
      tl.to(calendarRef.current, { scale: 1.2, opacity: 0, filter: 'blur(10px)', duration: 0.4 }, 9.9);
      tl.to(engCardRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out'
      }, 10.0);
      tl.to(node3Ref.current, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 10.2);
      tl.to(railFillRef.current, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 10.0);
    });

    // ── MOBILE SCREEN LAYOUT ──
    mm.add("(max-width: 768px)", () => {
      // Clear properties so that mobile CSS relative flows take precedence
      gsap.set([schoolCardRef.current, juniorCardRef.current, engCardRef.current, calendarRef.current], {
        clearProps: 'all'
      });

      // Initial resets for mobile elements
      gsap.set([mobCal1Ref.current, mobCal2Ref.current, mobCal3Ref.current], {
        opacity: 0,
        y: 20
      });
      gsap.set([schoolCardRef.current, juniorCardRef.current, engCardRef.current], {
        opacity: 0,
        y: 30,
        scale: 0.95
      });

      // Reset the year states
      setMobYear1(2008);
      setMobYear2(2021);
      setMobYear3(2023);

      const flipMobYear1 = (start, end, duration) => {
        return gsap.to({ val: start }, {
          val: end,
          duration: duration,
          ease: 'power1.inOut',
          onUpdate: function() {
            setMobYear1(Math.round(this.targets()[0].val));
          }
        });
      };

      const flipMobYear2 = (start, end, duration) => {
        return gsap.to({ val: start }, {
          val: end,
          duration: duration,
          ease: 'power1.inOut',
          onUpdate: function() {
            setMobYear2(Math.round(this.targets()[0].val));
          }
        });
      };

      const flipMobYear3 = (start, end, duration) => {
        return gsap.to({ val: start }, {
          val: end,
          duration: duration,
          ease: 'power1.inOut',
          onUpdate: function() {
            setMobYear3(Math.round(this.targets()[0].val));
          }
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top 30%',
          once: true // Plays automatically once when entered
        }
      });

      // Step 1: Reveal Mobile Calendar 1
      tl.to(mobCal1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
      // Step 2: Animate Calendar 1 from 2008 to 2021
      tl.add(flipMobYear1(2008, 2021, 1.8), 0.5);
      // Step 3: Pop School Card below Calendar 1
      tl.to(schoolCardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, 2.3);

      // Step 4: Reveal Mobile Calendar 2 (placed below School Card)
      tl.to(mobCal2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 2.9);
      // Step 5: Animate Calendar 2 from 2021 to 2023
      tl.add(flipMobYear2(2021, 2023, 1.2), 3.2);
      // Step 6: Pop Narayana Card below Calendar 2
      tl.to(juniorCardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, 4.4);

      // Step 7: Reveal Mobile Calendar 3 (placed below Narayana Card)
      tl.to(mobCal3Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 5.0);
      // Step 8: Animate Calendar 3 from 2023 to 2027
      tl.add(flipMobYear3(2023, 2027, 1.5), 5.3);
      // Step 9: Pop MVSR BTech Card below Calendar 3
      tl.to(engCardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, 6.8);
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={outerRef} id="scene-3" className="s3-section">
      <canvas ref={canvasRef} className="s3-particles-canvas" />
      <canvas ref={burstRef} className="s3-burst-canvas" />
      
      <div className="s3-header">
        <div className="s3-chapter-tag">CHAPTER 01</div>
        <h2 className="s3-chapter-title">THE ORIGIN STORY</h2>
        <div className="s3-chapter-sub">A journey through the years that shaped who I am today.</div>
      </div>

      {/* 3-Column Absolute Positioning Wrapper */}
      <div className="s3-cards-wrapper">
        
        {/* DESKTOP CALENDAR (Hidden on mobile) */}
        <div ref={calendarRef} className="s3-calendar-stage s3-desktop-calendar">
          <div className="s3-calendar-3d">
            <div className="s3-cal-rings">
              <div className="s3-cal-ring" /><div className="s3-cal-ring" />
            </div>
            <div className="s3-cal-page" ref={calendarYearRef}>
              {currentYear}
            </div>
          </div>
        </div>

        {/* MOBILE CALENDAR 1 (Hidden on desktop, placed above school card on mobile) */}
        <div ref={mobCal1Ref} className="s3-calendar-stage s3-mobile-calendar">
          <div className="s3-calendar-3d">
            <div className="s3-cal-rings">
              <div className="s3-cal-ring" /><div className="s3-cal-ring" />
            </div>
            <div className="s3-cal-page">
              {mobYear1}
            </div>
          </div>
        </div>

        {/* SCHOOL CARD */}
        <div ref={schoolCardRef} className="s3-milestone-item">
          <div className="s3-card">
            <img src="/school-campus.png" alt="School" className="s3-card-img" />
            <div className="s3-card-content">
              <span className="s3-card-era">2008 – 2021</span>
              <h3 className="s3-card-title">CAL Public School</h3>
              <span className="s3-card-sub">CBSE Board</span>
              <div className="s3-card-score">93.6%</div>
              <p className="s3-card-desc">Built strong foundations in Mathematics, Science and Problem Solving while developing curiosity toward technology.</p>
              <ul className="s3-card-bullets">
                <li>CBSE Curriculum</li>
                <li>Strong STEM Foundation</li>
                <li>Academic Excellence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MOBILE CALENDAR 2 (Hidden on desktop, placed below school card / above junior college card on mobile) */}
        <div ref={mobCal2Ref} className="s3-calendar-stage s3-mobile-calendar">
          <div className="s3-calendar-3d">
            <div className="s3-cal-rings">
              <div className="s3-cal-ring" /><div className="s3-cal-ring" />
            </div>
            <div className="s3-cal-page">
              {mobYear2}
            </div>
          </div>
        </div>

        {/* NARAYANA CARD */}
        <div ref={juniorCardRef} className="s3-milestone-item">
          <div className="s3-card">
            <img src="/junior-college.png" alt="Junior College" className="s3-card-img" />
            <div className="s3-card-content">
              <span className="s3-card-era">2021 – 2023</span>
              <h3 className="s3-card-title">Narayana Junior College</h3>
              <span className="s3-card-sub">MPC Stream</span>
              <div className="s3-card-score">96.3%</div>
              <p className="s3-card-desc">Focused on Mathematics, Physics and Chemistry while preparing for engineering education and developing analytical thinking.</p>
              <ul className="s3-card-bullets">
                <li>Competitive Exam Prep</li>
                <li>Strong Analytical Skills</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MOBILE CALENDAR 3 (Hidden on desktop, placed below junior college card / above btech card on mobile) */}
        <div ref={mobCal3Ref} className="s3-calendar-stage s3-mobile-calendar">
          <div className="s3-calendar-3d">
            <div className="s3-cal-rings">
              <div className="s3-cal-ring" /><div className="s3-cal-ring" />
            </div>
            <div className="s3-cal-page">
              {mobYear3}
            </div>
          </div>
        </div>

        {/* MVSR CARD */}
        <div ref={engCardRef} className="s3-milestone-item">
          <div className="s3-card">
            <img src="/engineering-college.png" alt="Engineering College" className="s3-card-img" />
            <div className="s3-card-content">
              <span className="s3-card-era">2023 – 2027</span>
              <h3 className="s3-card-title">MVSR Engineering College</h3>
              <span className="s3-card-sub">B.E. Computer Science & Engineering</span>
              <div className="s3-card-score">CGPA: 9.48</div>
              <p className="s3-card-desc">Specializing in Full Stack Development, AI, Cloud Technologies and Software Engineering through projects & hackathons.</p>
              <ul className="s3-card-bullets">
                <li>Full Stack & Cloud</li>
                <li>Artificial Intelligence</li>
                <li>Hackathons & Research</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* TIMELINE RAIL */}
      <div className="s3-rail-container">
        <div className="s3-timeline-base">
          <div ref={railFillRef} className="s3-timeline-fill" />
          
          <div ref={node1Ref} className="s3-timeline-node" style={{ left: '16.66%' }} />
          <div ref={node2Ref} className="s3-timeline-node" style={{ left: '50%' }} />
          <div ref={node3Ref} className="s3-timeline-node" style={{ left: '83.33%' }} />


        </div>
      </div>
    </section>
  );
}
