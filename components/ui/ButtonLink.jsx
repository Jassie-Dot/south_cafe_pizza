"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  ariaLabel
}) {
  const reduceMotion = useReducedMotion();
  const styles = {
    primary:
      "bg-tomato text-white shadow-soft hover:bg-[#a93f30] active:bg-[#8f3328]",
    secondary:
      "border border-white/70 bg-white text-charcoal hover:bg-surf active:bg-sand",
    outline:
      "border border-charcoal/20 bg-white text-charcoal hover:border-ocean hover:text-ocean",
    dark: "bg-charcoal text-white hover:bg-ocean"
  };

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.25, ease: smoothEase }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 py-3 text-lg font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}

export default ButtonLink;
