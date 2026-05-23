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
  customizationOptions as defaultCustomizationOptions,
  experienceHighlights,
  galleryImages,
  heroContent,
  hours,
  layoutSettings,
  menuCategories,
  menuItems,
  navLinks,
  ordering,
  orderCategoryTiles,
  specials,
  storeStatusSettings,
  topDeals,
  testimonials,
  weeklyHours
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

const CART_STORAGE_KEY = "south-pizza-cart-v1";
const ORDER_DRAFT_STORAGE_KEY = "south-pizza-order-draft-v1";
const THEME_STORAGE_KEY = "south-pizza-theme-v1";

const aiWelcomeMessage = {
  role: "assistant",
  text: "Hi, I am Max. Ask me about menu picks, prices, hours, pickup, delivery, or what goes well with your order."
};

const aiQuickPrompts = [
  "What should I order for a family?",
  "Do you have vegetarian pizza?",
  "What is the delivery minimum?"
];

const mealSuggestionCards = [
  {
    title: "Family takeout",
    price: "From $24.99",
    icon: "UsersRound",
    items: "Large pizza, garlic bread, fries, and a 2L drink.",
    prompt: "Build me a family takeout order."
  },
  {
    title: "Vegetarian comfort",
    price: "Ask Max",
    icon: "Leaf",
    items: "Veggie pizza, extra cheese option, and a cold drink.",
    prompt: "Suggest a vegetarian South Pizza meal."
  },
  {
    title: "Quick lunch",
    price: "Ask today",
    icon: "Timer",
    items: "Hot slice, simple side, and one drink for a fast stop.",
    prompt: "What is a quick lunch order?"
  },
  {
    title: "Senior-friendly",
    price: "Simple picks",
    icon: "HeartHandshake",
    items: "Easy portions, familiar toppings, and clear pickup timing.",
    prompt: "Suggest a simple senior-friendly meal."
  }
];

const homepageTabs = [
  { id: "menu", label: "Menu", href: "#menu", icon: "Utensils" },
  { id: "specials", label: "Specials", href: "#specials", icon: "BadgePercent" },
  { id: "gallery", label: "Gallery", href: "#gallery", icon: "Images" },
  { id: "story", label: "Story", href: "#about", icon: "Store" },
  { id: "reviews", label: "Reviews", href: "#reviews", icon: "Star" }
];

const sectionNavIcons = {
  "#menu": "Utensils",
  "#specials": "BadgePercent",
  "#about": "Store",
  "#reviews": "Star",
  "#gallery": "Images",
  "#visit": "MapPin",
  "/admin": "ShieldCheck"
};

const siteContentDefaults = {
  hero: heroContent,
  topDeals,
  orderCategoryTiles,
  menuItems,
  customizationOptions: defaultCustomizationOptions.map((label) => ({ label })),
  specials,
  galleryImages,
  storeStatus: storeStatusSettings,
  weeklyHours,
  layout: layoutSettings
};

function useEditableSiteContent() {
  const [content, setContent] = useState(siteContentDefaults);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/site-content", { cache: "no-store" });
        const data = await response.json();

        if (active && response.ok && data.content) {
          setContent({
            hero: data.content.hero || heroContent,
            topDeals: Array.isArray(data.content.topDeals)
              ? data.content.topDeals
              : topDeals,
            orderCategoryTiles: Array.isArray(data.content.orderCategoryTiles)
              ? data.content.orderCategoryTiles
              : orderCategoryTiles,
            menuItems: Array.isArray(data.content.menuItems)
              ? data.content.menuItems
              : menuItems,
            customizationOptions: Array.isArray(data.content.customizationOptions)
              ? data.content.customizationOptions
              : defaultCustomizationOptions.map((label) => ({ label })),
            specials: Array.isArray(data.content.specials)
              ? data.content.specials
              : specials,
            galleryImages: Array.isArray(data.content.galleryImages)
              ? data.content.galleryImages
              : galleryImages,
            storeStatus: data.content.storeStatus || storeStatusSettings,
            weeklyHours: Array.isArray(data.content.weeklyHours)
              ? data.content.weeklyHours
              : weeklyHours,
            layout: data.content.layout || layoutSettings
          });
        }
      } catch {
        // Static defaults keep the public site usable if the editor API is unavailable.
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  return content;
}

function editableList(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function editableCustomizationList(value) {
  if (!Array.isArray(value)) {
    return defaultCustomizationOptions.map((label) => ({ label, price: 0 }));
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { label: item, price: 0 };
      }

      return {
        label: item?.label,
        price: Number.isFinite(Number(item?.price)) ? Number(item.price) : 0
      };
    })
    .filter((item) => item.label);
}

function editableLayout(value) {
  return { ...layoutSettings, ...(value || {}) };
}

function tabIdFromHref(href) {
  const match = homepageTabs.find((tab) => tab.href === href);
  return match?.id || null;
}

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

function customizationLabel(choice) {
  return typeof choice === "string" ? choice : choice?.label || "";
}

function customizationPrice(choice) {
  return typeof choice === "string" ? 0 : Number(choice?.price) || 0;
}

function customizationTotal(choices) {
  return choices.reduce((sum, choice) => sum + customizationPrice(choice), 0);
}

function isOrderable(item) {
  return item.orderable !== false && item.priceValue !== null;
}

function searchMenuItem(item, query) {
  if (!query) {
    return true;
  }

  const searchable = [
    item.name,
    item.description,
    item.longDescription,
    item.badge,
    item.category,
    item.price,
    item.sku,
    item.sourceUrl,
    ...(item.groups || []),
    ...(item.options || []).map((option) => option.label)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function cleanCartItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.name === "string" &&
        Number.isFinite(Number(item.unitPrice)) &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) > 0
    )
    .map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      quantity: Math.min(99, Number(item.quantity))
    }));
}

