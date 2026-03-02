import { useCallback, useEffect, useRef, useState } from "react";
import NavDots from "./components/NavDots";
import Slide1Milestone from "./components/Slide1Milestone";
import Slide2Evolution from "./components/Slide2Evolution";
import Slide3Breath from "./components/Slide3Breath";
import Slide4WordGame from "./components/Slide4WordGame";
import Slide5Letter from "./components/Slide5Letter";
import Slide6Seal from "./components/Slide6Seal";
import StarField from "./components/StarField";

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToSlide = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const [index, ref] of slideRefs.current.entries()) {
      if (!ref) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSlide(index);
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(ref);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, []);

  const setSlideRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[index] = el;
    },
    [],
  );

  return (
    <div className="relative w-full" style={{ backgroundColor: "#0A0A0A" }}>
      {/* Fixed star background */}
      <StarField />

      {/* Navigation dots */}
      <NavDots activeSlide={activeSlide} onDotClick={scrollToSlide} />

      {/* Slides */}
      <div ref={setSlideRef(0)}>
        <Slide1Milestone />
      </div>
      <div ref={setSlideRef(1)}>
        <Slide2Evolution />
      </div>
      <div ref={setSlideRef(2)}>
        <Slide3Breath />
      </div>
      <div ref={setSlideRef(3)}>
        <Slide4WordGame />
      </div>
      <div ref={setSlideRef(4)}>
        <Slide5Letter />
      </div>
      <div ref={setSlideRef(5)}>
        <Slide6Seal />
      </div>

      {/* Footer */}
      <div
        className="relative z-10 text-center py-4 text-xs"
        style={{ color: "rgba(248,248,255,0.3)", backgroundColor: "#0A0A0A" }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(128,0,0,0.6)" }}
          className="hover:opacity-80 transition-opacity"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
