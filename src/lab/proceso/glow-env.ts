import * as THREE from "three";

type Ball = { color: number; pos: [number, number, number]; scale: number };

const BALLS: Ball[] = [
  { color: 0xd8f7ff, pos: [2.6, 3.2, 4.0], scale: 1.4 },
  { color: 0x89d4ff, pos: [-1.0, 2.6, 3.2], scale: 0.9 },
  { color: 0xffffff, pos: [0.2, 4.4, -0.8], scale: 0.65 },
  { color: 0x1a0848, pos: [-3.4, -2.0, -2.2], scale: 2.4 },
  { color: 0x6b4dff, pos: [3.0, -1.4, -3.0], scale: 1.6 },
];

/** PMREM cian/índigo. Sin HDR en red; cada canvas tiene su propio GL. */
export function attachBrandEnvironment(gl: THREE.WebGLRenderer, scene: THREE.Scene) {
  const envScene = new THREE.Scene();
  const geo = new THREE.SphereGeometry(1, 16, 12);
  const mats: THREE.MeshBasicMaterial[] = [];

  for (const ball of BALLS) {
    const mat = new THREE.MeshBasicMaterial({ color: ball.color });
    mats.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...ball.pos);
    mesh.scale.setScalar(ball.scale);
    envScene.add(mesh);
  }

  const pmrem = new THREE.PMREMGenerator(gl);
  const rt = pmrem.fromScene(envScene, 0.08);
  scene.environment = rt.texture;
  scene.environmentIntensity = 0.95;
  scene.userData.envRT = rt;

  pmrem.dispose();
  for (const mat of mats) mat.dispose();
  geo.dispose();
}
