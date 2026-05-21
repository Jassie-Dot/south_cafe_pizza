"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function Icon({ name, className = "h-5 w-5" }) {
  const IconComponent = Icons[name] || Icons.Utensils;
  return <IconComponent aria-hidden="true" className={className} strokeWidth={2} />;
}

export default Icon;
