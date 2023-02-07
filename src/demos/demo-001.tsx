import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createEveryNTimer, initializeWorld } from '../modules/three-helpers';
import { useThreeJsScene } from '../modules/three-helpers-react/use-three-js-scene';

// Main React Component
export const Demo001 = () => {
  const canvasNodeRef = useRef<HTMLCanvasElement>(null);
  const { debugJSON, errorMessage } = useThreeJsScene(canvasNodeRef, main);

  return (
    <>
      <header>
        <h1>Demo001</h1>
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
  const { scene, camera, clock, gui, renderRenderer, subscribeRaf } = initializeWorld(canvas);
  scene.background = new THREE.Color(0x333);
  camera.position.z = 8;
  camera.position.x = 1;
  camera.position.y = 10;

  // ===============================================
  //     Objects
  // ===============================================
  // Object - Mesh Label
  // const meshLabel = createMeshLabel('Clock');
  // scene.add(meshLabel.mesh);
  // meshLabel.mesh.position.y = meshLabel.mesh.geometry.parameters.height / 2;
  // meshLabel.mesh.position.z = -5;
  // meshLabel.mesh.position.x = -5;
  // meshLabel.mesh.scale.set(2, 2, 2);

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


  // Object - Wall
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, .1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  scene.add(wall);
  wall.position.z = -4;
  wall.position.y = wall.geometry.parameters.height / 2;
  const guiWall = gui.addFolder('Wall');
  guiWall.add(wall.material, 'wireframe');
  guiWall.addColor({ color: wall.material.color.getHex() }, 'color').onChange(color => wall.material.color.set(color));
  const guiWallPosition = guiWall.addFolder('Position');
  guiWallPosition.add(wall.position, 'z', -4, 4, 0.01);
  guiWallPosition.add(wall.position, 'x', -4, 4, 0.01);
  guiWallPosition.add(wall.position, 'y', -4, 4, 0.01);
  const guiWallRotation = guiWall.addFolder('Rotation');
  guiWallRotation.add(wall.rotation, 'z', -4, 4, 0.01);
  guiWallRotation.add(wall.rotation, 'x', -4, 4, 0.01);
  guiWallRotation.add(wall.rotation, 'y', -4, 4, 0.01);

  // Object - Wall Image Gallery
  const galleryImages = {
    images: [
      "https://source.unsplash.com/random/900×700/?panorama",
      "https://source.unsplash.com/random/900×700/?panorama,snow",
    ],
    current: -1,
    next() {
      this.current++;
      return this.images[this.current % this.images.length];
    },
    nextAsTexture() {
      return new THREE.TextureLoader().load(this.next());
    }
  };
  const gallery = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, .1),
    new THREE.MeshBasicMaterial({
      map: galleryImages.nextAsTexture(),
    })
  );
  scene.add(gallery);
  const galleryImagesNextImageTimer = createEveryNTimer(5000);
  gallery.position.z = -2;
  gallery.position.y = gallery.geometry.parameters.height / 2;
  const guiGallery = gui.addFolder('Gallery');
  guiGallery.add(gallery.material, 'wireframe');
  const guiGalleryPosition = guiGallery.addFolder('Position');
  guiGalleryPosition.add(gallery.position, 'z', -4, 4, 0.01);
  guiGalleryPosition.add(gallery.position, 'x', -4, 4, 0.01);
  guiGalleryPosition.add(gallery.position, 'y', -4, 4, 0.01);
  const guiGalleryRotation = guiGallery.addFolder('Rotation');
  guiGalleryRotation.add(gallery.rotation, 'z', -4, 4, 0.01);
  guiGalleryRotation.add(gallery.rotation, 'x', -4, 4, 0.01);
  guiGalleryRotation.add(gallery.rotation, 'y', -4, 4, 0.01);

  // Object - Car
  const car = await new GLTFLoader()
    .loadAsync("/demos/demo-001/models/130/scene.gltf")
    .then(gltf => gltf.scene);
  scene.add(car);
  car.position.x = -1;
  car.position.y = 0.25;


  // Object - Dog
  const dog = await new GLTFLoader()
    .loadAsync("/demos/demo-001/models/shiba/scene.gltf")
    .then(gltf => gltf.scene);
  // scene.add(dog);
  dog.position.x = 1;
  dog.position.y = 0.5;
  dog.scale.set(0.5, 0.5, 0.5);

  // ===============================================
  //     Render
  // ===============================================
  const unsubscribeRaf = subscribeRaf(() => {
    // const pendoloValue = Math.sin(clock.getElapsedTime()) * 0.5 + 0.5;
    // meshLabel.setText(pendoloValue.toFixed(2));

    // Animate Objects !!

    // Car
    //car.rotation.y += 0.005 * (pendoloValue - 0.5);

    // Gallery
    if (galleryImagesNextImageTimer(clock.getElapsedTime())) {
      gallery.material.map = galleryImages.nextAsTexture();
    }

    // Debug in React View
    setDebugJSON({
      "clock.elapsedTime": clock.getElapsedTime(),
    });
    //
    renderRenderer();
  });


  // return cleanup function 
  return () => {
    unsubscribeRaf();
  };

};