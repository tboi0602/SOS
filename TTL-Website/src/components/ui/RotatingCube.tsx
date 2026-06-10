"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useTheme } from "@/components/ui/ThemeProvider";

function GoldCube({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  const theme = useMemo(() => {
    if (isDark) {
      return {
        core: "#6B4E0A",
        c1: "#7A5510",
        c2: "#B8922E",
        glow: "#D4AF37",
        edge: "#D4AF37",
        edgeGlow: "#B8922E",
        baseAlpha: 0.06,
        gridMul: 0.15,
        scanMul: 0.45,
        borderMul: 0.3,
      };
    }
    return {
      core: "#A0822E",
      c1: "#C9A83E",
      c2: "#D4AF37",
      glow: "#F7E7B8",
      edge: "#F7E7B8",
      edgeGlow: "#D4AF37",
      baseAlpha: 0.1,
      gridMul: 0.2,
      scanMul: 0.5,
      borderMul: 0.35,
    };
  }, [isDark]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(theme.c1) },
    uColor2: { value: new THREE.Color(theme.c2) },
    uGlow: { value: new THREE.Color(theme.glow) },
  }), [theme.c1, theme.c2, theme.glow]);

  const shaderDef = useMemo(() => ({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uGlow;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 gold = mix(uColor1, uColor2, vUv.y);
        float gridX = step(0.96, fract(vUv.x * 8.0));
        float gridY = step(0.96, fract(vUv.y * 8.0));
        float grid = max(gridX, gridY);
        float scan = smoothstep(0.08, 0.0, abs(vUv.y - mod(uTime * 0.3, 1.4) + 0.1));
        float border = step(0.97, vUv.x) + step(0.97, vUv.y) + step(vUv.x, 0.03) + step(vUv.y, 0.03);
        border = clamp(border, 0.0, 1.0);

        vec3 viewDir = normalize(-vPosition);
        vec3 normal = normalize(vNormal);
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        float spec = pow(max(dot(reflect(-viewDir, normal), viewDir), 0.0), 32.0);

        vec3 bright = mix(uGlow, vec3(1.0, 0.95, 0.8), scan * 0.3 + spec * 0.8);
        float shininess = 0.3 + fresnel * 0.4 + spec * 0.6;
        vec3 finalColor = mix(gold, bright, scan * 0.3 + shininess * 0.2);

        float alpha = ${theme.baseAlpha} + (grid * ${theme.gridMul}) + (scan * ${theme.scanMul}) + (border * ${theme.borderMul}) + fresnel * 0.08 + spec * 0.1;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), [uniforms, theme]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={[0.98, 0.98, 0.98]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial color={theme.core} transparent opacity={isDark ? 0.9 : 0.85} depthWrite={true} />
      </mesh>

      <mesh>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <shaderMaterial ref={shaderRef} args={[shaderDef]} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.505, 2.505, 2.505)]} />
        <lineBasicMaterial color={theme.edge} transparent opacity={isDark ? 0.5 : 0.65} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.55, 2.55, 2.55)]} />
        <lineBasicMaterial color={theme.edgeGlow} transparent opacity={isDark ? 0.2 : 0.35} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

export default function RotatingCube() {
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
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ width: "100%", height: "100%", background: "transparent" }}>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false} enablePan={false}
        autoRotate autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5}
      />
      <GoldCube isDark={isDark} />
    </Canvas>
  );
}
