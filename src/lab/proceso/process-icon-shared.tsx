"use client";

import { useEffect, useState, type RefObject } from "react";
import { type LabIcon } from "./icons";

/** Idle / hover del spin 3D. El hover lo dispara la tarjeta, no el mesh. */
export const ICON_SPIN_IDLE = 0.28;
export const ICON_SPIN_HOVER = 1.3;
export const ICON_TILT_IDLE = 0.06;
export const ICON_TILT_HOVER = 0.26;
export const ICON_TILT_DAMP = 8;

export function useInView(ref: RefObject<HTMLElement | null>, initial = false) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return inView;
}

/** Se queda en true la primera vez que el bloque se acerca al viewport. */
export function useNearView(ref: RefObject<HTMLElement | null>, rootMargin = "240px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return near;
}

export function useBrandSky() {
  const [color, setColor] = useState("#5eb2e3");

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--brand-sky")
      .trim();
    if (value) setColor(value);
  }, []);

  return color;
}

export function ProcessRaster({ icon }: { icon: LabIcon }) {
  return <img src={icon.raster} alt="" className="size-full object-contain" />;
}

export function iconBloomClass(id: string) {
  return id === "aprender"
    ? "size-full [filter:drop-shadow(0_0_6px_rgba(94,178,227,0.5))_drop-shadow(0_0_12px_rgba(255,110,40,0.32))]"
    : "size-full [filter:drop-shadow(0_0_6px_rgba(94,178,227,0.48))_drop-shadow(0_0_14px_rgba(140,110,220,0.22))]";
}
