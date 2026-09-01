"use client";

import { useMemo } from "react";
import * as THREE from "three";

type GlowMaterialOptions = {
  /** `--brand-sky` leído del documento; no un hex suelto. */
  color: string;
  /** 0–1. Pinta naranja la parte baja del mesh (llama del cohete). */
  flame?: number;
};

const SHEEN = new THREE.Color("#5b7cff");
const EMISSIVE = new THREE.Color("#1a3a6a");

function makeBeforeCompile(flame: number) {
  return (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uFlame = { value: flame };
    shader.vertexShader = `varying vec3 vObjectPos;\nuniform float uFlame;\n${shader.vertexShader}`;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
       float flameRegion = uFlame * smoothstep(-0.42, -0.72, position.y)
         * (1.0 - smoothstep(0.14, 0.32, length(position.xz)));
       transformed.y -= flameRegion * 0.12;
       vObjectPos = position;`,
    );
    shader.fragmentShader = `varying vec3 vObjectPos;\nuniform float uFlame;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      float ndv = saturate(dot(normalize(geometryNormal), normalize(geometryViewDir)));
      float fresnel = pow(1.0 - ndv, 2.6);
      outgoingLight *= vec3(0.88, 0.96, 1.12);
      float low = smoothstep(0.35, -0.5, vObjectPos.y);
      outgoingLight = mix(outgoingLight, outgoingLight * vec3(0.82, 0.68, 1.18), low * 0.28);
      outgoingLight += vec3(0.62, 0.9, 1.0) * fresnel * 0.55;

      float flameMask = uFlame * smoothstep(-0.42, -0.72, vObjectPos.y)
        * (1.0 - smoothstep(0.14, 0.32, length(vObjectPos.xz)));
      vec3 flameHot = vec3(1.0, 0.52, 0.06);
      vec3 flameCool = vec3(0.95, 0.16, 0.02);
      vec3 flameCol = mix(flameCool, flameHot, saturate((-vObjectPos.y - 0.45) * 2.4));
      outgoingLight = mix(outgoingLight, flameCol, flameMask * 0.94);
      outgoingLight += flameCol * flameMask * 0.28;

      #include <opaque_fragment>
      `,
    );
  };
}

export function createGlassMaterial({ color, flame = 0 }: GlowMaterialOptions) {
  const base = new THREE.Color(color);
  base.offsetHSL(0.035, 0.06, 0.06);

  const mat = new THREE.MeshPhysicalMaterial({
    color: base,
    roughness: 0.2,
    metalness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.7,
    envMapIntensity: 1.05,
    sheen: 0.32,
    sheenColor: SHEEN,
    sheenRoughness: 0.45,
    iridescence: 0.12,
    iridescenceIOR: 1.26,
    iridescenceThicknessRange: [80, 280],
    emissive: EMISSIVE,
    emissiveIntensity: 0.22,
    toneMapped: true,
  });
  mat.onBeforeCompile = makeBeforeCompile(flame);
  mat.customProgramCacheKey = () => `vper-glow-fresnel-v12-${flame > 0 ? "flame" : "base"}`;
  return mat;
}

export function GlassMaterial({ color, flame = 0 }: GlowMaterialOptions) {
  const onBeforeCompile = useMemo(() => makeBeforeCompile(flame), [flame]);

  const base = useMemo(() => {
    const c = new THREE.Color(color);
    c.offsetHSL(0.035, 0.06, 0.06);
    return c;
  }, [color]);

  return (
    <meshPhysicalMaterial
      color={base}
      roughness={0.2}
      metalness={0.14}
      clearcoat={1.0}
      clearcoatRoughness={0.08}
      reflectivity={0.7}
      envMapIntensity={1.05}
      sheen={0.32}
      sheenColor={SHEEN}
      sheenRoughness={0.45}
      iridescence={0.12}
      iridescenceIOR={1.26}
      iridescenceThicknessRange={[80, 280]}
      emissive={EMISSIVE}
      emissiveIntensity={0.22}
      onBeforeCompile={onBeforeCompile}
      customProgramCacheKey={() => `vper-glow-fresnel-v12-${flame > 0 ? "flame" : "base"}`}
    />
  );
}
