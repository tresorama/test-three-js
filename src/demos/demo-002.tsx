import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createEveryNTimer, initializeWorld } from '../modules/three-helpers';

// Main React Component
export const Demo002 = () => {
  const canvasNodeRef = useRef<HTMLCanvasElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [debugJSON, setDebugJSON] = useState({});
  useEffect(() => {
    (async () => {
      const canvasNode = canvasNodeRef.current;
      if (!canvasNode) return;
      try {
        const cleanup = await main(canvasNode, setDebugJSON);
        return cleanup;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Open console!';
        setErrorMessage(errorMessage);
      }
    })();
  }, []);
  return (
    <>
      <header>
        <h1>Demo002</h1>
      </header>
      <canvas ref={canvasNodeRef} id="three-js-canvas" />
      <footer>
        {errorMessage && <p>{errorMessage}</p>}
        {debugJSON && <pre>{JSON.stringify(debugJSON, null, 2)}</pre>}
      </footer>
    </>
  );
};

// Main Three.js
const main = async (canvas: HTMLCanvasElement, setDebugJSON: (json: object) => void) => {
  // ===============================================
  //     Global Settings
  // ===============================================
  const { scene, camera, gui, grid, renderRenderer } = initializeWorld(canvas);
  camera.position.z = 8;
  camera.position.x = 3;
  camera.position.y = 5;
  camera.fov = 70;
  camera.updateProjectionMatrix();
  scene.background = new THREE.Color(0x333);
  grid.visible = false;

  // ===============================================
  //     Lights
  // ===============================================
  const lightsGroup = new THREE.Group();
  scene.add(lightsGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  ambientLight.visible = true;
  lightsGroup.add(ambientLight);
  const guiAL = gui.addFolder('Ambient Light');
  guiAL.add(ambientLight, 'visible');
  guiAL.add(ambientLight, 'intensity', 0, 4, 0.01);
  guiAL.addColor({ color: ambientLight.color.getHex() }, 'color').onChange(color => ambientLight.color.set(color));
  guiAL.open();

  const directionalLight = new THREE.DirectionalLight(0xff0000, 0.5);
  directionalLight.visible = true;
  directionalLight.castShadow = true;
  directionalLight.position.x = 0;
  directionalLight.position.y = 5;
  directionalLight.position.z = 0;
  lightsGroup.add(directionalLight);
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  lightsGroup.add(directionalLightHelper);
  const guiDL = gui.addFolder('Directional Light');
  guiDL.add(directionalLight, 'visible');
  guiDL.add(directionalLight, 'castShadow');
  guiDL.add(directionalLight, 'intensity', 0, 4, 0.01);
  guiDL.addColor({ color: directionalLight.color.getHex() }, 'color').onChange(color => directionalLight.color.set(color));
  const guiDLPosition = guiDL.addFolder('Position');
  guiDLPosition.add(directionalLight.position, 'z', -4, 4, 0.01);
  guiDLPosition.add(directionalLight.position, 'x', -4, 4, 0.01);
  guiDLPosition.add(directionalLight.position, 'y', -4, 10, 0.01);
  const guiDLRotation = guiDL.addFolder('Rotation');
  guiDLRotation.add(directionalLight.rotation, 'z', -4, 4, 0.01);
  guiDLRotation.add(directionalLight.rotation, 'x', -4, 4, 0.01);
  guiDLRotation.add(directionalLight.rotation, 'y', -4, 4, 0.01);
  guiDL.open();

  const spotLight = new THREE.SpotLight(0xffdd00, 0.5);
  spotLight.visible = true;
  spotLight.castShadow = true;
  spotLight.position.x = 2;
  spotLight.position.y = 4;
  spotLight.position.z = 0;
  spotLight.angle = (Math.PI / 3) * 0.15;
  lightsGroup.add(spotLight);
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  lightsGroup.add(spotLightHelper);
  const guiSL = gui.addFolder('Spot Light');
  guiSL.add(spotLight, 'visible');
  guiSL.add(spotLight, 'castShadow');
  guiSL.add(spotLight, 'intensity', 0, 4, 0.01);
  guiSL.add(spotLight, 'angle', 0, 1.5, 0.01);
  guiSL.addColor({ color: spotLight.color.getHex() }, 'color').onChange(color => spotLight.color.set(color));
  const guiSLPosition = guiSL.addFolder('Position');
  guiSLPosition.add(spotLight.position, 'z', -4, 4, 0.01);
  guiSLPosition.add(spotLight.position, 'x', -4, 4, 0.01);
  guiSLPosition.add(spotLight.position, 'y', -4, 10, 0.01);
  const guiSLRotation = guiSL.addFolder('Rotation');
  guiSLRotation.add(spotLight.rotation, 'z', -4, 4, 0.01);
  guiSLRotation.add(spotLight.rotation, 'x', -4, 4, 0.01);
  guiSLRotation.add(spotLight.rotation, 'y', -4, 4, 0.01);
  guiSL.open();

  const pointLight = new THREE.PointLight(0x00ff00, 0.5);
  pointLight.visible = true;
  pointLight.castShadow = true;
  pointLight.position.x = 2;
  pointLight.position.y = 4;
  pointLight.position.z = 0;
  lightsGroup.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  lightsGroup.add(pointLightHelper);
  const guiPL = gui.addFolder('Point Light');
  guiPL.add(pointLight, 'visible');
  guiPL.add(pointLight, 'castShadow');
  guiPL.add(pointLight, 'intensity', 0, 4, 0.01);
  guiPL.addColor({ color: pointLight.color.getHex() }, 'color').onChange(color => pointLight.color.set(color));
  const guiPLPosition = guiPL.addFolder('Position');
  guiPLPosition.add(pointLight.position, 'z', -4, 4, 0.01);
  guiPLPosition.add(pointLight.position, 'x', -4, 4, 0.01);
  guiPLPosition.add(pointLight.position, 'y', -4, 10, 0.01);
  const guiPLRotation = guiPL.addFolder('Rotation');
  guiPLRotation.add(pointLight.rotation, 'z', -4, 4, 0.01);
  guiPLRotation.add(pointLight.rotation, 'x', -4, 4, 0.01);
  guiPLRotation.add(pointLight.rotation, 'y', -4, 4, 0.01);
  guiPL.open();


  // ===============================================
  //     Objects
  // ===============================================

  // Object - Ground
  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.5, 8),
    new THREE.MeshPhongMaterial({ color: 0xfffffa }),
  );
  groundMesh.receiveShadow = true;
  groundMesh.position.y = groundMesh.geometry.parameters.height * 0.5 * -1;
  scene.add(groundMesh);

  // Object - Origin Cube
  const cuboOrigin = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  scene.add(cuboOrigin);

  // Cubes
  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);
  cubeGroup.position.y = 2;

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  cube1.position.x = -2;
  cube1.castShadow = true;
  cubeGroup.add(cube1);

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  );
  cube2.castShadow = true;
  cubeGroup.add(cube2);

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshPhongMaterial({ color: 0x0000ff })
  );
  cube3.position.x = 2;
  cube3.castShadow = true;
  cubeGroup.add(cube3);

  // Object - Dog
  const dog = await new GLTFLoader()
    .loadAsync("/assets/shiba/scene.gltf")
    .then(gltf => gltf.scene);
  dog.position.x = 1;
  dog.position.y = 2;
  dog.scale.set(0.5, 0.5, 0.5);
  dog.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
    }
  });
  scene.add(dog);



  // ===============================================
  //     Render
  // ===============================================

  const animate = () => {
    //   // Debug in React View
    //   setDebugJSON({});
    //
    window.requestAnimationFrame(animate);
    renderRenderer();
  };
  animate();

  // return cleanup function 
  return () => {
    gui.destroy();
  };

};
