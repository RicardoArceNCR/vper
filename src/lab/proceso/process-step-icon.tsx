"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { type LabIcon } from "./icons";
import { LabErrorBoundary } from "./error-boundary";
import { SvgExtrude } from "./svg-extrude";
import { GlbIcon } from "./glb-icon";
import { attachBrandEnvironment } from "./glow-env";
import { ProcessRaster, iconBloomClass } from "./process-icon-shared";

function FallbackShape({ color }: { color: string }) {
  return (
    <mesh>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.6} />
    </mesh>
  );
}

function IconModel({
  icon,
  color,
  hoverRef,
}: {
  icon: LabIcon;
  color: string;
  hoverRef: RefObject<boolean>;
}) {
  if (icon.source === "glb") {
    return (
      <GlbIcon
        url={icon.glb}
        color={color}
        restRotation={icon.restRotation}
        visualScale={icon.visualScale}
        flame={icon.id === "aprender"}
        hoverRef={hoverRef}
      />
    );
  }
  return <SvgExtrude url={icon.svg} color={color} hoverRef={hoverRef} />;
}

type ProcessStepIconProps = {
  icon: LabIcon;
  color: string;
  running: boolean;
  hoverRef: RefObject<boolean>;
  dpr?: [number, number];
};

export function ProcessStepIcon({
  icon,
  color,
  running,
  hoverRef,
  dpr = [1, 1.5],
}: ProcessStepIconProps) {
  return (
    <LabErrorBoundary fallback={<ProcessRaster icon={icon} />}>
      <div className={iconBloomClass(icon.id)}>
        <Canvas
          dpr={dpr}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={running ? "always" : "never"}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.22;
            attachBrandEnvironment(gl, scene);
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={36} />
          <hemisphereLight args={["#9ae8ff", "#1a1040", 0.38]} />
          <ambientLight intensity={0.1} />
          <directionalLight position={[2.2, 3.6, 3.8]} intensity={1.55} color="#f4fbff" />
          <directionalLight position={[-2.6, 1.4, 2.2]} intensity={0.7} color="#7ad0f5" />
          <directionalLight position={[0.6, -1.8, 2.4]} intensity={0.28} color="#8a6cff" />
          <Suspense fallback={<FallbackShape color={color} />}>
            <IconModel icon={icon} color={color} hoverRef={hoverRef} />
          </Suspense>
        </Canvas>
      </div>
    </LabErrorBoundary>
  );
}
