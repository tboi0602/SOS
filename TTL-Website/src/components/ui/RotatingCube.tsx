"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// Shader xanh không gian: Tạo độ sâu bằng Gradient từ Xanh đậm sang Cyan rực sáng
const BlueMysticShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#050b24") }, // Xanh đêm vũ trụ (Deep Navy)
    uColor2: { value: new THREE.Color("#00b7ff") }, // Xanh Cyan kĩ thuật số (Electric Cyan)
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      // Tạo dải màu chuyển tiếp (Gradient) từ tối sang sáng theo trục đứng Y
      vec3 baseColor = mix(uColor1, uColor2, vUv.y);

      // 1. Mạng lưới vi mạch công nghệ trên các mặt lập phương
      float gridX = step(0.96, fract(vUv.x * 6.0));
      float gridY = step(0.96, fract(vUv.y * 6.0));
      float grid = max(gridX, gridY);

      // 2. Tia quét ma trận mượt mà chạy dọc thân khối
      float scanline = smoothstep(0.08, 0.0, abs(vUv.y - mod(uTime * 0.35, 1.4) + 0.1));
      
      // 3. Viền khối phát quang sát các mép cạnh
      float border = step(0.97, vUv.x) + step(0.97, vUv.y) + step(vUv.x, 0.03) + step(vUv.y, 0.03);
      border = clamp(border, 0.0, 1.0);

      // Tính toán độ trong suốt cho lớp vỏ ngoài của khối lập phương
      float alpha = 0.04 + (grid * 0.12) + (scanline * 0.4) + (border * 0.3);

      // Tạo điểm nhấn sáng trắng xanh tại vùng tia quét chạy qua cho sinh động
      vec3 finalColor = mix(baseColor, vec3(0.8, 0.95, 1.0), scanline * 0.5);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

function TechBlueCube() {
  const groupRef = useRef<THREE.Group>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Tốc độ xoay mượt mà tạo chiều sâu không gian
      groupRef.current.rotation.x += delta * 0.12;
      groupRef.current.rotation.y += delta * 0.18;
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── 1. LÕI LẬP PHƯƠNG TRONG SUỐT NHẸ (Màu Xanh Navy đậm - Opacity 0.95) ── */}
      <mesh scale={[0.98, 0.98, 0.98]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial
          color="#0f2546" // Màu Xanh Navy đậm Tech-UI cực sang
          transparent
          opacity={0.95} // Độ trong suốt nhẹ 0.95 theo đúng ý bạn
          depthWrite={true}
        />
      </mesh>

      {/* ── 2. LỚP VỎ GRADIENT LẬP PHƯƠNG CHẠY MA TRẬN ── */}
      <mesh>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <shaderMaterial
          ref={shaderRef}
          args={[BlueMysticShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 3. KHUNG VIỀN CHÍNH LẬP PHƯƠNG (Cyan rực rỡ) ── */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.505, 2.505, 2.505)]} />
        <lineBasicMaterial
          color="#00b7ff"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* ── 4. KHUNG ĐỆM PHỤ LAN TỎA HÀO QUANG (Navy Glow) ── */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.53, 2.53, 2.53)]} />
        <lineBasicMaterial
          color="#0f2546"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function RotatingCube() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const pause = () => {
      controls.autoRotate = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const resume = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 1500);
    };

    controls.addEventListener("start", pause);
    controls.addEventListener("end", resume);
    return () => {
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end", resume);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.0}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />

      <TechBlueCube />
    </Canvas>
  );
}
