import React, { useRef } from 'react';
import { useMatrixRain} from '../hooks/UseMatrixRain';

const MatrixCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default MatrixCanvas;