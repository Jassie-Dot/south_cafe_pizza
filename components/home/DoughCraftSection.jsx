"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function DoughCraftSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -42, reduceMotion ? 0 : 42]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, reduceMotion ? 1.08 : 1.16]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#f7efe2] py-20"
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.85, ease: smoothEase }}
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(200,75,55,0.12),transparent_42%,rgba(33,110,130,0.12)),linear-gradient(90deg,rgba(36,33,29,0.06)_0_1px,transparent_1px_100%)] bg-[length:auto,80px_80px]" />
      <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="relative z-10">
          <p className="section-kicker">From Dough To Stone Bake</p>
          <h2 className="section-title font-sans text-[2.65rem] font-black uppercase tracking-normal sm:text-5xl md:text-6xl">
            Real dough. Real hands. Real pizza craft.
          </h2>
          <p className="section-copy">
            A more honest kitchen moment: fresh dough on the table, flour on the counter, and the quiet care that happens before the pizza reaches the oven.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-charcoal/10 bg-white/70 p-5">
              <p className="text-base font-black uppercase text-ocean sm:text-sm">Fresh base</p>
              <p className="mt-2 text-[1.35rem] font-bold leading-snug text-charcoal sm:text-xl">
                Rolled smooth for a crisp, golden finish.
              </p>
            </div>
            <div className="rounded-md border border-charcoal/10 bg-white/70 p-5">
              <p className="text-base font-black uppercase text-ocean sm:text-sm">Stone baked</p>
              <p className="mt-2 text-[1.35rem] font-bold leading-snug text-charcoal sm:text-xl">
                Made for that hot, beach-town pizza bite.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-charcoal shadow-soft sm:min-h-[440px] lg:min-h-[560px]">
          <motion.img
            src="/dough-prep-real.jpg"
            alt="A person flattening pizza dough with a rolling pin on a floured table"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ y: imageY, scale: imageScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-base font-black uppercase text-sand sm:text-sm">Kitchen prep</p>
            <p className="mt-2 max-w-xl text-[1.55rem] font-bold leading-snug sm:text-2xl">
              Hand-stretched dough, warm sauce, and a fresh bake built for beach-day cravings.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default DoughCraftSection;
