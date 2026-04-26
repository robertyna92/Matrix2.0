import { useEffect, useRef } from 'react';
import { getRandomCharacter, matricFace } from '../utils/characters';

const FONT_SIZE = 16;
const SPEED = 50;
const FACE_SIZE = 320;
const BUILD_ROWS_PER_TICK = 0.9;

type FaceCell = {
  char: string;
  intensity: number;
  seed: number;
};

export const useMatrixRain = (canvasRef: React.RefObject<HTMLCanvasElement | null> ) => {
  const dropsRef = useRef<number[]>([]);
  const clickRef = useRef({ x: 0, y: 0, textToShow: '', showText: false });
  const revealRowsRef = useRef(0);

  // 'face' per mostrare un volto, 'rain' per la pioggia di caratteri
  const modeRef = useRef<'face' | 'rain'>('rain');

  //tutte le immagini disponibili
  const facesRef = useRef<HTMLImageElement[]>([])

  //contiene le griglie di caratteri per ogni volto
  const facesGridRef = useRef<FaceCell[][][]>([]);

  //salvare la grid selezionata per il volto attuale
  const faceGridRef = useRef<FaceCell[][] | null>(null);

  // blocca click mentre è attiva una transizione
  const lockRef = useRef(false)

  const readyRef = useRef(false);
  
  useEffect(() => {
    let counter = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx ) return;

     for(let i = 0; i < matricFace.length; i++) {
      const img = new Image();
      img.onload = () => {       
      console.log("LOADED:", matricFace[i]); 

      facesRef.current[i] = img;
      facesGridRef.current[i] = createFaceGrid(img);
      console.log("GRID:", facesGridRef.current[i].length, facesGridRef.current[i][0].length);
      counter++;
      if(counter === matricFace.length) { readyRef.current = true; }
      }        
      img.onerror = () => {
        console.log("ERROR:", matricFace[i]);
        counter++;
        if(counter === matricFace.length) { readyRef.current = true; }
      }
      img.src = matricFace[i];
    }

    // imposta il canvas a tutto schermo
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // ricalcola le colonne in base alla larghezza
      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array(columns).fill(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
   

    const handleClick = (event: MouseEvent) => {
      if (lockRef.current) return; 
      if (!readyRef.current) return;
      if (facesRef.current.length === 0) return;

      modeRef.current = 'face';
      lockRef.current = true;

      const randomIndex = Math.floor(Math.random() * facesRef.current.length);
      faceGridRef.current = facesGridRef.current[randomIndex];
      revealRowsRef.current = 0;

      setTimeout(() => {
        lockRef.current = false;
        modeRef.current = 'rain';
      }, 5000);

      clickRef.current.x = event.clientX;
      clickRef.current.y = event.clientY;
      clickRef.current.showText = true;
    };

    window.addEventListener('click', handleClick);

    // loop di animazione
    const interval = setInterval(() => {

      // rettangolo nero semi-trasparente → crea l'effetto scia
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if(modeRef.current === 'face' &&  faceGridRef.current) {
       const grid = faceGridRef.current;
       if (grid.length === 0 || grid[0].length === 0) return;
       const gridWidth = grid[0].length * FONT_SIZE;
       const gridHeight = grid.length * FONT_SIZE;

       const startX = Math.max(0, Math.min(canvas.width - gridWidth, clickRef.current.x - gridWidth / 2));
       const startY = Math.max(0, Math.min(canvas.height - gridHeight, clickRef.current.y - gridHeight / 2));
       ctx.font = `${FONT_SIZE}px monospace`;
       revealRowsRef.current = Math.min(grid.length, revealRowsRef.current + BUILD_ROWS_PER_TICK);
       const visibleRows = Math.floor(revealRowsRef.current);

       const now = Date.now();
       grid.forEach((row, y) => {
        if (y > visibleRows) return;
        row.forEach((cell, x) => {
        if (cell.char) {
          const pulse = 0.75 + Math.sin(now * 0.006 + cell.seed * 9) * 0.25;
          const green = Math.min(255, Math.floor(90 + cell.intensity * 165 * pulse));
          const alpha = Math.min(1, 0.25 + cell.intensity * 0.85);
          const isHighlight = cell.intensity > 0.72 && Math.sin(now * 0.02 + cell.seed * 30) > 0.95;

          ctx.fillStyle = isHighlight ? `rgba(230,255,230,${Math.min(1, alpha + 0.15)})` : `rgba(0,${green},65,${alpha})`;
          ctx.fillText(
            cell.char,
            startX + x * FONT_SIZE,
            startY + y * FONT_SIZE
          );

          // piccola scia verticale per imitare il look "digitale"
          if (cell.intensity > 0.45 && Math.sin(now * 0.008 + cell.seed * 11) > 0.72) {
            ctx.fillStyle = `rgba(0,${Math.max(70, green - 45)},40,${alpha * 0.35})`;
            ctx.fillText('.', startX + x * FONT_SIZE, startY + y * FONT_SIZE + FONT_SIZE * 0.7);
          }
        }
    });
  });
} else {
      dropsRef.current.forEach((drop, i) => {
      const char = getRandomCharacter();
      const x = i * FONT_SIZE;
      const y = drop * FONT_SIZE;

      if(drop === 1) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#00ff41';
      }
      
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.fillText(char, x, y);
      
      if (y > canvas.height && Math.random() > 0.975) {
        dropsRef.current[i] = 0;
      }
      
      dropsRef.current[i]++;
    });
  }

}, SPEED);

const createFaceGrid = (img: HTMLImageElement): FaceCell[][] => {
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  
  if(!offscreenCtx) return [];
  
  offscreenCanvas.width = FACE_SIZE ;
  offscreenCanvas.height = FACE_SIZE;
  offscreenCtx?.drawImage(img, 0, 0, FACE_SIZE, FACE_SIZE);

  const imageData = offscreenCtx.getImageData(0, 0, FACE_SIZE, FACE_SIZE);

  const grid: FaceCell[][] = [];
  const threshold = 175;
     
    for(let y = 0; y < FACE_SIZE; y+= FONT_SIZE) {

    const row: FaceCell[] = [];

      for(let x = 0; x < FACE_SIZE; x+= FONT_SIZE) {
        let sumLum = 0;
        let sumAlpha = 0;
        let count = 0;

        const yEnd = Math.min(y + FONT_SIZE, FACE_SIZE);
        const xEnd = Math.min(x + FONT_SIZE, FACE_SIZE);

        for (let yy = y; yy < yEnd; yy++) {
          for (let xx = x; xx < xEnd; xx++) {
            const index = (yy * offscreenCanvas.width + xx) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            sumLum += lum;
            sumAlpha += a;
            count++;
          }
        }

        const avgLum = count > 0 ? sumLum / count : 255;
        const avgAlpha = count > 0 ? sumAlpha / count : 0;
        if (avgAlpha > 20 && avgLum < threshold) {
          const intensity = 1 - avgLum / threshold;
          row.push({
            char: getRandomCharacter(),
            intensity: Math.max(0, Math.min(1, intensity)),
            seed: Math.random(),
          });
        } else {
          row.push({ char: '', intensity: 0, seed: Math.random() });
        }
        
      }
      grid.push(row);
    }
    return grid;
  }

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, [canvasRef]);
};
