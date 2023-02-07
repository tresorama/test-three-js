import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThreeJsScene } from "../modules/three-helpers-react/use-three-js-scene";
import { GUI } from 'dat.gui';

// singleton
let gui = new GUI();

export const Demo011 = () => {
  const canvasNodeRef = useRef<HTMLCanvasElement>(null);
  const { debugJSON, errorMessage } = useThreeJsScene(canvasNodeRef, main);

  return (
    <>
      <style>{`
      #root,
      .page {
        height: initial;
        display: initial;
      }
      .canvas-container {
        z-index: 1;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .page-content {
        position: relative;
        z-index: 2;
      }

      .section {
        width: 100%;
        height: 100vh;
        display: flex;
        outline: 3px solid rebeccapurple;
      }

      .demo-notes {
        z-index: 1;
        position: fixed;
        top: 0;
        background: hsla(0deg, 100%,20%, 0.3);
        color: white;
        font-size: 0.8rem;
      }
      `}</style>
      <div className="canvas-container">
        <canvas ref={canvasNodeRef} />
      </div>
      <div className="demo-notes">
        Three.js Journey Lesson 19
      </div>
    </>
  );
};



// wrap all the code in an asycn function to be able to
// use async/await inside
async function main(canvas: HTMLCanvasElement, setDebugJSON: (json: any) => void) {
  // Dat Gui
  if (gui) gui.destroy();// Destroy the GUI on reload to prevent multiple stale UI from being displayed on screen.
  gui = new GUI();

  // ===================================
  // Init
  // ===================================

  const getSizes = () => {
    const node = canvas.parentElement!;
    const { width: w, height: h } = node.getBoundingClientRect();
    return {
      w,
      h,
      aspect: w / h,
    };
  };
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, getSizes().aspect, 0.1, 1000);
  const orbit = new OrbitControls(camera, renderer.domElement);
  // const axesHelper = new THREE.AxesHelper(70);
  // const gridHelper = new THREE.GridHelper(110);
  // scene.add(axesHelper, gridHelper);

  // on Resize
  const onResize = () => {
    const { w, h, aspect } = getSizes();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    orbit.update();
  };
  window.addEventListener("resize", onResize);
  onResize();

  // onMouseMove
  // const pointer = { x: 0, y: 0 };
  // window.addEventListener("mousemove", (event) => {
  //   const { w, h } = getSizes();
  //   pointer.x = event.clientX / w - 0.5;
  //   pointer.y = event.clientY / h - 0.5;
  // });

  // Render
  const onFrame = {
    callbacks: [] as ((time: number) => void)[],
    subscribe(cb: (time: number) => void) {
      this.callbacks.push(cb);
      return () => {
        this.callbacks = this.callbacks.filter((item) => item !== cb);
      };
    },
    runCallbacks(time: number) {
      this.callbacks.forEach((cb) => cb(time));
    },
  };
  function initRenderLoop() {
    const clock = new THREE.Clock();
    const animate: FrameRequestCallback = () => {
      const elapsedTime = clock.getElapsedTime();
      onFrame.runCallbacks(elapsedTime);
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }

  // const loadingManager = new THREE.LoadingManager(
  //   () => {
  //     //console.log("load on success");
  //     initRenderLoop();
  //   },
  //   () => console.log("load on progress"),
  //   (error) => console.error(error, "load on error")
  // );

  // ==================================
  //   Scene
  // ==================================

  const COLORS = {
    background: '#111122',
    particlesSphere: 0x888888,
    particlesRandom: 0xff8822,
  };

  // Scene - Environment
  camera.position.set(0, 1, 5);
  orbit.update();
  scene.background = new THREE.Color(COLORS.background);
  // scene.fog = new THREE.Fog(COLORS.background, 15, 20);

  // Scene - Environment - Light


  // Scene - Object
  const createGalaxy = (scene: THREE.Scene) => {
    const parameters = {
      count: 1000,
      size: 0.01,
    };
    const galaxyBag = {
      geometry: null as THREE.BufferGeometry | null,
      material: null as THREE.PointsMaterial | null,
      points: null as THREE.Points | null,
    };

    const updateGalaxy = () => {

      if (galaxyBag.points !== null) {
        galaxyBag.geometry?.dispose();
        galaxyBag.material?.dispose();
        scene.remove(galaxyBag.points);
      }

      const particlesCount = parameters.count;
      const verticesPositions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        const x = (Math.random() - .5) * 3;
        const y = (Math.random() - .5) * 3;
        const z = (Math.random() - .5) * 3;
        verticesPositions[i * 3] = x;
        verticesPositions[(i * 3) + 1] = y;
        verticesPositions[(i * 3) + 2] = z;
      }
      galaxyBag.geometry = new THREE.BufferGeometry();
      galaxyBag.geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesPositions, 3));

      galaxyBag.material = new THREE.PointsMaterial();
      galaxyBag.material.size = parameters.size;
      galaxyBag.material.sizeAttenuation = true;
      galaxyBag.material.depthWrite = false;
      galaxyBag.material.blending = THREE.AdditiveBlending;

      galaxyBag.points = new THREE.Points(galaxyBag.geometry, galaxyBag.material);
      scene.add(galaxyBag.points);

    };
    updateGalaxy();

    gui.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(updateGalaxy);
    gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(updateGalaxy);

    return galaxyBag;
  };

  const models = await (async () => {
    // add models to scene
    let { points: galaxy } = createGalaxy(scene);

    return {
      galaxy,
    };
  })();

  (async function setupRenderLoop() {
    // setup render loop
    initRenderLoop();
  })();


  // Return cleanup
  const cleanup = () => {
    gui.destroy();
  };
  return cleanup;
}
