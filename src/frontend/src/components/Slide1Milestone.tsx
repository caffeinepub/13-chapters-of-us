import { motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
}

export default function Slide1Milestone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const symbols = ["♡", "♡", "♡", "🌷", "✦", "·"];
    return {
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.8 + 0.3,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 14 + 10,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
      drift: (Math.random() - 0.5) * 0.3,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: 30 }, () => {
      const p = createParticle(canvas);
      p.y = Math.random() * canvas.height; // start scattered
      return p;
    });

    const REPEL_RADIUS = 100;
    const REPEL_STRENGTH = 3;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        // Mouse/touch repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * REPEL_STRENGTH * 0.1;
          p.vy += (dy / dist) * force * REPEL_STRENGTH * 0.1;
        }

        // Damping
        p.vx *= 0.98;
        p.vy = Math.max(p.speed * 0.3, p.vy * 0.99);

        p.x += p.vx + p.drift;
        p.y += p.vy;

        // Wrap horizontally
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        // Reset when off bottom
        if (p.y > canvas.height + 30) {
          particlesRef.current[i] = createParticle(canvas);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = "#F8F8FF";
        ctx.shadowColor = "rgba(248,248,255,0.4)";
        ctx.shadowBlur = 8;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [createParticle]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2 + i * 0.5,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section
      data-ocid="slide1.section"
      className="snap-slide flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ zIndex: 2 }}
      >
        {/* Giant glowing "13" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="animate-heartbeat"
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(8rem, 25vw, 18rem)",
            fontWeight: 900,
            lineHeight: 1,
            color: "#F8F8FF",
            textShadow: `
              0 0 30px rgba(248,248,255,0.6),
              0 0 60px rgba(128,0,0,0.8),
              0 0 100px rgba(128,0,0,0.5),
              0 0 160px rgba(128,0,0,0.3)
            `,
            userSelect: "none",
          }}
        >
          13
        </motion.div>

        {/* Floating text lines */}
        <div className="flex flex-col items-center gap-3 mt-4">
          {[
            "395 Days of Us...",
            "13 Months of Growth...",
            "1 Year + 1 Beautiful Month Together 🤍🫠",
          ].map((line, i) => (
            <motion.p
              key={line}
              custom={i}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily:
                  i === 2
                    ? "Instrument Serif, serif"
                    : "General Sans, sans-serif",
                fontSize:
                  i === 2
                    ? "clamp(1rem, 3vw, 1.4rem)"
                    : "clamp(0.9rem, 2.5vw, 1.2rem)",
                color: i === 2 ? "#F8F8FF" : "rgba(248,248,255,0.8)",
                letterSpacing: "0.08em",
                fontWeight: i === 2 ? 400 : 300,
                textShadow: "0 0 20px rgba(128,0,0,0.5)",
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(248,248,255,0.3)" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{ fontSize: "1.2rem" }}
          >
            ↓
          </motion.div>
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
