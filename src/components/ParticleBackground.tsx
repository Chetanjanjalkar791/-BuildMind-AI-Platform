import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse movement with gentle fallback coords
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 170, // Interaction radius
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle specification
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseOpacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Float velocities
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 2 + 1; // 1px to 3px

        // Color selection matching the branding (cyan, deep purple, hot pinks)
        const rand = Math.random();
        if (rand < 0.4) {
          this.color = '124, 58, 237'; // Purple-600
        } else if (rand < 0.7) {
          this.color = '14, 165, 233'; // Cyan-500
        } else {
          this.color = '236, 72, 153'; // Pink-500
        }
        this.baseOpacity = Math.random() * 0.3 + 0.15; // Gentle float
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Dynamic mouse interactivity: gently move towards mouse if within radius
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            // Calculate vector pull pressure
            const force = (mouse.radius - dist) / mouse.radius;
            // Pull particles gently
            this.x += (dx / dist) * force * 0.4;
            this.y += (dy / dist) * force * 0.4;
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.baseOpacity})`;
        context.fill();
      }
    }

    // Determine particle count based on display size
    const particleCount = Math.min(Math.floor((width * height) / 11000), 120);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect overlapping/nearby particles with constellation lines
    const connectParticles = (context: CanvasRenderingContext2D) => {
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            // Line opacity based on closeness
            const opacity = (1 - dist / maxDistance) * 0.08;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            // Gradient or solid color
            context.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            context.lineWidth = 0.8;
            context.stroke();
          }
        }
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render the particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Draw vector links
      connectParticles(ctx);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-ambient-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden mix-blend-screen"
      style={{ opacity: 0.85 }}
    />
  );
}
