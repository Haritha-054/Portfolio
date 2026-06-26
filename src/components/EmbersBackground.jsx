import React, { useEffect, useRef } from 'react';

const EmbersBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cv = canvasRef.current;
    const cx = cv.getContext('2d');

    const handleResize = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const ps = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      s: Math.random() * 0.9 + 0.2,
      v: Math.random() * 0.4 + 0.12,
      o: Math.random() * 0.28 + 0.05
    }));

    let animId;
    const drawParticles = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => {
        p.y -= p.v;
        if (p.y < -4) {
          p.y = cv.height + 4;
          p.x = Math.random() * cv.width;
        }
        cx.globalAlpha = p.o;
        cx.fillStyle = '#C9A84C';
        cx.beginPath();
        cx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        cx.fill();
      });
      cx.globalAlpha = 1;
      animId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="pts" ref={canvasRef} />;
};

export default EmbersBackground;
