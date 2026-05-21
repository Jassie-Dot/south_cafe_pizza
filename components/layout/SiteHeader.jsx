"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function SiteHeader({
  mobileOpen,
  setMobileOpen,
  onOrderClick,
  cartCount,
  onCartOpen,
  onAboutClick,
  theme,
  onThemeToggle
}) {
  const storeStatus = useStoreStatus();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 24);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  function handleNavClick(event, link) {
    if (link.href !== "#about") {
      return;
    }

    event.preventDefault();
    setMobileOpen(false);
    onAboutClick?.();
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

        <nav
          aria-label="Primary navigation"
          className="header-nav-glass hidden max-w-full min-w-0 flex-wrap items-center justify-center gap-1 justify-self-center rounded-full p-1 min-[1180px]:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link)}
              className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-[0.82rem] font-black text-charcoal/80 transition hover:bg-white/70 hover:text-charcoal min-[1500px]:px-3.5 min-[1500px]:text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden min-w-0 items-center justify-self-end gap-2 min-[1180px]:flex">
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
                    if (link.href !== "#about") {
                      setMobileOpen(false);
                    }
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
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default SiteHeader;
