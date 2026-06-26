import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene7() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const formCardRef = useRef(null);
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

  useEffect(() => {
    const circuitSvg = circuitSvgRef.current;
    let bgTimelineObject = null;
    if (circuitSvg) {
      bgTimelineObject = setupBackgroundGrid(circuitSvg);
    }
    return () => {
      if (bgTimelineObject) bgTimelineObject.kill();
    };
  }, []);


  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showError, setShowError] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [msgValue, setMsgValue] = useState('');
  const [successEmail, setSuccessEmail] = useState('');

  // 7 nodes coordinate mapping for n8n workflow
  const nodes = [
    { id: 1, x: 50,  y: 145, label: "Webhook Trigger", icon: "webhook", color: "#FF7C37", status: "webhook received ✓" },
    { id: 2, x: 210, y: 145, label: "Set Variables", icon: "pencil", color: "#4a90e2", status: "variables set ✓" },
    { id: 3, x: 370, y: 145, label: "Has Message?", icon: "split", color: "#FF7C37", status: "checking message..." },
    { id: 41, x: 530, y: 40,  label: "Personalize With Message", icon: "code", color: "#ff9f1c", status: "message personalized ✓" },
    { id: 42, x: 530, y: 250, label: "Default Message", icon: "code", color: "#ff9f1c", status: "default loaded ✓" },
    { id: 5, x: 690, y: 145, label: "Send Gmail", sublabel: "send: message", icon: "gmail", color: "#EA4335", status: "sending email..." },
    { id: 6, x: 850, y: 145, label: "Respond to Webhook", icon: "webhook", color: "#FF7C37", status: "response sent ✓" }
  ];

  // trigger n8n async webhook
  const triggerN8N = async (name, email, message) => {
    try {
      await fetch('http://localhost:5678/webhook/portfolio-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message || 'No message left.',
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      setShowError(true);
      const errorMsg = document.getElementById('error-msg');
      if (errorMsg) errorMsg.style.display = 'block';
    }
  };

  const createParticleBurst = () => {
    const wrapper = document.getElementById('particle-burst-container');
    if (!wrapper) return;

    // Node 6 is centered around cx=895 (width 985), cy=190 (height 380)
    // Percentage: left=90.86%, top=50%
    const originX = 90.86;
    const originY = 50;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 's7-particle';
      particle.style.left = `${originX}%`;
      particle.style.top = `${originY}%`;
      wrapper.appendChild(particle);

      // Random direction and speed
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 60;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        opacity: 0,
        scale: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  };

  const triggerFormShake = (errorMsgText) => {
    setValidationError(errorMsgText);
    const emailField = document.getElementById('rec-email');
    if (emailField) {
      emailField.classList.add('field-error');
      setTimeout(() => {
        emailField.classList.remove('field-error');
      }, 3000);
    }

    gsap.fromTo(formCardRef.current,
      { x: 0 },
      { x: -8, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => {
        gsap.set(formCardRef.current, { x: 0 });
      }}
    );
  };

  const handleSend = () => {
    if (isLoading || isSuccess) return;

    const name = nameValue.trim();
    const email = emailValue.trim();
    const message = msgValue.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      triggerFormShake("Please enter your email");
      return;
    }
    if (!emailRegex.test(email)) {
      triggerFormShake("Please enter a valid email");
      return;
    }

    // Run animation showcase
    runAutomationShowcase(name, email, message);
  };

  const runAutomationShowcase = (name, email, message) => {
    setIsLoading(true);
    setValidationError('');
    setIsSuccess(false);
    setShowError(false);
    setSuccessEmail(email);

    const container = containerRef.current;
    if (!container) return;

    const pulseDot = container.querySelector('#pulse-dot');
    const hasMessage = message.trim().length > 0;

    // Reset visual classes
    container.querySelectorAll('.s7-node-rect').forEach(node => {
      node.classList.remove('node-active', 'node-done');
    });
    container.querySelectorAll('.s7-conn-line').forEach(line => {
      line.classList.remove('line-active');
    });
    container.querySelectorAll('.s7-status-text').forEach(lbl => {
      gsap.set(lbl, { opacity: 0 });
    });
    container.querySelectorAll('.s7-node-checkmark').forEach(chk => {
      chk.classList.remove('visible');
    });
    container.querySelectorAll('.s7-line-badge').forEach(badge => {
      badge.classList.remove('badge-active');
    });

    // Make inactive branch grey explicitly (in case it was green in a previous run)
    const line3b = container.querySelector('#line-3b');
    const line4b = container.querySelector('#line-4b');
    const line3a = container.querySelector('#line-3a');
    const line4a = container.querySelector('#line-4a');
    if (line3b) line3b.style.stroke = '#252529';
    if (line4b) line4b.style.stroke = '#252529';
    if (line3a) line3a.style.stroke = '#252529';
    if (line4a) line4a.style.stroke = '#252529';

    const tl = gsap.timeline();

    // Helper for animating dot along path
    const animateAlongPath = (pathId, duration, lineActiveId, badgeActiveId) => {
      const pathObj = { progress: 0 };
      return gsap.to(pathObj, {
        progress: 1,
        duration: duration,
        ease: 'none',
        onStart: () => {
          const line = container.querySelector(lineActiveId);
          if (line) {
            line.classList.add('line-active');
            line.style.stroke = ''; // reset style override if any
          }
        },
        onComplete: () => {
          if (badgeActiveId) {
            const badge = container.querySelector(badgeActiveId);
            if (badge) badge.classList.add('badge-active');
          }
        },
        onUpdate: () => {
          const path = container.querySelector(pathId);
          if (path && pulseDot) {
            const pt = path.getPointAtLength(pathObj.progress * path.getTotalLength());
            gsap.set(pulseDot, { attr: { cx: pt.x, cy: pt.y } });
          }
        }
      });
    };

    // t=0.0s: pulse-dot opacity -> 1, cx = center of Node 1 (95), cy = 190
    tl.set(pulseDot, { opacity: 1, attr: { cx: 95, cy: 190 } }, 0.0);

    // Node 1 active
    tl.add(() => {
      const node = container.querySelector('#node-rect-1');
      const status = container.querySelector('#status-text-1');
      if (node) node.classList.add('node-active');
      if (status) gsap.to(status, { opacity: 1, duration: 0.2 });
    }, 0.1);

    // Travel Node 1 -> Node 2
    tl.add(animateAlongPath('#line-1', 0.6, '#line-1', '#badge-line-1'), 0.5);

    // Node 1 done, Node 2 active
    tl.add(() => {
      const node1 = container.querySelector('#node-rect-1');
      const chk1 = container.querySelector('#checkmark-1');
      const node2 = container.querySelector('#node-rect-2');
      const status2 = container.querySelector('#status-text-2');
      if (node1) {
        node1.classList.remove('node-active');
        node1.classList.add('node-done');
      }
      if (chk1) chk1.classList.add('visible');
      if (node2) node2.classList.add('node-active');
      if (status2) gsap.to(status2, { opacity: 1, duration: 0.2 });
    }, 1.1);

    // Travel Node 2 -> Node 3
    tl.add(animateAlongPath('#line-2', 0.6, '#line-2', '#badge-line-2'), 1.5);

    // Node 2 done, Node 3 active
    tl.add(() => {
      const node2 = container.querySelector('#node-rect-2');
      const chk2 = container.querySelector('#checkmark-2');
      const node3 = container.querySelector('#node-rect-3');
      const status3 = container.querySelector('#status-text-3');
      if (node2) {
        node2.classList.remove('node-active');
        node2.classList.add('node-done');
      }
      if (chk2) chk2.classList.add('visible');
      if (node3) node3.classList.add('node-active');
      if (status3) {
        status3.textContent = hasMessage ? "has message: true ✓" : "has message: false ✓";
        gsap.to(status3, { opacity: 1, duration: 0.2 });
      }
      
      // Fire actual webhook trigger (non-blocking)
      triggerN8N(name, email, message);
    }, 2.1);

    // Branching: travel Node 3 -> Node 4a (true) or 4b (false)
    if (hasMessage) {
      // Travel along true path
      tl.add(animateAlongPath('#line-3a', 0.8, '#line-3a', '#badge-line-3a'), 2.6);

      // Node 3 done, Node 4a active
      tl.add(() => {
        const node3 = container.querySelector('#node-rect-3');
        const chk3 = container.querySelector('#checkmark-3');
        const node4a = container.querySelector('#node-rect-41');
        const status4a = container.querySelector('#status-text-41');
        if (node3) {
          node3.classList.remove('node-active');
          node3.classList.add('node-done');
        }
        if (chk3) chk3.classList.add('visible');
        if (node4a) node4a.classList.add('node-active');
        if (status4a) gsap.to(status4a, { opacity: 1, duration: 0.2 });
      }, 3.4);

      // Travel Node 4a -> Node 5
      tl.add(animateAlongPath('#line-4a', 0.8, '#line-4a', '#badge-line-4a'), 3.8);

      // Node 4a done, Node 5 active
      tl.add(() => {
        const node4a = container.querySelector('#node-rect-41');
        const chk4a = container.querySelector('#checkmark-41');
        const node5 = container.querySelector('#node-rect-5');
        const status5 = container.querySelector('#status-text-5');
        if (node4a) {
          node4a.classList.remove('node-active');
          node4a.classList.add('node-done');
        }
        if (chk4a) chk4a.classList.add('visible');
        if (node5) node5.classList.add('node-active');
        if (status5) gsap.to(status5, { opacity: 1, duration: 0.2 });
      }, 4.6);
    } else {
      // Travel along false path
      tl.add(animateAlongPath('#line-3b', 0.8, '#line-3b', null), 2.6);

      // Node 3 done, Node 4b active
      tl.add(() => {
        const node3 = container.querySelector('#node-rect-3');
        const chk3 = container.querySelector('#checkmark-3');
        const node4b = container.querySelector('#node-rect-42');
        const status4b = container.querySelector('#status-text-42');
        if (node3) {
          node3.classList.remove('node-active');
          node3.classList.add('node-done');
        }
        if (chk3) chk3.classList.add('visible');
        if (node4b) node4b.classList.add('node-active');
        if (status4b) gsap.to(status4b, { opacity: 1, duration: 0.2 });
      }, 3.4);

      // Travel Node 4b -> Node 5
      tl.add(animateAlongPath('#line-4b', 0.8, '#line-4b', null), 3.8);

      // Node 4b done, Node 5 active
      tl.add(() => {
        const node4b = container.querySelector('#node-rect-42');
        const chk4b = container.querySelector('#checkmark-42');
        const node5 = container.querySelector('#node-rect-5');
        const status5 = container.querySelector('#status-text-5');
        if (node4b) {
          node4b.classList.remove('node-active');
          node4b.classList.add('node-done');
        }
        if (chk4b) chk4b.classList.add('visible');
        if (node5) node5.classList.add('node-active');
        if (status5) gsap.to(status5, { opacity: 1, duration: 0.2 });
      }, 4.6);
    }

    // Travel Node 5 -> Node 6
    tl.add(animateAlongPath('#line-5', 0.6, '#line-5', '#badge-line-5'), 5.1);

    // Node 5 done, Node 6 active
    tl.add(() => {
      const node5 = container.querySelector('#node-rect-5');
      const chk5 = container.querySelector('#checkmark-5');
      const node6 = container.querySelector('#node-rect-6');
      const status6 = container.querySelector('#status-text-6');
      if (node5) {
        node5.classList.remove('node-active');
        node5.classList.add('node-done');
      }
      if (chk5) chk5.classList.add('visible');
      if (node6) node6.classList.add('node-active');
      if (status6) gsap.to(status6, { opacity: 1, duration: 0.2 });
    }, 5.7);

    // Travel Node 6 -> End
    tl.add(animateAlongPath('#line-6', 0.3, '#line-6', '#badge-line-6'), 6.1);

    // Node 6 done, particle burst, transition to success
    tl.add(() => {
      const node6 = container.querySelector('#node-rect-6');
      const chk6 = container.querySelector('#checkmark-6');
      if (node6) {
        node6.classList.remove('node-active');
        node6.classList.add('node-done');
      }
      if (chk6) chk6.classList.add('visible');

      createParticleBurst();
    }, 6.4);

    // Success final state
    tl.add(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Dispatch avatar celebrate event
      window.dispatchEvent(new CustomEvent('set-avatar-state', {
        detail: { state: 'celebrate', text: "It works! Check your inbox 🚀" }
      }));

      gsap.to(pulseDot, { opacity: 0, duration: 0.3 });

      container.querySelectorAll('.s7-status-text').forEach(lbl => {
        gsap.to(lbl, { opacity: 0.6, duration: 0.3 });
      });
    }, 6.8);

    // Gently breathe together
    tl.add(() => {
      gsap.fromTo(container.querySelectorAll('.s7-node-rect.node-done'),
        { strokeOpacity: 0.4 },
        { strokeOpacity: 0.8, duration: 2.0, repeat: -1, yoyo: true, ease: 'power1.inOut' }
      );
    }, 7.0);
  };

  return (
    <section id="scene-7" className="s7-automation-section" ref={sectionRef}>
      {/* Starfield particle background */}
      <div className="s7-starfield"></div>

      {/* Dynamic traveling pulse grid background */}
      <div className="s7-circuit-grid">
        <svg className="s7-circuit-svg" ref={circuitSvgRef} width="100%" height="100%">
          <defs>
            <pattern id="s7-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 215, 0, 0.03)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="#FFD700" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s7-grid-pattern)" />
        </svg>
      </div>

      <div className="s7-layout-wrapper" ref={containerRef}>
        {/* Section Header */}
        <div className="s7-header">
          <div className="s7-eyebrow">CHAPTER 05</div>
          <h2 className="s7-title">Watch the AUTOMATION work.</h2>
          <p className="s7-subtitle">Not a demo. A real workflow firing live.</p>
        </div>

        {/* Two Columns Layout */}
        <div className="s7-columns-container">
          {/* Left: Input Form Card */}
          <div className="s7-column-left">
            <div className="s7-form-card" ref={formCardRef}>
              <h3 className="s7-card-title">Send me a message</h3>
              <p className="s7-card-subtitle">I'll automate a reply straight to your inbox.</p>

              {validationError && (
                <div className="s7-validation-error">
                  {validationError}
                </div>
              )}

              <input
                id="rec-name"
                type="text"
                placeholder="Your name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                disabled={isLoading || isSuccess}
                autoComplete="off"
              />

              <input
                id="rec-email"
                type="email"
                placeholder="your@email.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                disabled={isLoading || isSuccess}
              />

              <textarea
                id="rec-msg"
                placeholder="Leave a note (optional)"
                rows="3"
                value={msgValue}
                onChange={(e) => setMsgValue(e.target.value)}
                disabled={isLoading || isSuccess}
              />

              <button
                id="send-btn"
                onClick={handleSend}
                disabled={isLoading || isSuccess}
                className={isSuccess ? 'sent' : ''}
              >
                {isLoading ? "⚡ Sending..." : isSuccess ? "✓ Sent!" : "⚡ Trigger Automation →"}
              </button>

              {isSuccess && (
                <div id="success-msg" style={{ display: 'block' }}>
                  ✓ Done. A personalized email with my resume is heading to {successEmail}. Check inbox!
                </div>
              )}

              {showError && (
                <div id="error-msg" style={{ display: 'block' }}>
                  n8n is offline right now. Reach me at harithareddydondeti01@gmail.com
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Workflow Canvas */}
          <div className="s7-column-right">
            <div id="canvas-relative-container">
              {/* Particle burst target layer */}
              <div id="particle-burst-container"></div>

              <div className="svg-scroll-container">
                <svg
                  id="workflow-svg"
                  viewBox="0 0 985 380"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Layer 1 (bottom): Connection Lines */}
                  {/* Webhook to Set Variables */}
                  <path id="line-1" d="M 140 190 L 210 190" className="s7-conn-line" />
                  
                  {/* Set Variables to Has Message */}
                  <path id="line-2" d="M 300 190 L 370 190" className="s7-conn-line" />
                  
                  {/* Has Message to Personalize (true) */}
                  <path id="line-3a" d="M 460 175 C 495 175, 495 85, 530 85" className="s7-conn-line" />
                  
                  {/* Has Message to Default (false) */}
                  <path id="line-3b" d="M 460 205 C 495 205, 495 295, 530 295" className="s7-conn-line" style={{ stroke: '#252529' }} />
                  
                  {/* Personalize to Send Gmail */}
                  <path id="line-4a" d="M 620 85 C 655 85, 655 190, 690 190" className="s7-conn-line" />
                  
                  {/* Default to Send Gmail */}
                  <path id="line-4b" d="M 620 295 C 655 295, 655 190, 690 190" className="s7-conn-line" style={{ stroke: '#252529' }} />
                  
                  {/* Send Gmail to Respond */}
                  <path id="line-5" d="M 780 190 L 850 190" className="s7-conn-line" />
                  
                  {/* Respond to end */}
                  <path id="line-6" d="M 940 190 L 960 190" className="s7-conn-line" />

                  {/* Connection Labels / Badges */}
                  {/* Line 1 badges */}
                  <g className="s7-line-badge" id="badge-line-1">
                    <rect x={160} y={178} width={30} height={12} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={175} y={185} className="s7-badge-text">1 item</text>
                  </g>
                  <text x={152} y={202} className="s7-port-label post">POST</text>

                  {/* Line 2 badges */}
                  <g className="s7-line-badge" id="badge-line-2">
                    <rect x={320} y={178} width={30} height={12} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={335} y={185} className="s7-badge-text">1 item</text>
                  </g>

                  {/* Has Message branches labels */}
                  <text x={472} y={170} className="s7-port-label true">true</text>
                  <text x={472} y={214} className="s7-port-label false">false</text>

                  {/* Line 3a badge */}
                  <g className="s7-line-badge" id="badge-line-3a">
                    <rect x={480} y={117} width={30} height={12} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={495} y={124} className="s7-badge-text">1 item</text>
                  </g>

                  {/* Line 4a badge */}
                  <g className="s7-line-badge" id="badge-line-4a">
                    <rect x={640} y={126} width={30} height={12} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={655} y={133} className="s7-badge-text">1 item</text>
                  </g>

                  {/* Line 5 badge */}
                  <g className="s7-line-badge" id="badge-line-5">
                    <rect x={800} y={178} width={30} height={12} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={815} y={185} className="s7-badge-text">1 item</text>
                  </g>

                  {/* Line 6 badge */}
                  <g className="s7-line-badge" id="badge-line-6">
                    <rect x={932} y={166} width={28} height={11} rx={3} fill="#111111" stroke="#333333" strokeWidth="1" />
                    <text x={946} y={172} className="s7-badge-text" style={{ fontSize: '6px' }}>1 item</text>
                  </g>

                  {/* Plus button at the end */}
                  <g id="add-node-button" className="s7-add-node">
                    <rect x={960} y={180} width={20} height={20} rx={4} fill="#141414" stroke="#333333" strokeWidth="1" />
                    <text x={970} y={191} fill="#888899" fontSize="12" textAnchor="middle" dominantBaseline="middle">+</text>
                  </g>

                  {/* Layer 2 (top): Nodes */}
                  {nodes.map((node) => (
                    <g key={node.id} id={`node-group-${node.id}`}>
                      {/* Node Rect (Main square body) */}
                      <rect
                        id={`node-rect-${node.id}`}
                        x={node.x}
                        y={node.y}
                        width={90}
                        height={90}
                        rx={12}
                        className="s7-node-rect"
                      />

                      {/* Top Accent Stripe (n8n colored bar) */}
                      <path
                        d={`M ${node.x + 12} ${node.y} L ${node.x + 78} ${node.y} A 12 12 0 0 1 ${node.x + 90} ${node.y + 12} L ${node.x + 90} ${node.y + 18} L ${node.x} ${node.y + 18} L ${node.x} ${node.y + 12} A 12 12 0 0 1 ${node.x + 12} ${node.y} Z`}
                        fill={node.color}
                      />

                      {/* Icon (conditionally rendered SVG) */}
                      {node.icon === 'webhook' && (
                        <g transform={`translate(${node.x + 30}, ${node.y + 30})`} className="s7-node-icon-svg">
                          {/* Connection lines inside logo */}
                          <path d="M 15 15.5 L 15 9 M 15 15.5 L 8.5 19.5 M 15 15.5 L 21.5 19.5" stroke="#737373" strokeWidth="2.5" strokeLinecap="round" />
                          {/* Top Node (Red/Pink) */}
                          <circle cx="15" cy="9" r="4.5" fill="#ea4b6e" />
                          <circle cx="15" cy="9" r="1.8" fill="#ffffff" />
                          {/* Bottom Left Node (Dark) */}
                          <circle cx="8.5" cy="19.5" r="4.5" fill="#1e1e1e" />
                          <circle cx="8.5" cy="19.5" r="1.8" fill="#ffffff" />
                          {/* Bottom Right Node (Blue) */}
                          <circle cx="21.5" cy="19.5" r="4.5" fill="#4ba9ea" />
                          <circle cx="21.5" cy="19.5" r="1.8" fill="#ffffff" />
                        </g>
                      )}

                      {node.icon === 'pencil' && (
                        <g transform={`translate(${node.x + 30}, ${node.y + 30})`} stroke="#4a90e2" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="s7-node-icon-svg">
                          <path d="M6 24h18" />
                          <path d="M20.25 5.25a2.121 2.121 0 0 1 3 3L9.75 21.75l-4.5 1.5 1.5-4.5L20.25 5.25z" fill="rgba(74, 144, 226, 0.15)" />
                        </g>
                      )}

                      {node.icon === 'split' && (
                        <g transform={`translate(${node.x + 30}, ${node.y + 30})`} stroke="#4eba78" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="s7-node-icon-svg">
                          {/* Post */}
                          <line x1="15" y1="3" x2="15" y2="27" />
                          {/* Top Plank pointing left */}
                          <path d="M15 8H6l-3 4.5 3 4.5h9" fill="rgba(78, 186, 120, 0.15)" />
                          {/* Bottom Plank pointing right */}
                          <path d="M15 16h9l3 4.5-3 4.5H15" fill="rgba(78, 186, 120, 0.15)" />
                        </g>
                      )}

                      {node.icon === 'code' && (
                        <g transform={`translate(${node.x + 30}, ${node.y + 30})`} stroke="#ff9f1c" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="s7-node-icon-svg">
                          {/* Left brace */}
                          <path d="M11 6H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h2" />
                          {/* Right brace */}
                          <path d="M19 6h-2a2 2 0 0 1-2 2v5a2 2 0 0 0-2 2 2 2 0 0 0 2 2v5a2 2 0 0 1 2 2h2" />
                        </g>
                      )}

                      {node.icon === 'gmail' && (
                        <g transform={`translate(${node.x + 30}, ${node.y + 30})`} className="s7-node-icon-svg">
                          {/* Left leg (Blue) */}
                          <path d="M 5 9 L 5 21 C 5 22.1 5.9 23 7 23 L 9.5 23 L 9.5 13 Z" fill="#4285F4" />
                          {/* Right leg (Green) */}
                          <path d="M 25 9 L 25 21 C 25 22.1 24.1 23 23 23 L 20.5 23 L 20.5 13 Z" fill="#34A853" />
                          {/* Middle V (Red) */}
                          <path d="M 5 9 C 5 7.4 6.8 6.5 8.1 7.6 L 15 13.5 L 21.9 7.6 C 23.2 6.5 25 7.4 25 9 L 25 13.5 L 15 21.5 L 5 13.5 Z" fill="#EA4335" />
                          {/* Under fold (Yellow) */}
                          <path d="M 5 9 L 9.5 13 L 9.5 9 Z" fill="#FBBC05" />
                          <path d="M 25 9 L 20.5 13 L 20.5 9 Z" fill="#FBBC05" />
                        </g>
                      )}

                      {/* Left Input Port */}
                      {node.id !== 1 && (
                        <circle
                          cx={node.x}
                          cy={node.y + 45}
                          r={4}
                          className="s7-node-port"
                        />
                      )}

                      {/* Right Output Port(s) */}
                      {node.id === 3 ? (
                        <>
                          <circle
                            cx={node.x + 90}
                            cy={node.y + 30}
                            r={4}
                            className="s7-node-port"
                          />
                          <circle
                            cx={node.x + 90}
                            cy={node.y + 60}
                            r={4}
                            className="s7-node-port"
                          />
                        </>
                      ) : (
                        <circle
                          cx={node.x + 90}
                          cy={node.y + 45}
                          r={4}
                          className="s7-node-port"
                        />
                      )}

                      {/* Label underneath node */}
                      <text
                        x={node.x + 45}
                        y={node.y + 112}
                        className="s7-node-label"
                      >
                        {node.label}
                      </text>

                      {/* Sublabel underneath node (e.g. send: message) */}
                      {node.sublabel && (
                        <text
                          x={node.x + 45}
                          y={node.y + 124}
                          className="s7-node-sublabel"
                        >
                          {node.sublabel}
                        </text>
                      )}

                      {/* Status Label above node */}
                      <text
                        id={`status-text-${node.id}`}
                        x={node.x + 45}
                        y={node.y - 12}
                        className="s7-status-text"
                      >
                        {node.status}
                      </text>

                      {/* Executed Checkmark Badge (green circle + white tick) */}
                      <g id={`checkmark-${node.id}`} className="s7-node-checkmark">
                        <circle cx={node.x + 80} cy={node.y + 80} r="9" fill="#2eb872" />
                        <path d={`M ${node.x + 75} ${node.y + 80} L ${node.x + 79} ${node.y + 84} L ${node.x + 85} ${node.y + 76}`} stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </g>
                  ))}

                  {/* Data Pulse Dot */}
                  <circle
                    id="pulse-dot"
                    r={5}
                    cx={95}
                    cy={190}
                    className="s7-pulse-circle"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Label below SVG Canvas */}
            <div className="s7-bottom-label">
              <span className="s7-pulse-indicator"></span>
              <span>⚡ Powered by n8n · Running live · Local automation server</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
