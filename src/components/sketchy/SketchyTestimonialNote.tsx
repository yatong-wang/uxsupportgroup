import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export type SketchyTestimonialNoteProps = {
  quote: string;
  name: string;
  role: string;
  avatarSrc: string;
  avatarAlt?: string;
  className?: string;
};

export function SketchyTestimonialNote({
  quote,
  name,
  role,
  avatarSrc,
  avatarAlt,
  className,
}: SketchyTestimonialNoteProps) {
  const alt = avatarAlt ?? name;

  return (
    <div
      className={cn(
        "bg-[#ffe24a] shadow-xl relative w-full min-w-0 text-uxsg-ink",
        className,
      )}
    >
      <Quote className="w-8 h-8 mb-6 opacity-30 text-uxsg-ink" strokeWidth={1.5} aria-hidden />
      <blockquote className="font-hand not-italic text-base sm:text-lg lg:text-xl leading-relaxed mb-8 text-uxsg-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 not-italic">
        <div className="w-12 h-12 bg-uxsg-ink rounded-full overflow-hidden shrink-0">
          <img alt={alt} className="w-full h-full object-cover" src={avatarSrc} loading="lazy" />
        </div>
        <div className="font-body min-w-0">
          <p className="font-bold text-xs md:text-sm text-uxsg-ink">{name}</p>
          <p className="text-xs opacity-70">{role}</p>
        </div>
      </div>
    </div>
  );
}
