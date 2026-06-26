import React, { useRef, useState, useEffect } from 'react';

const SoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);

  const initAudio = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, ctx.currentTime); // 55Hz (A1) cinematic ambient rumble
    oscRef.current = osc;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filterNodeRef.current = filter;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime); // Start silent
    gainNodeRef.current = gain;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(0);
  };

  const handleToggle = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;

    if (!isPlaying) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Smooth fade-in
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);
      setIsPlaying(true);
    } else {
      // Smooth fade-out
      gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      id="sound-toggle"
      className="interactive"
      onClick={handleToggle}
      aria-label="Toggle ambient soundtrack"
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--gold)',
        width: '32px',
        height: '32px',
        padding: '4px',
        cursor: 'none',
        outline: 'none',
        pointerEvents: 'auto',
        transition: 'transform 0.2s ease, color 0.2s ease, opacity 0.2s ease',
        opacity: 0.7,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.color = '#FFFFFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '0.7';
        e.currentTarget.style.color = 'var(--gold)';
      }}
    >
      <svg
        id="speaker-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '100%', height: '100%', stroke: 'currentColor' }}
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        
        {/* Muted line path */}
        {!isPlaying && (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}

        {/* Soundwaves when active */}
        {isPlaying && (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
};

export default SoundToggle;
