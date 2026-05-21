"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function MealSuggestionsSection({ onOrderClick }) {
  const reduceMotion = useReducedMotion();
  const [aiNote, setAiNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSuggestion() {
      setLoading(true);

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                text:
                  "Give one short, practical South Pizza meal suggestion for a first-time customer. Keep it under 35 words."
              }
            ]
          })
        });
        const data = await response.json();

        if (active && response.ok && data.reply) {
          setAiNote(data.reply);
        }
      } catch {
        // Fallback cards below keep this section useful when the AI key is not configured.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSuggestion();

    return () => {
      active = false;
    };
  }, []);

  return (
    <SectionReveal id="meal-ideas" className="bg-white py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="section-kicker">Max meal suggestions</p>
            <h2 className="section-title">
              AI-guided meal picks for quick ordering.
            </h2>
            <p className="section-copy">
              Simple starting points for families, lunch stops, vegetarian orders, and easy pickup meals.
            </p>
          </div>

          <motion.div
            className="rounded-lg border border-ocean/20 bg-surf p-5 shadow-soft"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: smoothEase }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ocean text-white">
                <Icon name="Sparkles" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black uppercase text-ocean">
                  {aiNote ? "Live AI pick" : loading ? "Max is checking" : "Smart fallback"}
                </p>
                <p className="text-xl font-bold leading-tight text-charcoal">
                  {aiNote || "Try a hot pizza with garlic bread and cold drinks for an easy first order."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mealSuggestionCards.map((suggestion, index) => (
            <motion.article
              key={suggestion.title}
              className="rounded-lg border border-charcoal/10 bg-ivory p-6 shadow-soft"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: smoothEase }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-ocean">
                  <Icon name={suggestion.icon} className="h-6 w-6" />
                </span>
                <span className="rounded-md bg-charcoal px-3 py-1 text-sm font-black uppercase text-white">
                  AI pick
                </span>
              </div>
              <h3 className="mt-5 text-[1.55rem] font-bold leading-tight text-charcoal">
                {suggestion.title}
              </h3>
              <p className="mt-2 text-2xl font-black leading-tight text-ocean">
                {suggestion.price}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-charcoal/70">
                {suggestion.items}
              </p>
              <ButtonAction onClick={onOrderClick} variant="outline" className="mt-5 w-full !text-base">
                <Icon name="ShoppingBag" />
                Start Order
              </ButtonAction>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

export default MealSuggestionsSection;
