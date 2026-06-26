import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import resumePreview from '../assets/resume_preview.png';

gsap.registerPlugin(ScrollTrigger);

export default function Scene8() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subHeadlineRef = useRef(null);

  const triggerAvatar = (text, state = 'point') => {
    window.dispatchEvent(new CustomEvent('set-avatar-state', {
      detail: { state, text }
    }));
  };

  const resetAvatar = () => {
    window.dispatchEvent(new CustomEvent('set-avatar-state', {
      detail: { state: 'idle', text: "" }
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subHeadline = subHeadlineRef.current;
    if (!section || !headline) return;

    // Split headline words for reveal slide up animation
    const words = headline.querySelectorAll('.s8-reveal-word');
    gsap.set(words, { y: 60, opacity: 0 });
    gsap.set(subHeadline, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 55%',
      }
    });

    tl.to(words, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });

    tl.to(subHeadline, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '+=0.3');

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section id="scene-8" className="s8-finale-section" ref={sectionRef}>
      {/* Drifting blurred ellipses gold background */}
      <div className="s8-aurora-bg">
        <div className="s8-ell s8-ell-1"></div>
        <div className="s8-ell s8-ell-2"></div>
        <div className="s8-ell s8-ell-3"></div>
      </div>

      <div className="s8-layout-container">
        {/* Header */}
        <div className="s8-header">
          <div className="s8-eyebrow">CHAPTER 06</div>
          <h2 className="s8-headline" ref={headlineRef}>
            <div className="s8-line-1">
              <span className="s8-reveal-word">Let's</span>{' '}
              <span className="s8-reveal-word">build</span>{' '}
              <span className="s8-reveal-word">something</span>
            </div>
            <div className="s8-line-2">
              <span className="s8-reveal-word s8-highlight">extraordinary.</span>
            </div>
          </h2>
          <p className="s8-subheadline" ref={subHeadlineRef}>
            I'm currently open to opportunities.
          </p>
        </div>

        {/* Two Columns Layout */}
        <div className="s8-columns-container">
          {/* Left: Resume Showcase Card */}
          <div className="s8-column-left">
            <div className="s8-resume-card">
              <div className="s8-resume-card-header">
                <h3 className="s8-resume-title">My Resume</h3>
                <p className="s8-resume-subtitle">B.Tech in Computer Science & Engineering</p>
              </div>
              
              {/* Actual Resume Image Preview */}
              <div className="s8-resume-preview-container">
                <img 
                  src={resumePreview} 
                  alt="Haritha Reddy Resume Preview" 
                  className="s8-resume-preview"
                  onMouseEnter={() => triggerAvatar("Click to download my complete resume! 📄", "wave")}
                  onMouseLeave={resetAvatar}
                />
              </div>

              <div className="s8-resume-highlights">
                <div className="s8-highlight-item">
                  <span className="s8-highlight-dot"></span>
                  <span>AI & Workflow Automation Expert</span>
                </div>
                <div className="s8-highlight-item">
                  <span className="s8-highlight-dot"></span>
                  <span>Full-Stack Software Engineer</span>
                </div>
              </div>

              <a 
                href="https://drive.google.com/file/d/1oJI_S91Ii6cFv-0IWDDu_uQImGtwn0dR/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="s8-resume-btn"
                onMouseEnter={() => triggerAvatar("Get a copy of my PDF resume! 📥", "celebrate")}
                onMouseLeave={resetAvatar}
              >
                <span>View Resume PDF</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Connect Card with Official Icons */}
          <div className="s8-column-right">
            <div className="s8-connect-card">
              <div className="s8-connect-card-header">
                <h3 className="s8-connect-title">Connect With Me</h3>
                <p className="s8-connect-subtitle">Reach out directly via email or professional networks.</p>
              </div>

              <div className="s8-connect-list">
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/dondeti-haritha-reddy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="s8-connect-item linkedin"
                  onMouseEnter={() => triggerAvatar("Let's connect on LinkedIn! 💼", "wave")}
                  onMouseLeave={resetAvatar}
                >
                  <div className="s8-connect-icon-wrapper">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div className="s8-connect-info">
                    <span className="s8-connect-label">LinkedIn</span>
                    <span className="s8-connect-value">dondeti-haritha-reddy</span>
                  </div>
                  <span className="s8-connect-arrow">→</span>
                </a>

                {/* Gmail */}
                <a 
                  href="mailto:harithareddydondeti01@gmail.com" 
                  className="s8-connect-item gmail"
                  onMouseEnter={() => triggerAvatar("Drop me a line in my inbox! ✉️", "celebrate")}
                  onMouseLeave={resetAvatar}
                >
                  <div className="s8-connect-icon-wrapper">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div className="s8-connect-info">
                    <span className="s8-connect-label">Gmail</span>
                    <span className="s8-connect-value">harithareddydondeti01@gmail.com</span>
                  </div>
                  <span className="s8-connect-arrow">→</span>
                </a>

                {/* GitHub */}
                <a 
                  href="https://github.com/Haritha-054" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="s8-connect-item github"
                  onMouseEnter={() => triggerAvatar("Explore my open-source code! 🐙", "wave")}
                  onMouseLeave={resetAvatar}
                >
                  <div className="s8-connect-icon-wrapper">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="s8-connect-info">
                    <span className="s8-connect-label">GitHub</span>
                    <span className="s8-connect-value">Haritha-054</span>
                  </div>
                  <span className="s8-connect-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="s8-footer">
          <div className="s8-footer-line"></div>
          <p className="s8-footer-text">
            Built with obsession. © Haritha Reddy Dondeti 2025
          </p>
        </div>
      </div>
    </section>
  );
}
