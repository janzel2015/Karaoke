// KAPTEN KARAOKE - Audio Visualizer Component
import { useEffect, useRef, useCallback } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  variant?: 'bars' | 'wave' | 'circular';
  color?: string;
  height?: number;
}

export function AudioVisualizer({
  analyserNode,
  isPlaying,
  variant = 'bars',
  color = '#1DB954',
  height = 100,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const drawBars = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bufferLength = dataArray.length;
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}40`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }, [color]);

  const drawWave = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }, [color]);

  const drawCircular = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 60;
    const step = Math.floor(dataArray.length / bars);

    for (let i = 0; i < bars; i++) {
      const value = dataArray[i * step];
      const barHeight = (value / 255) * radius * 0.5;
      const angle = (i / bars) * Math.PI * 2;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      if (!isPlaying) {
        // Clear canvas when not playing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      analyserNode.getByteFrequencyData(dataArray);

      switch (variant) {
        case 'bars':
          drawBars(ctx, dataArray);
          break;
        case 'wave':
          drawWave(ctx, dataArray);
          break;
        case 'circular':
          drawCircular(ctx, dataArray);
          break;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyserNode, isPlaying, variant, drawBars, drawWave, drawCircular]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height }}
    />
  );
}

// Compact visualizer for player bar
export function CompactVisualizer({
  analyserNode,
  isPlaying,
  color = '#1DB954',
}: Omit<AudioVisualizerProps, 'variant' | 'height'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analyserNode || !containerRef.current) return;

    const bars = containerRef.current.querySelectorAll('.viz-bar');
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    let animationId: number;

    const animate = () => {
      if (isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);

        bars.forEach((bar, i) => {
          const index = Math.floor((i / bars.length) * dataArray.length);
          const value = dataArray[index];
          const height = Math.max(4, (value / 255) * 24);
          (bar as HTMLElement).style.height = `${height}px`;
        });
      } else {
        bars.forEach((bar) => {
          (bar as HTMLElement).style.height = '4px';
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [analyserNode, isPlaying]);

  return (
    <div ref={containerRef} className="flex items-end gap-0.5 h-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="viz-bar w-1 rounded-full transition-all duration-100"
          style={{
            backgroundColor: color,
            height: '4px',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
