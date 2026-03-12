import * as THREE from "three";
import { useMemo } from "react";

export function ReactorGlass() {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1.35, 1.15, 2.5, 48, 1, true);
    g.translate(0, 0.2, 0);
    return g;
  }, []);

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0b1224"),
        roughness: 0.15,
        metalness: 0.0,
        transmission: 0.96,
        thickness: 0.6,
        ior: 1.45,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      }),
    []
  );

  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0b1224",
        roughness: 0.35,
        metalness: 0.75,
        emissive: new THREE.Color("#0b1224"),
        emissiveIntensity: 0.2
      }),
    []
  );

  return (
    <group>
      <mesh geometry={geo} material={glass} />
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[1.28, 0.04, 16, 64]} />
        <primitive object={rim} attach="material" />
      </mesh>
      <mesh position={[0, -1.03, 0]}>
        <cylinderGeometry args={[1.22, 1.05, 0.12, 48]} />
        <primitive object={rim} attach="material" />
      </mesh>
    </group>
  );
}

