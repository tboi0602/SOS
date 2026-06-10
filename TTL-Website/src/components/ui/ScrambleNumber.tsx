"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

interface ScrambleNumberProps {
  value: string;
  className?: string;
  delay?: number;
}

export default function ScrambleNumber({ value, className = "", delay = 0 }: ScrambleNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
        onEnter: () => {
          setVisible(true);
          gsap.to(el, {
            duration: 1.2,
            scrambleText: { text: value, chars: "0123456789", revealDelay: 0.3 },
            ease: "power2.out",
            delay,
          });
        },
      });
    });

    return () => ctx.revert();
  }, [value, delay]);

  return <span ref={ref} className={className}>{visible ? value : "0"}</span>;
}
