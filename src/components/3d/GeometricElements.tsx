import * as THREE from 'three';

interface GeometricElementsProps {
  scrollProgress: number;
}

/**
 * Floating geometric wireframe shapes with parallax effect
 * Elements rotate, scale, and move based on scroll position
 */
const GeometricElements = ({ scrollProgress }: GeometricElementsProps) => {
  return (
    <group>
      {/* Rotating wireframe cube - front left */}
      <mesh
        position={[-8, 3, -10]}
        rotation={[
          scrollProgress * Math.PI * 2,
          scrollProgress * Math.PI * 1.5,
          scrollProgress * Math.PI * 0.5,
        ]}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshBasicMaterial
          color="#00ff41"
          wireframe
          transparent
          opacity={0.2 + scrollProgress * 0.3}
        />
      </mesh>

      {/* Rotating wireframe cube - front right */}
      <mesh
        position={[8, -2, -8]}
        rotation={[
          scrollProgress * Math.PI * -1.5,
          scrollProgress * Math.PI * 2,
          scrollProgress * Math.PI * -0.5,
        ]}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.2 + scrollProgress * 0.3}
        />
      </mesh>

      {/* Torus (ring) - mid depth */}
      <mesh
        position={[5, 4, -15]}
        rotation={[
          Math.PI / 2 + scrollProgress * Math.PI,
          0,
          scrollProgress * Math.PI * 0.5,
        ]}
      >
        <torusGeometry args={[2, 0.5, 16, 32]} />
        <meshBasicMaterial
          color="#ff2a6d"
          wireframe
          transparent
          opacity={0.15 + scrollProgress * 0.25}
        />
      </mesh>

      {/* Small octahedron - floating */}
      <mesh
        position={[-6, -4, -12]}
        rotation={[
          scrollProgress * Math.PI * 1.2,
          scrollProgress * Math.PI * -1.8,
          0,
        ]}
        scale={1 + scrollProgress * 0.5}
      >
        <octahedronGeometry args={[1.5]} />
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.2 + scrollProgress * 0.3}
        />
      </mesh>

      {/* Grid plane - floor with parallax */}
      <mesh
        position={[0, -8, -20 - scrollProgress * 15]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[60, 60, 24, 24]} />
        <meshBasicMaterial
          color="#00ff41"
          wireframe
          transparent
          opacity={0.05 + scrollProgress * 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical grid - back wall with parallax */}
      <mesh
        position={[0, 0, -35 - scrollProgress * 20]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.03 + scrollProgress * 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Small floating cube cluster - far right */}
      <group position={[12, 0, -25]}>
        <mesh
          position={[0, 2, 0]}
          rotation={[scrollProgress * Math.PI, 0, scrollProgress * Math.PI * 0.5]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#ff2a6d"
            wireframe
            transparent
            opacity={0.15 + scrollProgress * 0.2}
          />
        </mesh>
        <mesh
          position={[2, -1, 1]}
          rotation={[0, scrollProgress * Math.PI * 1.5, scrollProgress * Math.PI]}
        >
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial
            color="#00ff41"
            wireframe
            transparent
            opacity={0.15 + scrollProgress * 0.2}
          />
        </mesh>
      </group>

      {/* Large wireframe sphere - deep background */}
      <mesh
        position={[0, 5, -50 - scrollProgress * 25]}
        rotation={[0, scrollProgress * Math.PI * 0.3, 0]}
        scale={1 + scrollProgress * 0.5}
      >
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.02 + scrollProgress * 0.05}
        />
      </mesh>
    </group>
  );
};

export default GeometricElements;
