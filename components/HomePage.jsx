"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import * as Icons from "lucide-react";
import {
  contact,
  experienceHighlights,
  galleryImages,
  heroStats,
  hours,
  menuCategories,
  menuItems,
  navLinks,
  ordering,
  orderCategoryTiles,
  specials,
  testimonials
} from "../lib/siteData";

const smoothEase = [0.22, 1, 0.36, 1];

const categoryIconNames = {
  all: "Utensils",
  pizza: "Pizza",
  sides: "Utensils",
  drinks: "GlassWater",
  cafe: "Coffee",
  dessert: "IceCream"
};

const customizationOptions = [
  "Extra cheese",
  "Light cheese",
  "Well done",
  "Extra sauce",
  "No onions",
  "Spicy finish"
];

function Icon({ name, className = "h-5 w-5" }) {
  const IconComponent = Icons[name] || Icons.Utensils;
  return <IconComponent aria-hidden="true" className={className} strokeWidth={2} />;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: ordering.currency
  }).format(value || 0);
}

function defaultOption(item) {
  return item.options?.[0] || { label: "Regular", price: item.priceValue || 0 };
}

function cartTotals(cartItems, orderType) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const delivery =
    orderType === "delivery" && subtotal >= ordering.minimumDeliverySubtotal
      ? ordering.deliveryFee
      : 0;
  const tax = (subtotal + delivery) * ordering.taxRate;
  const total = subtotal + delivery + tax;

  return { subtotal, delivery, tax, total };
}

function buildOrderEmail({ cartItems, form, orderType, totals, orderId }) {
  const lines = [
    `Order request: ${orderId || "New South Pizza order"}`,
    "",
    `Order type: ${orderType}`,
    `Pickup time: ${form.time}`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email || "Not provided"}`,
    orderType === "delivery" ? `Delivery address: ${form.address}` : null,
    "",
    "Items:",
    ...cartItems.map(
      (item) =>
        `${item.quantity} x ${item.name} (${item.optionLabel}${
          item.customizations?.length ? `; ${item.customizations.join(", ")}` : ""
        }) - ${formatMoney(
          item.unitPrice * item.quantity
        )}`
    ),
    "",
    `Subtotal: ${formatMoney(totals.subtotal)}`,
    `Delivery: ${formatMoney(totals.delivery)}`,
    `Estimated tax: ${formatMoney(totals.tax)}`,
    `Estimated total: ${formatMoney(totals.total)}`,
    "",
    `Notes: ${form.notes || "None"}`
  ].filter(Boolean);

  return `mailto:${contact.email}?subject=${encodeURIComponent(
    `South Pizza order request ${orderId || ""}`.trim()
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function SectionReveal({ id, className = "", children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.85, ease: smoothEase }}
    >
      {children}
    </motion.section>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  ariaLabel
}) {
  const reduceMotion = useReducedMotion();
  const styles = {
    primary:
      "bg-tomato text-white shadow-soft hover:bg-[#a93f30] active:bg-[#8f3328]",
    secondary:
      "border border-white/70 bg-white text-charcoal hover:bg-surf active:bg-sand",
    outline:
      "border border-charcoal/20 bg-white text-charcoal hover:border-ocean hover:text-ocean",
    dark: "bg-charcoal text-white hover:bg-ocean"
  };

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.25, ease: smoothEase }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 py-3 text-lg font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}

function ButtonAction({
  children,
  onClick,
  variant = "primary",
  className = "",
  ariaLabel,
  type = "button",
  disabled = false
}) {
  const reduceMotion = useReducedMotion();
  const styles = {
    primary:
      "bg-tomato text-white shadow-soft hover:bg-[#a93f30] active:bg-[#8f3328]",
    secondary:
      "border border-white/70 bg-white text-charcoal hover:bg-surf active:bg-sand",
    outline:
      "border border-charcoal/20 bg-white text-charcoal hover:border-ocean hover:text-ocean",
    dark: "bg-charcoal text-white hover:bg-ocean"
  };

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled && !reduceMotion ? { y: -2 } : undefined}
      whileTap={!disabled && !reduceMotion ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.25, ease: smoothEase }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 py-3 text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 100,
    damping: reduceMotion ? 100 : 26
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-tomato"
      style={{ scaleX }}
    />
  );
}

