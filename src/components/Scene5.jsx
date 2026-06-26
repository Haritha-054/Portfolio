import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene5() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const dividerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const typeTargetRef = useRef(null);
  const statsLineRef = useRef(null);
  const circuitSvgRef = useRef(null);

  const setupBackgroundGrid = (svg) => {
    const width = svg.clientWidth || window.innerWidth;
    const height = svg.clientHeight || window.innerHeight;
    
    const spacing = 60;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    
    const numPulses = 9;
    const pulses = [];
    const timelines = [];

    for (let i = 0; i < numPulses; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '1.5');
      circle.setAttribute('fill', '#FFD700');
      circle.setAttribute('opacity', '0');
      circle.style.filter = 'drop-shadow(0 0 3px #FFD700)';
      svg.appendChild(circle);
      pulses.push(circle);
      
      const anim = () => {
        let cx = Math.floor(Math.random() * (cols - 2) + 1) * spacing;
        let cy = Math.floor(Math.random() * (rows - 2) + 1) * spacing;
        
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        
        const dir = Math.random() > 0.5 ? 0 : 1;
        const length = (Math.floor(Math.random() * 4) + 3) * spacing;
        const sign = Math.random() > 0.5 ? 1 : -1;
        
        let targetX = cx;
        let targetY = cy;
        if (dir === 0) {
          targetX = cx + length * sign;
        } else {
          targetY = cy + length * sign;
        }
        
        const duration = 2 + Math.random() * 2;
        
        const t = gsap.timeline()
          .to(circle, { opacity: 0.8, duration: 0.3 })
          .to(circle, { attr: { cx: targetX, cy: targetY }, duration: duration - 0.6, ease: 'none' })
          .to(circle, { opacity: 0, duration: 0.3, onComplete: anim });
          
        timelines.push(t);
      };
      
      anim();
    }
    
    return {
      kill: () => {
        timelines.forEach(t => t.kill());
        pulses.forEach(p => p.remove());
      }
    };
  };

  const skillsData = [
    { category: "LANGUAGES", skills: ["C", "C++", "Python", "Java"] },
    { category: "WEB", skills: ["HTML", "CSS", "JavaScript", "Bootstrap", "React.js", "Node.js"] },
    { category: "DATABASES & VERSION CONTROL", skills: ["MongoDB", "MySQL", "Git", "GitHub"] },
    { category: "CORE CS", skills: ["Operating Systems", "DBMS", "Computer Networks"] }
  ];

  const interestsData = [
    { category: "SPECIALIZATIONS", skills: ["Frontend Development", "UI/UX Design"] },
    { category: "AI & AUTOMATION", skills: ["Agentic AI", "n8n Automation", "AI Tools"] },
    { category: "CREATIVE & COMMUNITY", skills: ["Painting", "Art & Craft", "Open Source"] },
    { category: "HACKATHONS", skills: ["Building Side Projects", "Solving Real-world Problems"] }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    
    // Header title slide up
    gsap.fromTo(headerRef.current.querySelector('.s5-title'), 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        }
      }
    );

    // Divider line draw
    gsap.fromTo(dividerRef.current,
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
        }
      }
    );

    // Left Side Skills Entrance
    const skillRows = leftColRef.current.querySelectorAll('.s5-skill-row');
    skillRows.forEach((row, i) => {
      const buttons = row.querySelectorAll('.s5-skill-btn');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
        }
      });

      tl.fromTo(row, 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        i * 0.15 // row stagger
      );

      tl.fromTo(buttons,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 },
        `-=${0.3}` // overlap with row slide
      );
    });

    // Right Side Interests Entrance
    const interestRows = rightColRef.current.querySelectorAll('.s5-interest-row');
    interestRows.forEach((row, i) => {
      const buttons = row.querySelectorAll('.s5-skill-btn');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
        }
      });

      tl.fromTo(row, 
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        i * 0.15 // row stagger
      );

      tl.fromTo(buttons,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 },
        `-=${0.3}` // overlap with row slide
      );
    });

    // Typing effect on "Learning new tech" and the bottom stat line
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      once: true,
      onEnter: () => {
        // "Learning new tech" typing
        const textToType = "Learning new tech";
        let i = 0;
        const typeTarget = typeTargetRef.current;
        if (typeTarget) {
          typeTarget.innerHTML = "";
          const typingInterval = setInterval(() => {
            if (i < textToType.length) {
              typeTarget.innerHTML += textToType.charAt(i);
              i++;
            } else {
              clearInterval(typingInterval);
            }
          }, 60);
        }

        // Bottom stat line typing (delayed until columns finish loading)
        setTimeout(() => {
          const statText = "17 skills <span class='gold-dot'>·</span> 13 interests <span class='gold-dot'>·</span> 1 goal: build things that matter";
          const statTarget = statsLineRef.current;
          
          if (statTarget) {
            statTarget.style.opacity = 1;
            gsap.fromTo(statTarget, 
              { clipPath: 'inset(0 100% 0 0)' },
              { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'steps(40)' }
            );
          }
        }, 1500);
      }
    });

    // Setup background grid traveling pulses
    const circuitSvg = circuitSvgRef.current;
    let bgTimelineObject = null;
    if (circuitSvg) {
      bgTimelineObject = setupBackgroundGrid(circuitSvg);
    }

    return () => {
      if (bgTimelineObject) bgTimelineObject.kill();
    };
  }, []);

  return (
    <section id="scene-5" className="s5-section" ref={sectionRef}>
      
      {/* Reusing existing starfield class from previous scenes if applicable, or explicit styling */}
      <div className="s5-starfield"></div>

      {/* Dynamic traveling pulse grid background */}
      <div className="s5-circuit-grid">
        <svg className="s5-circuit-svg" ref={circuitSvgRef} width="100%" height="100%">
          <defs>
            <pattern id="s5-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 215, 0, 0.03)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="#FFD700" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s5-grid-pattern)" />
        </svg>
      </div>

      <div className="s5-container">
        
        {/* HEADER */}
        <div className="s5-header" ref={headerRef}>
          <div className="s5-chapter-tag">CHAPTER 03</div>
          <div className="s5-title-overflow">
            <h2 className="s5-title">THE STACK & THE SOUL.</h2>
          </div>
          <p className="s5-subtitle">What I know. What drives me.</p>
          <div className="s5-header-line"></div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="s5-split-layout">
          
          {/* LEFT: SKILLS */}
          <div className="s5-left-col" ref={leftColRef}>
            <div className="s5-col-label">TECHNICAL SKILLS</div>
            
            <div className="s5-skills-list">
              {skillsData.map((row, idx) => (
                <div key={idx} className="s5-skill-row">
                  <div className="s5-skill-row-label">{row.category}</div>
                  <div className="s5-skill-btn-group">
                    {row.skills.map((skill, sIdx) => (
                      <button key={sIdx} className="s5-skill-btn">{skill}</button>
                    ))}
                  </div>
                  {idx < skillsData.length - 1 && <div className="s5-row-divider"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div className="s5-vertical-divider" ref={dividerRef}></div>

          {/* RIGHT: INTERESTS */}
          <div className="s5-right-col" ref={rightColRef}>
            <div className="s5-col-label">WHAT DRIVES ME</div>
            
            <div className="s5-skills-list s5-interests-list">
              {interestsData.map((row, idx) => (
                <div key={idx} className="s5-interest-row">
                  <div className="s5-skill-row-label">{row.category}</div>
                  <div className="s5-skill-btn-group">
                    {row.skills.map((skill, sIdx) => (
                      <button key={sIdx} className="s5-skill-btn">{skill}</button>
                    ))}
                  </div>
                  {idx < interestsData.length - 1 && <div className="s5-row-divider"></div>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM STAT LINE */}
        <div className="s5-stat-line" ref={statsLineRef} style={{ opacity: 0 }}>
          17 skills <span className="gold-dot">·</span> 13 interests <span className="gold-dot">·</span> 1 goal: build things that matter
        </div>

      </div>
    </section>
  );
}
