type TickedLineProps = {
  className?: string;
};

export const TickedLine = ({ className = "" }: TickedLineProps) => (
  <svg
    className={`text-uxsg-ink ${className}`}
    viewBox="0 0 120 12"
    preserveAspectRatio="none"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M0 6 Q30 5 60 6 Q90 7 120 6" />
    <path d="M12 6 v-2.5 M28 6 v2 M44 6 v-2 M60 6 v2 M76 6 v-2 M92 6 v2.5 M108 6 v-2" />
  </svg>
);
