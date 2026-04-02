type HandDrawnRectTallProps = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
};

export const HandDrawnRectTall = ({
  fill = "white",
  stroke = "#090907",
  strokeWidth = 2,
  className = "",
}: HandDrawnRectTallProps) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    viewBox="0 0 100 200"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M3,4 C20,2 50,5 70,3 C85,4 95,3 97,5
         C99,20 97,50 98,80 C97,110 99,140 98,170 C97,185 99,195 97,197
         C80,199 50,196 30,198 C15,197 5,199 3,197
         C1,180 3,150 2,120 C3,90 1,60 2,30 C3,15 1,8 3,4 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);
