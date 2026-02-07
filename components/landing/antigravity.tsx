/**
 * Antigravity — Interactive 3D particle field background
 *
 * Uses Three.js + React Three Fiber (native) for GPU-accelerated
 * instanced-mesh particles that react to touch and auto-animate.
 * White capsule particles on black background for the hero section.
 */
import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';

/* ── Props ───────────────────────────────────────────────────────────── */
interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  interactive?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

/* ── Inner scene (runs inside Canvas) ────────────────────────────────── */
const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 200,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#ffffff',
  autoAnimate = true,
  interactive = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastPointerPos = useRef({ x: 0, y: 0 });
  const lastPointerTime = useRef(0);
  const virtualPointer = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = [];
    const w = viewport.width || 60;
    const h = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;

      const x = (Math.random() - 0.5) * w;
      const y = (Math.random() - 0.5) * h;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v, pointer: m } = state;

    let destX = 0;
    let destY = 0;

    if (interactive) {
      // Detect pointer movement
      const pointerDist = Math.sqrt(
        (m.x - lastPointerPos.current.x) ** 2 + (m.y - lastPointerPos.current.y) ** 2,
      );

      if (pointerDist > 0.001) {
        lastPointerTime.current = Date.now();
        lastPointerPos.current = { x: m.x, y: m.y };
      }

      destX = (m.x * v.width) / 2;
      destY = (m.y * v.height) / 2;

      // Auto-animate when no touch for 2s
      if (autoAnimate && Date.now() - lastPointerTime.current > 2000) {
        const time = state.clock.getElapsedTime();
        destX = Math.sin(time * 0.5) * (v.width / 4);
        destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
      }
    } else if (autoAnimate) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualPointer.current.x += (destX - virtualPointer.current.x) * smoothFactor;
    virtualPointer.current.y += (destY - virtualPointer.current.y) * smoothFactor;

    const targetX = virtualPointer.current.x;
    const targetY = virtualPointer.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((particle, i) => {
      let { mx, my, mz, cz, randomRadiusOffset } = particle;
      const t = (particle.t += particle.speed / 2);

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tpX = mx;
      let tpY = my;
      let tpZ = mz * depthFactor;

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;

        tpX = projectedTargetX + currentRingRadius * Math.cos(angle);
        tpY = projectedTargetY + currentRingRadius * Math.sin(angle);
        tpZ = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      particle.cx += (tpX - particle.cx) * lerpSpeed;
      particle.cy += (tpY - particle.cy) * lerpSpeed;
      particle.cz += (tpZ - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToPointer = Math.sqrt(
        (particle.cx - projectedTargetX) ** 2 + (particle.cy - projectedTargetY) ** 2,
      );

      const distFromRing = Math.abs(currentDistToPointer - ringRadius);
      let scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10));

      const finalScale =
        scaleFactor *
        (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) *
        particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.06, 0.25, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.12, 12, 12]} />}
      {particleShape === 'box' && <boxGeometry args={[0.18, 0.18, 0.18]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.18]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

/* ── Public component ────────────────────────────────────────────────── */
export function Antigravity(props: AntigravityProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1, pointerEvents: 'none' }]}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 35 }}
        style={{ backgroundColor: 'transparent' }}
        gl={{ alpha: true }}
        events={undefined}
      >
        <AntigravityInner {...props} />
      </Canvas>
    </View>
  );
}

export default Antigravity;
