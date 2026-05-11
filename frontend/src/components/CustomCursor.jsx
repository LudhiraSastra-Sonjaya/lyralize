import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Move cursor
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    // Hover effect on interactable elements
    const handleHoverIn = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Electric blue tint
        border: '1px solid rgba(59, 130, 246, 0.8)',
        duration: 0.3,
      });
    };

    const handleHoverOut = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'rgba(248, 250, 252, 1)', // White
        border: 'none',
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Add event listeners to all links and buttons
    const interactables = document.querySelectorAll('a, button');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverIn);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
    />
  );
};

export default CustomCursor;
