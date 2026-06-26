import React, { useEffect, useState, useRef } from 'react';

const CHAPTERS = [
  { id: 'scene-3', num: 1, x: 80, y: 260, title: 'THE ORIGIN STORY', label: 'Education', desc: 'A cinematic journey through school, junior college, and MVSR Engineering College. Discovering computer science, building software fundamentals, and preparing for the developer arena.' },
  { id: 'scene-4', num: 2, x: 260, y: 100, title: 'MILESTONES THAT MATTER', label: 'Achievements', desc: 'Hackathon trophies, national finals, and credentials. Highlights include winning Sudhee CBIT hackathon, pre-finalist recognition in Technoverse, and SIH finalist.' },
  { id: 'scene-5', num: 3, x: 440, y: 260, title: 'THE STACK & THE SOUL.', label: 'Toolkit', desc: 'Core developer stack and technical skills. Deep dives into React, Python, MongoDB, and AI integration libraries that fuel my day-to-day projects.' },
  { id: 'scene-6', num: 4, x: 620, y: 100, title: 'THE WORK.', label: 'Projects', desc: 'A curated showcase of real-world production projects. Includes plant disease detection using TensorFlow.js, n8n backends, and MERN software suites.' },
  { id: 'scene-7', num: 5, x: 800, y: 260, title: 'Watch the AUTOMATION work.', label: 'AI & n8n', desc: 'Live execution workflow integrations. Triggering automated replies, email sequences, and agentic AI tools working in harmony in real-time.' },
  { id: 'scene-8', num: 6, x: 940, y: 150, title: 'CONNECT WITH ME', label: 'Contact', desc: 'The final destination. Reach out directly via email, professional networking channels, or get access to download my complete PDF resume.' }
];

export default function Roadmap() {
  const [activeNum, setActiveNum] = useState(1);
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const containerRef = useRef(null);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section is in middle viewport
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ch = CHAPTERS.find(c => c.id === entry.target.id);
          if (ch) {
            setActiveNum(ch.num);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => {
      CHAPTERS.forEach((ch) => {
        const el = document.getElementById(ch.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handlePinClick = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine which content to show in the info panel
  const activeChapter = hoveredChapter || CHAPTERS.find(c => c.num === activeNum) || CHAPTERS[0];

  return (
    <div className="s2-roadmap-wrapper" ref={containerRef}>
      <h3 className="s2-roadmap-heading">PORTFOLIO NAVIGATOR</h3>
      <p className="s2-roadmap-subheading">A real-time roadmap of all portfolio chapters. Hover or click to explore.</p>

      {/* Split HUD Layout */}
      <div className="s2-hud-container">
        
        {/* Left Side: Map Pane */}
        <div className="s2-map-pane">
          <div className="s2-map-canvas">
            {/* Map grid decoration overlay */}
            <div className="s2-map-grid"></div>
            <div className="s2-map-lines"></div>
            <div className="s2-radar-sweep"></div>

            {/* HUD Cyber Elements */}
            <span className="hud-tag hud-tl">SYS_NAV // v1.5</span>
            <span className="hud-tag hud-tr">LAT 17.3850° N / LON 78.4867° E</span>
            <span className="hud-tag hud-bl">TARGET: CH_0{activeNum}</span>
            <span className="hud-tag hud-br">STATUS // LOCKED</span>

            {/* SVG Navigation Winding Route */}
            <svg className="s2-map-svg" viewBox="0 0 1000 360" preserveAspectRatio="xMidYMid meet">
              {/* Background Route Road */}
              <path
                d="M 80,260 C 170,260 170,100 260,100 C 350,100 350,260 440,260 C 530,260 530,100 620,100 C 710,100 710,260 800,260 C 870,260 890,150 940,150"
                className="s2-route-road"
              />
              {/* Animated Route Flow Dashed Line */}
              <path
                d="M 80,260 C 170,260 170,100 260,100 C 350,100 350,260 440,260 C 530,260 530,100 620,100 C 710,100 710,260 800,260 C 870,260 890,150 940,150"
                className="s2-route-flow"
              />
            </svg>

            {/* Chapter Location Pins */}
            {CHAPTERS.map((ch) => {
              const isActive = activeNum === ch.num;
              const isHovered = hoveredChapter && hoveredChapter.num === ch.num;
              
              return (
                <div
                  key={ch.num}
                  className={`s2-pin-container ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                  style={{
                    left: `${ch.x / 10}%`,
                    top: `${ch.y / 3.6}%`
                  }}
                  onMouseEnter={() => setHoveredChapter(ch)}
                  onMouseLeave={() => setHoveredChapter(null)}
                  onClick={() => handlePinClick(ch.id)}
                >
                  {/* Pulsing base ring for active pins */}
                  {isActive && <div className="s2-pin-pulse" />}

                  {/* Teardrop location marker */}
                  <div className="s2-teardrop-pin">
                    <svg viewBox="0 0 24 30" width="36" height="45">
                      {/* Outer teardrop */}
                      <path
                        d="M12 0 C5.37 0 0 5.37 0 12 C0 21 12 30 12 30 C12 30 24 21 24 12 C24 5.37 18.63 0 12 0 Z"
                        className="s2-pin-body"
                      />
                      {/* Inner white target circle */}
                      <circle cx="12" cy="11" r="5.5" fill="#FFFFFF" />
                    </svg>
                    {/* Text overlay for chapter number inside pin */}
                    <span className="s2-pin-number">{ch.num}</span>
                  </div>

                  {/* Pin Label underneath */}
                  <div className="s2-pin-label">{ch.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Information Pane (Always Visible HUD Console) */}
        <div className="s2-info-pane">
          <div className="s2-info-card">
            <div className="s2-card-header">
              <span className="s2-info-badge">CHAPTER 0{activeChapter.num}</span>
              <span className="s2-info-nav">NAV-ACTIVE // SCROLL</span>
            </div>
            
            <h4 className="s2-info-title">{activeChapter.title}</h4>
            <div className="s2-info-divider" />
            <p className="s2-info-desc">{activeChapter.desc}</p>
            
            <div className="s2-info-footer">
              <div className="s2-hud-progress">
                <span className="s2-progress-text">CHAPTER {activeNum} OF 6</span>
                <div className="s2-progress-track">
                  <div 
                    className="s2-progress-fill" 
                    style={{ width: `${(activeNum / 6) * 100}%` }}
                  />
                </div>
              </div>
              
              <button 
                className="s2-hud-nav-btn interactive"
                onClick={() => handlePinClick(activeChapter.id)}
              >
                JUMP TO SECTION ⮞
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
