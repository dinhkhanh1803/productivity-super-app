"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionStyle,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  /** Tilt intensity in degrees (default: 6) */
  tiltDeg?: number;
  /** Scale on hover (default: 1.025) */
  hoverScale?: number;
  /** Whether to disable the effect (e.g. on mobile) */
  disabled?: boolean;
}

/**
 * Wraps children in a subtle 3D mouse-tilt card.
 * Internally uses framer-motion spring values for smooth physics.
 *
 * Usage:
 *   <Card3D className="rounded-2xl bg-card ...">…content…</Card3D>
 */
export function Card3D({
  children,
  className,
  tiltDeg = 6,
  hoverScale = 1.025,
  disabled = false,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  /* Raw mouse position: -0.5 … +0.5 relative to card center */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Map to rotation angles */
  const rotateY = useTransform(rawX, [-0.5, 0.5], [-tiltDeg, tiltDeg]);
  const rotateX = useTransform(rawY, [-0.5, 0.5], [tiltDeg, -tiltDeg]);

  /* Spring for smoothness */
  const springCfg = { stiffness: 260, damping: 28, mass: 0.6 };
  const springRotX = useSpring(rotateX, springCfg);
  const springRotY = useSpring(rotateY, springCfg);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
    scale.set(hoverScale);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
  }

  const style: MotionStyle = disabled
    ? {}
    : {
        rotateX: springRotX,
        rotateY: springRotY,
        scale,
        transformStyle: "preserve-3d",
      };

  return (
    <motion.div
      ref={ref}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "transition-shadow duration-300 hover:shadow-xl will-change-transform",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
