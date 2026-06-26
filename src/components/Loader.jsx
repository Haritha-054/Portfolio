import React, { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [tagOn, setTagOn] = useState(false);
  const [droppedIndices, setDroppedIndices] = useState(new Set());
  const [glowingIndices, setGlowingIndices] = useState(new Set());
  const [ctaOn, setCtaOn] = useState(false);

  const row1 = "HARITHA".split("");
  const row2 = "REDDY".split("");
  const totalLettersCount = row1.length + row2.length;

  useEffect(() => {
    const t1 = setTimeout(() => setRulesOpen(true), 200);
    const t2 = setTimeout(() => setTagOn(true), 550);

    // Letter drops stagger-wise
    const dropTimers = [];
    for (let i = 0; i < totalLettersCount; i++) {
      const timer = setTimeout(() => {
        setDroppedIndices(prev => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }, 480 + i * 72);
      dropTimers.push(timer);
    }

    // Letter glows stagger-wise
    const glowTimers = [];
    const doneTime = 480 + totalLettersCount * 72 + 350;
    for (let i = 0; i < totalLettersCount; i++) {
      const timer = setTimeout(() => {
        setGlowingIndices(prev => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }, doneTime + i * 38);
      glowTimers.push(timer);
    }

    // CTA reveal
    const ctaTime = doneTime + totalLettersCount * 38 + 400;
    const t3 = setTimeout(() => setCtaOn(true), ctaTime);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      dropTimers.forEach(clearTimeout);
      glowTimers.forEach(clearTimeout);
    };
  }, []);

  const renderLetter = (char, index) => {
    const isDropped = droppedIndices.has(index);
    const isGlowing = glowingIndices.has(index);
    let classes = 'lt';
    if (isDropped) classes += ' drop';
    if (isGlowing) classes += ' glow';

    return (
      <span
        key={index}
        className={classes}
        style={{
          transitionDuration: '.68s, .26s'
        }}
      >
        {char}
      </span>
    );
  };

  return (
    <section id="s0">
      <div id="r1" className={`rule ${rulesOpen ? 'open' : ''}`} />
      
      <div style={{ textAlign: 'center' }}>
        <p id="s0-tag" className={tagOn ? 'on' : ''}>
          Full Stack Developer &nbsp;·&nbsp; AI Builder &nbsp;·&nbsp; Hackathon Winner
        </p>
        
        <div id="stage">
          <div className="nrow" id="nr1">
            {row1.map((char, i) => renderLetter(char, i))}
          </div>
          <div className="nrow" id="nr2">
            {row2.map((char, i) => renderLetter(char, i + row1.length))}
          </div>
        </div>
      </div>

      <div id="r2" className={`rule ${rulesOpen ? 'open' : ''}`} />

      <div id="cta-w" className={ctaOn ? 'on' : ''}>
        <button id="cta-btn" className="interactive" onClick={onComplete}>
          ⚡ &nbsp; Let's Dive In &nbsp; →
        </button>
        <span className="bob">↓ &nbsp; scroll to explore</span>
      </div>
    </section>
  );
};

export default Loader;
