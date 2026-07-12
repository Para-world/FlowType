"use client";

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGsap } from '@/hooks/useGsap';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const containerRef = useRef(null);

  useGsap(() => {
    // When pathname changes, animate the container in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
}
