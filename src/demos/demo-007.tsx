import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThreeJsScene } from "../modules/three-helpers-react/use-three-js-scene";
import { enableObjectShadow } from "../modules/three-helpers/utils/enable-object-shadow";



export const Demo007 = () => {
  const canvasNodeRef = useRef<HTMLCanvasElement>(null);
  const { debugJSON, errorMessage } = useThreeJsScene(canvasNodeRef, main);

  return (
    <>
      <style>{`
      .canvas-container {
        width: 100%;
        height: 100%;
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
  renderer.setPixelRatio(window.devicePixelRatio);
  //renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, getSizes().aspect, 0.1, 1000);
  const orbit = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(70);
  const gridHelper = new THREE.GridHelper(110);
  scene.add(axesHelper, gridHelper);

  // on Resize
  const onResize = () => {
    const { w, h, aspect } = getSizes();
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    orbit.update();
  };
  window.addEventListener("resize", onResize);
  onResize();

  // onMouseMove
  const pointer = { x: 0, y: 0 };
  window.addEventListener("mousemove", (event) => {
    const { w, h } = getSizes();
    pointer.x = event.clientX / w - 0.5;
    pointer.y = event.clientY / h - 0.5;
  });

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

  const loadingManager = new THREE.LoadingManager(
    () => {
      //console.log("load on success");
      initRenderLoop();
    },
    () => console.log("load on progress"),
    (error) => console.error(error, "load on error")
  );

  // ==================================
  //   Scene
  // ==================================

  // Scene - Environment

  camera.position.set(20, 20, 130);
  orbit.update();

  // Scene - Environment - Light

  const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
  scene.add(ambientLight);

  // const spotLight = new THREE.SpotLight(0xffffff, 50, 100, 0.4);
  // spotLight.position.set(-30, 70, 10);
  // spotLight.castShadow = true;
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLight);
  // scene.add(spotLightHelper);

  // Scene - Object

  const createGround = () => {
    const geometry = new THREE.PlaneGeometry(100, 100, 30, 30);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      wireframe: true,
    });

    function smoothstep(min: number, max: number, t: number) {
      var x = Math.max(0, Math.min(1, (t - min) / (max - min)));
      return x * x * (3 - 2 * x);
    }
    const itemSize = geometry.getAttribute("position").itemSize;
    console.log(itemSize);
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i = i + 3) {
      //a vertex' position is (vertices[i],vertices[i+1],vertices[i+2])
      const vertexPosition = new THREE.Vector3(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
      );
      const distanceFromCenter = vertexPosition.distanceTo(new THREE.Vector3(0, 0, 0));
      if (i < 100) {
        console.log(distanceFromCenter);
      }
      const h = smoothstep(0, 20, Math.abs(distanceFromCenter));
      // @ts-ignore
      geometry.attributes.position.array[i + 2] = h * 20;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;

    return mesh;
  };

  const models = await (async () => {
    // create objects and add to scene

    const groundGroup = new THREE.Group();
    const ground = createGround();
    ground.receiveShadow = true;
    groundGroup.add(ground);
    scene.add(groundGroup);
    scene.add(ground);

    // enable shadow

    //enableObjectShadow(scene);

    // define initial position of objects

    return {
      groundGroup,
      ground,
    };
  })();

  onFrame.subscribe((time) => {
    //scene.rotation.y += 0.001;
  });
  initRenderLoop();

  // Return cleanup
  const cleanup = () => { };
  return cleanup;
}