function BrandLockup({ compact = false }) {
  return (
    <span className="flex items-center gap-3">
      <motion.img
        src="/south-pizza-logo-small.webp"
        alt="South Pizza logo"
        className={`${compact ? "h-14 w-14" : "h-16 w-16"} rounded-full object-cover shadow-sm`}
        initial={{ rotate: -4, scale: 0.92 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: smoothEase }}
      />
      <span className="leading-tight">
        <span className="block font-display text-2xl font-bold text-charcoal">
          South Pizza
        </span>
        <span className="block text-sm font-bold uppercase text-ocean">
          Stone Baked Pizza
        </span>
      </span>
    </span>
  );
}

function SiteHeader({
  mobileOpen,
  setMobileOpen,
  onOrderClick,
  cartCount,
  onCartOpen
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/95 backdrop-blur">
      <div className="section-shell flex min-h-[var(--header-height)] items-center justify-between gap-4">
        <a href="#home" aria-label="South Pizza home">
          <BrandLockup compact />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-3 text-lg font-bold text-charcoal/80 transition hover:bg-surf hover:text-charcoal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={contact.phoneHref} variant="outline" ariaLabel="Call South Pizza">
            <Icon name="Phone" />
            Call
          </ButtonLink>
          <ButtonAction onClick={onOrderClick} ariaLabel="Start or view your South Pizza order">
            <Icon name="ShoppingBag" />
            {cartCount ? `View Order (${cartCount})` : "Order Online"}
          </ButtonAction>
          {cartCount ? (
            <button
              type="button"
              onClick={onCartOpen}
              className="tap-target relative inline-flex items-center justify-center rounded-md border border-charcoal/15 bg-white text-charcoal"
              aria-label={`Open cart with ${cartCount} items`}
            >
              <Icon name="ShoppingCart" className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-ocean px-2 text-sm font-bold text-white">
                {cartCount}
              </span>
            </button>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white text-charcoal lg:hidden"
        >
          <Icon name={mobileOpen ? "X" : "Menu"} className="h-7 w-7" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: smoothEase }}
            className="overflow-hidden border-t border-charcoal/10 bg-ivory px-4 pb-5 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="mx-auto grid max-w-xl gap-2 pt-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-white px-4 py-4 text-xl font-bold text-charcoal shadow-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <ButtonLink href={contact.phoneHref} variant="outline" className="w-full">
                  <Icon name="Phone" />
                  Call Now
                </ButtonLink>
                <ButtonAction
                  onClick={() => {
                    setMobileOpen(false);
                    onOrderClick();
                  }}
                  className="w-full"
                >
                  <Icon name="ShoppingBag" />
                  {cartCount ? `View Order (${cartCount})` : "Order Online"}
                </ButtonAction>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 760], [0, reduceMotion ? 0 : 120]);
  const imageScale = useTransform(scrollY, [0, 760], [1, reduceMotion ? 1 : 1.08]);

  return (
    <section
      id="home"
      className="relative isolate min-h-[88svh] overflow-hidden bg-charcoal text-white"
    >
      <motion.img
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2200&q=82"
        alt="Fresh pizza served on a beach-side cafe table"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        fetchPriority="high"
        style={{ y: imageY, scale: imageScale }}
      />
      <div className="absolute inset-0 -z-10 bg-charcoal/65" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-charcoal/85 to-transparent" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="hero-sun absolute right-[8%] top-[18%] -z-10 h-48 w-48 rounded-full bg-sand/30 blur-2xl"
        animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="section-shell flex min-h-[88svh] flex-col justify-center py-16">
        <motion.div
          className="max-w-4xl"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: smoothEase }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-4 rounded-full border border-white/25 bg-white/14 px-4 py-3 backdrop-blur"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.65, ease: smoothEase }}
          >
            <img
              src="/south-pizza-logo-small.webp"
              alt="South Pizza badge"
              className="h-16 w-16 rounded-full object-cover"
            />
            <span>
              <span className="block text-base font-bold uppercase text-sand">
                {contact.tagline}
              </span>
              <span className="block text-lg font-bold text-white">Port Elgin</span>
            </span>
          </motion.div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">
            Fresh Pizza by the Beach
          </h1>
          <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-white/90">
            Relax, enjoy handcrafted stone-baked pizza, fresh coffee, cold drinks, and a warm beach-side atmosphere in Port Elgin.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="#menu" variant="secondary" className="sm:w-auto">
              <Icon name="Utensils" />
              View Menu
            </ButtonLink>
            <ButtonLink href="#menu" className="sm:w-auto">
              <Icon name="ShoppingBag" />
              Start Order
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-3 md:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.28 } }
          }}
        >
          {heroStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="rounded-lg border border-white/20 bg-white/12 p-5 backdrop-blur"
            >
              <p className="text-sm font-bold uppercase text-sand">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MenuCard({ item, onAdd }) {
  const reduceMotion = useReducedMotion();
  const [optionIndex, setOptionIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizing, setCustomizing] = useState(false);
  const [customizations, setCustomizations] = useState([]);
  const selectedOption = item.options?.[optionIndex] || defaultOption(item);
  const canOrder = item.orderable !== false && item.priceValue !== null;

  function toggleCustomization(option) {
    setCustomizations((current) =>
      current.includes(option)
        ? current.filter((itemOption) => itemOption !== option)
        : [...current, option]
    );
  }

  function addItem() {
    onAdd(item, selectedOption, quantity, customizations);
    setQuantity(1);
  }

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.55, ease: smoothEase }}
      className="group flex h-full flex-col overflow-hidden rounded-md bg-white shadow-[0_14px_34px_rgba(36,33,29,0.14)] ring-1 ring-charcoal/10"
    >
      <div className="aspect-[16/10] overflow-hidden bg-surf">
        <motion.img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          transition={{ duration: 0.9, ease: smoothEase }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-ocean">{item.badge}</p>
            <h3 className="mt-1 text-2xl font-black uppercase leading-none text-charcoal md:text-3xl">
              {item.name}
            </h3>
            <p className="mt-2 text-base font-bold text-charcoal/70">
              {item.category === "pizza" ? "140-240 cals/slice" : "Freshly prepared"}
            </p>
          </div>

          {canOrder ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-charcoal/35 bg-white text-3xl leading-none text-charcoal transition hover:border-ocean hover:text-ocean"
                aria-label={`Decrease ${item.name} quantity`}
              >
                -
              </button>
              <span className="min-w-5 text-center text-xl font-black text-charcoal">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-charcoal/35 bg-white text-3xl leading-none text-charcoal transition hover:border-ocean hover:text-ocean"
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          ) : null}
        </div>

        <p className="mt-5 text-lg leading-relaxed text-charcoal/78">
          {item.description}
        </p>

        {canOrder ? (
          <fieldset className="mt-5 grid gap-3">
            <legend className="sr-only">Choose size for {item.name}</legend>
            {item.options?.map((option, index) => {
              const active = optionIndex === index;
              return (
                <label
                  key={option.label}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-1 py-1 text-lg text-charcoal/75 transition hover:bg-surf/60"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`${item.name}-size`}
                      checked={active}
                      onChange={() => setOptionIndex(index)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        active ? "border-ocean" : "border-ocean/70"
                      }`}
                    >
                      <span
                        className={`h-3 w-3 rounded-full bg-ocean transition ${
                          active ? "scale-100" : "scale-0"
                        }`}
                      />
                    </span>
                    <span>{option.label}</span>
                  </span>
                  <strong className="font-semibold text-charcoal">
                    {formatMoney(option.price)}
                  </strong>
                </label>
              );
            })}
          </fieldset>
        ) : (
          <p className="mt-5 rounded-md bg-sand px-4 py-3 text-lg font-bold text-charcoal">
            Available in store
          </p>
        )}

        <AnimatePresence initial={false}>
          {customizing && canOrder ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: smoothEase }}
              className="mt-5 overflow-hidden rounded-md border border-charcoal/10 bg-ivory p-4"
            >
              <p className="text-base font-black uppercase text-ocean">Customize</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {customizationOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-base font-bold text-charcoal">
                    <input
                      type="checkbox"
                      checked={customizations.includes(option)}
                      onChange={() => toggleCustomization(option)}
                      className="h-5 w-5 accent-ocean"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-[0.9fr_1.1fr]">
          <button
            type="button"
            onClick={() => setCustomizing((value) => !value)}
            disabled={!canOrder}
            className="min-h-14 rounded-md border-2 border-charcoal bg-white px-4 text-lg font-black uppercase tracking-wide text-charcoal transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-50"
          >
            Customize
          </button>
          <button
            type="button"
            onClick={addItem}
            disabled={!canOrder}
            className="min-h-14 rounded-md bg-ocean px-4 text-lg font-black uppercase tracking-wide text-white shadow-soft transition hover:bg-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/35"
          >
            {canOrder ? "Add to Order" : "In Store"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedMenu({ onAdd, onCartOpen, cartCount }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("pizza");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const pizzaY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -90, reduceMotion ? 0 : 130]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -12, reduceMotion ? 0 : 18]);
  const pizzaScale = useTransform(scrollYProgress, [0, 1], [1.05, reduceMotion ? 1.05 : 1.18]);
  const miniPizzaY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 80, reduceMotion ? 0 : -80]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  function cycleCategory(direction) {
    const categories = menuCategories.map((category) => category.id);
    const currentIndex = categories.indexOf(activeCategory);
    const nextIndex = (currentIndex + direction + categories.length) % categories.length;
    setActiveCategory(categories[nextIndex]);
  }

  return (
    <motion.section
      id="menu"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#fbfaf6] py-20"
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: smoothEase }}
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,rgba(255,250,242,0.96),rgba(255,255,255,0.88)),radial-gradient(circle_at_top_left,rgba(33,110,130,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(200,75,55,0.12),transparent_32%)]" />
      <motion.img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1400&q=82"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -right-28 top-20 -z-10 hidden h-[680px] w-[680px] rounded-full object-cover opacity-[0.16] mix-blend-multiply blur-[1px] lg:block"
        style={{ y: pizzaY, rotate: pizzaRotate, scale: pizzaScale }}
      />
      <motion.img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1601924582975-7e67e3f6f655?auto=format&fit=crop&w=900&q=82"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -left-32 bottom-24 -z-10 hidden h-[360px] w-[360px] rounded-full object-cover opacity-[0.1] mix-blend-multiply lg:block"
        style={{ y: miniPizzaY }}
      />

      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Start Your Order</p>
            <h2 className="section-title font-sans text-5xl font-black uppercase tracking-normal md:text-6xl">
              Fresh picks, easy ordering.
            </h2>
            <p className="section-copy">
              Choose a category, pick a size, customize your pizza, and add it to the cart in one smooth flow.
            </p>
          </div>
          <ButtonAction onClick={onCartOpen} variant="dark" className="lg:shrink-0">
            <Icon name="ShoppingCart" />
            {cartCount ? `Review Order (${cartCount})` : "Order Cart"}
          </ButtonAction>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {orderCategoryTiles.map((tile, index) => {
            const active = activeCategory === tile.category;
            return (
              <motion.button
                key={`${tile.label}-${index}`}
                type="button"
                onClick={() => setActiveCategory(tile.category)}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className={`group relative min-h-36 overflow-hidden rounded-md text-white shadow-soft ring-2 transition ${
                  active ? "ring-ocean" : "ring-transparent hover:ring-ocean/60"
                }`}
                aria-pressed={active}
              >
                <img
                  src={tile.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-charcoal/42" aria-hidden="true" />
                <span className="relative flex min-h-36 items-center justify-center px-3 text-center text-2xl font-black uppercase leading-none tracking-wide text-white drop-shadow">
                  {tile.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div
          className="mt-8 flex gap-3 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Menu category filters"
        >
          {menuCategories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category.id)}
                whileTap={{ scale: 0.98 }}
                className={`tap-target flex min-w-36 items-center gap-3 rounded-md border px-4 py-3 text-left transition ${
                  active
                    ? "border-ocean bg-ocean text-white"
                    : "border-charcoal/10 bg-white text-charcoal hover:border-ocean"
                }`}
              >
                <Icon name={categoryIconNames[category.id]} className="h-6 w-6 shrink-0" />
                <span>
                  <span className="block text-lg font-bold">{category.label}</span>
                  <span className={`block text-sm ${active ? "text-white/80" : "text-charcoal/60"}`}>
                    {category.helper}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-16 flex items-center justify-between gap-5">
          <h3 className="font-sans text-3xl font-black uppercase leading-none text-charcoal md:text-4xl">
            {activeCategory === "pizza" ? "The Pizza Maker's Picks" : `${menuCategories.find((category) => category.id === activeCategory)?.label || "Menu"} Picks`}
          </h3>
          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => cycleCategory(-1)}
              className="tap-target inline-flex items-center justify-center rounded-md border-2 border-ocean bg-white text-ocean transition hover:bg-ocean hover:text-white"
              aria-label="Previous menu category"
            >
              <Icon name="ChevronLeft" className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={() => cycleCategory(1)}
              className="tap-target inline-flex items-center justify-center rounded-md border-2 border-ocean bg-white text-ocean transition hover:bg-ocean hover:text-white"
              aria-label="Next menu category"
            >
              <Icon name="ChevronRight" className="h-7 w-7" />
            </button>
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-6 lg:grid-cols-3">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <MenuCard key={`${item.category}-${item.name}`} item={item} onAdd={onAdd} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

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
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=82"
            alt="Warm cafe interior with natural wood tables"
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-charcoal/70 p-6 text-white">
            <p className="text-sm font-bold uppercase text-sand">Port Elgin's Home of Perfect Pizza</p>
            <p className="mt-2 text-2xl font-bold">Fresh. Hot. Simply Irresistible.</p>
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
                <h3 className="text-xl font-bold text-charcoal">{title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-charcoal/70">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function BeachExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionReveal className="relative isolate overflow-hidden py-24 text-white">
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=82"
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
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">
            Sunset slices, cold drinks, and an easy place to slow down.
          </h2>
          <p className="mt-6 text-2xl leading-relaxed text-white/90">
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
              <h3 className="mt-4 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-white/85">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

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
                <span className="rounded-md bg-olive px-3 py-1 text-sm font-bold uppercase text-white">
                  {special.tag}
                </span>
                <Icon name="Sparkles" className="h-6 w-6 text-tomato" />
              </div>
              <h3 className="mt-5 text-2xl font-bold leading-tight text-charcoal">
                {special.title}
              </h3>
              <p className="mt-3 text-3xl font-bold text-ocean">{special.price}</p>
              <p className="mt-4 text-lg leading-relaxed text-charcoal/70">
                {special.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

function GallerySection({ selectedImage, setSelectedImage }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionReveal id="gallery" className="bg-white py-20">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Gallery</p>
            <h2 className="section-title">Pizza, coffee, beach views, and warm cafe moments.</h2>
          </div>
          <ButtonLink href={contact.instagramUrl} external variant="outline">
            <Icon name="Instagram" />
            Instagram Gallery
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image, index) => (
            <motion.button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(index)}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.35, ease: smoothEase }}
              className={`group overflow-hidden rounded-lg bg-surf text-left shadow-soft ${
                index === 1 || index === 4 ? "sm:row-span-2" : ""
              }`}
              aria-label={`Open gallery image: ${image.title}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                  index === 1 || index === 4 ? "h-full min-h-80" : "aspect-[4/3]"
                }`}
              />
              <span className="block bg-white px-5 py-4 text-xl font-bold text-charcoal">
                {image.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage !== null ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/85 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: smoothEase }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 p-4">
                <h3 className="text-2xl font-bold text-charcoal">
                  {galleryImages[selectedImage].title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 text-charcoal"
                  aria-label="Close gallery image"
                >
                  <Icon name="X" className="h-7 w-7" />
                </button>
              </div>
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-h-[76vh] w-full object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionReveal>
  );
}

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
                  <p className="text-2xl font-bold text-charcoal">{current.name}</p>
                  <p className="text-lg text-charcoal/60">{current.detail}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-1 text-tomato" aria-label="Five star review">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Icon key={star} name="Star" className="h-6 w-6 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-3xl font-bold leading-snug text-charcoal">
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

function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="card p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="flex items-center gap-3">
        <Icon name="CalendarCheck" className="h-7 w-7 text-ocean" />
        <h3 className="text-2xl font-bold text-charcoal">Reservation Request</h3>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-lg font-bold text-charcoal">
          Name
          <input
            required
            name="name"
            className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-lg font-bold text-charcoal">
          Phone
          <input
            required
            name="phone"
            className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
            placeholder="Phone number"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-lg font-bold text-charcoal">
            Date
            <input
              required
              type="date"
              name="date"
              className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
            />
          </label>
          <label className="grid gap-2 text-lg font-bold text-charcoal">
            Guests
            <input
              required
              type="number"
              min="1"
              max="20"
              name="guests"
              className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
              placeholder="2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="min-h-14 rounded-md bg-ocean px-5 py-3 text-lg font-bold text-white transition hover:bg-charcoal"
        >
          Send Request
        </button>
        {submitted ? (
          <p className="rounded-md bg-surf p-4 text-lg font-bold text-charcoal">
            Thanks. Please call {contact.phoneDisplay} to confirm the table time.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function LocationContact({ onOrderClick }) {
  return (
    <SectionReveal id="visit" className="bg-white py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Location & Contact</p>
          <h2 className="section-title">Visit South Pizza in Port Elgin.</h2>
          <p className="section-copy">
            Find us at 1110 Goderich St Unit D2/3 with online ordering, phone ordering, and simple directions.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-surf">
            <iframe
              title="Map to South Pizza in Port Elgin"
              src={contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[430px] w-full border-0"
              allowFullScreen
            />
          </div>

          <div className="grid gap-5">
            <div className="card p-6">
              <h3 className="text-2xl font-bold text-charcoal">Contact</h3>
              <div className="mt-5 grid gap-4 text-lg">
                <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="MapPin" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.address}</span>
                </a>
                <a href={contact.phoneHref} className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="Phone" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.phoneDisplay}</span>
                </a>
                <a href={`mailto:${contact.email}`} className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="Mail" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.email}</span>
                </a>
                <p className="flex gap-3 rounded-md p-2 font-bold text-charcoal">
                  <Icon name="Car" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>Convenient plaza parking near the restaurant.</span>
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ButtonLink href={contact.directionsUrl} external variant="dark" className="w-full">
                  <Icon name="MapPin" />
                  Directions
                </ButtonLink>
                <ButtonLink href={contact.phoneHref} variant="outline" className="w-full">
                  <Icon name="Phone" />
                  Call Now
                </ButtonLink>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3">
                <Icon name="Clock" className="h-7 w-7 text-ocean" />
                <h3 className="text-2xl font-bold text-charcoal">Business Hours</h3>
              </div>
              <div className="mt-5 grid gap-3">
                {hours.map((row) => (
                  <div key={row.day} className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-bold text-charcoal">{row.day}</span>
                    <span className="text-right text-charcoal/75">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ReservationForm />
          <div className="rounded-lg bg-charcoal p-8 text-white">
            <p className="text-sm font-bold uppercase text-sand">Ordering</p>
            <h3 className="mt-3 font-display text-4xl font-bold leading-tight">
              Order online, call ahead, or stop in after the beach.
            </h3>
            <p className="mt-5 text-xl leading-relaxed text-white/85">
              Use the online cart for pickup or delivery details, call ahead for a quick order, or choose DoorDash when you want South Pizza brought to you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonAction onClick={onOrderClick}>
                <Icon name="ShoppingBag" />
                Start Order
              </ButtonAction>
              <ButtonLink href={contact.doorDashUrl} external variant="secondary">
                <Icon name="ExternalLink" />
                DoorDash
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function CartDrawer({
  open,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
  clearCart
}) {
  const [orderType, setOrderType] = useState("pickup");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    time: "ASAP",
    notes: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const totals = useMemo(() => cartTotals(cartItems, orderType), [cartItems, orderType]);
  const emailHref = buildOrderEmail({
    cartItems,
    form,
    orderType,
    totals,
    orderId: result?.orderId
  });
  const deliveryTooSmall =
    orderType === "delivery" &&
    cartItems.length > 0 &&
    totals.subtotal < ordering.minimumDeliverySubtotal;

  useEffect(() => {
    if (open) {
      setError("");
    }
  }, [open]);

  async function submitOrder(event) {
    event.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Please add at least one item to your order.");
      return;
    }

    if (deliveryTooSmall) {
      setError(`Delivery orders need at least ${formatMoney(ordering.minimumDeliverySubtotal)} before tax.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          customer: form,
          items: cartItems,
          totals,
          createdAt: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The order could not be prepared.");
      }
      setResult(data);
    } catch (orderError) {
      setError(orderError.message || "The order could not be prepared.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] bg-charcoal/55"
          role="dialog"
          aria-modal="true"
          aria-label="South Pizza order cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close order cart"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-ivory shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: smoothEase }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 p-5">
              <div>
                <p className="text-sm font-bold uppercase text-ocean">South Pizza Online Order</p>
                <h2 className="text-3xl font-bold leading-tight text-charcoal">Your Order</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white text-charcoal"
                aria-label="Close cart"
              >
                <Icon name="X" className="h-7 w-7" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {cartItems.length ? (
                <div className="grid gap-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="rounded-lg border border-charcoal/10 bg-white p-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold leading-tight text-charcoal">
                                {item.name}
                              </h3>
                              <p className="text-base text-charcoal/65">{item.optionLabel}</p>
                              {item.customizations?.length ? (
                                <p className="mt-1 text-sm font-bold text-ocean">
                                  {item.customizations.join(", ")}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-lg font-bold text-charcoal">
                              {formatMoney(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="flex items-center rounded-md border border-charcoal/15 bg-ivory">
                              <button
                                type="button"
                                className="tap-target px-3 text-xl font-bold"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity for ${item.name}`}
                              >
                                -
                              </button>
                              <span className="min-w-10 text-center text-lg font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="tap-target px-3 text-xl font-bold"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase quantity for ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="min-h-12 rounded-md px-3 text-base font-bold text-tomato hover:bg-surf"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-charcoal/10 bg-white p-6 text-center">
                  <Icon name="ShoppingCart" className="mx-auto h-10 w-10 text-ocean" />
                  <h3 className="mt-4 text-2xl font-bold text-charcoal">Your cart is empty.</h3>
                  <p className="mt-2 text-lg text-charcoal/70">
                    Add pizzas, sides, and drinks from the menu to start an order.
                  </p>
                  <ButtonAction onClick={onClose} variant="dark" className="mt-5">
                    Back to Menu
                  </ButtonAction>
                </div>
              )}

              <form onSubmit={submitOrder} className="mt-6 grid gap-5">
                <div className="rounded-lg border border-charcoal/10 bg-white p-4">
                  <h3 className="text-2xl font-bold text-charcoal">Order Type</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {["pickup", "delivery"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setOrderType(type);
                          setResult(null);
                        }}
                        className={`min-h-14 rounded-md border px-4 text-lg font-bold capitalize transition ${
                          orderType === type
                            ? "border-ocean bg-ocean text-white"
                            : "border-charcoal/15 bg-ivory text-charcoal"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {deliveryTooSmall ? (
                    <p className="mt-3 rounded-md bg-sand p-3 text-base font-bold text-charcoal">
                      Delivery minimum is {formatMoney(ordering.minimumDeliverySubtotal)} before tax.
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 rounded-lg border border-charcoal/10 bg-white p-4">
                  <h3 className="text-2xl font-bold text-charcoal">Customer Details</h3>
                  <label className="grid gap-2 text-lg font-bold text-charcoal">
                    Name
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-2 text-lg font-bold text-charcoal">
                    Phone
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
                      placeholder="Phone number"
                    />
                  </label>
                  <label className="grid gap-2 text-lg font-bold text-charcoal">
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
                      placeholder="Email address"
                    />
                  </label>
                  {orderType === "delivery" ? (
                    <label className="grid gap-2 text-lg font-bold text-charcoal">
                      Delivery Address
                      <input
                        required
                        value={form.address}
                        onChange={(event) => updateField("address", event.target.value)}
                        className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
                        placeholder="Street address"
                      />
                    </label>
                  ) : null}
                  <label className="grid gap-2 text-lg font-bold text-charcoal">
                    Time
                    <select
                      value={form.time}
                      onChange={(event) => updateField("time", event.target.value)}
                      className="min-h-12 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal"
                    >
                      {ordering.pickupTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-lg font-bold text-charcoal">
                    Notes
                    <textarea
                      value={form.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                      className="min-h-24 rounded-md border border-charcoal/20 bg-white px-4 py-3 text-charcoal"
                      placeholder="Toppings, allergies, or pickup notes"
                    />
                  </label>
                </div>

                <div className="rounded-lg border border-charcoal/10 bg-white p-4">
                  <div className="grid gap-2 text-lg text-charcoal/75">
                    <p className="flex justify-between gap-4">
                      <span>Subtotal</span>
                      <strong className="text-charcoal">{formatMoney(totals.subtotal)}</strong>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>Delivery</span>
                      <strong className="text-charcoal">{formatMoney(totals.delivery)}</strong>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>Estimated tax</span>
                      <strong className="text-charcoal">{formatMoney(totals.tax)}</strong>
                    </p>
                    <p className="mt-2 flex justify-between gap-4 border-t border-charcoal/10 pt-3 text-2xl font-bold text-charcoal">
                      <span>Total</span>
                      <span>{formatMoney(totals.total)}</span>
                    </p>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-md bg-[#fff0ee] p-4 text-lg font-bold text-tomato">
                    {error}
                  </p>
                ) : null}

                {result ? (
                  <div className="rounded-lg border border-ocean/25 bg-surf p-4">
                    <h3 className="text-2xl font-bold text-charcoal">
                      Order request {result.orderId} is ready.
                    </h3>
                    <p className="mt-2 text-lg text-charcoal/75">
                      Please call to confirm timing and payment, or send the order details by email.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <ButtonLink href={contact.phoneHref} variant="dark" className="w-full">
                        <Icon name="Phone" />
                        Call to Confirm
                      </ButtonLink>
                      <ButtonLink href={emailHref} variant="outline" className="w-full">
                        <Icon name="Mail" />
                        Send Email
                      </ButtonLink>
                    </div>
                  </div>
                ) : null}

                <div className="sticky bottom-0 -mx-5 bg-ivory/95 p-5 backdrop-blur">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <ButtonAction
                      type="submit"
                      disabled={!cartItems.length || submitting}
                      className="w-full"
                    >
                      <Icon name="Send" />
                      {submitting ? "Preparing Order..." : "Place Order Request"}
                    </ButtonAction>
                    {cartItems.length ? (
                      <button
                        type="button"
                        onClick={() => {
                          clearCart();
                          setResult(null);
                        }}
                        className="min-h-14 rounded-md border border-charcoal/20 bg-white px-5 text-lg font-bold text-charcoal hover:bg-surf"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function OrderToast({ toast }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.32, ease: smoothEase }}
          className="fixed bottom-24 left-4 right-4 z-[90] mx-auto max-w-md rounded-lg bg-charcoal p-4 text-white shadow-soft md:bottom-6 md:left-auto md:right-6"
          role="status"
        >
          <div className="flex items-center gap-3">
            <Icon name="CheckCircle2" className="h-7 w-7 text-sand" />
            <p className="text-lg font-bold">{toast}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-charcoal pb-24 pt-12 text-white md:pb-12">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/south-pizza-logo-small.webp"
              alt="South Pizza logo"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">South Pizza</p>
              <p className="text-sm font-bold uppercase text-sand">Stone baked pizza</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/75">
            Warm pizza, simple ordering, and a relaxed Port Elgin cafe experience.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-lg text-white/75 hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Contact</h3>
          <div className="mt-4 grid gap-2 text-lg text-white/75">
            <a href={contact.phoneHref} className="hover:text-white">{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
            <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              Get Directions
            </a>
            <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Hours</h3>
          <div className="mt-4 grid gap-2 text-lg text-white/75">
            {hours.map((row) => (
              <p key={row.day}>
                <span className="font-bold text-white">{row.day}:</span> {row.time}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-white/15 pt-6 text-base text-white/60">
        <p>Copyright 2026 South Pizza. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FloatingActions({ onOrderClick, cartCount }) {
  return (
    <>
      <button
        type="button"
        onClick={onOrderClick}
        className="fixed bottom-6 right-6 z-40 hidden min-h-14 items-center gap-2 rounded-md bg-tomato px-5 py-3 text-lg font-bold text-white shadow-soft transition hover:bg-charcoal md:inline-flex"
      >
        <Icon name="ShoppingBag" />
        {cartCount ? `View Order (${cartCount})` : "Order Online"}
      </button>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-charcoal/10 bg-white text-charcoal shadow-soft md:hidden">
        <button
          type="button"
          onClick={onOrderClick}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm font-bold"
        >
          <Icon name="ShoppingBag" className="h-6 w-6 text-tomato" />
          {cartCount ? "Order" : "Menu"}
        </button>
        <a href={contact.phoneHref} className="flex min-h-16 flex-col items-center justify-center gap-1 border-x border-charcoal/10 text-sm font-bold">
          <Icon name="Phone" className="h-6 w-6 text-ocean" />
          Call
        </a>
        <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm font-bold">
          <Icon name="MapPin" className="h-6 w-6 text-olive" />
          Directions
        </a>
      </div>
    </>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (selectedImage === null) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImage]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function startOrder() {
    if (cartItems.length) {
      setCartOpen(true);
      return;
    }

    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addToCart(item, option = defaultOption(item), quantity = 1, customizations = []) {
    if (item.orderable === false || item.priceValue === null) {
      return;
    }

    const cleanCustomizations = [...customizations].sort();
    const customLabel = cleanCustomizations.join(", ");
    const id = `${item.name}-${option.label}-${customLabel || "standard"}`;
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [
        ...current,
        {
          id,
          name: item.name,
          image: item.image,
          optionLabel: option.label,
          customizations: cleanCustomizations,
          unitPrice: option.price,
          quantity
        }
      ];
    });
    setToast(`${item.name} added to your order`);
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      setCartItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function removeItem(id) {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-charcoal"
      >
        Skip to main content
      </a>
      <SiteHeader
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOrderClick={startOrder}
        onCartOpen={() => setCartOpen(true)}
        cartCount={cartCount}
      />
      <main id="main">
        <Hero />
        <FeaturedMenu
          onAdd={addToCart}
          onCartOpen={() => setCartOpen(true)}
          cartCount={cartCount}
        />
        <AboutSection />
        <BeachExperience />
        <SpecialsSection />
        <GallerySection selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        <TestimonialsSection />
        <LocationContact onOrderClick={startOrder} />
      </main>
      <SiteFooter />
      <FloatingActions onOrderClick={startOrder} cartCount={cartCount} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={() => setCartItems([])}
      />
      <OrderToast toast={toast} />
    </>
  );
}
