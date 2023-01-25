import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export class ThreeJsScene {
  // NOTE: Core components to initialize Three.js app.
  canvasNode: HTMLCanvasElement;
  sizes: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  // NOTE: Camera params;
  fov: number = 45;
  nearPlane: number = 1;
  farPlane: number = 1000;
  // NOTE: Additional components.
  clock: THREE.Clock;
  stats: Stats;
  controls: OrbitControls;
  grid: THREE.GridHelper;
  // NOTE: Lighting is basically required.
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  constructor(canvasNode: HTMLCanvasElement) {
    this.canvasNode = canvasNode;
    this.fetchCanvasSizes();
  }
  fetchCanvasSizes() {
    const { width, height } = getComputedStyle(this.canvasNode);
    this.sizes = {
      width: Number(width),
      height: Number(height),
      aspectRatio: Number(width) / Number(height),
    };
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.sizes.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.z = 48;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasNode,
      antialias: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // this.clock = new THREE.Clock();
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.stats = Stats();
    // document.body.appendChild(this.stats.dom);
    // this.grid = new THREE.GridHelper();
    // this.scene.add(this.grid);

    // ambient light which is for the whole scene
    // this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    // this.ambientLight.castShadow = true;
    // this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // this.directionalLight.position.set(0, 32, 64);
    // this.scene.add(this.directionalLight);

    // if window resizes
    // window.addEventListener("resize", () => this.onWindowResize(), false);

    // NOTE: Load space background.
    // this.loader = new THREE.TextureLoader();
    // this.scene.background = this.loader.load('./pics/space.jpeg');

    // NOTE: Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
  }

  animate() {
    this.render();
    this.stats.update();
    this.controls.update();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.fetchCanvasSizes();
    this.camera.aspect = this.sizes.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }
}
