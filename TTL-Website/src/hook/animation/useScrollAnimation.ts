"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | Element;
  stagger?: number;
  start?: string;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  once?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  selector: string,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    stagger = 0.08,
    start = "top 85%",
    y = 40,
    opacity = 0,
    duration = 0.6,
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    const anim = gsap.fromTo(
      targets,
      { y, opacity, scale: options.scale ?? 1 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration,
        force3D: true,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reset",
        },
      }
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === el) t.kill();
      });
    };
  }, [selector, stagger, start, y, opacity, duration, once]);

  return ref;
}
