"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function AboutSection() {
  return (
    <SectionReveal id="about" className="bg-white py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <motion.div
          className="relative overflow-hidden rounded-lg"
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.55, ease: smoothEase }}
        >
          <img
            src="/uploads/south-pizza-photo-31.jpg"
            alt="Warm cafe interior with natural wood tables"
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-charcoal/70 p-6 text-white">
            <p className="text-base font-bold uppercase text-sand sm:text-sm">Port Elgin's Home of Perfect Pizza</p>
            <p className="mt-2 text-[1.55rem] font-bold leading-tight sm:text-2xl">Fresh. Hot. Simply Irresistible.</p>
          </div>
        </motion.div>

        <div>
          <p className="section-kicker">About South Pizza</p>
          <h2 className="section-title">A friendly pizza stop with a relaxed beach-side cafe spirit.</h2>
          <p className="section-copy">
            South Pizza is built for easy meals, warm service, and fresh pizza that works for families, locals, seniors, and visitors. The experience is simple: clear choices, handmade pizza, familiar sides, cold drinks, and a calm place to pause.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Fresh ingredients", "Pizza, toppings, sides, and drinks presented with clean menu sections."],
              ["Family friendly", "Large buttons, readable text, and simple ordering paths for every age."],
              ["Local focus", "A Port Elgin restaurant designed around beach visitors and neighbourhood regulars."],
              ["Handmade comfort", "Classic pizza with vegetarian, gluten-free, and vegan cheese specials."]
            ].map(([title, copy]) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: smoothEase }}
                className="rounded-lg border border-charcoal/10 bg-ivory p-5"
              >
                <h3 className="text-[1.35rem] font-bold leading-tight text-charcoal sm:text-xl">{title}</h3>
                <p className="mt-2 text-xl leading-relaxed text-charcoal/70 sm:text-lg">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

export default AboutSection;
