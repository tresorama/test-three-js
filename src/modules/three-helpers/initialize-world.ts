import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getCanvasSizes } from './utils/get-canvas-sizes';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

// Singleton
let gui: GUI;


/**
 * Initialize a Three.js world
 * @param canvas canvas dom node where to render the world
 */
export const initializeWorld = (canvas: HTMLCanvasElement) => {
  const sizes = getCanvasSizes(canvas);

  // Renderer
  let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = [
    THREE.NoToneMapping,
    THREE.LinearToneMapping,
    THREE.ReinhardToneMapping,
    THREE.CineonToneMapping,
    THREE.ACESFilmicToneMapping,
  ][4];
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Renderer - Composer
  let composer = new EffectComposer(renderer);


  // Stats
  const stats = Stats();
  document.body.appendChild(stats.dom);

  // Dat Gui
  if (gui) gui.destroy();// Destroy the GUI on reload to prevent multiple stale UI from being displayed on screen.
  gui = new GUI();

  // Scene
  let scene = new THREE.Scene();

  // Camera
  let camera = new THREE.PerspectiveCamera(50, sizes.aspectRatio, 1, 1000);
  camera.position.set(0, 1.5, 5);

  // Orbit Control
  let orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update(); // controls.update() must be called after any manual changes to the camera's transform

  // Clock
  let clock = new THREE.Clock();

  // Grid 
  let grid = new THREE.GridHelper();
  scene.add(grid);

  // Axes
  let axesHelper = new THREE.AxesHelper(8);
  scene.add(axesHelper);

  // Lights
  // const guiLights = gui.addFolder('Lights');
  //
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  // // ambientLight.castShadow = true;
  // scene.add(ambientLight);
  // initGuiControls.ambientLight(guiLights, ambientLight);
  // //
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
  // directionalLight.castShadow = true;
  // directionalLight.position.x = -2;
  // directionalLight.position.y = 5;
  // directionalLight.position.z = 0;
  // scene.add(directionalLight);
  // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  // scene.add(directionalLightHelper);
  // initGuiControls.directionalLight(guiLights, directionalLight);
  //
  // const spotLight = new THREE.SpotLight(0x0000ff, 1);
  // spotLight.castShadow = true;
  // spotLight.position.x = 2;
  // spotLight.position.y = 5;
  // spotLight.position.z = 0;
  // scene.add(spotLight);
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
  // initGuiControls.spotLight(guiLights, spotLight);

  // Render
  const renderUpdates = () => {
    stats.update();
    orbit.update();// required if controls.enableDamping or controls.autoRotate are set to true
  };
  const renderRenderer = () => {
    renderUpdates();
    renderer.render(scene, camera);
  };
  const renderComposer = () => {
    renderUpdates();
    composer.render();
  };

  const subscribeRaf = (everyFrameCallback: () => void) => {
    let rafRef: ReturnType<typeof window.requestAnimationFrame>;
    const animate = () => {
      everyFrameCallback();
      rafRef = window.requestAnimationFrame(animate);
    };

    // play first frame
    window.requestAnimationFrame(animate);

    // destroy every thing
    const unsubscribe = () => {
      // clean window render frame loop
      window.cancelAnimationFrame(rafRef);
      // clean every object of the scene
      disposeSceneByTraversing(scene);
      renderer.dispose();
      composer.dispose();
      orbit.dispose();
      grid.dispose();
      axesHelper.dispose();
      renderer.renderLists.dispose();
      renderer = null as any;
      composer = null as any;
      orbit = null as any;
      grid = null as any;
      axesHelper = null as any;
      scene = null as any;
      camera = null as any;
    };
    return unsubscribe;
  };

  return { scene, camera, clock, gui, grid, axesHelper, renderer, composer, renderRenderer, renderComposer, subscribeRaf };

};

const disposeSceneByTraversing = (scene: THREE.Scene) => {
  // travers scene and destroy every Geometry and MAterial and Texture
  scene.traverse((object: any) => {
    //if (object instanceof THREE.Mesh) {
    console.log('dispose geometry!');
    object.geometry?.dispose?.();

    console.log('dispose material!');
    if (object.material) {
      if (Array.isArray(object.material)) {
        for (const material of object.material) cleanMaterial(material);
      } else {
        cleanMaterial(object.material);
      }
    }
  });

  function cleanMaterial(material: THREE.Material) {
    console.log('dispose material!');
    material.dispose();

    // dispose textures
    for (const key in material) {
      // @ts-ignore
      const value = material[key];
      if (value && typeof value === 'object' && 'minFilter' in value) {
        console.log('dispose texture!');
        value.dispose();
      }
    }
  };
};


const initGuiControls = {
  ambientLight: (gui: GUI, ambientLight: THREE.AmbientLight) => {
    const guiAL = gui.addFolder('Ambient Light');
    guiAL.add(ambientLight, 'visible');
    guiAL.add(ambientLight, 'castShadow');
    guiAL.add(ambientLight, 'intensity', 0, 50, 0.01);
    guiAL.addColor({ color: ambientLight.color.getHex() }, 'color').onChange(color => ambientLight.color.set(color));
  },
  directionalLight: (gui: GUI, directionalLight: THREE.DirectionalLight) => {
    const guiDL = gui.addFolder('Directional Light');
    guiDL.add(directionalLight, 'visible');
    guiDL.add(directionalLight, 'castShadow');
    guiDL.add(directionalLight, 'intensity', 0, 50, 0.01);
    guiDL.addColor({ color: directionalLight.color.getHex() }, 'color').onChange(color => directionalLight.color.set(color));
    const guiDLPosition = guiDL.addFolder('Position');
    guiDLPosition.add(directionalLight.position, 'z', -4, 4, 0.01);
    guiDLPosition.add(directionalLight.position, 'x', -4, 4, 0.01);
    guiDLPosition.add(directionalLight.position, 'y', -4, 4, 0.01);
    const guiDLRotation = guiDL.addFolder('Rotation');
    guiDLRotation.add(directionalLight.rotation, 'z', -4, 4, 0.01);
    guiDLRotation.add(directionalLight.rotation, 'x', -4, 4, 0.01);
    guiDLRotation.add(directionalLight.rotation, 'y', -4, 4, 0.01);
    guiDLPosition.open();
    guiDLRotation.open();
  },
  spotLight: (gui: GUI, spotLight: THREE.SpotLight) => {
    const guiSL = gui.addFolder('Spot Light');
    guiSL.add(spotLight, 'visible');
    guiSL.add(spotLight, 'castShadow');
    guiSL.add(spotLight, 'intensity', 0, 50, 0.01);
    guiSL.addColor({ color: spotLight.color.getHex() }, 'color').onChange(color => spotLight.color.set(color));
  },
  pointLight: (gui: GUI, pointLight: THREE.PointLight) => {
    const guiPL = gui.addFolder('Point Light');
    guiPL.add(pointLight, 'visible');
    guiPL.add(pointLight, 'castShadow');
    guiPL.add(pointLight, 'intensity', 0, 50, 0.01);
    guiPL.addColor({ color: pointLight.color.getHex() }, 'color').onChange(color => pointLight.color.set(color));
  },
};