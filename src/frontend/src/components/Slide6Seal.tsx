import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

interface KissParticle {
  id: number;
  angle: number;
  distance: number;
  duration: number;
  delay: number;
}

const PHOTO_ID = "anniversary-photo";

function generateKissParticles(): KissParticle[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (i / 24) * 360 + Math.random() * 15 - 7.5,
    distance: Math.random() * 120 + 80,
    duration: Math.random() * 0.8 + 0.6,
    delay: Math.random() * 0.3,
  }));
}

export default function Slide6Seal() {
  const [showEnding, setShowEnding] = useState(false);
  const [kissParticles, setKissParticles] = useState<KissParticle[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const { actor, isFetching } = useActor();

  // Load existing photo
  const { data: photoIds } = useQuery<string[]>({
    queryKey: ["photoIds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPhotoIds();
    },
    enabled: !!actor && !isFetching,
  });

  useEffect(() => {
    if (!actor || !photoIds?.includes(PHOTO_ID)) return;

    let url: string | null = null;
    actor
      .getPhoto(PHOTO_ID)
      .then((entry) => {
        url = entry.blob.getDirectURL();
        setPhotoUrl(url);
      })
      .catch(console.error);

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [actor, photoIds]);

  const handleMwah = useCallback(() => {
    if (isExploding) return;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setIsExploding(true);
    setKissParticles(generateKissParticles());

    setTimeout(() => {
      setIsExploding(false);
      setKissParticles([]);
      setShowEnding(true);
    }, 1500);
  }, [isExploding]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!actor) return;
      setIsUploading(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8array = new Uint8Array(arrayBuffer);
        const { ExternalBlob } = await import("../backend");
        const blob = ExternalBlob.fromBytes(uint8array);
        await actor.uploadPhoto(PHOTO_ID, blob, file.name);

        // Show locally
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setPhotoUrl(url);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [actor],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
  );

  return (
    <section
      data-ocid="slide6.section"
      className="snap-slide flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(128,0,0,0.12) 0%, #0A0A0A 65%)",
      }}
    >
      <AnimatePresence mode="wait">
        {!showEnding ? (
          /* Button screen */
          <motion.div
            key="button-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 relative"
          >
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                color: "#F8F8FF",
                textShadow: "0 0 20px rgba(128,0,0,0.5)",
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              Seal The Deal 💍
            </h2>

            {/* 3D Kiss button */}
            <div className="relative">
              {/* Kiss particles */}
              <AnimatePresence>
                {kissParticles.map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const tx = Math.cos(rad) * p.distance;
                  const ty = Math.sin(rad) * p.distance;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: tx,
                        y: ty,
                        scale: [0, 1.5, 1],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none"
                      style={{
                        width: 20,
                        height: 20,
                        fontSize: "1.5rem",
                        zIndex: 20,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      💋
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <motion.button
                data-ocid="slide6.primary_button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 4 }}
                onClick={handleMwah}
                disabled={isExploding}
                className="btn-3d relative"
                style={{
                  backgroundColor: "#800000",
                  color: "#F8F8FF",
                  border: "none",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 1.5rem) clamp(2rem, 6vw, 4rem)",
                  fontFamily: "Fraunces, serif",
                  fontSize: "clamp(1.8rem, 6vw, 3rem)",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  cursor: isExploding ? "default" : "pointer",
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  boxShadow: `
                    0 6px 0 #4a0000,
                    0 10px 20px rgba(0,0,0,0.6),
                    0 0 40px rgba(128,0,0,0.4),
                    inset 0 1px 0 rgba(255,100,100,0.3)
                  `,
                  zIndex: 10,
                  userSelect: "none",
                }}
              >
                MWAHHHHH
              </motion.button>
            </div>

            <p
              style={{
                color: "rgba(248,248,255,0.35)",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Tap to send a kiss 💋
            </p>
          </motion.div>
        ) : (
          /* Ending screen */
          <motion.div
            key="ending-screen"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 px-4"
          >
            {/* Polaroid frame */}
            <motion.div
              initial={{ rotate: -3 }}
              animate={{ rotate: [-3, -1, -3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: "#F8F8FF",
                padding: "12px 12px 40px 12px",
                borderRadius: "4px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(128,0,0,0.2)",
                width: "clamp(180px, 50vw, 260px)",
              }}
            >
              {/* Photo area */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  backgroundColor: "#1a1a1a",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Our anniversary"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center h-full gap-2"
                    style={{ color: "rgba(248,248,255,0.3)" }}
                  >
                    <span style={{ fontSize: "2rem" }}>📷</span>
                    <span
                      style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
                    >
                      No photo yet
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Caption */}
            <p
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(1rem, 3vw, 1.3rem)",
                color: "#F8F8FF",
                textAlign: "center",
                textShadow: "0 0 20px rgba(128,0,0,0.5)",
                letterSpacing: "0.04em",
                lineHeight: 1.5,
              }}
            >
              HAPPY 13TH MONTH ANNIVERSARY
              <br />
              MY PONDATIII 💍🤍
            </p>

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <motion.button
              data-ocid="slide6.upload_button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 flex items-center gap-2"
              style={{
                backgroundColor: isUploading ? "rgba(128,0,0,0.4)" : "#800000",
                color: "#F8F8FF",
                border: "1px solid rgba(248,248,255,0.2)",
                borderRadius: "8px",
                fontFamily: "General Sans, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: isUploading ? "default" : "pointer",
                boxShadow: "0 0 20px rgba(128,0,0,0.3)",
              }}
            >
              {isUploading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    ⏳
                  </motion.span>
                  Uploading...
                </>
              ) : (
                <>
                  📷 {photoUrl ? "Re-upload Our Pic" : "Upload Our Latest Pic"}
                </>
              )}
            </motion.button>

            {/* Replay button */}
            <button
              type="button"
              onClick={() => setShowEnding(false)}
              style={{
                color: "rgba(248,248,255,0.3)",
                background: "none",
                border: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              ↩ Send another kiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
