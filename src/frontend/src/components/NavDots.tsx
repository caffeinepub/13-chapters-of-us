interface NavDotsProps {
  activeSlide: number;
  onDotClick: (index: number) => void;
}

const labels = ["Milestone", "Evolution", "Breathe", "Game", "Letter", "Seal"];

export default function NavDots({ activeSlide, onDotClick }: NavDotsProps) {
  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
      aria-label="Slide navigation"
    >
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          data-ocid={`nav.item.${index + 1}`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}: ${label}`}
          className="group relative flex items-center justify-end"
        >
          {/* Tooltip */}
          <span
            className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs whitespace-nowrap pointer-events-none"
            style={{
              color: "rgba(248,248,255,0.7)",
              fontFamily: "General Sans, sans-serif",
            }}
          >
            {label}
          </span>
          {/* Dot */}
          <div
            className="transition-all duration-300"
            style={{
              width: activeSlide === index ? "10px" : "8px",
              height: activeSlide === index ? "10px" : "8px",
              borderRadius: "50%",
              backgroundColor:
                activeSlide === index ? "#F8F8FF" : "transparent",
              border: `2px solid ${activeSlide === index ? "#F8F8FF" : "rgba(248,248,255,0.4)"}`,
              boxShadow:
                activeSlide === index
                  ? "0 0 8px rgba(248,248,255,0.6), 0 0 16px rgba(128,0,0,0.4)"
                  : "none",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
