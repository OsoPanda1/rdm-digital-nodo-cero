import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { MapMarkerData, MapViewportState } from "@/features/places/mapTypes";

const GEO_COORD_SCALE = 220;

interface Map3DTwinProps {
  viewport: MapViewportState;
  markers: MapMarkerData[];
  userPosition?: { lat: number; lng: number; accuracy?: number } | null;
  aiPilotEnabled?: boolean;
  onViewportChange: (next: Partial<MapViewportState>) => void;
}

function toScenePosition(
  point: Pick<MapViewportState, "lat" | "lng"> | Pick<MapMarkerData, "lat" | "lng">,
  center: Pick<MapViewportState, "lat" | "lng">,
) {
  return [
    (point.lng - center.lng) * GEO_COORD_SCALE,
    0,
    -(point.lat - center.lat) * GEO_COORD_SCALE,
  ] as const;
}

// Procedural terrain with Real del Monte's mountainous character
function Terrain({ points, center }: { points: MapMarkerData[]; center: Pick<MapViewportState, "lat" | "lng"> }) {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(24, 24, 120, 120);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Multi-octave noise for mountain terrain
      const h =
        Math.sin(x * 0.5) * 0.4 +
        Math.cos(y * 0.6) * 0.35 +
        Math.sin((x + y) * 1.2) * 0.15 +
        Math.sin(x * 2.5) * 0.08 +
        Math.cos(y * 3.1) * 0.06;
      positions.setZ(i, h);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group rotation-x={-Math.PI / 2.2}>
      <mesh geometry={geom} receiveShadow>
        <meshStandardMaterial
          color="#1a2a3a"
          metalness={0.1}
          roughness={0.92}
          emissive="#162030"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Grid lines for spatial reference */}
      <gridHelper args={[24, 40, "#ffffff08", "#ffffff04"]} rotation-x={Math.PI / 2} position-z={0.01} />
      {/* Marker pillars */}
      {points.map((point) => {
        const [x, , z] = toScenePosition(point, center);
        const isPremium = point.isPremium;
        const color = isPremium ? "#f59e0b" : point.type === "place" ? "#60a5fa" : "#34d399";
        return (
          <group key={point.id} position={[x, 0.01, z]}>
            {/* Pillar */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.6} />
            </mesh>
            {/* Top sphere */}
            <mesh position={[0, 0.52, 0]}>
              <sphereGeometry args={[isPremium ? 0.16 : 0.1, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            {/* Ground ring */}
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.15, 0.22, 24]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.3} />
            </mesh>
            {/* Label */}
            <Html center distanceFactor={10} position={[0, 0.75, 0]} style={{ pointerEvents: "none" }}>
              <div className="whitespace-nowrap rounded-md border border-white/20 bg-night-900/90 px-2 py-0.5 text-[9px] font-medium text-silver-200 shadow-lg backdrop-blur-sm">
                {point.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function UserBeacon({ position, accuracy }: { position: [number, number, number]; accuracy: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = 0.3 + Math.sin(t * 2) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.15);
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity = 0.3 - Math.sin(t * 1.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Accuracy ring */}
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.2, 0.35, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      {/* User sphere */}
      <mesh ref={meshRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} />
      </mesh>
      {/* Label */}
      <Html center distanceFactor={8} position={[0, 0.65, 0]}>
        <div className="rounded-full border border-cyan-400/40 bg-night-900/85 px-2.5 py-1 text-[10px] font-semibold text-cyan-300 shadow-lg backdrop-blur-sm">
          📍 Tú · ±{Math.round(accuracy)}m
        </div>
      </Html>
    </group>
  );
}

// Volumetric fog planes
function AtmosphericFog() {
  return (
    <>
      <fog attach="fog" args={["#0a0f1a", 12, 35]} />
      <mesh position={[0, -0.5, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0d1525" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

function CameraRig({ viewport, aiPilotEnabled }: { viewport: MapViewportState; aiPilotEnabled: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame(() => {
    const angle = THREE.MathUtils.degToRad(viewport.bearing || 30);
    const dist = THREE.MathUtils.clamp(20 - viewport.zoom * 0.8, 5, 14);
    const y = THREE.MathUtils.clamp(3 + (18 - viewport.zoom) * 0.4, 2.5, 9);
    target.current.set(0, 0.2, 0);
    desired.current.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
    camera.position.lerp(desired.current, aiPilotEnabled ? 0.12 : 0.04);
    camera.lookAt(target.current);
  });

  return null;
}

export function Map3DTwin({ viewport, markers, userPosition, aiPilotEnabled = false, onViewportChange }: Map3DTwinProps) {
  useEffect(() => {
    onViewportChange({ pitch: 55 });
  }, [onViewportChange]);

  const userScenePosition = userPosition ? toScenePosition(userPosition, viewport) : null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070b14]" style={{ height: "640px" }}>
      <Canvas camera={{ position: [10, 7, 10], fov: 45 }} dpr={[1, 1.5]} shadows style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} color="#c8d6f0" />
          <directionalLight position={[8, 12, 6]} intensity={1.2} color="#a6c2ff" castShadow />
          <pointLight position={[0, 6, 0]} intensity={0.15} color="#f59e0b" distance={25} />
          <pointLight position={[-5, 4, 5]} intensity={0.1} color="#22d3ee" distance={20} />
          <Stars radius={90} depth={40} count={1800} factor={2.8} fade speed={0.25} />
          <AtmosphericFog />
          <Terrain points={markers} center={viewport} />
          {userScenePosition && userPosition && (
            <UserBeacon
              position={[userScenePosition[0], 0, userScenePosition[2]]}
              accuracy={userPosition.accuracy ?? 0}
            />
          )}
          <CameraRig viewport={viewport} aiPilotEnabled={aiPilotEnabled} />
          <OrbitControls
            enablePan
            maxDistance={20}
            minDistance={4}
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 4}
            autoRotate
            autoRotateSpeed={0.18}
            panSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      {/* HUD overlays */}
      <div className="absolute bottom-3 left-3 z-20 rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-xs text-silver-300 backdrop-blur-sm">
        <span className="text-cyan-400 font-semibold">Gemelo Digital</span> · {viewport.lat.toFixed(4)}, {viewport.lng.toFixed(4)}
      </div>
      <div className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-[11px] text-silver-300 backdrop-blur-sm">
        {aiPilotEnabled ? "🤖 AI piloto activo" : "Arrastra para rotar · rueda para zoom"}
      </div>
      {userPosition && (
        <div className="absolute left-3 top-3 z-20 rounded-lg border border-cyan-500/30 bg-night-900/80 px-3 py-2 text-[11px] text-cyan-300 backdrop-blur-sm">
          📍 {userPosition.lat.toFixed(5)}, {userPosition.lng.toFixed(5)}
        </div>
      )}
    </div>
  );
}
