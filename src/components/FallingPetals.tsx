import React, { useEffect, useRef } from 'react';

const FallingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const petals: Petal[] = [];
    const petalCount = 30;

    class Petal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * -canvas!.height;
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y / 50) * 1.5 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        
        // Draw a simple petal shape (ellipse-like)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        // Rose antique color
        ctx.fillStyle = '#D8AC9C'; 
        ctx.fill();
        
        ctx.restore();
      }
    }

    const init = () => {
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default FallingPetals;
