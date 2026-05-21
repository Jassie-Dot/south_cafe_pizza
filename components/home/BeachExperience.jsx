"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function BeachExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionReveal className="relative isolate overflow-hidden py-24 text-white">
      <img
        src="/uploads/south-pizza-photo-30.jpg"
        alt="Blue water and sandy beach near sunset"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ocean/75" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-16 left-0 right-0 -z-10 h-32 bg-white/12"
        animate={reduceMotion ? undefined : { x: ["-6%", "4%", "-6%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-sand">Beach-side Cafe Experience</p>
          <h2 className="mt-3 font-display text-[2.55rem] font-bold leading-tight sm:text-4xl md:text-6xl">
            Sunset slices, cold drinks, and an easy place to slow down.
          </h2>
          <p className="mt-6 text-[1.38rem] leading-relaxed text-white/90 sm:text-2xl">
            Designed for the rhythm of Port Elgin: quick pickup, relaxed tables, summer visits, and friendly service that never feels rushed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {experienceHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-lg border border-white/20 bg-white/12 p-6 backdrop-blur"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.12, duration: 0.65, ease: smoothEase }}
            >
              <Icon name="Sun" className="h-8 w-8 text-sand" />
              <h3 className="mt-4 text-[1.65rem] font-bold leading-tight sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-xl leading-relaxed text-white/85 sm:text-lg">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

export default BeachExperience;
