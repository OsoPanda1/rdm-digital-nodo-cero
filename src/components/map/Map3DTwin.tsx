import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { MapMarkerData, MapViewportState } from "@/features/places/mapTypes";

const GEO_LNG_CENTER = -98.6732;
const GEO_LAT_OFFSET = 20.1374;
const GEO_COORD_SCALE = 160;

interface Map3DTwinProps {
  viewport: MapViewportState;
  markers: MapMarkerData[];
  userPosition?: { lat: number; lng: number } | null;
  aiPilotEnabled?: boolean;
  onViewportChange: (next: Partial<MapViewportState>) => void;
}

function FoggyTerrain({ points }: { points: MapMarkerData[] }) {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(18, 18, 120, 120);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(x * 0.75) * 0.25 + Math.cos(y * 0.9) * 0.18;
      const noise = Math.sin((x + y) * 1.8) * 0.12;
      positions.setZ(i, wave + noise);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group rotation-x={-Math.PI / 2.8}>
      <mesh geometry={geom} receiveShadow castShadow>
        <meshStandardMaterial
          color="#1b2539"
          metalness={0.15}
          roughness={0.95}
          emissive="#1f2f4d"
          emissiveIntensity={0.1}
        />
      </mesh>
      {points.map((point) => (
        <mesh
          key={point.id}
          position={[(point.lng - GEO_LNG_CENTER) * GEO_COORD_SCALE, 0.18, -(point.lat - GEO_LAT_OFFSET) * GEO_COORD_SCALE]}
          castShadow
        >
          <sphereGeometry args={[point.isPremium ? 0.18 : 0.13, 24, 24]} />
          <meshStandardMaterial
            color={point.isPremium ? "#f59e0b" : point.type === "place" ? "#60a5fa" : "#34d399"}
            emissive={point.isPremium ? "#f59e0b" : "#6ea8ff"}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}


function FogPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float wave = sin((vUv.x * 9.0) + uTime * 0.28) * 0.08;
            float band = smoothstep(0.25 + wave, 0.82 + wave, vUv.y);
            float alpha = (1.0 - band) * 0.22;
            gl_FragColor = vec4(0.74, 0.8, 0.92, alpha);
          }
        `,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 1.25, 0]} rotation-x={-Math.PI / 2} material={material}>
      <planeGeometry args={[18, 18, 1, 1]} />
    </mesh>
  );
}

function Atmosphere() {
  const { scene } = useThree();
  const fogRef = useRef(new THREE.FogExp2("#0b1323", 0.055));

  useEffect(() => {
    scene.fog = fogRef.current;
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.45} color="#d6ddf0" />
      <spotLight
        position={[6, 12, 8]}
        intensity={1.05}
        angle={0.4}
        penumbra={0.55}
        color="#a6c2ff"
        castShadow
      />
      <spotLight position={[-8, 10, -6]} intensity={0.6} angle={0.52} color="#f7d6a0" />
      <pointLight position={[0, 8, 0]} intensity={0.25} color="#f59e0b" distance={20} />
      <Stars radius={80} depth={35} count={1500} factor={2.5} fade speed={0.3} />
    </>
  );
}

function ViewportCameraRig({
  viewport,
  aiPilotEnabled,
}: {
  viewport: MapViewportState;
  aiPilotEnabled: boolean;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const desiredRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const tx = (viewport.lng - GEO_LNG_CENTER) * GEO_COORD_SCALE;
    const tz = -(viewport.lat - GEO_LAT_OFFSET) * GEO_COORD_SCALE;
    targetRef.current.set(tx, 0.1, tz);

    const distance = THREE.MathUtils.clamp(18 - viewport.zoom * 0.7, 6, 11);
    const y = THREE.MathUtils.clamp(2 + (18 - viewport.zoom) * 0.35, 2.2, 7.2);
    desiredRef.current.set(tx + distance, y, tz + distance);

    const damping = aiPilotEnabled ? 0.1 : 0.04;
    camera.position.lerp(desiredRef.current, damping);
    camera.lookAt(targetRef.current);
  });

  return null;
}

function UserBeacon({ userPosition }: { userPosition: { lat: number; lng: number } }) {
  return (
    <mesh
      position={[
        (userPosition.lng - GEO_LNG_CENTER) * GEO_COORD_SCALE,
        0.24,
        -(userPosition.lat - GEO_LAT_OFFSET) * GEO_COORD_SCALE,
      ]}
      castShadow
    >
      <sphereGeometry args={[0.2, 24, 24]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.65} />
    </mesh>
  );
}

export function Map3DTwin({ viewport, markers, userPosition, aiPilotEnabled = false, onViewportChange }: Map3DTwinProps) {
  useEffect(() => {
    onViewportChange({ pitch: 55 });
  }, [onViewportChange]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] md:h-[640px]">
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,.12),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,.18),transparent_40%)]" />
      <Canvas shadows camera={{ position: [8, 6, 8], fov: 48 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Atmosphere />
          <FoggyTerrain points={markers} />
          <FogPlane />
          {userPosition && <UserBeacon userPosition={userPosition} />}
          <ViewportCameraRig viewport={viewport} aiPilotEnabled={aiPilotEnabled} />
          <Environment preset="night" />
          <OrbitControls
            enablePan={false}
            maxDistance={16}
            minDistance={5}
            maxPolarAngle={Math.PI / 2.12}
            minPolarAngle={Math.PI / 3.4}
            autoRotate
            autoRotateSpeed={0.22}
            onEnd={() => {
              onViewportChange({});
            }}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-3 z-20 rounded-lg border border-white/15 bg-night-900/75 px-3 py-2 text-xs text-silver-300 backdrop-blur-sm">
        Gemelo Digital sincronizado · {viewport.lat.toFixed(4)}, {viewport.lng.toFixed(4)}
      </div>
      <div className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-night-900/75 px-3 py-2 text-[11px] text-silver-300 backdrop-blur-sm">
        {aiPilotEnabled ? "AI piloto activo · render 3D autoajustado" : "Arrastra para rotar · rueda para zoom"}
      </div>
    </div>
  );
}
