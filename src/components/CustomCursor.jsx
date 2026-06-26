import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const curRef = useRef(null);
  const crrRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursor = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      if (curRef.current) {
        curRef.current.style.left = `${e.clientX}px`;
        curRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button') || e.target.closest('.interactive') || e.target.closest('a')) {
        setIsOn(true);
      } else {
        setIsOn(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    let animId;
    const updatePosition = () => {
      const lerp = 0.1;
      cursor.current.x += (mouse.current.x - cursor.current.x) * lerp;
      cursor.current.y += (mouse.current.y - cursor.current.y) * lerp;

      if (crrRef.current) {
        crrRef.current.style.left = `${cursor.current.x}px`;
        crrRef.current.style.top = `${cursor.current.y}px`;
      }
      animId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef} />
      <div id="cur-r" ref={crrRef} className={isOn ? 'on' : ''} />
    </>
  );
};

export default CustomCursor;
