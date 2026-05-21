"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function FeaturedMenu({ onAdd, onCartOpen, cartCount }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [activeTileId, setActiveTileId] = useState(orderCategoryTiles[0].id);
  const [activeCategoryId, setActiveCategoryId] = useState(orderCategoryTiles[0].category);
  const [activeGroupFilter, setActiveGroupFilter] = useState(
    orderCategoryTiles[0].filter || "all"
  );
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

  const activeTile =
    orderCategoryTiles.find((tile) => tile.id === activeTileId) || orderCategoryTiles[0];
  const activeCategory =
    menuCategories.find((category) => category.id === activeCategoryId) || menuCategories[0];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const pageSize = 6;

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
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
  }, [activeCategoryId, activeGroupFilter, normalizedQuery, quickFilter]);

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
    ? `${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"} for "${searchQuery.trim()}"`
    : `${filteredItems.length} menu item${filteredItems.length === 1 ? "" : "s"} ready to browse`;

  useEffect(() => {
    setPage(0);
  }, [activeCategoryId, activeGroupFilter, normalizedQuery, quickFilter]);

  function cyclePage(direction) {
    setPage((value) => (value + direction + totalPages) % totalPages);
  }

  function chooseTile(tile) {
    setActiveTileId(tile.id);
    setActiveCategoryId(tile.category);
    setActiveGroupFilter(tile.filter || "all");
  }

  function chooseCategory(category) {
    const matchingTile =
      orderCategoryTiles.find((tile) => tile.category === category.id && !tile.filter) ||
      orderCategoryTiles.find((tile) => tile.category === category.id);

    setActiveCategoryId(category.id);
    setActiveGroupFilter("all");
    setActiveTileId(matchingTile?.id || "");
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
      className="relative isolate overflow-hidden bg-[#fbfaf6] py-16 sm:py-20"
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

        <div className="mt-10 flex snap-x gap-3 overflow-x-auto pb-2 sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 xl:grid-cols-8">
          {orderCategoryTiles.map((tile, index) => {
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
                <span className="relative flex min-h-40 items-center justify-center px-4 text-center text-[1.85rem] font-black uppercase leading-none tracking-wide text-white drop-shadow sm:min-h-36 sm:px-3 sm:text-2xl">
                  {tile.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-charcoal/10 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ocean">
                <Icon name="Search" className="h-6 w-6" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-h-16 w-full rounded-md border border-charcoal/15 bg-white py-3 pl-12 pr-4 text-xl font-bold text-charcoal placeholder:text-charcoal/40 sm:min-h-14 sm:text-lg"
                placeholder="Search paneer, pepperoni, garlic bread..."
                aria-label="Search the South Pizza menu"
              />
            </label>
            <button
              type="button"
              onClick={resetMenuFilters}
              className="inline-flex min-h-16 items-center justify-center gap-2 rounded-md border border-charcoal/15 bg-ivory px-4 text-xl font-bold text-charcoal transition hover:border-ocean hover:text-ocean sm:min-h-14 sm:text-lg"
            >
              <Icon name="RotateCcw" />
              Reset
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Menu categories">
            {menuCategories.map((category) => {
              const active = activeCategoryId === category.id;
              const count = menuItems.filter((item) =>
                category.id === "all" ? true : item.category === category.id
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => chooseCategory(category)}
                  aria-pressed={active}
                  className={`inline-flex min-h-12 items-center gap-2 rounded-md border px-4 text-lg font-bold transition sm:min-h-11 sm:px-3 sm:text-base ${
                    active
                      ? "border-ocean bg-ocean text-white"
                      : "border-charcoal/15 bg-white text-charcoal hover:border-ocean hover:text-ocean"
                  }`}
                >
                  <Icon name={categoryIconNames[category.id]} className="h-5 w-5" />
                  {category.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active ? "bg-white/20 text-white" : "bg-surf text-charcoal"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2" aria-label="Menu filters">
            {quickMenuFilters.map((filter) => {
              const active = quickFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setQuickFilter(filter.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-12 items-center gap-2 rounded-md border px-3 text-base font-black uppercase leading-tight transition sm:min-h-10 sm:text-sm ${
                    active
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-charcoal/15 bg-white text-charcoal/75 hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  <Icon name={filter.icon} className="h-4 w-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
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
          <motion.div layout className="mt-8 grid gap-6 lg:grid-cols-3">
            <AnimatePresence>
              {visibleItems.map((item) => (
                <MenuCard key={`${item.category}-${item.name}`} item={item} onAdd={onAdd} />
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
      </div>
    </motion.section>
  );
}

export default FeaturedMenu;
