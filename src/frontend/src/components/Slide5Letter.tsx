import { motion } from "motion/react";

const LETTER_SECTIONS: string[] = [
  "AKKKAAAAAA HAPPY 13 MONTHS ANNIVERSARY MY LOVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 🤍🧿✨ …… One year and one extra beautiful month written in our story maaa and heart feels too soft too full too overwhelmed thinking about everything 🫠🤍 …… Babyy thirteen months to the world might be just time passing but to this heart it is thirteen deep chapters of love growth lessons tears laughter and choosing each other again and again sayanggg 🌙💫 …… Myy loveee came into this life quietly and slowly changed the whole atmosphere without forcing anything maaa 🌌🤍 …… Akkaa presence became natural like breathing and now imagining a day without that existence feels impossible 🫠🔥🤍 …… This love feels magical not because it is perfect but because it survived because it grew because it stayed 🕊✨ …… Every memory from silly jokes to deep midnight talks built this strong foundation that both hearts standing on today maaa 🤍🌱🫶",

  "Maaa last month truly tested everything my loveee 🎢🤍 …… misunderstandings emotions mood swings heavy silence and sharp words all came like storms 🌧🌫 …… there were moments of confusion moments of frustration and moments where patience felt tired maaa 💭🤍 …… but the most powerful thing is this 🫠🧿 neither heart chose to walk away …… ego did not win distance did not win giving up did not win 🔥🤍 …… instead holding on became stronger than pride and love became louder than anger 🕊✨ …… that is what makes this bond rare maaa not the absence of problems but the strength to stay through them 🌌🤍 …… those honest talks even when they felt sharp were not breaking anything but shaping something healthier stronger and more mature 💋🌱🔥",

  "Maaa today this heart also speaks about growth with full sincerity 🤍🧿✨ …… Akkaa carries a vision of the future and that vision is respected deeply maaa 🌙💭 …… becoming better step by step in dressing discipline sleeping schedule self care mindset and responsibility is not pressure but motivation 🫠🌷🤍 …… improving is part of loving better and building stronger tomorrow together 🔥🧿 …… thirteen months proved that this is not ordinary love this is intentional unbreakable choosing every single day kind of love 🤍🕊 …… both hearts feel safe valued calm and powerful inside this bond 🫠🌌 …… I LOVE YOU SOOOOOOOOOOOOOOOOO MUCH MY UNIVERSE 🤍🌷🧿 …… hold hands tight maaa and let us rock and roll this whole world together my loveee 🔥🤍💋 HAPPY 13 MONTHS BABYYYYYYYY 🤍🧿✨💋",
];

const SECTION_KEYS = ["section-1", "section-2", "section-3"];

export default function Slide5Letter() {
  return (
    <section
      data-ocid="slide5.section"
      className="snap-slide flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(128,0,0,0.08) 0%, #0A0A0A 60%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full max-w-2xl flex flex-col gap-4"
        style={{ height: "85vh", maxHeight: "700px" }}
      >
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              color: "#F8F8FF",
              textShadow: "0 0 30px rgba(128,0,0,0.5)",
              letterSpacing: "0.04em",
            }}
          >
            The 13th Chapter
          </h2>
          <div
            style={{
              width: "60px",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, #800000, transparent)",
              margin: "8px auto 0",
            }}
          />
        </div>

        {/* Glass card */}
        <div
          data-ocid="slide5.card"
          className="letter-scroll flex-1 overflow-y-auto"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(128, 0, 0, 0.3)",
            borderRadius: "16px",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        >
          {/* Decorative top */}
          <div
            className="text-center mb-6 opacity-50"
            style={{ letterSpacing: "0.3em", color: "#800000" }}
          >
            ✦ · · · ✦
          </div>

          {LETTER_SECTIONS.map((section, i) => (
            <p
              key={SECTION_KEYS[i]}
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "clamp(0.82rem, 1.8vw, 0.95rem)",
                color: "rgba(248,248,255,0.88)",
                lineHeight: 1.9,
                letterSpacing: "0.025em",
                marginBottom: i < LETTER_SECTIONS.length - 1 ? "2em" : 0,
              }}
            >
              {section}
            </p>
          ))}

          {/* Decorative bottom */}
          <div
            className="text-center mt-6 opacity-50"
            style={{ letterSpacing: "0.3em", color: "#800000" }}
          >
            ✦ · · · ✦
          </div>
        </div>

        {/* Scroll hint */}
        <p
          className="text-center flex-shrink-0"
          style={{
            color: "rgba(248,248,255,0.25)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Scroll within the card to read more
        </p>
      </motion.div>
    </section>
  );
}
