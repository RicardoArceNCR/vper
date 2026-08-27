"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@ui/lib/utils";

// Fade de opacidad al decode real (onLoad / .complete). No usa el
// fadeInUp del sitio (y: 40): trasladar láminas full-bleed es caro y
// no hace falta para que se vean ordenadas. motion-reduce: visibles
// de entrada, sin transición.

type FadeInImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function FadeInImage({
  src,
  alt,
  className,
  priority = false,
}: FadeInImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reveal = useCallback(() => setLoaded(true), []);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onLoad={reveal}
      onError={reveal}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn(
        "opacity-0 transition-opacity duration-500 ease-out motion-reduce:opacity-100 motion-reduce:transition-none",
        loaded && "opacity-100",
        className,
      )}
    />
  );
}
