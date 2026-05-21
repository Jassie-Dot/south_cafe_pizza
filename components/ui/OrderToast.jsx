"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function OrderToast({ toast }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.32, ease: smoothEase }}
          className="fixed bottom-28 left-4 right-4 z-[90] mx-auto max-w-md rounded-lg bg-charcoal p-4 text-white shadow-soft md:bottom-6 md:left-auto md:right-6"
          role="status"
        >
          <div className="flex items-center gap-3">
            <Icon name="CheckCircle2" className="h-7 w-7 text-sand" />
            <p className="text-xl font-bold leading-snug sm:text-lg">{toast}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default OrderToast;
