"use client"

import { useScroll, useTransform, MotionValue } from "framer-motion"

export function useScrollGlow(
  inputRange: [number, number] = [0, 0.3],
  outputRange: [number, number] = [0.3, 1],
): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  return useTransform(scrollYProgress, inputRange, outputRange)
}
