"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const _consoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  _consoleWarn(...args);
};

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

const PARTICLE_DATA = (() => {
  const count = 2000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const c = new THREE.Color().setHSL(
      0.55 + Math.random() * 0.15,
      0.5,
      0.2 + Math.random() * 0.4,
    );
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { positions: pos, colors: col };
})();

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { tick } = useProgress();
  const { positions, colors } = PARTICLE_DATA;

  useFrame((_, delta) => {
    tick(delta);
    ref.current.rotation.y += delta * 0.008;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

const NEURAL_GEOMETRY = (() => {
  const nodes = 50;
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

function NeuralWeb() {
  const ref = useRef<THREE.LineSegments>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const { progress, tick } = useProgress();
  const elapsed = useRef(0);
  const geometry = NEURAL_GEOMETRY;
  const pulseSpeed = PULSE_SPEED;

  useFrame((_, delta) => {
    tick(delta);
    elapsed.current += delta;
    const t = elapsed.current;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.06;
    ref.current.rotation.y = t * 0.008;
    matRef.current.opacity =
      (0.03 + Math.sin(t * pulseSpeed) * 0.015) * progress.current;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial ref={matRef} color="#1856ff" transparent opacity={0} />
    </lineSegments>
  );
}

const ORBIT_POSITIONS = (() => {
  const count = 120;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const offset = Math.random() * 0.5;
    const radius = 2.1 + offset;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return pos;
})();

function OrbitParticles() {
  const ref = useRef<THREE.Points>(null!);
  const { progress, tick } = useProgress();
  const elapsed = useRef(0);
  const positions = ORBIT_POSITIONS;

  useFrame((_, delta) => {
    tick(delta);
    elapsed.current += delta;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x = Math.sin(elapsed.current * 0.08) * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        size={0.03}
        color="#22d3ee"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

type ShapeData = {
  pos: [number, number, number];
  rotSpeed: number;
  hue: number;
  size: number;
  delay: number;
};

const CRYSTAL_SHAPES: ShapeData[] = (() => {
  const items: ShapeData[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 2.8 + Math.random() * 1.2;
    items.push({
      pos: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius,
      ],
      rotSpeed: 0.2 + Math.random() * 0.6,
      hue: 0.55 + Math.random() * 0.15,
      size: 0.05 + Math.random() * 0.08,
      delay: Math.random() * 2,
    });
  }
  return items;
})();

function CrystalShapes() {
  const groupRef = useRef<THREE.Group>(null!);
  const { progress, tick } = useProgress();
  const elapsed = useRef(0);
  const shapes = CRYSTAL_SHAPES;

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    tick(delta);
    elapsed.current += delta;
    const t = elapsed.current;
    groupRef.current.rotation.y = t * 0.04;
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x += delta * shapes[i].rotSpeed;
        mesh.rotation.y += delta * shapes[i].rotSpeed * 0.6;
        const { material } = mesh as unknown as {
          material: THREE.MeshBasicMaterial;
        };
        if (material) {
          const revealDelay = Math.max(
            0,
            Math.min(1, (progress.current * 3 - shapes[i].delay) / 1),
          );
          material.opacity = 0.1 * revealDelay;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => {
        const c = new THREE.Color().setHSL(s.hue, 0.8, 0.5);
        return (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            position={s.pos}
          >
            <octahedronGeometry args={[s.size, 0]} />
            <meshBasicMaterial
              color={c.getHex()}
              transparent
              opacity={0}
              wireframe
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <fog attach="fog" args={["#0c1e3a", 5, 12]} />
        <ParticleField />
        <NeuralWeb />
        <OrbitParticles />
        <CrystalShapes />
      </Canvas>
    </div>
  );
}
