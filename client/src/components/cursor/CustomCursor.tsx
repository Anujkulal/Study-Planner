import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Set initial opacity to 0
    gsap.set([cursor, follower], { opacity: 0 });

    // Fade in cursor on first mouse move
    let hasMovedMouse = false;
    
    const fadeInCursor = () => {
      if (!hasMovedMouse) {
        gsap.to([cursor, follower], {
          opacity: 1,
          duration: 0.3,
        });
        hasMovedMouse = true;
      }
    };

    // Move cursor instantly
    const moveCursor = (e: MouseEvent) => {
      fadeInCursor();
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
    };

    // Move follower with delay (smooth effect)
    const moveFollower = (e: MouseEvent) => {
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add hover effect on interactive elements
    const addHoverEffect = () => {
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3,
      });
      gsap.to(follower, {
        scale: 3,
        backgroundColor: 'rgb(202, 202, 202)', // Blue-500 fill
        duration: 0.3,
      });
    };

    const removeHoverEffect = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
      });
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent', // Remove fill
        duration: 0.3,
      });
    };

    // Event listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', moveFollower);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], [role="link"]');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', moveFollower);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', addHoverEffect);
        el.removeEventListener('mouseleave', removeHoverEffect);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gray-100 rounded-full pointer-events-none z-9999 mix-blend-difference opacity-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-5 h-5 border border-gray-100 rounded-full pointer-events-none z-9998 mix-blend-difference opacity-0"
        style={{ 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'transparent'
        }}
      />
    </>
  );
};