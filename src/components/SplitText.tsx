
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: any;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  style,
  delay = 50,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const [elements, setElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!text) return;

    if (splitType === 'chars') {
      const chars = text.split('').map((char, index) => (
        <span
          key={index}
          className="split-char inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ));
      setElements(chars);
    } else if (splitType === 'words') {
      const words = text.split(' ').map((word, index) => (
        <span key={index} className="split-word inline-block mr-[0.25em]">
          {word}
        </span>
      ));
      setElements(words);
    } else {
      // Simple fallback for lines or others
      setElements([<span key="0">{text}</span>]);
    }
  }, [text, splitType]);

  useGSAP(() => {
    if (elements.length === 0 || !containerRef.current) return;

    const targets = containerRef.current.children;
    
    gsap.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          once: true,
        },
        onComplete: () => {
          onLetterAnimationComplete?.();
        },
      }
    );
  }, { dependencies: [elements], scope: containerRef });

  return (
    // @ts-ignore
    <Tag
      ref={containerRef}
      className={`split-parent ${className}`}
      style={{ textAlign, display: 'inline-block', width: '100%', ...style }}
    >
      {elements}
    </Tag>
  );
};

export default SplitText;
