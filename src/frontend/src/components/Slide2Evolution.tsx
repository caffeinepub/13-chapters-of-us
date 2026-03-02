import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

export default function Slide2Evolution() {
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 2), 98);
    setSliderPos(pct);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updateSlider(e.clientX);

      const handleMouseMove = (ev: MouseEvent) => updateSlider(ev.clientX);
      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [updateSlider],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updateSlider(e.touches[0].clientX);

      const handleTouchMove = (ev: TouchEvent) =>
        updateSlider(ev.touches[0].clientX);
      const handleTouchEnd = () => {
        setIsDragging(false);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
    },
    [updateSlider],
  );

  return (
    <section
      data-ocid="slide2.section"
      className="snap-slide flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col items-center gap-6"
      >
        {/* Title */}
        <div className="text-center">
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              color: "#F8F8FF",
              letterSpacing: "0.04em",
              textShadow: "0 0 30px rgba(128,0,0,0.5)",
            }}
          >
            The Evolution
          </h2>
          <p
            style={{
              color: "rgba(248,248,255,0.5)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            Swipe to evolve ↔
          </p>
        </div>

        {/* Comparison container */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden cursor-ew-resize"
          style={{
            height: "clamp(200px, 45vh, 360px)",
            borderRadius: "12px",
            border: "1px solid rgba(128,0,0,0.3)",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Right side — warm glow (2026) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1a0000 0%, #3a0000 40%, #600000 70%, #800000 100%)",
            }}
          >
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  fontSize: "3rem",
                  filter: "drop-shadow(0 0 12px rgba(255,100,100,0.6))",
                }}
              >
                💍
              </motion.div>
              <p
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
                  color: "#F8F8FF",
                  lineHeight: 1.5,
                  textShadow: "0 0 20px rgba(255,80,80,0.5)",
                }}
              >
                13 Months Later...
                <br />
                <span
                  style={{ color: "rgba(255,180,180,0.9)", fontSize: "0.9em" }}
                >
                  My Pondatiii, the most headache in my life 🤪💍🤍
                </span>
              </p>
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,120,120,0.7)",
                  textTransform: "uppercase",
                }}
              >
                2026 ✨
              </span>
            </div>
          </div>

          {/* Left side — B&W (2025) - clipped */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              background:
                "linear-gradient(135deg, #111 0%, #1f1f1f 50%, #2a2a2a 100%)",
              filter: "grayscale(1) brightness(0.7)",
            }}
          >
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div style={{ fontSize: "3rem", opacity: 0.6 }}>🏃‍♂️</div>
              <p
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
                  color: "#ccc",
                  lineHeight: 1.5,
                }}
              >
                1 week &amp; 4 days...
                <br />
                <span style={{ color: "#aaa", fontSize: "0.9em" }}>
                  The shy boy 🏃‍♂️💨
                </span>
              </p>
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "rgba(200,200,200,0.7)",
                  textTransform: "uppercase",
                }}
              >
                2025
              </span>
            </div>
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 flex items-center"
            style={{
              left: `${sliderPos}%`,
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            {/* Line */}
            <div
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #F8F8FF 20%, #F8F8FF 80%, transparent)",
                boxShadow: "0 0 8px rgba(248,248,255,0.6)",
              }}
            />
            {/* Handle */}
            <motion.div
              data-ocid="slide2.drag_handle"
              animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#F8F8FF",
                boxShadow:
                  "0 0 16px rgba(248,248,255,0.5), 0 0 32px rgba(128,0,0,0.4), 0 2px 8px rgba(0,0,0,0.6)",
                cursor: "ew-resize",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <span
                style={{ fontSize: "14px", color: "#0A0A0A", fontWeight: 700 }}
              >
                ↔
              </span>
            </motion.div>
          </div>
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center max-w-lg"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "rgba(248,248,255,0.7)",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            textShadow: "0 0 12px rgba(128,0,0,0.3)",
          }}
        >
          Maaa... look how much can change in just 395 days babyyy... From
          hiding my stories to sharing my entire life with Akkaa 🫠🤍🌷
        </motion.p>
      </motion.div>
    </section>
  );
}
