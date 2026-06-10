"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  scrollTrigger?: boolean;
}

export default function SplitHeading({ text, as: Tag = "h1", className = "", scrollTrigger = true }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, { type: "words" });
      gsap.from(split.words, {
        y: 30,
        opacity: 0,
        rotateX: -20,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: scrollTrigger ? { trigger: el, start: "top 85%", toggleActions: "play none none none" } : undefined,
      });
    });

    return () => ctx.revert();
  }, [text, scrollTrigger]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
