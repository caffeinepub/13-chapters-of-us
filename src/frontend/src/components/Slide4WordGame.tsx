import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  type: "good" | "bad";
  particles?: { x: number; y: number; vx: number; vy: number; life: number }[];
  shattered?: boolean;
}

const GOOD_WORDS = ["Loyalty", "Trust", "Kisses", "Our Future"];
const BAD_WORDS = ["Doubt", "Silence", "Distance"];

let wordIdCounter = 0;

export default function Slide4WordGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const wordsRef = useRef<FallingWord[]>([]);
  const catcherXRef = useRef(50); // percentage
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const rewardShownRef = useRef(false);
  const gameActiveRef = useRef(false);

  const spawnWord = useCallback((canvas: HTMLCanvasElement) => {
    const isGood = Math.random() > 0.35;
    const pool = isGood ? GOOD_WORDS : BAD_WORDS;
    const text = pool[Math.floor(Math.random() * pool.length)];
    wordsRef.current.push({
      id: wordIdCounter++,
      text,
      x: Math.random() * (canvas.width - 100) + 50,
      y: -30,
      speed: Math.random() * 1.5 + 0.8,
      type: isGood ? "good" : "bad",
    });
  }, []);

  const startGame = useCallback(() => {
    setGameActive(true);
    gameActiveRef.current = true;
    scoreRef.current = 0;
    setScore(0);
    wordsRef.current = [];
    rewardShownRef.current = false;
    setShowReward(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      catcherXRef.current = canvas.width / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const CATCHER_WIDTH = 100;
    const CATCHER_HEIGHT = 16;
    const CATCHER_Y_OFFSET = 60;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const catcherX = catcherXRef.current;
      const catcherY = canvas.height - CATCHER_Y_OFFSET;

      if (gameActiveRef.current) {
        // Spawn words
        if (timestamp - lastSpawnRef.current > 1800) {
          spawnWord(canvas);
          lastSpawnRef.current = timestamp;
        }

        // Draw catcher
        ctx.save();
        ctx.beginPath();
        const grd = ctx.createLinearGradient(
          catcherX - CATCHER_WIDTH / 2,
          catcherY,
          catcherX + CATCHER_WIDTH / 2,
          catcherY + CATCHER_HEIGHT,
        );
        grd.addColorStop(0, "rgba(248,248,255,0.9)");
        grd.addColorStop(1, "rgba(128,0,0,0.8)");
        ctx.fillStyle = grd;
        ctx.shadowColor = "rgba(248,248,255,0.5)";
        ctx.shadowBlur = 10;
        ctx.roundRect(
          catcherX - CATCHER_WIDTH / 2,
          catcherY,
          CATCHER_WIDTH,
          CATCHER_HEIGHT,
          8,
        );
        ctx.fill();
        ctx.restore();

        // Update and draw words
        wordsRef.current = wordsRef.current.filter((word) => {
          if (word.shattered) {
            // Update and draw particles
            if (word.particles) {
              let anyAlive = false;
              for (const p of word.particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.life -= 0.025;
                if (p.life > 0) {
                  anyAlive = true;
                  ctx.save();
                  ctx.globalAlpha = p.life;
                  ctx.fillStyle = "#FF4444";
                  ctx.shadowColor = "#FF0000";
                  ctx.shadowBlur = 4;
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();
                }
              }
              return anyAlive;
            }
            return false;
          }

          word.y += word.speed;

          // Check catch collision
          const wordWidth = word.text.length * 8 + 20;
          const hitX =
            Math.abs(word.x - catcherX) < CATCHER_WIDTH / 2 + wordWidth / 2;
          const hitY =
            word.y + 15 >= catcherY && word.y - 15 <= catcherY + CATCHER_HEIGHT;

          if (hitX && hitY && !rewardShownRef.current) {
            if (word.type === "good") {
              scoreRef.current += 10;
              setScore(scoreRef.current);
              if (scoreRef.current >= 30 && !rewardShownRef.current) {
                rewardShownRef.current = true;
                setShowReward(true);
                gameActiveRef.current = false;
                setGameActive(false);
              }
            } else {
              // Bad word — shatter
              word.shattered = true;
              word.particles = Array.from({ length: 16 }, () => ({
                x: word.x,
                y: word.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
              }));
              scoreRef.current = Math.max(0, scoreRef.current - 5);
              setScore(scoreRef.current);
              return true;
            }
            return false;
          }

          // Off screen
          if (word.y > canvas.height + 30) return false;

          // Draw word
          ctx.save();
          const isGood = word.type === "good";
          ctx.font = "bold 15px General Sans, sans-serif";
          const textWidth = ctx.measureText(word.text).width;

          // Pill background
          ctx.beginPath();
          ctx.roundRect(
            word.x - textWidth / 2 - 10,
            word.y - 14,
            textWidth + 20,
            22,
            6,
          );
          ctx.fillStyle = isGood
            ? "rgba(248,248,255,0.12)"
            : "rgba(128,0,0,0.2)";
          ctx.fill();

          ctx.strokeStyle = isGood
            ? "rgba(248,248,255,0.5)"
            : "rgba(255,50,50,0.6)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = isGood ? "#F8F8FF" : "#FF5555";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = isGood
            ? "rgba(248,248,255,0.7)"
            : "rgba(255,50,50,0.8)";
          ctx.shadowBlur = isGood ? 8 : 12;
          ctx.fillText(word.text, word.x, word.y);
          ctx.restore();

          return true;
        });
      }

      // Score display
      ctx.save();
      ctx.font = "bold 16px General Sans, sans-serif";
      ctx.fillStyle = "rgba(248,248,255,0.7)";
      ctx.textAlign = "right";
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width - 16, 30);
      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [spawnWord]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      catcherXRef.current = e.clientX - rect.left;
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      catcherXRef.current = e.touches[0].clientX - rect.left;
    },
    [],
  );

  return (
    <section
      data-ocid="slide4.section"
      className="snap-slide flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0A0A0A", position: "relative" }}
    >
      {/* Header */}
      <div
        className="absolute top-6 left-0 right-0 text-center z-10"
        style={{ pointerEvents: "none" }}
      >
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
            color: "#F8F8FF",
            textShadow: "0 0 20px rgba(128,0,0,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          The Loyalty Game
        </h2>
        {!gameActive && !showReward && (
          <p
            style={{
              color: "rgba(248,248,255,0.4)",
              fontSize: "0.8rem",
              marginTop: "4px",
              letterSpacing: "0.1em",
            }}
          >
            Catch good words • Avoid bad ones
          </p>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        data-ocid="slide4.canvas_target"
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{ cursor: gameActive ? "none" : "default", touchAction: "none" }}
      />

      {/* Start / Score overlay */}
      <AnimatePresence>
        {!gameActive && !showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div
              className="glass-card p-6 text-center max-w-xs"
              style={{ borderRadius: "16px" }}
            >
              <p
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "0.95rem",
                  color: "rgba(248,248,255,0.75)",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                🎮 Catch:{" "}
                <span style={{ color: "#F8F8FF" }}>
                  Loyalty, Trust, Kisses, Our Future
                </span>
                <br />💔 Avoid:{" "}
                <span style={{ color: "#FF5555" }}>
                  Doubt, Silence, Distance
                </span>
              </p>
              <motion.button
                data-ocid="slide4.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-3"
                style={{
                  backgroundColor: "#800000",
                  color: "#F8F8FF",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "General Sans, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(128,0,0,0.5)",
                }}
              >
                {scoreRef.current > 0 ? "Play Again" : "Start Game"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-20 flex flex-col items-center gap-6 px-6"
          >
            <div
              className="glass-card p-8 text-center max-w-sm"
              style={{
                background: "rgba(128,0,0,0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(128,0,0,0.5)",
                borderRadius: "20px",
                boxShadow: "0 0 40px rgba(128,0,0,0.3)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                style={{ fontSize: "3rem", marginBottom: "12px" }}
              >
                🤍💍
              </motion.div>
              <p
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                  color: "#F8F8FF",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                  textShadow: "0 0 10px rgba(248,248,255,0.2)",
                }}
              >
                My word still stands maaa... I&apos;m never letting go of this
                hand my loveee 🤍💍🫶🏼.
              </p>
              <motion.button
                data-ocid="slide4.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowReward(false);
                  startGame();
                }}
                className="px-6 py-2.5"
                style={{
                  backgroundColor: "#800000",
                  color: "#F8F8FF",
                  border: "1px solid rgba(248,248,255,0.2)",
                  borderRadius: "8px",
                  fontFamily: "General Sans, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Continue 🫶🏼
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
