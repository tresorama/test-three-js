import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const getCanvas = () => document.getElementById('three-canvas') as HTMLCanvasElement | null;
const getCanvasSizes = (canvas: HTMLCanvasElement) => {
  const computedStyle = getComputedStyle(canvas);
  const width = Number(computedStyle.width.slice(0, -2));
  const height = Number(computedStyle.height.slice(0, -2));
  return {
    width,
    height,
    aspectRatio: Number((width / height).toFixed(3)),
  };
};

async function main() {
  debugger;
  // Initialize
  const canvas = getCanvas();
  if (!canvas) return;
  const sizes = getCanvasSizes(canvas);
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(sizes.width, sizes.height);
  // Scene
  const scene = new THREE.Scene();
  // Scene - Camera
  const camera = new THREE.PerspectiveCamera(45, sizes.aspectRatio);
  camera.position.set(0, 10, 70);
  // Scene - Orbit COntrols
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.update();
  // Scene - Lights
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  // ambientLight.castShadow = true;
  // scene.add(ambientLight);
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  //directionalLight.castShadow = true;
  // directionalLight.position.set(0, 32, 64);
  // scene.add(directionalLight);
  // Scene - Time
  const time = new THREE.Clock();
  time.start();
  // Scene - Grid Ground
  const grid = new THREE.GridHelper(200);
  scene.add(grid);

  // Scene Object - Origin
  const cuboOrigin = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  scene.add(cuboOrigin);

  // Scene Object - Cube
  // const cube = new THREE.Mesh(
  //   new THREE.BoxGeometry(10, 10, 2),
  //   new THREE.MeshBasicMaterial({ color: 0xff7700 })
  // );
  // cube.position.setY(cube.geometry.parameters.height / 2);
  // cube.position.setX(10);
  // scene.add(cube);

  // Scene Object - Blender Object
  // const shiba = await new GLTFLoader()
  //   .loadAsync("/assets/shiba/scene.gltf")
  //   .then((gltf) => gltf.scene);
  // shiba.position.setY(10);
  // shiba.scale.set(10, 10, 10);
  // scene.add(shiba);

  // Scene - 130 Car
  const car = await new GLTFLoader()
    .loadAsync("/assets/130/scene.gltf")
    .then(gltf => gltf.scene);
  scene.add(car);
  car.scale.set(10, 10, 10);
  car.position.setY(10);

  // Mount scene
  const animate = () => {
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };
  animate();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
    const canvas = getCanvas();
    if (canvas) {
      document.body.innerHTML = error instanceof Error ? error.message : 'Error, apri console';
    }
    throw error;
  }
})();
