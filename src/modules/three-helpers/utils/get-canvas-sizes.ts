export const getCanvasSizes = (canvas: HTMLCanvasElement) => {
  const computedStyle = getComputedStyle(canvas);
  const width = Number(computedStyle.width.slice(0, -2));
  const height = Number(computedStyle.height.slice(0, -2));
  return {
    width,
    height,
    aspectRatio: Number((width / height).toFixed(3)),
  };
};