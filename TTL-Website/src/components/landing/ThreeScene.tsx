"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/ui/ThemeProvider";

function useProgress(duration = 3) {
  const ref = useRef(0);
  const elapsed = useRef(0);

  const tick = (delta: number) => {
    elapsed.current = Math.min(elapsed.current + delta, duration);
    const t = elapsed.current / duration;
    ref.current = t * t * (3 - 2 * t);
  };

  return { progress: ref, tick };
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    const t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    const t2 = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}

function ParticleField({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const { tick } = useProgress();

  const { pos, col } = useMemo(() => {
    const rng = mulberry32(42);
    const count = 800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + rng() * 9;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (rng() - 0.5) * 7;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = new THREE.Color(
        isDark ? "hsl(25, 30%, 40%)" : "hsl(40, 25%, 65%)",
      );
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { pos, col };
  }, [isDark]);

  useFrame((_, delta) => {
    tick(delta);
    ref.current.rotation.y += delta * 0.006;
  });

  return (
    <Points
      ref={ref}
      positions={pos}
      colors={col}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

const NEURAL_GEOMETRY = (() => {
  const nodes = 30;
  const pos: number[] = [];
  for (let i = 0; i < nodes; i++) {
    const r = 1.8 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
  }
  const pairs: number[] = [];
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 3) {
        pairs.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
        pairs.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pairs, 3));
  return geo;
})();

const PULSE_SPEED = 0.5 + Math.random() * 0.3;

function NeuralWeb({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.LineSegments>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const { progress, tick } = useProgress();
  const elapsed = useRef(0);
  const geometry = NEURAL_GEOMETRY;
  const pulseSpeed = PULSE_SPEED;
  const lineColor = isDark ? "#58130F" : "#A07235";

  useFrame((_, delta) => {
    tick(delta);
    elapsed.current += delta;
    const t = elapsed.current;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.06;
    ref.current.rotation.y = t * 0.008;
    matRef.current.opacity =
      (0.015 + Math.sin(t * pulseSpeed) * 0.008) * progress.current;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color={lineColor}
        transparent
        opacity={0}
      />
    </lineSegments>
  );
}

function OrbitParticles({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const { progress, tick } = useProgress();
  const elapsed = useRef(0);
  const pos = useMemo(() => {
    const rng = mulberry32(42);
    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = rng() * 0.5;
      const radius = 2.1 + offset;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (rng() - 0.5) * 0.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);
  const particleColor = isDark ? "#F0CC1A" : "#A07235";

  useFrame((_, delta) => {
    tick(delta);
    elapsed.current += delta;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x = Math.sin(elapsed.current * 0.08) * 0.15;
  });

  return (
    <Points ref={ref} positions={pos} stride={3} frustumCulled={false}>
      <PointMaterial
        size={0.02}
        color={particleColor}
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function ThreeScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <fog attach="fog" args={[isDark ? "#0a0808" : "#ffffff", 5, 14]} />
        <ParticleField isDark={isDark} />
        <NeuralWeb isDark={isDark} />
        <OrbitParticles isDark={isDark} />
      </Canvas>
    </div>
  );
}
