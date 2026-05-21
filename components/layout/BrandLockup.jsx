"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function BrandLockup({ compact = false }) {
  return (
    <span className="flex items-center gap-2 sm:gap-4">
      <motion.img
        src="/south-pizza-logo-small.png"
        alt="South Pizza logo"
        className={`${compact ? "h-9 w-9 sm:h-11 sm:w-11" : "h-16 w-16"} rounded-full border border-charcoal/10 bg-white object-cover shadow-sm`}
        initial={{ rotate: -4, scale: 0.92 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: smoothEase }}
      />
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-charcoal sm:text-2xl">
          South Pizza
        </span>
        <span className="block text-[0.58rem] font-black uppercase tracking-[0.12em] text-ocean sm:text-[0.78rem] sm:tracking-[0.16em]">
          Stone Baked Pizza
        </span>
      </span>
    </span>
  );
}

export default BrandLockup;
