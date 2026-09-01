"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { GlassMaterial } from "./glass-material";

const FIT = 1.55;

type SvgExtrudeProps = {
  url: string;
  color: string;
};

export function SvgExtrude({ url, color }: SvgExtrudeProps) {
  const data = useLoader(SVGLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);

  const geometry = useMemo(() => {
    const shapes = data.paths.flatMap((path) => path.toShapes());
    if (shapes.length === 0) {
      return new THREE.IcosahedronGeometry(0.7, 1);
    }

    const pieces = shapes.map(
      (shape) =>
        new THREE.ExtrudeGeometry(shape, {
          depth: 28,
          bevelEnabled: true,
          bevelThickness: 2.2,
          bevelSize: 1.4,
          bevelSegments: 1,
          curveSegments: 5,
        }),
    );
    const merged = mergeGeometries(pieces, false) ?? pieces[0]!;
    for (const piece of pieces) {
      if (piece !== merged) piece.dispose();
    }

    merged.rotateX(Math.PI);
    merged.center();
    merged.computeBoundingBox();
    const size = merged.boundingBox?.getSize(new THREE.Vector3()) ?? new THREE.Vector3(1, 1, 1);
    const max = Math.max(size.x, size.y, size.z) || 1;
    const s = FIT / max;
    merged.scale(s, s, s);
    merged.center();
    return merged;
  }, [data]);

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * (hovered.current ? 0.9 : 0.28);
    mesh.rotation.x = THREE.MathUtils.damp(
      mesh.rotation.x,
      hovered.current ? 0.18 : 0.06,
      6,
      delta,
    );
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => {
        hovered.current = true;
      }}
      onPointerOut={() => {
        hovered.current = false;
      }}
    >
      <GlassMaterial color={color} />
    </mesh>
  );
}
