"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <SectionReveal className="bg-ivory py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="section-kicker">Testimonials</p>
          <h2 className="section-title">Clear, calm ordering and the kind of pizza people come back for.</h2>
          <p className="section-copy">
            Guests come for friendly service, clear ordering, and pizza that fits quick pickup as well as relaxed visits.
          </p>
          <ButtonLink href={contact.reviewUrl} external variant="outline" className="mt-8">
            <Icon name="Star" />
            Read Google Reviews
          </ButtonLink>
        </div>

        <div className="card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: smoothEase }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean text-2xl font-bold text-white">
                  {current.initials}
                </div>
                <div>
                  <p className="text-[1.6rem] font-bold leading-tight text-charcoal sm:text-2xl">{current.name}</p>
                  <p className="text-xl text-charcoal/60 sm:text-lg">{current.detail}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-1 text-tomato" aria-label="Five star review">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Icon key={star} name="Star" className="h-6 w-6 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-[2rem] font-bold leading-snug text-charcoal sm:text-3xl">
                "{current.quote}"
              </blockquote>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setIndex((value) => (value === 0 ? testimonials.length - 1 : value - 1))}
              className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white text-charcoal"
              aria-label="Show previous review"
            >
              <Icon name="ChevronLeft" className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
              className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white text-charcoal"
              aria-label="Show next review"
            >
              <Icon name="ChevronRight" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

export default TestimonialsSection;
