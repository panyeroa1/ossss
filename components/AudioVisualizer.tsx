
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useEffect, useRef } from 'react';

export default function AudioVisualizer() {
  const { volume } = useLiveAPIContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bars = 60;
    const barWidth = 1.5;
    const gap = 3;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Responsive multiplier based on volume
      const v = volume * 1.8; 

      for (let i = 0; i < bars; i++) {
        const distance = Math.abs(i - bars / 2);
        const multiplier = Math.pow(Math.max(0.05, 1 - distance / (bars / 2)), 2);
        const timeFactor = Date.now() / 400;
        const wave = Math.sin(timeFactor + i * 0.15) * 0.3 + 0.7;
        const height = 3 + v * 50 * multiplier * wave;
        
        const x = centerX + (i - bars / 2) * (barWidth + gap);
        
        // Premium gradient-like selection
        if (i % 3 === 0) {
            ctx.fillStyle = 'rgba(77, 166, 255, 0.9)';
        } else if (i % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        } else {
            ctx.fillStyle = 'rgba(77, 166, 255, 0.2)';
        }

        ctx.beginPath();
        ctx.roundRect(x, centerY - height / 2, barWidth, height, 2);
        ctx.fill();
        
        // Add extreme subtle glow
        if (v > 0.1 && multiplier > 0.5) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(77, 166, 255, 0.4)';
        } else {
          ctx.shadowBlur = 0;
        }
      }
      
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [volume]);

  return (
    <div className="audio-visualizer-container">
      <canvas ref={canvasRef} width={600} height={100} />
    </div>
  );
}
