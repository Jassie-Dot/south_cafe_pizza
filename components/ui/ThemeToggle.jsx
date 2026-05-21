"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function ThemeToggle({ theme, onToggle, className = "", showLabel = false, style }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      style={style}
      className={`glass-button inline-flex items-center justify-center gap-2 rounded-md text-charcoal transition hover:border-ocean hover:text-ocean ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      <Icon name={isDark ? "Sun" : "Moon"} className="h-5 w-5" />
      {showLabel ? (
        <span className="text-base font-black">{isDark ? "Light" : "Dark"}</span>
      ) : null}
    </button>
  );
}

export default ThemeToggle;
