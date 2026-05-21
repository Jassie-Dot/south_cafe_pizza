"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function Hero({ onOrderClick }) {
  const reduceMotion = useReducedMotion();
  const storeStatus = useStoreStatus();
  const [activeDeal, setActiveDeal] = useState(0);
  const currentDeal = topDeals[activeDeal];
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 760], [0, reduceMotion ? 0 : 120]);
  const imageScale = useTransform(scrollY, [0, 760], [1, reduceMotion ? 1 : 1.08]);

  useEffect(() => {
    if (reduceMotion || topDeals.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveDeal((value) => (value + 1) % topDeals.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  function goToDeal(direction) {
    setActiveDeal((value) => (value + direction + topDeals.length) % topDeals.length);
  }

  return (
    <section
      id="home"
      className="relative isolate min-h-[86svh] overflow-hidden bg-charcoal text-white"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentDeal.image}
          src={currentDeal.image}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          fetchPriority="high"
          style={{ y: imageY, scale: imageScale }}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: smoothEase }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-charcoal/65" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-charcoal/85 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-white/18 to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0_10%,transparent_10%_20%,rgba(255,255,255,0.1)_20%_30%,transparent_30%_100%)]"
        aria-hidden="true"
      />

      <div className="section-shell flex min-h-[86svh] flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDeal.title}
            className="max-w-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <motion.div
              className="mb-7 inline-flex max-w-full items-center gap-3 rounded-md border border-white/25 bg-white/14 px-3 py-3 backdrop-blur sm:mb-8 sm:gap-4 sm:rounded-full sm:px-4"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.55, ease: smoothEase }}
            >
              <img
                src="/south-pizza-logo-small.png"
                alt="South Pizza badge"
                className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
              />
              <span>
                <span className="block text-base font-bold uppercase leading-tight text-sand">
                  Hot Deals
                </span>
                <span className="block text-xl font-bold leading-tight text-white sm:text-lg">{currentDeal.eyebrow}</span>
              </span>
            </motion.div>
            <p className="text-base font-black uppercase leading-tight tracking-wide text-sand sm:text-lg">
              Limited-time South Pizza offer
            </p>
            <h1 className="mt-4 max-w-4xl font-sans text-[3.05rem] font-black uppercase leading-[0.98] tracking-normal text-white sm:text-5xl md:text-7xl">
              {currentDeal.title}
            </h1>
            <p className="mt-5 text-[2.35rem] font-black leading-tight text-sand sm:text-4xl">{currentDeal.price}</p>
            <p className="mt-6 max-w-2xl text-[1.38rem] leading-relaxed text-white/90 sm:text-2xl">
              {currentDeal.description}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <ButtonAction onClick={onOrderClick}>
                <Icon name="ShoppingBag" />
                Order Deal
              </ButtonAction>
              <ButtonLink href="#menu" variant="secondary" className="sm:w-auto">
                <Icon name="Utensils" />
                View Menu
              </ButtonLink>
            </div>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                {
                  icon: storeStatus?.isOpen ? "BadgeCheck" : "Clock",
                  label: storeStatus?.label || "Hours today",
                  detail: storeStatus?.detail || "11:00 AM - 10:00 PM"
                },
                { icon: "Timer", label: "Fast pickup", detail: "Choose ASAP or schedule ahead" },
                {
                  icon: "Truck",
                  label: "Delivery ready",
                  detail: `${formatMoney(ordering.minimumDeliverySubtotal)} minimum before tax`
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-white/20 bg-white/12 p-4 backdrop-blur"
                >
                  <Icon name={item.icon} className="h-6 w-6 text-sand" />
                  <p className="mt-3 text-xl font-black leading-tight text-white sm:text-lg">{item.label}</p>
                  <p className="mt-1 text-base font-semibold leading-snug text-white/80 sm:text-sm sm:text-white/75">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5">
          <div className="flex gap-2" aria-label="Hot deal slides">
            {topDeals.map((deal, index) => (
              <button
                key={deal.title}
                type="button"
                onClick={() => setActiveDeal(index)}
                className={`h-3 rounded-full transition ${
                  activeDeal === index ? "w-10 bg-sand" : "w-3 bg-white/55"
                }`}
                aria-label={`Show hot deal ${index + 1}: ${deal.title}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goToDeal(-1)}
              className="tap-target inline-flex items-center justify-center rounded-md border border-white/55 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-charcoal"
              aria-label="Previous hot deal"
            >
              <Icon name="ChevronLeft" className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={() => goToDeal(1)}
              className="tap-target inline-flex items-center justify-center rounded-md border border-white/55 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-charcoal"
              aria-label="Next hot deal"
            >
              <Icon name="ChevronRight" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
