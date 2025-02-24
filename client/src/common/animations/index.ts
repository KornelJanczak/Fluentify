"use client";

import { type Variants } from "framer-motion";

export const fadeOut: Variants = {
  initial: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

export const scaleAndFadeAnimation: (isPresent: boolean) => Variants = (
  isPresent: boolean
) => ({
  style: {
    position: isPresent ? "static" : ("absolute" as any),
  },
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.6, opacity: 0 },
  transition: { type: "spring", stiffness: 900, damping: 40 },
});
