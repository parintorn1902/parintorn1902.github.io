import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  scrollProgress: number;
}

/**
 * Matrix rain-style particle field that reacts to scroll
 * Particles fall faster and become more visible as user scrolls
 */
const ParticleField = ({ scrollProgress }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Adjust particle count based on device (mobile vs desktop)
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 300 : 800;

  // Initialize particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z

      // Random fall velocity
      velocities[i] = 0.01 + Math.random() * 0.03;
    }

    return { positions, velocities };
  }, [particleCount]);

  // Animate particles (Matrix rain effect)
  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Speed increases with scroll
      const speed = particles.velocities[i] * (1 + scrollProgress * 2);

      // Move particle down
      positions[i * 3 + 1] -= speed;

      // Reset to top when particle falls below bottom
      if (positions[i * 3 + 1] < -25) {
        positions[i * 3 + 1] = 25;
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ff41"
        transparent
        opacity={0.4 + scrollProgress * 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
