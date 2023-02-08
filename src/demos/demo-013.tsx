import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThreeJsScene } from "../modules/three-helpers-react/use-three-js-scene";
import { GUI } from 'dat.gui';

// singleton
let gui = new GUI();

export const Demo013 = () => {
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
  const createShape = () => {

    const particlesCount = 1000;
    const verticesPositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const smoothstep = (min: number, max: number, value: number) => {
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      };
      const spiral = (t: number) => [
        t,
        Math.pow(t, 5),
        Math.pow(t, 10),
      ];
      const [x, y, z] = spiral(smoothstep(0, particlesCount * 3, i * 3));
      const amplitude = 1;
      verticesPositions[i * 3] = x * amplitude;
      verticesPositions[(i * 3) + 1] = y * amplitude;
      verticesPositions[(i * 3) + 2] = z * amplitude;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesPositions, 3));

    const material = new THREE.PointsMaterial();
    material.size = 0.05;
    //material.sizeAttenuation = true;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;

    const points = new THREE.Points(geometry, material);
    return points;
  };

  const models = await (async () => {
    // add models to scene
    const shape = createShape();
    scene.add(shape);

    return {
      shape,
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
