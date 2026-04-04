import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta } from "@/seo/pageMeta";

export function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = getPageMeta(pathname);
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [pathname]);

  return null;
}
