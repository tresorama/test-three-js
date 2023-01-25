import * as THREE from 'three';

export const createMeshLabel = (text: string) => {
  const aspectRatio = 1 / (2 / 1);
  const createTexture = (text: string | number) => {
    const cv = document.createElement('canvas');
    // document.body.appendChild(cv);
    // setTimeout(() => document.body.removeChild(cv), 800);
    const w = 200;
    const h = w * aspectRatio;
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d')!;

    ctx.fillStyle = "#0066dd";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${h * 0.2}px serif`;
    ctx.fillText(text.toString(), 10, 40);

    return new THREE.CanvasTexture(cv);
  };
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3 * aspectRatio),
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: createTexture(text),
      transparent: true,
      opacity: 1.0
    })
  );
  return {
    mesh,
    setText: (text: string | number) => {
      mesh.material.map = createTexture(text);
    }
  };
};