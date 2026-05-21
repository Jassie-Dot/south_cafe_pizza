"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function SpecialsSection() {
  return (
    <SectionReveal id="specials" className="bg-surf py-20">
      <div className="section-shell">
        <p className="section-kicker">Pizza Specials</p>
        <h2 className="section-title">Simple offers that are easy to understand at a glance.</h2>
        <p className="section-copy">
          Look for daily pizza favourites, quick lunch pairings, family takeout options, and seasonal beach-day add-ons.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {specials.map((special) => (
            <motion.article
              key={special.title}
              whileHover={{ y: -8, rotate: -0.4 }}
              transition={{ duration: 0.35, ease: smoothEase }}
              className="card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-olive px-3 py-1 text-base font-bold uppercase text-white sm:text-sm">
                  {special.tag}
                </span>
                <Icon name="Sparkles" className="h-6 w-6 text-tomato" />
              </div>
              <h3 className="mt-5 text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">
                {special.title}
              </h3>
              <p className="mt-3 text-[2rem] font-bold leading-tight text-ocean sm:text-3xl">{special.price}</p>
              <p className="mt-4 text-xl leading-relaxed text-charcoal/70 sm:text-lg">
                {special.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

export default SpecialsSection;
