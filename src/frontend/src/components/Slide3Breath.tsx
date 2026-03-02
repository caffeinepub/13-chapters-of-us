import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Slide3Breath() {
  const [isHolding, setIsHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0-1
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const holdStartRef = useRef<number>(0);

  const startHold = useCallback(() => {
    setIsHolding(true);
    holdStartRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / 3000, 1);
      setHoldProgress(progress);
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      setRevealed(true);
      setIsHolding(false);
      setHoldProgress(1);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    }, 3000);
  }, []);

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (!revealed) {
      setIsHolding(false);
      setHoldProgress(0);
    }
  }, [revealed]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <section
      data-ocid="slide3.section"
      className="snap-slide flex flex-col items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(128,0,0,0.15) 0%, #0A0A0A 70%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-8 max-w-md text-center"
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            color: "#F8F8FF",
            textShadow: "0 0 20px rgba(128,0,0,0.4)",
            letterSpacing: "0.04em",
          }}
        >
          The Healing Breath
        </h2>

        {/* Instruction */}
        <p
          style={{
            color: "rgba(248,248,255,0.6)",
            fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
            letterSpacing: "0.05em",
          }}
        >
          Hold your thumb here to breathe with me maaa...
        </p>

        {/* Breathing circle */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 220, height: 220 }}
        >
          {/* Progress ring */}
          {isHolding && !revealed && (
            <svg
              className="absolute inset-0"
              viewBox="0 0 220 220"
              style={{ transform: "rotate(-90deg)" }}
              aria-label="Breathing progress ring"
              role="img"
            >
              <title>Breathing progress</title>
              <circle
                cx="110"
                cy="110"
                r="105"
                fill="none"
                stroke="rgba(128,0,0,0.3)"
                strokeWidth="3"
              />
              <circle
                cx="110"
                cy="110"
                r="105"
                fill="none"
                stroke="#FF4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 105}`}
                strokeDashoffset={`${2 * Math.PI * 105 * (1 - holdProgress)}`}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
          )}

          {/* Main circle */}
          <motion.button
            data-ocid="slide3.canvas_target"
            animate={
              isHolding
                ? { scale: 1.3 }
                : revealed
                  ? { scale: 1.1 }
                  : {
                      scale: [0.9, 1.1, 0.9],
                      transition: {
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }
            }
            transition={
              isHolding
                ? { type: "spring", stiffness: 100, damping: 10 }
                : undefined
            }
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="relative flex items-center justify-center"
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: isHolding
                ? "radial-gradient(circle, rgba(248,248,255,0.25) 0%, rgba(248,248,255,0.08) 60%, transparent 100%)"
                : "radial-gradient(circle, rgba(248,248,255,0.15) 0%, rgba(248,248,255,0.05) 60%, transparent 100%)",
              border: `2px solid ${isHolding ? "rgba(248,248,255,0.5)" : "rgba(248,248,255,0.2)"}`,
              boxShadow: isHolding
                ? "0 0 40px rgba(248,248,255,0.3), 0 0 80px rgba(248,248,255,0.15), inset 0 0 30px rgba(248,248,255,0.1)"
                : "0 0 20px rgba(248,248,255,0.1), 0 0 40px rgba(128,0,0,0.2), inset 0 0 15px rgba(248,248,255,0.05)",
              cursor: "pointer",
              touchAction: "none",
            }}
          >
            <span style={{ fontSize: "2.5rem", pointerEvents: "none" }}>
              {isHolding ? "🌬️" : revealed ? "🤍" : "🫁"}
            </span>
          </motion.button>
        </div>

        {/* Revealed text */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="glass-card p-6 max-w-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(128,0,0,0.3)",
                borderRadius: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(0.85rem, 2.2vw, 1rem)",
                  color: "rgba(248,248,255,0.88)",
                  lineHeight: 1.9,
                  letterSpacing: "0.02em",
                }}
              >
                Maaa... calm down maaa... just take a deep breath and relax
                babyyy... it&apos;s okay maaa 🤍. I know things feel heavy
                sometimes... but I don&apos;t want to lose you searching for
                answers maaa... I just want to hold Akkaa&apos;s hand forever
                🌷. Even if you feel &apos;nothing&apos; right now... I have
                enough love for both of us until you find your smile again
                babyyy 💍🫠.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint text if not yet revealed */}
        {!revealed && (
          <p
            style={{
              color: "rgba(248,248,255,0.3)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            {isHolding ? "Keep holding..." : "Press & hold for 3 seconds"}
          </p>
        )}
      </motion.div>
    </section>
  );
}
