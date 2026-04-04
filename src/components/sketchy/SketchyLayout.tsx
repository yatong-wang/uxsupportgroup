import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DocumentMeta } from "@/components/DocumentMeta";
import { SketchyHeader } from "@/components/sketchy/SketchyHeader";
import { SketchyFooter } from "@/components/sketchy/SketchyFooter";
import { SummitAnnouncementBar } from "@/components/sketchy/SummitAnnouncementBar";

export const SketchyLayout = () => {
  const { pathname } = useLocation();
  const showSummitBar = pathname !== "/summit";

  return (
    <>
      <DocumentMeta />
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="roughen">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>
      <div className="sticky top-0 z-50 shadow-sm shadow-uxsg-ink/5">
        {showSummitBar && <SummitAnnouncementBar />}
        <SketchyHeader />
      </div>
      <div className="min-h-screen paper-bg font-body">
        <a
          href="#main"
          className={cn(
            "sr-only focus:fixed focus:left-4 focus:z-[100] focus:p-4 focus:rounded focus:bg-uxsg-ink focus:text-white focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:[clip:auto]",
            showSummitBar ? "focus:top-28" : "focus:top-24"
          )}
        >
          Skip to main content
        </a>
        <Outlet />
      </div>
      <SketchyFooter />
    </>
  );
};

export default SketchyLayout;
