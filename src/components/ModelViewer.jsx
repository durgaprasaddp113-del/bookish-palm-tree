import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

function getActivityColor(activity) {
  if (activity.delayed) return '#ef4444';
  if (activity.progress === 100) return '#16a34a';
  if (activity.progress > 0) return '#f97316';
  return '#9ca3af';
}

function ModelMesh({ modelUrl, activities }) {
  const { scene } = useGLTF(modelUrl);

  const activityMap = useMemo(() => {
    const map = new Map();
    activities.forEach((activity) => {
      map.set(activity.name.toLowerCase(), activity);
    });
    return map;
  }, [activities]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const meshName = child.name.toLowerCase();
      const activity = [...activityMap.values()].find((item) => meshName.includes(item.name.toLowerCase()));
      const color = activity ? getActivityColor(activity) : '#cbd5e1';

      child.material = child.material.clone();
      child.material.color = new THREE.Color(color);
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene, activityMap]);

  return <primitive object={scene} scale={1} />;
}

function PlaceholderBuilding({ activities }) {
  return activities.map((activity, index) => (
    <mesh key={activity.name} position={[0, 0.45 + index * 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.2 - index * 0.15, 0.4, 2.2 - index * 0.15]} />
      <meshStandardMaterial color={getActivityColor(activity)} />
    </mesh>
  ));
}

function ActivityLegend({ activities }) {
  return (
    <div className="absolute right-4 top-4 z-10 rounded bg-white/90 p-3 text-xs shadow">
      <p className="mb-2 font-semibold text-slate-700">Activity color mapping</p>
      <div className="space-y-1">
        {activities.map((activity) => (
          <div key={activity.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded" style={{ backgroundColor: getActivityColor(activity) }} />
            <span className="text-slate-700">{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelViewer({ modelUrl, activities }) {
  const [modelExists, setModelExists] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(modelUrl, { method: 'HEAD' })
      .then((response) => {
        if (active) {
          setModelExists(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setModelExists(false);
        }
      });

    return () => {
      active = false;
    };
  }, [modelUrl]);

  return (
    <div className="relative h-[540px] w-full overflow-hidden rounded-xl border bg-slate-200">
      <ActivityLegend activities={activities} />
      <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight castShadow position={[10, 15, 10]} intensity={1} />
        <Environment preset="city" />
        <Grid args={[30, 30]} sectionColor="#94a3b8" cellColor="#cbd5e1" fadeDistance={40} />
        {modelExists ? <ModelMesh modelUrl={modelUrl} activities={activities} /> : <PlaceholderBuilding activities={activities} />}
        <OrbitControls enablePan enableRotate enableZoom />
      </Canvas>
      <div className="absolute bottom-2 left-3 text-xs text-slate-600">
        Rotate: left mouse • Pan: right mouse • Zoom: wheel
      </div>
    </div>
  );
}
