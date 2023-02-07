import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThreeJsScene } from "../modules/three-helpers-react/use-three-js-scene";
import { enableObjectShadow } from "../modules/three-helpers/utils/enable-object-shadow";
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


export const Demo008 = () => {
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
      `}</style>
      <div className="canvas-container">
        <canvas ref={canvasNodeRef} />
      </div>
      <div className="page-content">
        <div className="section">
          <p>Scroll Down</p>
        </div>
        <div className="section">
          <h1>Bear vs Witch</h1>
        </div>
        <div className="section bear-stats">
          <p>Bear stats</p>
        </div>
        <div className="section witch-stats">
          <p>Witch stats</p>
        </div>
        <div className="section winner">
          <p>Winner</p>
        </div>
      </div>
    </>
  );
};


// wrap all the code in an asycn function to be able to
// use async/await inside
async function main(canvas: HTMLCanvasElement, setDebugJSON: (json: any) => void) {

  gsap.registerPlugin(ScrollTrigger);

  const COLORS = {
    background: 'white',
    light: '#ffffff',
    sky: '#aaaaff',
    ground: '#88ff88'
  };

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
  const camera = new THREE.PerspectiveCamera(40, getSizes().aspect, 0.1, 100);
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
    const animate: FrameRequestCallback = (time) => {
      onFrame.runCallbacks(time);
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

  // Scene - Environment
  const cameraTarget = new THREE.Vector3(0, 1, 0);
  camera.position.set(0, 1, 6);
  orbit.update();
  onFrame.subscribe(() => { camera.lookAt(cameraTarget); });
  scene.background = new THREE.Color(COLORS.background);
  scene.fog = new THREE.Fog(COLORS.background, 15, 20);

  // Scene - Environment - Light

  const directionalLight = new THREE.DirectionalLight(COLORS.light, 2);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(2, 5, 3);
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(COLORS.sky, COLORS.ground, 0.5);
  scene.add(hemisphereLight);


  // Scene - Object
  const createFloor = () => {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.ground
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotateX(-Math.PI * 0.5);
    return floor;
  };
  const createWitch = async () => {
    const loader = new GLTFLoader();
    const witch = await loader.loadAsync("demos/demo-008/models/witch/model.gltf").then(gltf => gltf.scene);
    return witch;
  };
  const createBear = async () => {
    const loader = new GLTFLoader();
    const bear = await loader.loadAsync("demos/demo-008/models/bear/model.gltf").then(gltf => gltf.scene);
    return bear;
  };

  const models = await (async () => {

    const floor = createFloor();
    floor.receiveShadow = true;
    scene.add(floor);

    const witch = await createWitch();
    enableObjectShadow(witch);
    scene.add(witch);

    const bear = await createBear();
    enableObjectShadow(bear);
    scene.add(bear);

    return {
      floor,
      witch,
      bear,
    };
  })();

  (async function setupRenderLoop() {
    const setupAnimation = () => {
      models.witch.position.x = 5;
      models.bear.position.x = -5;
      ScrollTrigger.matchMedia({
        '(prefers-reduced-motion: no-preference)': desktopAnimation,
      });
    };
    const desktopAnimation = () => {
      console.log('desktopAn');

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.page',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      let section = 0;
      tl.to(models.witch.position, { x: 1 }, section);
      tl.to(models.bear.position, { x: -1 }, section);

      section += 1;
      tl.to(models.witch.position, { x: 5, ease: 'power4.in' }, section);
      tl.to(models.bear.position, { z: 2 }, section);

      section += 1;
      tl.to(models.witch.position, { x: 1, z: 2, ease: 'power4.out' }, section);
      tl.to(models.bear.position, { x: -5, z: 0, ease: 'power4.in' }, section);

      section += 1;
      tl.to(models.witch.position, { x: 1, z: 0 }, section);
      tl.to(models.bear.position, { x: -1, z: 0 }, section);
    };

    // setup render loop
    setupAnimation();
    initRenderLoop();

  })();


  // Return cleanup
  const cleanup = () => { };
  return cleanup;
}
