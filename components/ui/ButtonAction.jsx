"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function ButtonAction({
  children,
  onClick,
  variant = "primary",
  className = "",
  ariaLabel,
  type = "button",
  disabled = false
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
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled && !reduceMotion ? { y: -2 } : undefined}
      whileTap={!disabled && !reduceMotion ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.25, ease: smoothEase }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 py-3 text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default ButtonAction;
