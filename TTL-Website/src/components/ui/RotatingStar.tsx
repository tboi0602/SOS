"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useTheme } from "@/components/ui/ThemeProvider";

function createStarShape(outerR: number, innerR: number, points: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    const t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    const t2 = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}

function SparkleParticles({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 120;
  const positions = useMemo(() => {
    const rng = mulberry32(42);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 3 + rng() * 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <pointsMaterial
        size={0.06}
        color="#FFE55C"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Points(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(props.positions, 3));
    return g;
  }, [props.positions]);
  return (
    <points ref={ref} geometry={geo} {...props}>
      {props.children}
    </points>
  );
}

function GoldStar({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  const starShape = useMemo(() => createStarShape(1.8, 0.75, 5), []);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.04,
      bevelSegments: 5,
    };
    const geo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [starShape]);

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(isDark ? "#F5D97A" : "#DDB84D"),
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(isDark ? "#D4AF37" : "#C9952A"),
    emissiveIntensity: isDark ? 0.35 : 0.45,
    envMapIntensity: 1.5,
  }), [isDark]);

  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: "#FFE55C",
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  }), []);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#FFD700",
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
  }), []);

  const outerGlowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#FFC125",
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
  }), []);

  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  const glowGeometry = useMemo(() => {
    const g = geometry.clone();
    g.scale(1.12, 1.12, 1.12);
    return g;
  }, [geometry]);

  const outerGlowGeometry = useMemo(() => {
    const g = geometry.clone();
    g.scale(1.35, 1.35, 1.35);
    return g;
  }, [geometry]);

  const outerGlowRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.06;
      groupRef.current.rotation.y += delta * 0.1;
    }
    const t = state.clock.elapsedTime;
    if (glowRef.current && !Array.isArray(glowRef.current.material)) {
      const pulse = 0.12 + Math.sin(t * 1.2) * 0.05;
      (glowRef.current.material as { opacity: number }).opacity = pulse;
    }
    if (outerGlowRef.current && !Array.isArray(outerGlowRef.current.material)) {
      const pulse = 0.05 + Math.sin(t * 0.8 + 0.5) * 0.025;
      (outerGlowRef.current.material as { opacity: number }).opacity = pulse;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={outerGlowGeometry} ref={outerGlowRef} material={outerGlowMaterial} />
      <mesh geometry={glowGeometry} ref={glowRef} material={glowMaterial} />
      <mesh geometry={geometry} material={material}>
        <pointLight ref={lightRef} intensity={0.8} distance={8} color="#FFD700" />
      </mesh>
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
      <SparkleParticles isDark={isDark} />
    </group>
  );
}

export default function RotatingStar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const pause = () => { controls.autoRotate = false; if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    const resume = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => { controls.autoRotate = true; }, 1500);
    };

    controls.addEventListener("start", pause);
    controls.addEventListener("end", resume);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end", resume);
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ width: "100%", height: "100%", background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <directionalLight position={[-3, -3, 2]} intensity={0.4} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false} enablePan={false}
        autoRotate autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5}
      />
      <GoldStar isDark={isDark} />
    </Canvas>
  );
}
