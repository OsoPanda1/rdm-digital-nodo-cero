import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { MapMarkerData, MapViewportState } from "@/features/places/mapTypes";

const GEO_COORD_SCALE = 160;

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

function Terrain({ points, center }: { points: MapMarkerData[]; center: Pick<MapViewportState, "lat" | "lng"> }) {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(18, 18, 80, 80);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      positions.setZ(i, Math.sin(x * 0.75) * 0.25 + Math.cos(y * 0.9) * 0.18 + Math.sin((x + y) * 1.8) * 0.12);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group rotation-x={-Math.PI / 2.8}>
      <mesh geometry={geom} receiveShadow>
        <meshStandardMaterial color="#1b2539" metalness={0.15} roughness={0.95} emissive="#1f2f4d" emissiveIntensity={0.1} />
      </mesh>
      {points.map((point) => (
        <mesh
          key={point.id}
          position={[...toScenePosition(point, center).slice(0, 1), 0.18, toScenePosition(point, center)[2]]}
        >
          <sphereGeometry args={[point.isPremium ? 0.18 : 0.13, 16, 16]} />
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

function CameraRig({ viewport, aiPilotEnabled }: { viewport: MapViewportState; aiPilotEnabled: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame(() => {
    const angle = THREE.MathUtils.degToRad(viewport.bearing || 35);
    const dist = THREE.MathUtils.clamp(18 - viewport.zoom * 0.7, 6, 11);
    const y = THREE.MathUtils.clamp(2 + (18 - viewport.zoom) * 0.35, 2.2, 7.2);
    target.current.set(0, 0.1, 0);
    desired.current.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
    camera.position.lerp(desired.current, aiPilotEnabled ? 0.1 : 0.04);
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
      <Canvas camera={{ position: [8, 6, 8], fov: 48 }} dpr={[1, 1.5]} style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#d6ddf0" />
          <directionalLight position={[6, 10, 8]} intensity={1.15} color="#a6c2ff" />
          <pointLight position={[0, 8, 0]} intensity={0.18} color="#f59e0b" distance={20} />
          <Stars radius={80} depth={35} count={1200} factor={2.5} fade speed={0.3} />
          <Terrain points={markers} center={viewport} />
          {userScenePosition && (
            <mesh position={[userScenePosition[0], 0.24, userScenePosition[2]]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.65} />
              <Html center distanceFactor={8}>
                <div className="rounded-full border border-border bg-primary/85 px-2 py-1 text-[10px] font-medium text-primary-foreground shadow-soft backdrop-blur-sm">
                  Tú · ±{Math.round(userPosition.accuracy ?? 0)}m
                </div>
              </Html>
            </mesh>
          )}
          <CameraRig viewport={viewport} aiPilotEnabled={aiPilotEnabled} />
          <OrbitControls
            enablePan={false}
            maxDistance={16}
            minDistance={5}
            maxPolarAngle={Math.PI / 2.12}
            minPolarAngle={Math.PI / 3.4}
            autoRotate
            autoRotateSpeed={0.22}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-3 z-20 rounded-lg border border-white/15 bg-night-900/75 px-3 py-2 text-xs text-silver-300 backdrop-blur-sm">
        Gemelo Digital · {viewport.lat.toFixed(4)}, {viewport.lng.toFixed(4)}
      </div>
      <div className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-night-900/75 px-3 py-2 text-[11px] text-silver-300 backdrop-blur-sm">
        {aiPilotEnabled ? "AI piloto activo" : "Arrastra para rotar · rueda para zoom"}
      </div>
    </div>
  );
}
