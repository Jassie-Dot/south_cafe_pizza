import {
  customizationOptions,
  galleryImages,
  heroContent,
  layoutSettings,
  menuItems,
  orderCategoryTiles,
  specials,
  storeStatusSettings,
  topDeals,
  weeklyHours
} from "./siteData";

const layouts = {
  defaultTheme: ["system", "light", "dark"],
  heroMode: ["slideshow", "static"],
  heroTextAlign: ["left", "center"],
  heroOverlay: ["soft", "strong"],
  menuDensity: ["compact", "standard"],
  sectionSpacing: ["compact", "comfortable"]
};

export const defaultSiteContent = {
  hero: heroContent,
  topDeals,
  orderCategoryTiles,
  menuItems,
  customizationOptions: customizationOptions.map((label) => ({ label })),
  specials,
  galleryImages,
  storeStatus: storeStatusSettings,
  weeklyHours,
  layout: layoutSettings
};

function text(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function choice(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function bool(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function number(value, fallback = null) {
  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function time(value, fallback) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || value === "24:00"
    ? value
    : fallback;
}

function fallbackAt(items, index) {
  return items[index % items.length] || items[0] || {};
}

function cleanGroups(value, fallback = []) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : fallback;

  return [...new Set(source.map((item) => text(item)).filter(Boolean))].slice(0, 12);
}

function cleanMenuOptions(items, fallback = []) {
  const source = Array.isArray(items) ? items : fallback;
  const cleaned = source
    .slice(0, 12)
    .map((item, index) => {
      const fallbackOption = fallbackAt(fallback, index);
      const label = text(item?.label, fallbackOption.label || "Regular");
      const price = number(item?.price, number(fallbackOption.price, 0));

      return {
        label,
        price: price ?? 0
      };
    })
    .filter((item) => item.label);

  return cleaned.length ? cleaned : [{ label: "Regular", price: 0 }];
}

function cleanHero(value = {}) {
  const fallback = defaultSiteContent.hero;

  return {
    headline: text(value.headline, fallback.headline),
    subheadline: text(value.subheadline, fallback.subheadline),
    tabKicker: text(value.tabKicker, fallback.tabKicker),
    tabHeadline: text(value.tabHeadline, fallback.tabHeadline)
  };
}

function cleanDeals(items) {
  if (!Array.isArray(items) || !items.length) {
    return defaultSiteContent.topDeals;
  }

  return items.slice(0, 12).map((item, index) => {
    const fallback = fallbackAt(defaultSiteContent.topDeals, index);

    return {
      eyebrow: text(item?.eyebrow, fallback.eyebrow || "Deal"),
      title: text(item?.title, fallback.title || "Pizza Deal"),
      price: text(item?.price, fallback.price || "Ask today"),
      description: text(item?.description, fallback.description || ""),
      image: text(item?.image, fallback.image || "")
    };
  });
}

function cleanCategoryTiles(items) {
  const source = Array.isArray(items) ? items : defaultSiteContent.orderCategoryTiles;

  return source.slice(0, 16).map((item, index) => {
    const fallback = fallbackAt(defaultSiteContent.orderCategoryTiles, index);

    return {
      id: text(item?.id, fallback.id || `tile-${index + 1}`),
      label: text(item?.label, fallback.label || "Menu"),
      heading: text(item?.heading, fallback.heading || "Menu Picks"),
      category: text(item?.category, fallback.category || "pizza"),
      filter: text(item?.filter, fallback.filter || ""),
      image: text(item?.image, fallback.image || "")
    };
  });
}

function cleanMenuItems(items) {
  const source = Array.isArray(items) ? items : defaultSiteContent.menuItems;

  return source.slice(0, 80).map((item, index) => {
    const fallback = fallbackAt(defaultSiteContent.menuItems, index);
    const priceValue = number(item?.priceValue, number(fallback.priceValue, null));

    return {
      wooId: number(item?.wooId, number(fallback.wooId, null)),
      category: text(item?.category, fallback.category || "pizza"),
      name: text(item?.name, fallback.name || "Menu Item"),
      price: text(item?.price, fallback.price || "Ask today"),
      priceValue,
      orderable: bool(item?.orderable, fallback.orderable !== false && priceValue !== null),
      options: cleanMenuOptions(item?.options, fallback.options || []),
      badge: text(item?.badge, fallback.badge || "Menu"),
      groups: cleanGroups(item?.groups, fallback.groups || []),
      description: text(item?.description, fallback.description || ""),
      longDescription: text(item?.longDescription, fallback.longDescription || item?.description || ""),
      image: text(item?.image, fallback.image || ""),
      alt: text(item?.alt, fallback.alt || item?.name || "South Pizza menu item"),
      sourceUrl: text(item?.sourceUrl, fallback.sourceUrl || ""),
      sku: text(item?.sku, fallback.sku || "")
    };
  });
}

function cleanCustomizationOptions(items) {
  const source = Array.isArray(items)
    ? items
    : defaultSiteContent.customizationOptions;

  return source
    .slice(0, 60)
    .map((item) => ({
      label: text(typeof item === "string" ? item : item?.label),
      price: number(typeof item === "string" ? 0 : item?.price, 0) ?? 0
    }))
    .filter((item) => item.label);
}

function cleanSpecials(items) {
  if (!Array.isArray(items) || !items.length) {
    return defaultSiteContent.specials;
  }

  return items.slice(0, 12).map((item, index) => {
    const fallback = fallbackAt(defaultSiteContent.specials, index);

    return {
      title: text(item?.title, fallback.title || "Special"),
      price: text(item?.price, fallback.price || "Ask today"),
      description: text(item?.description, fallback.description || ""),
      tag: text(item?.tag, fallback.tag || "Special")
    };
  });
}

function cleanGallery(items) {
  if (!Array.isArray(items) || !items.length) {
    return defaultSiteContent.galleryImages;
  }

  return items.slice(0, 18).map((item, index) => {
    const fallback = fallbackAt(defaultSiteContent.galleryImages, index);

    return {
      src: text(item?.src, fallback.src || ""),
      alt: text(item?.alt, fallback.alt || "South Pizza photo"),
      title: text(item?.title, fallback.title || "Gallery")
    };
  });
}

function cleanStoreStatus(value = {}) {
  const fallback = defaultSiteContent.storeStatus;
  const modes = ["auto", "open", "closed"];

  return {
    mode: choice(value.mode, modes, fallback.mode),
    openLabel: text(value.openLabel, fallback.openLabel),
    openDetail: text(value.openDetail, fallback.openDetail),
    closedLabel: text(value.closedLabel, fallback.closedLabel),
    closedDetail: text(value.closedDetail, fallback.closedDetail)
  };
}

function cleanWeeklyHours(items) {
  const source = Array.isArray(items) ? items : [];

  return defaultSiteContent.weeklyHours.map((fallback) => {
    const item = source.find((entry) => entry?.id === fallback.id) || {};

    return {
      id: fallback.id,
      day: fallback.day,
      shortDay: fallback.shortDay,
      open: time(item.open, fallback.open),
      close: time(item.close, fallback.close),
      closed: bool(item.closed, fallback.closed)
    };
  });
}

function cleanLayout(layout = {}) {
  const fallback = defaultSiteContent.layout;

  return {
    defaultTheme: choice(layout.defaultTheme, layouts.defaultTheme, fallback.defaultTheme),
    heroMode: choice(layout.heroMode, layouts.heroMode, fallback.heroMode),
    heroTextAlign: choice(layout.heroTextAlign, layouts.heroTextAlign, fallback.heroTextAlign),
    heroOverlay: choice(layout.heroOverlay, layouts.heroOverlay, fallback.heroOverlay),
    menuDensity: choice(layout.menuDensity, layouts.menuDensity, fallback.menuDensity),
    sectionSpacing: choice(layout.sectionSpacing, layouts.sectionSpacing, fallback.sectionSpacing),
    showDough: bool(layout.showDough, fallback.showDough),
    showSpecials: bool(layout.showSpecials, fallback.showSpecials),
    showGallery: bool(layout.showGallery, fallback.showGallery),
    showVisit: bool(layout.showVisit, fallback.showVisit),
    showMax: bool(layout.showMax, fallback.showMax),
    showFloatingOrder: bool(layout.showFloatingOrder, fallback.showFloatingOrder)
  };
}

export function cleanSiteContent(content = {}) {
  return {
    hero: cleanHero(content.hero),
    topDeals: cleanDeals(content.topDeals),
    orderCategoryTiles: cleanCategoryTiles(content.orderCategoryTiles),
    menuItems: cleanMenuItems(content.menuItems),
    customizationOptions: cleanCustomizationOptions(content.customizationOptions),
    specials: cleanSpecials(content.specials),
    galleryImages: cleanGallery(content.galleryImages),
    storeStatus: cleanStoreStatus(content.storeStatus),
    weeklyHours: cleanWeeklyHours(content.weeklyHours),
    layout: cleanLayout(content.layout)
  };
}

export function contentCapabilities() {
  return {
    editableCollections: [
      "topDeals",
      "orderCategoryTiles",
      "menuItems",
      "customizationOptions",
      "specials",
      "galleryImages"
    ],
    editableLayout: layouts,
    editableSections: ["hero", "storeStatus", "weeklyHours"],
    imageUpload: "JPG and PNG files saved into /public/uploads"
  };
}
