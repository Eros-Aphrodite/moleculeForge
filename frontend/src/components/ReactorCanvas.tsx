import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "./ParticleSystem";
import { ReactorGlass } from "./ReactorGlass";

export function ReactorCanvas() {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 4.2], fov: 50, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} />
      <Environment preset="city" />

      <group position={[0, -0.2, 0]}>
        <ReactorGlass />
        <ParticleSystem />
      </group>

      <OrbitControls enablePan={false} minDistance={2.2} maxDistance={7} />
    </Canvas>
  );
}

