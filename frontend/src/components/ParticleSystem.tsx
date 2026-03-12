import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { InstancedMesh } from "three";
import { useSimulationStore } from "../store/simulationStore";

export function ParticleSystem() {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const frame = useSimulationStore((s) => s.frame);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 10, 10);
    const material = new THREE.MeshStandardMaterial({
      color: "#7dd3fc",
      roughness: 0.35,
      metalness: 0.05,
      emissive: new THREE.Color("#0ea5e9"),
      emissiveIntensity: 0.35
    });
    return { geometry, material };
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !frame) return;

    const n = frame.particles.length;
    for (let i = 0; i < n; i++) {
      const p = frame.particles[i];
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.r);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, 3000]} frustumCulled={false} />;
}

