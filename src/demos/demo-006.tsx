import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createEveryNTimer, initializeWorld } from '../modules/three-helpers';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FilmShader } from 'three/examples/jsm/shaders/FilmShader';
import { StaticShader } from '../modules/three-helpers/shaders/StaticShader';


// Main React Component
export const Demo006 = () => {
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
        <h1>Demo006</h1>
      </header>
      <main style={{ position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1674590462122-ae799c236b08?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1065&amp;q=80"
          style={{
            zIndex: 0,
            width: "61%",
            position: "absolute",
            left: "0",
          }}
        />
        <canvas ref={canvasNodeRef} id="three-js-canvas" style={{
          zIndex: 1,
          position: 'relative',
          mixBlendMode: 'lighten',
        }} />
      </main>
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
  const { scene, camera, gui, grid, clock, axesHelper, composer, renderComposer } = initializeWorld(canvas);
  camera.position.z = 80;
  camera.position.x = 1;
  camera.position.y = 0;
  camera.rotation.x = -26;
  camera.rotation.y = -2;
  camera.fov = 4;
  camera.updateProjectionMatrix();
  scene.background = new THREE.Color(0x333);
  grid.visible = false;
  axesHelper.visible = false;

  // ===============================================
  //     Lights
  // ===============================================
  const lightsGroup = new THREE.Group();
  scene.add(lightsGroup);

  const ambientLight = new THREE.AmbientLight(0xffbe47, .5);
  ambientLight.visible = true;
  lightsGroup.add(ambientLight);
  const guiAL = gui.addFolder('Ambient Light');
  guiAL.add(ambientLight, 'visible');
  guiAL.add(ambientLight, 'intensity', 0, 4, 0.01);
  guiAL.addColor({ color: ambientLight.color.getHex() }, 'color').onChange(color => ambientLight.color.set(color));
  // guiAL.open();

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.visible = false;
  // // directionalLight.castShadow = true;
  // directionalLight.position.set(0, 32, 64);
  // lightsGroup.add(directionalLight);
  // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  // lightsGroup.add(directionalLightHelper);
  // const guiDL = gui.addFolder('Directional Light');
  // guiDL.add(directionalLight, 'visible');
  // guiDL.add(directionalLight, 'castShadow');
  // guiDL.add(directionalLight, 'intensity', 0, 4, 0.01);
  // guiDL.addColor({ color: directionalLight.color.getHex() }, 'color').onChange(color => directionalLight.color.set(color));
  // const guiDLPosition = guiDL.addFolder('Position');
  // guiDLPosition.add(directionalLight.position, 'z', -4, 4, 0.01);
  // guiDLPosition.add(directionalLight.position, 'x', -4, 4, 0.01);
  // guiDLPosition.add(directionalLight.position, 'y', -4, 10, 0.01);
  // const guiDLRotation = guiDL.addFolder('Rotation');
  // guiDLRotation.add(directionalLight.rotation, 'z', -4, 4, 0.01);
  // guiDLRotation.add(directionalLight.rotation, 'x', -4, 4, 0.01);
  // guiDLRotation.add(directionalLight.rotation, 'y', -4, 4, 0.01);
  // // guiDL.open();

  // const spotLight = new THREE.SpotLight(0xffdd00, 0.5);
  // spotLight.visible = true;
  // spotLight.castShadow = true;
  // spotLight.position.x = 2;
  // spotLight.position.y = 4;
  // spotLight.position.z = 0;
  // spotLight.angle = (Math.PI / 3) * 0.15;
  // lightsGroup.add(spotLight);
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // lightsGroup.add(spotLightHelper);
  // const guiSL = gui.addFolder('Spot Light');
  // guiSL.add(spotLight, 'visible');
  // guiSL.add(spotLight, 'castShadow');
  // guiSL.add(spotLight, 'intensity', 0, 4, 0.01);
  // guiSL.add(spotLight, 'angle', 0, 1.5, 0.01);
  // guiSL.addColor({ color: spotLight.color.getHex() }, 'color').onChange(color => spotLight.color.set(color));
  // const guiSLPosition = guiSL.addFolder('Position');
  // guiSLPosition.add(spotLight.position, 'z', -4, 4, 0.01);
  // guiSLPosition.add(spotLight.position, 'x', -4, 4, 0.01);
  // guiSLPosition.add(spotLight.position, 'y', -4, 10, 0.01);
  // const guiSLRotation = guiSL.addFolder('Rotation');
  // guiSLRotation.add(spotLight.rotation, 'z', -4, 4, 0.01);
  // guiSLRotation.add(spotLight.rotation, 'x', -4, 4, 0.01);
  // guiSLRotation.add(spotLight.rotation, 'y', -4, 4, 0.01);
  // guiSL.open();

  // const pointLight = new THREE.PointLight(0x00ff00, 0.5);
  // pointLight.visible = true;
  // pointLight.castShadow = true;
  // pointLight.position.x = 2;
  // pointLight.position.y = 4;
  // pointLight.position.z = 0;
  // lightsGroup.add(pointLight);
  // const pointLightHelper = new THREE.PointLightHelper(pointLight);
  // lightsGroup.add(pointLightHelper);
  // const guiPL = gui.addFolder('Point Light');
  // guiPL.add(pointLight, 'visible');
  // guiPL.add(pointLight, 'castShadow');
  // guiPL.add(pointLight, 'intensity', 0, 4, 0.01);
  // guiPL.addColor({ color: pointLight.color.getHex() }, 'color').onChange(color => pointLight.color.set(color));
  // const guiPLPosition = guiPL.addFolder('Position');
  // guiPLPosition.add(pointLight.position, 'z', -4, 4, 0.01);
  // guiPLPosition.add(pointLight.position, 'x', -4, 4, 0.01);
  // guiPLPosition.add(pointLight.position, 'y', -4, 10, 0.01);
  // const guiPLRotation = guiPL.addFolder('Rotation');
  // guiPLRotation.add(pointLight.rotation, 'z', -4, 4, 0.01);
  // guiPLRotation.add(pointLight.rotation, 'x', -4, 4, 0.01);
  // guiPLRotation.add(pointLight.rotation, 'y', -4, 4, 0.01);
  // guiPL.open();


  // ===============================================
  //     Objects
  // ===============================================

  //Object - Ground;
  // const groundMesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(8, 0.5, 8),
  //   new THREE.MeshPhongMaterial({ color: 0xfffffa }),
  // );
  // groundMesh.position.y = groundMesh.geometry.parameters.height * 0.5 * -1;
  // groundMesh.rotation.x = Math.PI / 4;
  // scene.add(groundMesh);



  // ===============================================
  //     POST-PROCESSSING
  // ===============================================
  const renderPass = new RenderPass(scene, camera);


  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  const bloomParams = {
    bloomThreshold: 0,
    bloomStrength: .9,
    bloomRadius: 0.7,
  };
  const guiBloom = gui.addFolder('Bloom');
  guiBloom.add(bloomParams, 'bloomThreshold', 0.0, 1.0).onChange(onParamsChange);
  guiBloom.add(bloomParams, 'bloomStrength', 0.0, 3.0).onChange(onParamsChange);
  guiBloom.add(bloomParams, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(onParamsChange);
  // guiBloom.open();


  const filmPass = new ShaderPass(FilmShader);
  // filmPass.uniforms.grayscale.value = 0;
  const filmParams = {
    show: true,
    count: 800,
    sIntensity: 0.9,
    nIntensity: 0.4
  };
  var f3 = gui.addFolder('Scanlines');
  f3.add(filmParams, 'count', 50, 1000).onChange(onParamsChange);
  f3.add(filmParams, 'sIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
  f3.add(filmParams, 'nIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
  f3.open();


  const staticPass = new ShaderPass(StaticShader);
  const staticParams = {
    show: true,
    amount: 0.3,
    size: 1.0
  };
  var f4 = gui.addFolder('Static');
  f4.add(staticParams, 'amount', 0.0, 1.0).step(0.01).listen().onChange(onParamsChange);
  f4.add(staticParams, 'size', 1.0, 100.0).step(1.0).onChange(onParamsChange);
  f4.open();


  const glitchPass = new GlitchPass();


  // mount render passes
  composer.addPass(renderPass);
  composer.addPass(filmPass);
  composer.addPass(staticPass);
  // composer.addPass(glitchPass);
  staticPass.renderToScreen = true;


  function onParamsChange() {
    bloomPass.threshold = bloomParams.bloomThreshold;
    bloomPass.strength = bloomParams.bloomStrength;
    bloomPass.radius = bloomParams.bloomRadius;

    filmPass.uniforms['sCount'].value = filmParams.count;
    filmPass.uniforms['sIntensity'].value = filmParams.sIntensity;
    filmPass.uniforms['nIntensity'].value = filmParams.nIntensity;

    staticPass.uniforms['amount'].value = staticParams.amount;
    staticPass.uniforms['size'].value = staticParams.size;
  }
  onParamsChange();

  // ===============================================
  //     Render
  // ===============================================

  const animate = () => {
    const shaderTime = clock.getElapsedTime();
    filmPass.uniforms['time'].value = shaderTime;
    staticPass.uniforms['time'].value = shaderTime;

    window.requestAnimationFrame(animate);
    renderComposer();
    // Debug in React View
    // setDebugJSON();
  };
  animate();

  // return cleanup function 
  return () => {
    gui.destroy();
  };

};
