import { useEffect, useRef, useState } from "react";

export const useThreeJsScene = (
  canvasNodeRef: React.RefObject<HTMLCanvasElement>,
  sceneItintializer: (
    canvas: HTMLCanvasElement,
    setDebugJSON: (json: object) => void
  ) => Promise<() => void>
) => {
  const [debugJSON, setDebugJSON] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const cleanupFunctionRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    (async () => {
      const canvasNode = canvasNodeRef.current;
      if (!canvasNode) return;
      try {
        cleanupFunctionRef.current = await sceneItintializer(canvasNode, setDebugJSON);
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Open console!';
        setErrorMessage(errorMessage);
      }
    })();
    return () => {
      cleanupFunctionRef.current?.();
    };
  }, []);

  return {
    debugJSON,
    errorMessage,
  };
};