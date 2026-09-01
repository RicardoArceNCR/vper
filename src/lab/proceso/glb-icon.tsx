"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PROCESS_LAB_ICONS } from "./icons";
import { createGlassMaterial } from "./glass-material";

for (const icon of PROCESS_LAB_ICONS) {
  if (icon.source === "glb") useGLTF.preload(icon.glb);
}

type GlbIconProps = {
  url: string;
  color: string;
  restRotation?: [number, number, number];
  flame?: boolean;
};

export function GlbIcon({
  url,
  color,
  restRotation = [0, 0, 0],
  flame = false,
}: GlbIconProps) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const material = useMemo(
    () => createGlassMaterial({ color, flame: flame ? 1 : 0 }),
    [color, flame],
  );

  useEffect(() => {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = material;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    return () => {
      material.dispose();
    };
  }, [root, material]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * (hovered.current ? 0.9 : 0.28);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      hovered.current ? 0.18 : 0.06,
      6,
      delta,
    );
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        hovered.current = true;
      }}
      onPointerOut={() => {
        hovered.current = false;
      }}
    >
      <Center>
        <group rotation={restRotation}>
          <primitive object={root} />
        </group>
      </Center>
    </group>
  );
}
