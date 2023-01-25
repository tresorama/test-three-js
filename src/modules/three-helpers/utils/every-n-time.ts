import * as THREE from 'three';

export const createEveryNTimer = (timeInMs: number) => {
  let last = 0;
  let speed = timeInMs / 1000;
  const isNow = (elapsedTime: THREE.Clock['elapsedTime']) => {
    const delta = elapsedTime - last;
    if (delta >= speed) {
      last = elapsedTime;
      return true;
    }
    return false;
  };
  return isNow;
};
