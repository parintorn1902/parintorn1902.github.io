import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import ParticleField from './ParticleField';
import GeometricElements from './GeometricElements';

/**
 * Main 3D Scene component
 * Renders fixed background canvas that reacts to scroll position
 */
const Scene = () => {
  const scrollProgress = useScrollProgress();

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      dpr={[1, 2]} // Limit pixel ratio for performance
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#00ff41" intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00d9ff" intensity={0.3} />

      {/* 3D Elements */}
      <ParticleField scrollProgress={scrollProgress} />
      <GeometricElements scrollProgress={scrollProgress} />

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5 + scrollProgress * 0.3}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
