import { useEffect, useRef } from 'react';
import { getRandomCharacter, getRandomPhrase } from '../utils/characters';

const FONT_SIZE = 16;
const SPEED = 50;


export const useMatrixRain = (canvasRef: React.RefObject<HTMLCanvasElement | null> ) => {
  const dropsRef = useRef<number[]>([]);

  const clickRef = useRef({ x: 0, y: 0, textToShow: '', showText: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      //recupero le frasi random da mostrare al click
      clickRef.current.textToShow = getRandomPhrase();
      clickRef.current.x = event.clientX;
      clickRef.current.y = event.clientY;
      clickRef.current.showText = true;

      setTimeout(() => {
        clickRef.current.showText = false;
      }, 5000);
    };

    window.addEventListener('click', handleClick);

    // loop di animazione
    const interval = setInterval(() => {


      // rettangolo nero semi-trasparente → crea l'effetto scia
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

   if(clickRef.current.showText) {
    drawText(ctx, clickRef.current.textToShow, clickRef.current.x, clickRef.current.y, canvas.width - clickRef.current.x);
   }

}, SPEED);


const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) => {
  const words = text.split(' ');
  let currentLine = '';
  let currentY = y;
  
  words.forEach(word => {
   const testLine = currentLine + word + ' ';
   const testWidth = ctx.measureText(testLine).width;
   ctx.fillStyle = '#fffb00';

  if(testWidth > maxWidth) {
    ctx.fillText(currentLine, x, currentY);
    currentLine = word + ' ';
    currentY += FONT_SIZE + 4; // spaziatura tra le righe
  } else {
    currentLine = testLine;
    }   
 });
 ctx.fillText(currentLine, x, currentY);
}

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, [canvasRef]);
};