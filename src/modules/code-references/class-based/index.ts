import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ThreeJsScene } from "./ThreeJsScene";

const getCanvas = () => document.getElementById('three-canvas') as HTMLCanvasElement | null;

async function main() {
  const canvas = getCanvas();
  if (!canvas) return;
  const scene = new ThreeJsScene(canvas);
  scene.initialize();
  scene.animate();

  // const shiba = await new GLTFLoader()
  //   .loadAsync("assets/shiba/scene.gltf")
  //   .then((gltf) => gltf.scene);
  // shiba.rotation.y = Math.PI / 8;
  // shiba.position.y = 3;
  // shiba.scale.set(10, 10, 10);
  // scene.scene.add(shiba);

  // const angelica = await new GLTFLoader()
  //   .loadAsync("./assets/angelica/scene.gltf")
  //   .then((gltf) => gltf.scene);
  // scene.scene.add(angelica);
  // angelica.rotation.y = Math.PI / 8;
  // angelica.position.y = 3;
  // angelica.scale.set(10, 10, 10);

  const animate = () => {
    // shiba.rotation.x += 0.01;
    // shiba.rotation.y += 0.01;
    // shiba.rotation.z += 0.01;
    requestAnimationFrame(animate);
  };
  animate();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