function formatTimeFromMinutes(minutes) {
  const normalized = minutes >= 24 * 60 ? 0 : minutes;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const hour12 = hour24 % 12 || 12;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function parseTimeToMinutes(value, fallback) {
  if (value === "24:00") {
    return 24 * 60;
  }

  const match = /^(\d{2}):(\d{2})$/.exec(value || "");
  if (!match) {
    return fallback;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatHoursRows(rows = weeklyHours) {
  return rows.map((row) => ({
    day: row.shortDay || row.day,
    time: row.closed
      ? "Closed"
      : `${formatTimeFromMinutes(parseTimeToMinutes(row.open, 11 * 60))} - ${formatTimeFromMinutes(
          parseTimeToMinutes(row.close, 22 * 60)
        )}`
  }));
}

function getNextOpenDetail(rows, weekday, currentMinutes) {
  const todayIndex = rows.findIndex((row) => row.id === weekday);

  for (let offset = 0; offset < 7; offset += 1) {
    const row = rows[(todayIndex + offset + rows.length) % rows.length];

    if (!row || row.closed) {
      continue;
    }

    const open = parseTimeToMinutes(row.open, 11 * 60);

    if (offset === 0 && currentMinutes < open) {
      return `Opens at ${formatTimeFromMinutes(open)}`;
    }

    if (offset > 0) {
      return `Opens ${offset === 1 ? "tomorrow" : row.day} at ${formatTimeFromMinutes(open)}`;
    }
  }

  return "Please check today's hours";
}

function getStoreStatus(date = new Date(), statusSettings = storeStatusSettings, rows = weeklyHours) {
  if (statusSettings?.mode === "open") {
    return {
      isOpen: true,
      label: statusSettings.openLabel || "Open now",
      detail: statusSettings.openDetail || "Taking orders today"
    };
  }

  if (statusSettings?.mode === "closed") {
    return {
      isOpen: false,
      label: statusSettings.closedLabel || "Closed now",
      detail: statusSettings.closedDetail || "Please check today's hours"
    };
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value || "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const currentMinutes = hour * 60 + minute;
  const today = rows.find((row) => row.id === weekday) || rows[0] || weeklyHours[0];
  const open = parseTimeToMinutes(today.open, 11 * 60);
  const close = parseTimeToMinutes(today.close, 22 * 60);

  if (!today.closed && currentMinutes >= open && currentMinutes < close) {
    return {
      isOpen: true,
      label: "Open now",
      detail: `Closes at ${formatTimeFromMinutes(close)}`
    };
  }

  return {
    isOpen: false,
    label: "Closed now",
    detail: getNextOpenDetail(rows, weekday, currentMinutes)
  };
}

function useStoreStatus(statusSettings = storeStatusSettings, rows = weeklyHours) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const updateStatus = () => setStatus(getStoreStatus(new Date(), statusSettings, rows));
    updateStatus();
    const interval = window.setInterval(updateStatus, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [rows, statusSettings]);

  return status;
}

function getCartRecommendations(cartItems, menuList = menuItems) {
  const cartNames = new Set(cartItems.map((item) => item.name));
  const hasPizza = cartItems.some((item) => item.category === "pizza" || /pizza/i.test(item.name));
  const priorityCategories = hasPizza ? ["sides", "drinks", "dessert"] : ["pizza", "sides"];

  return menuList
    .filter((item) => isOrderable(item) && !cartNames.has(item.name))
    .sort((first, second) => {
      const firstIndex = priorityCategories.indexOf(first.category);
      const secondIndex = priorityCategories.indexOf(second.category);
      return (firstIndex === -1 ? 99 : firstIndex) - (secondIndex === -1 ? 99 : secondIndex);
    })
    .slice(0, 3);
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

function ThemeToggle({ theme, onToggle, className = "", showLabel = false, style }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      style={style}
      className={`glass-button inline-flex items-center justify-center gap-2 rounded-md text-charcoal transition hover:border-ocean hover:text-ocean ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      <Icon name={isDark ? "Sun" : "Moon"} className="h-5 w-5" />
      {showLabel ? (
        <span className="text-base font-black">{isDark ? "Light" : "Dark"}</span>
      ) : null}
    </button>
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
    <span className="flex items-center gap-2 sm:gap-4">
      <motion.img
        src="/south-pizza-logo-small.png"
        alt="South Pizza logo"
        className={`${compact ? "h-9 w-9 sm:h-11 sm:w-11" : "h-16 w-16"} rounded-full border border-charcoal/10 bg-white object-cover shadow-sm`}
        initial={{ rotate: -4, scale: 0.92 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: smoothEase }}
      />
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-charcoal sm:text-2xl">
          South Pizza
        </span>
        <span className="block text-[0.58rem] font-black uppercase tracking-[0.12em] text-ocean sm:text-[0.78rem] sm:tracking-[0.16em]">
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
  onCartOpen,
  onAboutClick,
  onNavClick,
  onHotDealsClick,
  statusSettings,
  schedule,
  theme,
  onThemeToggle
}) {
  const storeStatus = useStoreStatus(statusSettings, schedule);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 24);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  function handleNavClick(event, link) {
    if (!link.href.startsWith("#")) {
      setMobileOpen(false);
      return;
    }

    event.preventDefault();
    setMobileOpen(false);
    if (onNavClick) {
      onNavClick(link.href);
      return;
    }

    if (link.href === "#about") {
      onAboutClick?.();
    }
  }

  return (
    <header
      className={`site-header-glass sticky top-0 z-50 w-screen max-w-full border-b border-white/40 transition-all before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-charcoal ${
        scrolled ? "site-header-glass--scrolled" : ""
      }`}
    >
      <div className="relative mx-auto grid min-h-[var(--header-height)] w-full max-w-[112rem] grid-cols-[1fr] items-center gap-3 px-4 py-1.5 pr-20 transition-all sm:px-6 lg:px-8 min-[1180px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1180px]:pr-8">
        <a
          href="#home"
          aria-label="South Pizza home"
          className="justify-self-start rounded-md transition hover:opacity-90"
        >
          <BrandLockup compact />
        </a>

        <div className="hidden min-w-0 items-center justify-self-end gap-2 min-[1180px]:flex">
          <ButtonAction
            onClick={onHotDealsClick}
            variant="outline"
            ariaLabel="Open South Pizza hot deals"
            className="glass-button header-hot-deals-animate hidden !h-[46px] !min-h-[46px] !w-[46px] shrink-0 whitespace-nowrap !px-0 !py-2 !text-base min-[1180px]:inline-flex min-[1500px]:!w-auto min-[1500px]:!px-4"
          >
            <Icon name="Flame" className="relative z-[1] h-5 w-5" />
            <span className="relative z-[1] hidden min-[1500px]:inline">Hot Deals</span>
          </ButtonAction>
          <div className="header-status-glass hidden min-h-[46px] min-w-[132px] shrink-0 items-center rounded-md px-3 text-sm font-bold text-charcoal min-[1700px]:flex">
            <span className="grid gap-0.5">
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    storeStatus?.isOpen ? "bg-olive" : "bg-tomato"
                  }`}
                  aria-hidden="true"
                />
                {storeStatus?.label || "Hours today"}
              </span>
              <span className="block whitespace-nowrap text-[0.7rem] font-semibold text-charcoal/60">
                {storeStatus?.detail || "11:00 AM opening"}
              </span>
            </span>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={onThemeToggle}
            className="h-[46px] w-[46px] shrink-0"
          />
          <ButtonLink
            href={contact.phoneHref}
            variant="outline"
            ariaLabel="Call South Pizza"
            className="glass-button !h-[46px] !min-h-[46px] !w-[46px] shrink-0 whitespace-nowrap !px-0 !py-2 !text-base min-[1320px]:!w-auto min-[1320px]:!px-4"
          >
            <Icon name="Phone" className="h-5 w-5" />
            <span className="hidden min-[1320px]:inline">Call</span>
          </ButtonLink>
          <ButtonAction
            onClick={onOrderClick}
            ariaLabel="Start or view your South Pizza order"
            className="!h-[46px] !min-h-[46px] !w-[46px] shrink-0 whitespace-nowrap !px-0 !py-2 !text-base min-[1320px]:!w-auto min-[1320px]:!px-4 min-[1500px]:!px-5"
          >
            <Icon name="ShoppingBag" className="h-5 w-5" />
            <span className="hidden min-[1320px]:inline">
              {cartCount ? `Order (${cartCount})` : "Order Online"}
            </span>
          </ButtonAction>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="tap-target absolute right-4 top-1/2 z-[60] inline-flex -translate-y-1/2 items-center justify-center rounded-md border border-charcoal/20 bg-white text-charcoal shadow-sm min-[1180px]:hidden"
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
              {storeStatus ? (
                <div className="rounded-md border border-charcoal/10 bg-white px-4 py-3 shadow-sm">
                  <span className="flex items-center gap-2 text-lg font-bold text-charcoal sm:text-base">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        storeStatus.isOpen ? "bg-olive" : "bg-tomato"
                      }`}
                      aria-hidden="true"
                    />
                    {storeStatus.label}
                  </span>
                  <span className="mt-1 block text-base font-semibold text-charcoal/65 sm:text-sm">
                    {storeStatus.detail}
                  </span>
                </div>
              ) : null}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    handleNavClick(event, link);
                  }}
                  className="rounded-md bg-white px-5 py-5 text-2xl font-bold leading-tight text-charcoal shadow-sm sm:px-4 sm:py-4 sm:text-xl"
                >
                  {link.label}
                </a>
              ))}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <ThemeToggle
                  theme={theme}
                  onToggle={onThemeToggle}
                  showLabel
                  className="min-h-14 w-full px-5 sm:col-span-2"
                />
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
                <ButtonAction
                  onClick={() => {
                    setMobileOpen(false);
                    onHotDealsClick?.();
                  }}
                  variant="outline"
                  className="header-hot-deals-animate w-full sm:col-span-2"
                >
                  <Icon name="Flame" className="relative z-[1]" />
                  <span className="relative z-[1]">Hot Deals</span>
                </ButtonAction>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero({ deals = topDeals, layout = layoutSettings }) {
  const reduceMotion = useReducedMotion();
  const [activeDeal, setActiveDeal] = useState(0);
  const settings = editableLayout(layout);
  const heroDeals = editableList(deals, topDeals);
  const currentDeal = heroDeals[activeDeal] || heroDeals[0] || topDeals[0];
  const strongOverlay = settings.heroOverlay === "strong";
  const slideshowEnabled = settings.heroMode !== "static" && heroDeals.length > 1;
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 760], [0, reduceMotion ? 0 : 120]);
  const imageScale = useTransform(scrollY, [0, 760], [1, reduceMotion ? 1 : 1.08]);

  useEffect(() => {
    setActiveDeal((value) => Math.min(value, Math.max(0, heroDeals.length - 1)));
  }, [heroDeals.length]);

  useEffect(() => {
    if (reduceMotion || !slideshowEnabled) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveDeal((value) => (value + 1) % heroDeals.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [heroDeals.length, reduceMotion, slideshowEnabled]);

  return (
    <section
      id="home"
      className="relative isolate min-h-[64svh] overflow-hidden bg-charcoal text-white"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentDeal.image || currentDeal.title}
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
      <div className={`absolute inset-0 -z-10 ${strongOverlay ? "bg-charcoal/65" : "bg-charcoal/48"}`} aria-hidden="true" />
      <div className={`absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t ${strongOverlay ? "from-charcoal/85" : "from-charcoal/60"} to-transparent`} aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-white/18 to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0_10%,transparent_10%_20%,rgba(255,255,255,0.1)_20%_30%,transparent_30%_100%)]"
        aria-hidden="true"
      />
    </section>
  );
}

function MenuCard({
  item,
  onAdd,
  onInspect,
  customizationChoices = defaultCustomizationOptions
}) {
  const reduceMotion = useReducedMotion();
  const [optionIndex, setOptionIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizing, setCustomizing] = useState(false);
  const [customizations, setCustomizations] = useState([]);
  const selectedOption = item.options?.[optionIndex] || defaultOption(item);
  const canOrder = item.orderable !== false && item.priceValue !== null;
  const availableCustomizations = customizationChoices
    .map((choice) =>
      typeof choice === "string"
        ? { label: choice, price: 0 }
        : { label: choice?.label, price: Number(choice?.price) || 0 }
    )
    .filter((choice) => choice.label);
  const canCustomize = canOrder && item.category === "pizza" && availableCustomizations.length > 0;
  const selectedCustomizations = availableCustomizations.filter((choice) =>
    customizations.includes(choice.label)
  );
  const lineTotal =
    (Number(selectedOption.price) + customizationTotal(selectedCustomizations)) * quantity;

  function toggleCustomization(option) {
    const label = customizationLabel(option);
    setCustomizations((current) =>
      current.includes(label)
        ? current.filter((itemOption) => itemOption !== label)
        : [...current, label]
    );
  }

  function addItem() {
    onAdd(item, selectedOption, quantity, selectedCustomizations);
    setQuantity(1);
    setCustomizing(false);
    setCustomizations([]);
  }

  function inspectItem() {
    onInspect?.(item);
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
      <button
        type="button"
        onClick={inspectItem}
        className="relative aspect-[16/10] overflow-hidden bg-surf text-left"
        aria-label={`View details for ${item.name}`}
      >
        <motion.img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          transition={{ duration: 0.9, ease: smoothEase }}
        />
        <span className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-2 text-lg font-black leading-tight text-charcoal shadow-sm sm:text-base">
          {canOrder ? `From ${formatMoney(defaultOption(item).price)}` : item.price}
        </span>
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-charcoal/85 px-3 py-2 text-sm font-black uppercase text-white opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Icon name="MousePointerClick" className="h-4 w-4" />
          Details
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-black uppercase leading-tight tracking-wide text-ocean sm:text-sm">{item.badge}</p>
            <button
              type="button"
              onClick={inspectItem}
              className="mt-1 block text-left text-[2rem] font-black uppercase leading-[1.02] text-charcoal transition hover:text-ocean sm:text-2xl md:text-3xl"
            >
              {item.name}
            </button>
          </div>

          {canOrder ? (
            <div className="flex shrink-0 items-center gap-3 self-start rounded-md bg-ivory p-1 sm:gap-2 sm:bg-transparent sm:p-0">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-charcoal/35 bg-white text-3xl leading-none text-charcoal transition hover:border-ocean hover:text-ocean sm:h-12 sm:w-12"
                aria-label={`Decrease ${item.name} quantity`}
              >
                -
              </button>
              <span className="min-w-8 text-center text-2xl font-black text-charcoal sm:min-w-5 sm:text-xl">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-charcoal/35 bg-white text-3xl leading-none text-charcoal transition hover:border-ocean hover:text-ocean sm:h-12 sm:w-12"
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          ) : null}
        </div>

        {canOrder ? (
          <fieldset className="mt-4 grid gap-3">
            <legend className="sr-only">Choose size for {item.name}</legend>
            {item.options?.map((option, index) => {
              const active = optionIndex === index;
              return (
                <label
                  key={option.label}
                  className="flex cursor-pointer flex-col items-start gap-2 rounded-md border border-transparent px-3 py-3 text-xl leading-snug text-charcoal/75 transition hover:bg-surf/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:border-0 sm:px-1 sm:py-1 sm:text-lg"
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
                  <strong className="pl-9 text-xl font-semibold text-charcoal sm:pl-0 sm:text-base">
                    {formatMoney(option.price)}
                  </strong>
                </label>
              );
            })}
          </fieldset>
        ) : (
          <p className="mt-5 rounded-md bg-sand px-4 py-3 text-xl font-bold text-charcoal sm:text-lg">
            Available in store
          </p>
        )}

        <AnimatePresence initial={false}>
          {customizing && canCustomize ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: smoothEase }}
              className="mt-5 overflow-hidden rounded-md border border-charcoal/10 bg-ivory p-4"
            >
              <p className="text-lg font-black uppercase text-ocean sm:text-base">Customize</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availableCustomizations.map((option) => (
                  <label key={option.label} className="flex min-h-12 items-center justify-between gap-3 text-lg font-bold text-charcoal sm:min-h-0 sm:gap-2 sm:text-base">
                    <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customizations.includes(option.label)}
                      onChange={() => toggleCustomization(option)}
                      className="h-5 w-5 accent-ocean"
                    />
                      {option.label}
                    </span>
                    {option.price ? (
                      <span className="text-sm font-black text-ocean">
                        +{formatMoney(option.price)}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-[0.75fr_0.85fr_1.2fr]">
          <button
            type="button"
            onClick={inspectItem}
            className="min-h-16 rounded-md border-2 border-ocean bg-white px-4 text-xl font-black uppercase leading-tight tracking-wide text-ocean transition hover:bg-ocean hover:text-white sm:min-h-14 sm:text-lg"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setCustomizing((value) => !value)}
            disabled={!canCustomize}
            className="min-h-16 rounded-md border-2 border-charcoal bg-white px-4 text-xl font-black uppercase leading-tight tracking-wide text-charcoal transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:text-lg"
          >
            Customize
          </button>
          <button
            type="button"
            onClick={addItem}
            disabled={!canOrder}
            className="min-h-16 rounded-md bg-ocean px-4 text-xl font-black uppercase leading-tight tracking-wide text-white shadow-soft transition hover:bg-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/35 sm:min-h-14 sm:text-lg"
          >
            {canOrder
              ? `Add ${formatMoney(lineTotal)}`
              : "In Store"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductDetailModal({
  item,
  onClose,
  onAdd,
  customizationChoices = defaultCustomizationOptions
}) {
  const reduceMotion = useReducedMotion();
  const [optionIndex, setOptionIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState([]);

  const selectedOption = item?.options?.[optionIndex] || (item ? defaultOption(item) : null);
  const canOrder = Boolean(item && item.orderable !== false && item.priceValue !== null);
  const availableCustomizations = customizationChoices
    .map((choice) =>
      typeof choice === "string"
        ? { label: choice, price: 0 }
        : { label: choice?.label, price: Number(choice?.price) || 0 }
    )
    .filter((choice) => choice.label);
  const canCustomize = canOrder && item?.category === "pizza" && availableCustomizations.length > 0;
  const selectedCustomizations = availableCustomizations.filter((choice) =>
    customizations.includes(choice.label)
  );
  const addOnTotal = customizationTotal(selectedCustomizations);
  const lineTotal = selectedOption
    ? (Number(selectedOption.price) + addOnTotal) * quantity
    : 0;

  useEffect(() => {
    setOptionIndex(0);
    setQuantity(1);
    setCustomizations([]);
  }, [item?.name]);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  function toggleCustomization(option) {
    const label = customizationLabel(option);
    setCustomizations((current) =>
      current.includes(label)
        ? current.filter((itemOption) => itemOption !== label)
        : [...current, label]
    );
  }

  function addItem() {
    if (!item || !selectedOption) {
      return;
    }

    onAdd(item, selectedOption, quantity, selectedCustomizations);
    onClose();
  }

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[92] overflow-y-auto bg-charcoal/70 p-4 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} details`}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.24, ease: smoothEase }}
        >
          <button
            type="button"
            aria-label="Close product details"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={onClose}
          />
          <motion.article
            className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)] lg:grid-cols-[0.92fr_1.08fr]"
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.34, ease: smoothEase }}
          >
            <div className="relative min-h-[280px] bg-surf lg:min-h-full">
              <img
                src={item.image}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                <p className="text-sm font-black uppercase text-sand">{item.badge}</p>
                <p className="mt-2 text-3xl font-black uppercase leading-tight sm:text-4xl">
                  {canOrder ? `From ${formatMoney(defaultOption(item).price)}` : item.price}
                </p>
              </div>
            </div>

            <div className="max-h-[min(760px,calc(100svh-2rem))] overflow-y-auto p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-ocean">
                    {item.category === "pizza" ? "Pizza" : item.badge}
                  </p>
                  <h2 className="mt-2 text-[2.25rem] font-black uppercase leading-[1.02] text-charcoal sm:text-5xl">
                    {item.name}
                  </h2>
                  {item.sku ? (
                    <p className="mt-2 text-sm font-black uppercase text-charcoal/45">
                      SKU {item.sku}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="tap-target inline-flex shrink-0 items-center justify-center rounded-md border border-charcoal/20 bg-ivory text-charcoal transition hover:border-tomato hover:text-tomato"
                  aria-label="Close product details"
                >
                  <Icon name="X" className="h-6 w-6" />
                </button>
              </div>

              <p className="mt-5 text-xl font-semibold leading-relaxed text-charcoal/72 sm:text-lg">
                {item.longDescription || item.description}
              </p>

              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-charcoal/15 bg-ivory px-4 text-base font-black text-charcoal transition hover:border-ocean hover:text-ocean"
                >
                  <Icon name="ExternalLink" className="h-4 w-4" />
                  Original Menu Page
                </a>
              ) : null}

              {canOrder ? (
                <fieldset className="mt-6 grid gap-3">
                  <legend className="text-sm font-black uppercase text-ocean">
                    Choose Option
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.options?.map((option, index) => {
                      const active = optionIndex === index;
                      return (
                        <label
                          key={`${option.label}-${index}`}
                          className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3 text-base font-bold transition ${
                            active
                              ? "border-ocean bg-surf text-charcoal"
                              : "border-charcoal/12 bg-white text-charcoal/75 hover:border-ocean"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`${item.name}-modal-option`}
                              checked={active}
                              onChange={() => setOptionIndex(index)}
                              className="h-5 w-5 accent-ocean"
                            />
                            {option.label}
                          </span>
                          <strong className="shrink-0 text-ocean">
                            {formatMoney(option.price)}
                          </strong>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : (
                <p className="mt-6 rounded-md bg-sand px-4 py-3 text-lg font-bold text-charcoal">
                  This item is listed from the original menu. Please call or ask in store for current ordering.
                </p>
              )}

              {canCustomize ? (
                <fieldset className="mt-6 grid gap-3">
                  <legend className="text-sm font-black uppercase text-ocean">
                    Customize Pizza
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {availableCustomizations.map((option) => (
                      <label
                        key={option.label}
                        className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-md border border-charcoal/10 bg-ivory px-3 py-2 text-base font-bold text-charcoal transition hover:border-ocean"
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={customizations.includes(option.label)}
                            onChange={() => toggleCustomization(option)}
                            className="h-5 w-5 accent-ocean"
                          />
                          {option.label}
                        </span>
                        {option.price ? (
                          <span className="shrink-0 text-sm font-black text-ocean">
                            +{formatMoney(option.price)}
                          </span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className="mt-7 grid gap-3 rounded-lg border border-charcoal/10 bg-ivory p-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="flex items-center rounded-md border border-charcoal/15 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="tap-target px-4 text-2xl font-black text-charcoal"
                    aria-label={`Decrease ${item.name} quantity`}
                    disabled={!canOrder}
                  >
                    -
                  </button>
                  <span className="min-w-12 text-center text-2xl font-black text-charcoal">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="tap-target px-4 text-2xl font-black text-charcoal"
                    aria-label={`Increase ${item.name} quantity`}
                    disabled={!canOrder}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={!canOrder}
                  className="min-h-14 rounded-md bg-tomato px-5 text-lg font-black uppercase text-white shadow-soft transition hover:bg-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/35"
                >
                  {canOrder ? `Add ${formatMoney(lineTotal)}` : "Call To Order"}
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FeaturedMenu({
  onAdd,
  onCartOpen,
  cartCount,
  layout = layoutSettings,
  menuList = menuItems,
  categoryTiles = orderCategoryTiles,
  customizationChoices = defaultCustomizationOptions,
  onItemOpen
}) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const resultsRef = useRef(null);
  const settings = editableLayout(layout);
  const [activeTileId, setActiveTileId] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeGroupFilter, setActiveGroupFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const pizzaY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -90, reduceMotion ? 0 : 130]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -12, reduceMotion ? 0 : 18]);
  const pizzaScale = useTransform(scrollYProgress, [0, 1], [1.05, reduceMotion ? 1.05 : 1.18]);
  const miniPizzaY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 80, reduceMotion ? 0 : -80]);

  const activeTile = categoryTiles.find((tile) => tile.id === activeTileId);
  const activeCategory =
    menuCategories.find((category) => category.id === activeCategoryId) || menuCategories[0];
  const hasMenuSelection = Boolean(activeTileId);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const pageSize = settings.menuDensity === "compact" ? 9 : 6;
  const visibleMenuCategories = useMemo(() => {
    const availableCategories = new Set(menuList.map((item) => item.category));
    return menuCategories.filter(
      (category) => category.id === "all" || availableCategories.has(category.id)
    );
  }, [menuList]);

  const filteredItems = useMemo(() => {
    return menuList.filter((item) => {
      const matchesCategory =
        activeCategoryId === "all" || item.category === activeCategoryId;
      const matchesGroup =
        activeGroupFilter === "all" || item.groups?.includes(activeGroupFilter);
      const matchesQuick =
        quickFilter === "all" ||
        (quickFilter === "orderable" ? isOrderable(item) : item.groups?.includes(quickFilter));

      if (!matchesCategory || !matchesGroup || !matchesQuick) {
        return false;
      }

      return searchMenuItem(item, normalizedQuery);
    });
  }, [activeCategoryId, activeGroupFilter, menuList, normalizedQuery, quickFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleItems = filteredItems.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const activeHeading =
    activeGroupFilter !== "all" && activeTile?.heading
      ? activeTile.heading
      : activeCategoryId === "all"
        ? "All South Pizza favourites"
        : `${activeCategory.label} favourites`;
  const resultsLabel = normalizedQuery
    ? `${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"}`
    : `${filteredItems.length} item${filteredItems.length === 1 ? "" : "s"}`;

  useEffect(() => {
    setPage(0);
  }, [activeCategoryId, activeGroupFilter, normalizedQuery, quickFilter]);

  useEffect(() => {
    if (visibleMenuCategories.some((category) => category.id === activeCategoryId)) {
      return;
    }

    setActiveCategoryId("all");
    setActiveGroupFilter("all");
    setActiveTileId("");
  }, [activeCategoryId, visibleMenuCategories]);

  function cyclePage(direction) {
    setPage((value) => (value + direction + totalPages) % totalPages);
  }

  function scrollToResults() {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 80);
  }

  function chooseTile(tile) {
    setActiveTileId(tile.id);
    setActiveCategoryId(tile.category);
    setActiveGroupFilter(tile.filter || "all");
    setQuickFilter("all");
    scrollToResults();
  }

  function resetMenuFilters() {
    setSearchQuery("");
    setQuickFilter("all");
    setActiveCategoryId("all");
    setActiveGroupFilter("all");
    setActiveTileId("");
  }

  return (
    <motion.section
      id="menu"
      ref={sectionRef}
      className={`relative isolate overflow-hidden bg-[#fbfaf6] ${
        settings.sectionSpacing === "compact" ? "py-12 sm:py-14" : "py-16 sm:py-20"
      }`}
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: smoothEase }}
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,rgba(255,250,242,0.96),rgba(255,255,255,0.88)),linear-gradient(90deg,rgba(33,110,130,0.09)_0_1px,transparent_1px_100%),linear-gradient(0deg,rgba(200,75,55,0.08)_0_1px,transparent_1px_100%)] bg-[length:auto,72px_72px,72px_72px]" />
      <motion.img
        aria-hidden="true"
        src="/uploads/south-pizza-photo-24.jpg"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -right-28 top-20 -z-10 hidden h-[680px] w-[680px] rounded-lg object-cover opacity-[0.14] mix-blend-multiply blur-[1px] lg:block"
        style={{ y: pizzaY, rotate: pizzaRotate, scale: pizzaScale }}
      />
      <motion.img
        aria-hidden="true"
        src="/uploads/south-pizza-photo-01.jpg"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -left-32 bottom-24 -z-10 hidden h-[360px] w-[360px] rounded-lg object-cover opacity-[0.1] mix-blend-multiply lg:block"
        style={{ y: miniPizzaY }}
      />

      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Start Your Order</p>
            <h2 className="section-title font-sans text-[2.75rem] font-black uppercase tracking-normal sm:text-5xl md:text-6xl">
              Menu
            </h2>
          </div>
          <ButtonAction onClick={onCartOpen} variant="dark" className="lg:shrink-0">
            <Icon name="ShoppingCart" />
            {cartCount ? `Review Order (${cartCount})` : "Order Cart"}
          </ButtonAction>
        </div>

        <div className="mt-10 flex snap-x gap-3 overflow-x-auto pb-2 sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 xl:grid-cols-8">
          {categoryTiles.map((tile, index) => {
            const active =
              activeTileId === tile.id &&
              activeCategoryId === tile.category &&
              activeGroupFilter === (tile.filter || "all");
            return (
              <motion.button
                key={`${tile.label}-${index}`}
                type="button"
                onClick={() => chooseTile(tile)}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className={`group relative min-h-40 min-w-[76%] snap-start overflow-hidden rounded-md text-white shadow-soft ring-2 transition sm:min-h-36 sm:min-w-0 ${
                  active
                    ? "ring-ocean ring-offset-4 ring-offset-[#fbfaf6]"
                    : "ring-transparent hover:ring-ocean/60"
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
                {active ? (
                  <span className="absolute right-3 top-3 rounded-full bg-ocean px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-sm">
                    Selected
                  </span>
                ) : null}
                <span className="relative flex min-h-40 items-center justify-center px-4 text-center text-xl font-black uppercase leading-none tracking-wide text-white drop-shadow sm:min-h-36 sm:px-3 sm:text-lg">
                  {tile.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {hasMenuSelection ? (
          <>
            <div ref={resultsRef} className="mt-10 scroll-mt-28 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h3 className="font-sans text-[2.15rem] font-black uppercase leading-none text-charcoal sm:text-3xl md:text-4xl">
                  {activeHeading}
                </h3>
                <p className="mt-3 text-xl font-bold leading-snug text-charcoal/65 sm:text-lg">{resultsLabel}</p>
              </div>
              <div className="hidden gap-3 sm:flex">
                <button
                  type="button"
                  onClick={() => cyclePage(-1)}
                  disabled={totalPages <= 1}
                  className="tap-target inline-flex items-center justify-center rounded-md border-2 border-ocean bg-white text-ocean transition hover:bg-ocean hover:text-white"
                  aria-label="Previous products"
                >
                  <Icon name="ChevronLeft" className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={() => cyclePage(1)}
                  disabled={totalPages <= 1}
                  className="tap-target inline-flex items-center justify-center rounded-md border-2 border-ocean bg-white text-ocean transition hover:bg-ocean hover:text-white"
                  aria-label="Next products"
                >
                  <Icon name="ChevronRight" className="h-7 w-7" />
                </button>
              </div>
            </div>

            {visibleItems.length ? (
              <motion.div layout className={`mt-8 ${visibleItems.length === 1 ? 'flex justify-center' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}`}>
                <AnimatePresence>
                  {visibleItems.map((item) => (
                    <div key={`${item.category}-${item.name}`} className={visibleItems.length === 1 ? 'w-full max-w-md' : 'w-full'}>
                      <MenuCard
                        item={item}
                        onAdd={onAdd}
                        onInspect={onItemOpen}
                        customizationChoices={customizationChoices}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="mt-8 rounded-lg border border-charcoal/10 bg-white p-8 text-center shadow-soft">
                <Icon name="SearchX" className="mx-auto h-10 w-10 text-ocean" />
                <h3 className="mt-4 text-2xl font-black text-charcoal">No menu items found.</h3>
                <p className="mx-auto mt-2 max-w-xl text-lg leading-relaxed text-charcoal/70">
                  Try a broader search or clear the current category and style filters.
                </p>
                <ButtonAction onClick={resetMenuFilters} variant="dark" className="mt-5">
                  <Icon name="RotateCcw" />
                  Clear Filters
                </ButtonAction>
              </div>
            )}

            {totalPages > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    className={`h-3 rounded-full transition ${
                      safePage === index ? "w-9 bg-ocean" : "w-3 bg-charcoal/25"
                    }`}
                    aria-label={`Show product page ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </motion.section>
  );
}

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
          <h2 className="section-title font-sans text-[2.65rem] font-black uppercase tracking-normal !leading-snug sm:text-5xl md:text-6xl">
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

function MealSuggestionsSection({ onOrderClick }) {
  const reduceMotion = useReducedMotion();
  const ownerPick =
    "Try a hot pizza with garlic bread and cold drinks for an easy first South Pizza order.";

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
                  Owner pick
                </p>
                <p className="text-xl font-bold leading-tight text-charcoal">
                  {ownerPick}
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
          <h2 className="mt-3 font-display text-[2.55rem] font-bold leading-normal sm:text-4xl md:text-6xl">
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

function SpecialsSection({ specialsList = specials, onOrderClick }) {
  const reduceMotion = useReducedMotion();
  const visibleSpecials = editableList(specialsList, specials);

  return (
    <SectionReveal id="specials" className="specials-section scroll-mt-28 bg-[#eef6f3] py-20">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Pizza Specials</p>
            <h2 className="section-title font-sans text-[2.65rem] font-black uppercase sm:text-5xl md:text-6xl">
              Tonight's easiest order starters.
            </h2>
            <p className="section-copy">
              Clear combinations for quick lunches, family takeout, and guests who want a simple recommendation before they order.
            </p>
          </div>
          {onOrderClick ? (
            <ButtonAction onClick={onOrderClick} variant="dark" className="lg:shrink-0">
              <Icon name="ShoppingBag" />
              Start Order
            </ButtonAction>
          ) : null}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visibleSpecials.map((special) => (
            <motion.article
              key={special.title}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.35, ease: smoothEase }}
              className="card flex min-h-[260px] flex-col p-6"
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

function GallerySection({ selectedImage, setSelectedImage, galleryItems = galleryImages }) {
  const reduceMotion = useReducedMotion();
  const visibleImages = editableList(galleryItems, galleryImages);
  const selectedGalleryImage =
    selectedImage !== null ? visibleImages[selectedImage] : null;

  return (
    <SectionReveal id="gallery" className="bg-white py-20">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Gallery</p>
            <h2 className="section-title">Gallery</h2>
          </div>
          <ButtonLink href={contact.instagramUrl} external variant="outline">
            <Icon name="Instagram" />
            Instagram Gallery
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleImages.map((image, index) => (
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
              <span className="block bg-white px-5 py-5 text-[1.35rem] font-bold leading-tight text-charcoal sm:py-4 sm:text-xl">
                {image.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedGalleryImage ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/90 p-4"
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
                <h3 className="text-[1.6rem] font-bold leading-tight text-charcoal sm:text-2xl">
                  {selectedGalleryImage.title}
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
                src={selectedGalleryImage.src}
                alt={selectedGalleryImage.alt}
                className="max-h-[76vh] w-full object-contain"
              />
              <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 p-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage - 1 + visibleImages.length) % visibleImages.length
                    )
                  }
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white px-3 text-charcoal hover:bg-surf"
                  aria-label="Show previous gallery image"
                >
                  <Icon name="ChevronLeft" className="h-7 w-7" />
                </button>
                <p className="text-lg font-bold text-charcoal/60 sm:text-base">
                  {selectedImage + 1} of {visibleImages.length}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedImage((selectedImage + 1) % visibleImages.length)}
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white px-3 text-charcoal hover:bg-surf"
                  aria-label="Show next gallery image"
                >
                  <Icon name="ChevronRight" className="h-7 w-7" />
                </button>
              </div>
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
    <SectionReveal id="reviews" className="bg-ivory py-20">
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
        <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Reservation Request</h3>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
          Name
          <input
            required
            name="name"
            autoComplete="name"
            className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
          Phone
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
            placeholder="Phone number"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
            Date
            <input
              required
              type="date"
              name="date"
              className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
            />
          </label>
          <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
            Guests
            <input
              required
              type="number"
              min="1"
              max="20"
              name="guests"
              className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
              placeholder="2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="min-h-16 rounded-md bg-ocean px-5 py-3 text-xl font-bold text-white transition hover:bg-charcoal sm:min-h-14 sm:text-lg"
        >
          Send Request
        </button>
        {submitted ? (
          <p className="rounded-md bg-surf p-4 text-xl font-bold text-charcoal sm:text-lg">
            Thanks. Please call {contact.phoneDisplay} to confirm the table time.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function LocationContact({
  onOrderClick,
  statusSettings = storeStatusSettings,
  schedule = weeklyHours
}) {
  const storeStatus = useStoreStatus(statusSettings, schedule);
  const visibleHours = formatHoursRows(schedule);

  return (
    <SectionReveal id="visit" className="bg-white py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Location & Contact</p>
          <h2 className="section-title">Visit South Pizza</h2>
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
              <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Contact</h3>
              <div className="mt-5 grid gap-4 text-xl sm:text-lg">
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
                <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Business Hours</h3>
              </div>
              {storeStatus ? (
                <div className="mt-5 rounded-md border border-charcoal/10 bg-ivory p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        storeStatus.isOpen ? "bg-olive" : "bg-tomato"
                      }`}
                      aria-hidden="true"
                    />
                    <p className="text-[1.45rem] font-black leading-tight text-charcoal sm:text-xl">{storeStatus.label}</p>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-charcoal/65 sm:text-lg">
                    {storeStatus.detail}
                  </p>
                </div>
              ) : null}
              <div className="mt-5 grid gap-3">
                {visibleHours.map((row) => (
                  <div key={row.day} className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-bold text-charcoal">{row.day}</span>
                    <span className="text-right text-charcoal/75">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-charcoal p-8 text-white">
          <p className="text-sm font-bold uppercase text-sand">Ordering</p>
          <h3 className="mt-3 font-display text-[2.45rem] font-bold leading-tight sm:text-4xl">
            Order online or DoorDash.
          </h3>
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
    </SectionReveal>
  );
}

function HomeSectionNav({ activeTab, onNavigate }) {
  return (
    <div className="section-shell pt-6 sm:pt-8">
      <nav
        aria-label="South Pizza sections"
        className="flex max-w-full snap-x gap-2 overflow-x-auto rounded-lg border border-white/15 bg-charcoal/95 p-2 shadow-[0_18px_45px_rgba(7,10,18,0.2)] backdrop-blur sm:flex-wrap sm:overflow-visible"
      >
        {navLinks.map((link) => {
          const tabId = tabIdFromHref(link.href);
          const active = tabId ? activeTab === tabId : false;
          const iconName = sectionNavIcons[link.href] || "Circle";

          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => onNavigate(event, link)}
              className={`group inline-flex min-h-12 shrink-0 snap-start items-center justify-center gap-2 rounded-md border px-4 py-2 text-base font-black leading-tight transition sm:px-5 ${
                active
                  ? "border-ocean bg-ocean text-white shadow-[0_10px_24px_rgba(33,110,130,0.34)]"
                  : "border-white/10 bg-white/[0.08] text-white/86 hover:border-ocean/70 hover:bg-white/[0.14] hover:text-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                name={iconName}
                className={`h-5 w-5 transition ${active ? "text-white" : "text-sand/90 group-hover:text-white"}`}
              />
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function CompactHomeTabs({
  activeTab,
  onTabChange,
  onAdd,
  onCartOpen,
  cartCount,
  layout,
  hero,
  menuList,
  categoryTiles,
  customizationChoices,
  specialsList,
  selectedImage,
  setSelectedImage,
  galleryItems,
  statusSettings,
  schedule,
  onOrderClick,
  onItemOpen
}) {
  const settings = editableLayout(layout);
  const visibleTabs = homepageTabs.filter((tab) => {
    if (tab.id === "specials") {
      return settings.showSpecials;
    }

    if (tab.id === "gallery") {
      return settings.showGallery;
    }

    return true;
  });
  const safeActiveTab = visibleTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : "menu";

  useEffect(() => {
    if (safeActiveTab !== activeTab) {
      onTabChange(safeActiveTab);
    }
  }, [activeTab, onTabChange, safeActiveTab]);

  function handleSectionNav(event, link) {
    if (!link.href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    const tabId = tabIdFromHref(link.href);

    if (tabId) {
      onTabChange(tabId);
      return;
    }

    if (link.href === "#visit") {
      window.history.replaceState(null, "", link.href);
      document.getElementById("visit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderActiveTab() {
    switch (safeActiveTab) {
      case "specials":
        return <SpecialsSection specialsList={specialsList} onOrderClick={onOrderClick} />;
      case "gallery":
        return (
          <GallerySection
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            galleryItems={galleryItems}
          />
        );
      case "story":
        return <AboutSection />;
      case "reviews":
        return <TestimonialsSection />;
      case "menu":
      default:
        return (
          <FeaturedMenu
            onAdd={onAdd}
            onCartOpen={onCartOpen}
            cartCount={cartCount}
            layout={layout}
            menuList={menuList}
            categoryTiles={categoryTiles}
            customizationChoices={customizationChoices}
            onItemOpen={onItemOpen}
          />
        );
    }
  }

  return (
    <section id="explore" className="bg-ivory">
      <HomeSectionNav activeTab={safeActiveTab} onNavigate={handleSectionNav} />
      <div
        id={`homepage-panel-${safeActiveTab}`}
        role="tabpanel"
        className="scroll-mt-28"
      >
        {renderActiveTab()}
      </div>

      <LocationContact
        onOrderClick={onOrderClick}
        statusSettings={statusSettings}
        schedule={schedule}
      />
    </section>
  );
}

function HotDealsModal({ open, onClose, deals = topDeals, onOrderClick }) {
  const reduceMotion = useReducedMotion();
  const visibleDeals = editableList(deals, topDeals);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[96] overflow-y-auto bg-charcoal/88 p-4 text-white backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="South Pizza hot deals"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25, ease: smoothEase }}
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-sand">Fresh from the counter</p>
                <h2 className="mt-2 text-4xl font-black uppercase leading-tight sm:text-5xl">
                  Hot Deals
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="tap-target inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-charcoal"
                aria-label="Close hot deals"
              >
                <Icon name="X" className="h-7 w-7" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleDeals.map((deal) => (
                <article
                  key={`${deal.title}-${deal.image}`}
                  className="overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="aspect-[4/3] w-full bg-charcoal object-cover"
                  />
                  <div className="p-5">
                    <p className="text-sm font-black uppercase text-sand">{deal.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-white">
                      {deal.title}
                    </h3>
                    <p className="mt-2 text-2xl font-black text-sand">{deal.price}</p>
                    <p className="mt-3 text-base font-semibold leading-relaxed text-white/75">
                      {deal.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonAction
                onClick={() => {
                  onClose();
                  onOrderClick();
                }}
              >
                <Icon name="ShoppingBag" />
                Start Order
              </ButtonAction>
              <ButtonLink href={contact.phoneHref} variant="secondary">
                <Icon name="Phone" />
                Call South Pizza
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CartDrawer({
  open,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
  clearCart,
  onAdd,
  menuList = menuItems
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
  const [draftHydrated, setDraftHydrated] = useState(false);
  const totals = useMemo(() => cartTotals(cartItems, orderType), [cartItems, orderType]);
  const recommendations = useMemo(
    () => getCartRecommendations(cartItems, menuList),
    [cartItems, menuList]
  );
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
  const deliveryRemaining = Math.max(0, ordering.minimumDeliverySubtotal - totals.subtotal);
  const deliveryProgress = Math.min(
    100,
    Math.round((totals.subtotal / ordering.minimumDeliverySubtotal) * 100)
  );
  const detailsComplete =
    form.name.trim().length > 1 &&
    form.phone.trim().length > 1 &&
    (orderType !== "delivery" || form.address.trim().length > 1);
  const orderSteps = [
    { label: "Cart", complete: cartItems.length > 0 },
    { label: "Details", complete: detailsComplete },
    { label: "Confirm", complete: Boolean(result) }
  ];

  useEffect(() => {
    try {
      const storedDraft = window.localStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
      const draft = JSON.parse(storedDraft || "{}");

      if (draft?.orderType === "pickup" || draft?.orderType === "delivery") {
        setOrderType(draft.orderType);
      }

      if (draft?.form && typeof draft.form === "object") {
        setForm((current) => ({ ...current, ...draft.form }));
      }
    } catch {
      window.localStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
    } finally {
      setDraftHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!draftHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        ORDER_DRAFT_STORAGE_KEY,
        JSON.stringify({ orderType, form })
      );
    } catch {
      // The drawer remains usable when storage is blocked.
    }
  }, [draftHydrated, form, orderType]);

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
            className="order-cart-drawer absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-ivory shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: smoothEase }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 p-5">
              <div>
                <p className="text-base font-bold uppercase text-ocean sm:text-sm">South Pizza Online Order</p>
                <h2 className="text-[2.1rem] font-bold leading-tight text-charcoal sm:text-3xl">Your Order</h2>
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

            <div className="border-b border-charcoal/10 bg-white/75 px-5 py-4">
              <div className="grid grid-cols-3 gap-2" aria-label="Order progress">
                {orderSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className={`rounded-md border px-2 py-3 text-center text-base font-black uppercase leading-tight sm:px-3 sm:py-2 sm:text-sm ${
                      step.complete
                        ? "border-ocean bg-surf text-charcoal"
                        : index === 0 || orderSteps[index - 1]?.complete
                          ? "border-charcoal/20 bg-white text-charcoal"
                          : "border-charcoal/10 bg-ivory text-charcoal/40"
                    }`}
                  >
                    {step.label}
                  </div>
                ))}
              </div>
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
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                            <div>
                              <h3 className="text-[1.35rem] font-bold leading-tight text-charcoal sm:text-xl">
                                {item.name}
                              </h3>
                              <p className="text-lg leading-snug text-charcoal/65 sm:text-base">{item.optionLabel}</p>
                              {item.customizations?.length ? (
                                <p className="mt-1 text-base font-bold text-ocean sm:text-sm">
                                  {item.customizations.join(", ")}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-xl font-bold text-charcoal sm:text-lg">
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
                              <span className="min-w-12 text-center text-xl font-bold sm:min-w-10 sm:text-lg">
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
                              className="min-h-14 rounded-md px-3 text-lg font-bold text-tomato hover:bg-surf sm:min-h-12 sm:text-base"
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
                  <h3 className="mt-4 text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Your cart is empty.</h3>
                  <p className="mt-2 text-xl text-charcoal/70 sm:text-lg">
                    Add pizzas, sides, and drinks from the menu to start an order.
                  </p>
                  <ButtonAction onClick={onClose} variant="dark" className="mt-5">
                    Back to Menu
                  </ButtonAction>
                </div>
              )}

              {recommendations.length ? (
                <div className="mt-5 rounded-lg border border-charcoal/10 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-black uppercase text-ocean sm:text-sm">Suggested add-ons</p>
                      <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Complete the order</h3>
                    </div>
                    <Icon name="Sparkles" className="h-7 w-7 text-tomato" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {recommendations.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-[68px_1fr] items-center gap-3 rounded-md bg-ivory p-3 sm:grid-cols-[72px_1fr_auto] sm:p-2"
                      >
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold leading-tight text-charcoal sm:text-base">{item.name}</p>
                          <p className="text-base font-semibold text-charcoal/60 sm:text-sm">
                            From {formatMoney(defaultOption(item).price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onAdd(item, defaultOption(item), 1, [])}
                          className="col-span-2 min-h-14 rounded-md bg-ocean px-3 text-base font-black uppercase text-white transition hover:bg-charcoal sm:col-span-1 sm:min-h-11 sm:text-sm"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <form onSubmit={submitOrder} className="mt-6 grid gap-5">
                <div className="rounded-lg border border-charcoal/10 bg-white p-4">
                  <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Order Type</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {["pickup", "delivery"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setOrderType(type);
                          setResult(null);
                        }}
                        className={`min-h-16 rounded-md border px-4 text-xl font-bold capitalize transition sm:min-h-14 sm:text-lg ${
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
                    <p className="mt-3 rounded-md bg-sand p-3 text-lg font-bold leading-snug text-charcoal sm:text-base">
                      Delivery minimum is {formatMoney(ordering.minimumDeliverySubtotal)} before tax.
                    </p>
                  ) : null}
                  {orderType === "delivery" ? (
                    <div className="mt-4 rounded-md border border-charcoal/10 bg-ivory p-3">
                      <div className="flex flex-col gap-1 text-base font-black uppercase leading-tight text-charcoal/70 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-sm">
                        <span>Delivery minimum</span>
                        <span>{formatMoney(totals.subtotal)} / {formatMoney(ordering.minimumDeliverySubtotal)}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                        <span
                          className="block h-full rounded-full bg-ocean transition-all duration-500"
                          style={{ width: `${deliveryProgress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-lg font-bold leading-snug text-charcoal sm:text-base">
                        {deliveryRemaining > 0
                          ? `${formatMoney(deliveryRemaining)} more unlocks delivery.`
                          : "Delivery minimum reached."}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 rounded-lg border border-charcoal/10 bg-white p-4">
                  <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Customer Details</h3>
                  <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                    Name
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      autoComplete="name"
                      className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                    Phone
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      autoComplete="tel"
                      className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
                      placeholder="Phone number"
                    />
                  </label>
                  <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      autoComplete="email"
                      className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
                      placeholder="Email address"
                    />
                  </label>
                  {orderType === "delivery" ? (
                    <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                      Delivery Address
                      <input
                        required
                        value={form.address}
                        onChange={(event) => updateField("address", event.target.value)}
                        autoComplete="street-address"
                        className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
                        placeholder="Street address"
                      />
                    </label>
                  ) : null}
                  <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                    Time
                    <select
                      value={form.time}
                      onChange={(event) => updateField("time", event.target.value)}
                      className="min-h-14 rounded-md border border-charcoal/20 bg-white px-4 text-charcoal sm:min-h-12"
                    >
                      {ordering.pickupTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-xl font-bold text-charcoal sm:text-lg">
                    Notes
                    <textarea
                      value={form.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                      className="min-h-28 rounded-md border border-charcoal/20 bg-white px-4 py-3 text-charcoal sm:min-h-24"
                      placeholder="Toppings, allergies, or pickup notes"
                    />
                  </label>
                </div>

                <div className="rounded-lg border border-charcoal/10 bg-white p-4">
                  <div className="grid gap-2 text-xl text-charcoal/75 sm:text-lg">
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
                    <p className="mt-2 flex justify-between gap-4 border-t border-charcoal/10 pt-3 text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">
                      <span>Total</span>
                      <span>{formatMoney(totals.total)}</span>
                    </p>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-md bg-[#fff0ee] p-4 text-xl font-bold leading-snug text-tomato sm:text-lg">
                    {error}
                  </p>
                ) : null}

                {result ? (
                  <div className="rounded-lg border border-ocean/25 bg-surf p-4">
                    <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">
                      Order request {result.orderId} is ready.
                    </h3>
                    <p className="mt-2 text-xl text-charcoal/75 sm:text-lg">
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
                        className="min-h-16 rounded-md border border-charcoal/20 bg-white px-5 text-xl font-bold text-charcoal hover:bg-surf sm:min-h-14 sm:text-lg"
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

function SiteFooter({ onAboutClick, onNavClick, schedule = weeklyHours }) {
  const visibleHours = formatHoursRows(schedule);

  function handleFooterLink(event, link) {
    if (!link.href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    if (onNavClick) {
      onNavClick(link.href);
      return;
    }

    if (link.href === "#about") {
      onAboutClick?.();
    }
  }

  return (
    <footer className="bg-charcoal pb-32 pt-12 text-white md:pb-12">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/south-pizza-logo-small.png"
              alt="South Pizza logo"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">South Pizza</p>
              <p className="text-sm font-bold uppercase text-sand">Stone baked pizza</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleFooterLink(event, link)}
                className="text-lg text-white/75 hover:text-white"
              >
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
            {visibleHours.map((row) => (
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

function PizzaAiAssistant({ concealed = false }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([aiWelcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    const root = document.documentElement;

    if (!open) {
      root.classList.remove("ai-night-mode");
      document.body.style.overflow = "";
      return undefined;
    }

    root.classList.add("ai-night-mode");
    document.body.style.overflow = "hidden";

    return () => {
      root.classList.remove("ai-night-mode");
      document.body.style.overflow = "";
    };
  }, [open]);

  async function sendMessage(messageText = input) {
    const text = messageText.trim();

    if (!text || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter(
            (message, index) => !(index === 0 && message.role === "assistant")
          )
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The pizza assistant is unavailable right now.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply || "I can help with South Pizza menu, hours, and ordering."
        }
      ]);
    } catch (assistantError) {
      setError(assistantError.message || "The pizza assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  function submitMessage(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed right-4 top-24 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-tomato/90 text-white shadow-[0_18px_42px_rgba(36,33,29,0.24)] backdrop-blur-xl transition hover:bg-charcoal md:bottom-28 md:right-6 md:top-auto md:h-16 md:w-16 ${
          concealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label={open ? "Close South Pizza AI assistant" : "Open South Pizza AI assistant"}
        aria-expanded={open}
        aria-hidden={concealed}
        tabIndex={concealed ? -1 : 0}
        whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span className="absolute -right-2 -top-1 rounded-full bg-ocean px-2 py-0.5 text-xs font-black uppercase text-white shadow-sm">
          Max
        </span>
        <Icon name="Pizza" className="h-8 w-8 md:h-9 md:w-9" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] overflow-hidden bg-[#070a12]/88 p-4 text-white backdrop-blur-xl sm:p-6"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28, ease: smoothEase }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="shooting-star"
                  style={{
                    left: `${82 + index * 5}%`,
                    top: `${8 + (index % 5) * 15}%`,
                    animationDelay: `${index * 0.72}s`,
                    animationDuration: `${4.2 + (index % 3) * 0.55}s`
                  }}
                />
              ))}
            </div>

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="South Pizza AI assistant"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.34, ease: smoothEase }}
              className="relative z-10 mx-auto flex h-[min(780px,calc(100svh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0c111d]/88 shadow-[0_32px_90px_rgba(0,0,0,0.48)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/8 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tomato text-white shadow-[0_0_24px_rgba(200,75,55,0.45)]">
                    <Icon name="Pizza" className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase text-sand">Dark mode assistant</p>
                    <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                      Max is ready
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="tap-target inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-charcoal"
                  aria-label="Close AI assistant"
                >
                  <Icon name="X" className="h-6 w-6" />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="hidden border-r border-white/10 bg-white/5 p-6 lg:block">
                  <p className="text-sm font-black uppercase text-sand">Meal shortcuts</p>
                  <h3 className="mt-3 text-[2rem] font-bold leading-tight text-white">
                    Ask Max for a quick meal plan, not just a menu item.
                  </h3>
                  <div className="mt-6 grid gap-3">
                    {mealSuggestionCards.slice(0, 3).map((suggestion) => (
                      <button
                        key={suggestion.title}
                        type="button"
                        onClick={() => sendMessage(suggestion.prompt)}
                        disabled={loading}
                        className="rounded-md border border-white/12 bg-white/8 p-4 text-left transition hover:border-sand hover:bg-white/12 disabled:opacity-50"
                      >
                        <span className="text-sm font-black uppercase text-sand">
                          {suggestion.title}
                        </span>
                        <span className="mt-1 block text-base font-semibold leading-snug text-white/75">
                          {suggestion.items}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-0 flex-col">
                  <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <p
                          className={`max-w-[88%] rounded-lg px-4 py-3 text-lg font-semibold leading-relaxed ${
                            message.role === "user"
                              ? "bg-ocean text-white"
                              : "border border-white/12 bg-white/10 text-white"
                          }`}
                        >
                          {message.text}
                        </p>
                      </div>
                    ))}

                    {loading ? (
                      <div className="flex justify-start">
                        <p className="rounded-lg border border-white/12 bg-white/10 px-4 py-3 text-lg font-bold text-white/70">
                          Thinking about pizza...
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-white/10 bg-[#090d17]/90 p-4 sm:p-5">
                    {error ? (
                      <p className="mb-3 rounded-md border border-tomato/30 bg-tomato/15 p-3 text-base font-bold leading-snug text-[#ffd8d1]">
                        {error}
                      </p>
                    ) : null}

                    <div className="mb-3 flex flex-wrap gap-2">
                      {aiQuickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          disabled={loading}
                          className="shrink-0 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-black uppercase text-white transition hover:border-sand hover:text-sand disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={submitMessage} className="grid grid-cols-[1fr_auto] gap-2">
                      <label className="sr-only" htmlFor="pizza-ai-message">
                        Ask the South Pizza AI assistant
                      </label>
                      <input
                        id="pizza-ai-message"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        className="min-h-14 rounded-md border border-white/15 bg-white/10 px-4 text-lg font-bold text-white placeholder:text-white/45"
                        placeholder="Ask Max for a meal..."
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="tap-target inline-flex items-center justify-center rounded-md bg-tomato px-4 text-white transition hover:bg-white hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send message to AI assistant"
                      >
                        <Icon name="Send" className="h-6 w-6" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
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

      <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-charcoal/10 bg-white text-charcoal shadow-soft md:hidden">
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
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [activeHomeTab, setActiveHomeTab] = useState("menu");
  const [hotDealsOpen, setHotDealsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeReady, setThemeReady] = useState(false);
  const [toast, setToast] = useState("");
  const siteContent = useEditableSiteContent();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const editableTopDeals = editableList(siteContent.topDeals, topDeals);
  const editableOrderCategoryTiles = editableList(
    siteContent.orderCategoryTiles,
    orderCategoryTiles
  );
  const editableMenuItems = editableList(siteContent.menuItems, menuItems);
  const editableCustomizationChoices = editableCustomizationList(
    siteContent.customizationOptions
  );
  const editableSpecials = editableList(siteContent.specials, specials);
  const editableGalleryImages = editableList(siteContent.galleryImages, galleryImages);
  const editableHero = useMemo(
    () => ({ ...heroContent, ...(siteContent.hero || {}) }),
    [siteContent.hero]
  );
  const editableStoreStatus = useMemo(
    () => ({ ...storeStatusSettings, ...(siteContent.storeStatus || {}) }),
    [siteContent.storeStatus]
  );
  const editableWeeklyHours = useMemo(
    () => editableList(siteContent.weeklyHours, weeklyHours),
    [siteContent.weeklyHours]
  );
  const editableSiteLayout = useMemo(
    () => editableLayout(siteContent.layout),
    [siteContent.layout]
  );

  useEffect(() => {
    const applyHashTab = () => {
      const tabId = tabIdFromHref(window.location.hash);
      if (tabId) {
        setActiveHomeTab(tabId);
      }
    };

    applyHashTab();
    window.addEventListener("hashchange", applyHashTab);
    return () => window.removeEventListener("hashchange", applyHashTab);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    } else if (editableSiteLayout.defaultTheme === "dark" || editableSiteLayout.defaultTheme === "light") {
      setTheme(editableSiteLayout.defaultTheme);
    } else {
      setTheme(prefersDark ? "dark" : "light");
    }

    setThemeReady(true);
  }, [editableSiteLayout.defaultTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (themeReady) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, themeReady]);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const savedItems = cleanCartItems(JSON.parse(storedCart || "[]"));
      if (savedItems.length) {
        setCartItems(savedItems);
        setToast("Saved order restored");
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!cartHydrated) {
      return;
    }

    try {
      if (cartItems.length) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } else {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable in private browsing; the cart still works in memory.
    }
  }, [cartHydrated, cartItems]);

  useEffect(() => {
    if (selectedImage === null) {
      return undefined;
    }

    if (selectedImage >= editableGalleryImages.length) {
      setSelectedImage(null);
      return undefined;
    }

    const handleGalleryKeys = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedImage((current) =>
          current === null ? current : (current + 1) % editableGalleryImages.length
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) =>
          current === null
            ? current
            : (current - 1 + editableGalleryImages.length) % editableGalleryImages.length
        );
      }
    };

    window.addEventListener("keydown", handleGalleryKeys);
    return () => window.removeEventListener("keydown", handleGalleryKeys);
  }, [editableGalleryImages.length, selectedImage]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function selectHomeTab(tabId, { scroll = true, updateHash = true } = {}) {
    const tab = homepageTabs.find((item) => item.id === tabId);

    if (!tab) {
      return;
    }

    setActiveHomeTab(tab.id);

    if (updateHash) {
      window.history.replaceState(null, "", tab.href);
    }

    if (scroll) {
      window.setTimeout(() => {
        document.getElementById("explore")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 80);
    }
  }

  function handleHomepageNav(href) {
    const tabId = tabIdFromHref(href);

    if (tabId) {
      selectHomeTab(tabId);
      return;
    }

    if (href === "#visit") {
      document.getElementById("visit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startOrder() {
    if (cartItems.length) {
      setCartOpen(true);
      return;
    }

    selectHomeTab("menu");
  }

  function revealAbout() {
    selectHomeTab("story");
  }

  function addToCart(item, option = defaultOption(item), quantity = 1, customizations = []) {
    if (item.orderable === false || item.priceValue === null) {
      return;
    }

    const cleanCustomizations = customizations
      .map((choice) => ({
        label: customizationLabel(choice),
        price: customizationPrice(choice)
      }))
      .filter((choice) => choice.label)
      .sort((first, second) => first.label.localeCompare(second.label));
    const customizationDisplay = cleanCustomizations.map((choice) =>
      choice.price ? `${choice.label} (+${formatMoney(choice.price)})` : choice.label
    );
    const customLabel = customizationDisplay.join(", ");
    const id = `${item.name}-${option.label}-${customLabel || "standard"}`;
    const unitPrice = Number(option.price) + customizationTotal(cleanCustomizations);
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
          category: item.category,
          groups: item.groups || [],
          optionLabel: option.label,
          customizations: customizationDisplay,
          unitPrice,
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

  function clearCart() {
    setCartItems([]);
    setToast("Order cart cleared");
  }

  function toggleTheme() {
    setThemeReady(true);
    setTheme((current) => (current === "dark" ? "light" : "dark"));
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
        onAboutClick={revealAbout}
        onNavClick={handleHomepageNav}
        onHotDealsClick={() => setHotDealsOpen(true)}
        statusSettings={editableStoreStatus}
        schedule={editableWeeklyHours}
        theme={theme}
        onThemeToggle={toggleTheme}
        cartCount={cartCount}
      />
      <main id="main">
        <Hero
          onOrderClick={startOrder}
          deals={editableTopDeals}
          layout={editableSiteLayout}
          hero={editableHero}
          statusSettings={editableStoreStatus}
          schedule={editableWeeklyHours}
        />
        <CompactHomeTabs
          activeTab={activeHomeTab}
          onTabChange={selectHomeTab}
          onAdd={addToCart}
          onCartOpen={() => setCartOpen(true)}
          cartCount={cartCount}
          layout={editableSiteLayout}
          hero={editableHero}
          menuList={editableMenuItems}
          categoryTiles={editableOrderCategoryTiles}
          customizationChoices={editableCustomizationChoices}
          specialsList={editableSpecials}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          galleryItems={editableGalleryImages}
          statusSettings={editableStoreStatus}
          schedule={editableWeeklyHours}
          onOrderClick={startOrder}
          onItemOpen={setSelectedMenuItem}
        />
      </main>
      <SiteFooter
        onAboutClick={revealAbout}
        onNavClick={handleHomepageNav}
        schedule={editableWeeklyHours}
      />
      {editableSiteLayout.showMax ? <PizzaAiAssistant concealed={mobileOpen} /> : null}
      {editableSiteLayout.showFloatingOrder ? (
        <FloatingActions onOrderClick={startOrder} cartCount={cartCount} />
      ) : null}
      <HotDealsModal
        open={hotDealsOpen}
        onClose={() => setHotDealsOpen(false)}
        deals={editableTopDeals}
        onOrderClick={startOrder}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
        onAdd={addToCart}
        menuList={editableMenuItems}
      />
      <ProductDetailModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAdd={addToCart}
        customizationChoices={editableCustomizationChoices}
      />
      <OrderToast toast={toast} />
    </>
  );
}
