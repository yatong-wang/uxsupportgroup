type RoughWavyUnderlineProps = {
  className?: string;
  strokeW?: number;
  /** Stretch path to fill width/height (e.g. hero underline under variable-width text). */
  expandToBounds?: boolean;
};

export const RoughWavyUnderline = ({
  className = "",
  strokeW = 3,
  expandToBounds = false,
}: RoughWavyUnderlineProps) => (
  <svg
    className={className}
    viewBox="0 0 200 16"
    fill="none"
    preserveAspectRatio={expandToBounds ? "none" : undefined}
    aria-hidden="true"
  >
    <path
      d="M2 10 C10 4, 20 4, 30 10 C40 16, 50 16, 60 10 C70 4, 80 4, 90 10 C100 16, 110 16, 120 10 C130 4, 140 4, 150 10 C160 16, 170 16, 180 10 C185 7, 190 6, 198 8"
      stroke="currentColor"
      strokeWidth={strokeW}
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
