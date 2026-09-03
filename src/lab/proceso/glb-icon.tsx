"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PROCESS_LAB_ICONS } from "./icons";
import { createGlassMaterial } from "./glass-material";
import {
  ICON_SPIN_HOVER,
  ICON_SPIN_IDLE,
  ICON_TILT_DAMP,
  ICON_TILT_HOVER,
  ICON_TILT_IDLE,
} from "./process-icon-shared";

/** Solo el lab (`/lab/proceso`). En la home un `useGLTF.preload` a
 *  nivel de módulo pedía los 5 GLB (~1.5 MB) en cuanto se evaluaba
 *  este archivo — a veces en el primer paint, por el prefetch del
 *  `dynamic()`. La home carga cada GLB cuando el canvas monta
 *  (`useNearView` en `process-section`). */
export function preloadProcessGlbs() {
  for (const icon of PROCESS_LAB_ICONS) {
    if (icon.source === "glb") useGLTF.preload(icon.glb);
  }
}

const DEFAULT_REST: [number, number, number] = [0, 0, 0];

/** Cámara z=2.5, fov=36 → alto visible ≈ 1.62. Los GLB salen a 1.6
 *  (preguntar con restRotation llega a ~1.89) y el canvas los afeita. */
const ICON_FIT = 1.42;

function fitScale(
  object: THREE.Object3D,
  restRotation: [number, number, number],
) {
  const probe = new THREE.Group();
  probe.rotation.set(...restRotation);
  probe.add(object.clone(true));
  probe.updateWorldMatrix(true, true);
  const size = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
  const max = Math.max(size.x, size.y, size.z) || 1;
  return ICON_FIT / max;
}

type GlbIconProps = {
  url: string;
  color: string;
  restRotation?: [number, number, number];
  visualScale?: number;
  flame?: boolean;
  hoverRef: RefObject<boolean>;
};

export function GlbIcon({
  url,
  color,
  restRotation = DEFAULT_REST,
  visualScale = 1,
  flame = false,
  hoverRef,
}: GlbIconProps) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => scene.clone(true), [scene]);
  const scale = useMemo(
    () => fitScale(root, restRotation) * visualScale,
    [root, restRotation, visualScale],
  );
  const groupRef = useRef<THREE.Group>(null);
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
    group.rotation.y += delta * (hoverRef.current ? ICON_SPIN_HOVER : ICON_SPIN_IDLE);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      hoverRef.current ? ICON_TILT_HOVER : ICON_TILT_IDLE,
      ICON_TILT_DAMP,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <group rotation={restRotation} scale={scale}>
          <primitive object={root} />
        </group>
      </Center>
    </group>
  );
}
