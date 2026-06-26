import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Scene1 from './components/Scene1';
import Scene3 from './components/Scene3';
import Scene4 from './components/Scene4';
import Scene5 from './components/Scene5';
import Scene6 from './components/Scene6';
import Scene7 from './components/Scene7';
import Scene8 from './components/Scene8';
import CustomCursor from './components/CustomCursor';
import EmbersBackground from './components/EmbersBackground';
import SoundToggle from './components/SoundToggle';
import Avatar from './components/Avatar';
import Roadmap from './components/Roadmap';

function App() {
  const [loaderOut, setLoaderOut] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [goldFlashActive, setGoldFlashActive] = useState(false);
  const [progressWidth, setProgressWidth] = useState('0%');
  const [letterboxesOpen, setLetterboxesOpen] = useState(false);
  const [navOn, setNavOn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Transition: Scene 0 -> Scene 1
  const goS1 = () => {
    // 80ms black flash trigger
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
    }, 160);

    setTimeout(() => {
      setLoaderOut(true);
      setLetterboxesOpen(true);
      setNavOn(true);

      // Enable body scroll as soon as loader ends
      document.body.classList.add('scroll-active');
      document.documentElement.classList.add('scroll-active');

      setTimeout(() => {
        setLetterboxesOpen(false);
      }, 480);
    }, 80);
  };

  // Smooth scroll down to Scene 2
  const scrollToScene2 = () => {
    document.querySelector('#scene-2')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic progress bar width + scroll-to-top visibility
  useEffect(() => {
    if (!loaderOut) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgressWidth(`${pct}%`);
      setShowScrollTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaderOut]);

  return (
    <>
      {/* ── GLOBAL BACKGROUNDS & FX ── */}
      <div id="grain" />
      <div id="flash" style={{ opacity: flashActive ? 1 : 0, transition: 'opacity .08s' }} />
      <div id="gold-flash" style={{ opacity: goldFlashActive ? 0.5 : 0, transition: 'opacity .09s' }} />
      <div id="prog" style={{ width: progressWidth }} />
      <CustomCursor />
      
      {/* Cinematic Letterbox shutter bars */}
      <div className={`lb ${letterboxesOpen ? 'open' : ''}`} id="lbT" />
      <div className={`lb ${letterboxesOpen ? 'open' : ''}`} id="lbB" />
      
      <EmbersBackground />

      {/* ── NAVIGATION HEADER ── */}
      <nav id="nav" className={navOn ? 'on' : ''}>
        <div className="logo">H · R</div>
        <div className="nav-r">
          <a href="#s1" onClick={(e) => { e.preventDefault(); document.querySelector('#s1')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>
          <a href="#scene-4" onClick={(e) => { e.preventDefault(); document.querySelector('#scene-4')?.scrollIntoView({ behavior: 'smooth' }); }}>Achievements</a>
          <a href="#scene-5" onClick={(e) => { e.preventDefault(); document.querySelector('#scene-5')?.scrollIntoView({ behavior: 'smooth' }); }}>Skills</a>
          <a href="#scene-6" onClick={(e) => { e.preventDefault(); document.querySelector('#scene-6')?.scrollIntoView({ behavior: 'smooth' }); }}>Projects</a>
          <a href="#scene-7" onClick={(e) => { e.preventDefault(); document.querySelector('#scene-7')?.scrollIntoView({ behavior: 'smooth' }); }}>n8n</a>
          <a href="#scene-8" onClick={(e) => { e.preventDefault(); document.querySelector('#scene-8')?.scrollIntoView({ behavior: 'smooth' }); }} className="hire">Contact</a>
          <SoundToggle />
        </div>
      </nav>

      {/* ── SCROLL TO TOP BUTTON ── */}
      <button
        id="scroll-top-btn"
        className={showScrollTop ? 'visible' : ''}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      {/* ── PERSISTENT AVATAR GUIDE (Scene 2+) ── */}
      <Avatar active={loaderOut} />

      {/* ── SCENE MANAGER ── */}
      {!loaderOut && (
        <Loader onComplete={goS1} />
      )}

      {loaderOut && (
        <div id="main-content">
          <Scene1 onComplete={scrollToScene2} />
          
          <div id="portfolio-scenes">
            {/* ═══ Scene 2: Prologue / Welcome landing ═══ */}
            <section id="scene-2" className="s2-intro-section">
              {/* Drifting gold orbs */}
              <div className="s2-orb s2-orb-1" />
              <div className="s2-orb s2-orb-2" />
              <div className="s2-orb s2-orb-3" />

              <div className="s2-inner">
                {/* Interactive Google Map Roadmap */}
                <Roadmap />
              </div>
            </section>



            {/* ═══ Scene 3: Education Journey (Avatar: point state) ═══ */}
            <Scene3 />

            {/* Scene 4: Hackathon Arena */}
            <Scene4 />

            {/* Scene 5: Toolkit */}
            <Scene5 />

            {/* Scene 6: Real Products */}
            <Scene6 />

            {/* Scene 7: Agentic AI & n8n Workflow Showcase */}
            <Scene7 />

            {/* Scene 8: Contact / Hire Me Finale */}
            <Scene8 />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
