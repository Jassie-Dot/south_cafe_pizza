"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";

const collections = [
  { id: "menuItems", label: "Menu Items", icon: "Pizza" },
  { id: "orderCategoryTiles", label: "Preference Cards", icon: "PanelsTopLeft" },
  { id: "customizationOptions", label: "Customization Options", icon: "ListChecks" },
  { id: "topDeals", label: "Hot Deal Posters", icon: "Flame" },
  { id: "specials", label: "Specials", icon: "BadgePercent" },
  { id: "galleryImages", label: "Gallery", icon: "Images" }
];

const menuCategoryOptions = [
  ["pizza", "Pizza"],
  ["sides", "Sides"],
  ["drinks", "Drinks"],
  ["cafe", "Cafe"],
  ["dessert", "Dessert"]
];

const panels = [
  { id: "content", label: "Content", icon: "PanelsTopLeft" },
  { id: "layout", label: "Refine", icon: "SlidersHorizontal" },
  { id: "hours", label: "Hours", icon: "Clock" },
  { id: "ai", label: "AI Control", icon: "Sparkles" }
];

const blankItems = {
  menuItems: {
    wooId: null,
    category: "pizza",
    name: "New Menu Item",
    price: "$0.00",
    priceValue: 0,
    orderable: true,
    options: [{ label: "Regular", price: 0 }],
    badge: "New",
    groups: ["customize"],
    description: "",
    longDescription: "",
    image: "",
    alt: "South Pizza menu item",
    sourceUrl: "",
    sku: ""
  },
  orderCategoryTiles: {
    id: "new-preference",
    label: "New",
    heading: "New Menu Picks",
    category: "pizza",
    filter: "",
    image: ""
  },
  customizationOptions: {
    label: "New customization",
    price: 0
  },
  topDeals: {
    eyebrow: "New Deal",
    title: "Pizza Deal",
    price: "Ask today",
    description: "",
    image: ""
  },
  specials: {
    title: "New Special",
    price: "Ask today",
    description: "",
    tag: "Special"
  },
  galleryImages: {
    src: "",
    alt: "South Pizza photo",
    title: "Gallery"
  }
};

const fieldGroups = {
  menuItems: [
    ["wooId", "WooCommerce ID", "number"],
    ["name", "Item name"],
    ["category", "Category", "select", menuCategoryOptions],
    ["price", "Display price"],
    ["priceValue", "Base price", "number"],
    ["orderable", "Can be ordered online", "toggle"],
    ["badge", "Badge"],
    ["groups", "Preference groups", "tags"],
    ["description", "Details", "textarea"],
    ["longDescription", "Full product details", "textarea"],
    ["options", "Size / price options", "options"],
    ["image", "Item picture", "image"],
    ["alt", "Image alt text"],
    ["sourceUrl", "Original product page"],
    ["sku", "SKU"]
  ],
  orderCategoryTiles: [
    ["id", "Card ID"],
    ["label", "Card label"],
    ["heading", "Result heading"],
    ["category", "Category", "select", menuCategoryOptions],
    ["filter", "Preference group"],
    ["image", "Card picture", "image"]
  ],
  customizationOptions: [
    ["label", "Customization choice"],
    ["price", "Add-on price", "number"]
  ],
  topDeals: [
    ["eyebrow", "Label"],
    ["title", "Title"],
    ["price", "Price"],
    ["description", "Description", "textarea"],
    ["image", "Prepared poster", "image"]
  ],
  specials: [
    ["tag", "Tag"],
    ["title", "Title"],
    ["price", "Price"],
    ["description", "Description", "textarea"]
  ],
  galleryImages: [
    ["title", "Title"],
    ["alt", "Alt text"],
    ["src", "Gallery image", "image"]
  ]
};

const layoutOptions = [
  {
    key: "defaultTheme",
    label: "Default Theme",
    type: "select",
    options: [
      ["system", "System"],
      ["light", "Light"],
      ["dark", "Dark"]
    ]
  },
  {
    key: "heroMode",
    label: "Hero Motion",
    type: "select",
    options: [
      ["slideshow", "Slideshow"],
      ["static", "Static"]
    ]
  },
  {
    key: "heroTextAlign",
    label: "Hero Text",
    type: "select",
    options: [
      ["left", "Left"],
      ["center", "Center"]
    ]
  },
  {
    key: "heroOverlay",
    label: "Hero Overlay",
    type: "select",
    options: [
      ["strong", "Strong"],
      ["soft", "Soft"]
    ]
  },
  {
    key: "menuDensity",
    label: "Menu Density",
    type: "select",
    options: [
      ["standard", "Standard"],
      ["compact", "Compact"]
    ]
  },
  {
    key: "sectionSpacing",
    label: "Section Spacing",
    type: "select",
    options: [
      ["comfortable", "Comfortable"],
      ["compact", "Compact"]
    ]
  },
  ["showDough", "Show Dough Section"],
  ["showSpecials", "Show Specials"],
  ["showGallery", "Show Gallery"],
  ["showMax", "Show Max Assistant"],
  ["showFloatingOrder", "Show Floating Order Button"]
];

const layoutPresets = [
  {
    id: "balanced",
    label: "Balanced",
    icon: "LayoutTemplate",
    values: {
      defaultTheme: "system",
      heroMode: "slideshow",
      heroTextAlign: "left",
      heroOverlay: "strong",
      menuDensity: "standard",
      sectionSpacing: "comfortable",
      showDough: true,
      showSpecials: true,
      showGallery: true,
      showVisit: true,
      showMax: true,
      showFloatingOrder: true
    }
  },
  {
    id: "compact",
    label: "Compact",
    icon: "Minimize2",
    values: {
      menuDensity: "compact",
      sectionSpacing: "compact",
      showDough: false,
      showMax: true,
      showFloatingOrder: true
    }
  },
  {
    id: "showcase",
    label: "Showcase",
    icon: "Images",
    values: {
      heroMode: "slideshow",
      heroTextAlign: "center",
      heroOverlay: "soft",
      sectionSpacing: "comfortable",
      showDough: true,
      showSpecials: true,
      showGallery: true
    }
  }
];

const aiPresets = [
  "Make the homepage cleaner and more premium, keep ordering easy, and fix any weak copy.",
  "Create a strong weekend hot deal and make it the first hero slide.",
  "Switch to a compact layout while keeping Max and online ordering visible.",
  "Review everything and correct missing titles, prices, descriptions, and image paths."
];

function Icon({ name, className = "h-5 w-5" }) {
  const IconComponent = Icons[name] || Icons.Pencil;
  return <IconComponent aria-hidden="true" className={className} strokeWidth={2} />;
}

function serializeContent(value) {
  return JSON.stringify(value || null);
}

function itemSearchText(item) {
  return Object.values(item || {})
    .map((value) => {
      if (typeof value === "string") {
        return value;
      }

      if (Array.isArray(value)) {
        return value
          .map((entry) =>
            typeof entry === "string" ? entry : Object.values(entry || {}).join(" ")
          )
          .join(" ");
      }

      return "";
    })
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function itemTitle(item, index) {
  return item?.name || item?.title || item?.label || item?.eyebrow || `Item ${index + 1}`;
}

function duplicateTitle(item) {
  if (item?.name) {
    return { name: `${item.name} Copy` };
  }

  if (item?.label) {
    return { label: `${item.label} Copy` };
  }

  return { title: `${item?.title || "Item"} Copy` };
}

function buildContentStats(content) {
  if (!content) {
    return {
      items: 0,
      images: 0,
      missingImages: 0,
      hiddenSections: 0
    };
  }

  const dealImages = content.topDeals?.filter((item) => item.image)?.length || 0;
  const menuImages = content.menuItems?.filter((item) => item.image)?.length || 0;
  const tileImages = content.orderCategoryTiles?.filter((item) => item.image)?.length || 0;
  const galleryImages = content.galleryImages?.filter((item) => item.src)?.length || 0;
  const missingDealImages = content.topDeals?.filter((item) => !item.image)?.length || 0;
  const missingMenuImages = content.menuItems?.filter((item) => !item.image)?.length || 0;
  const missingTileImages = content.orderCategoryTiles?.filter((item) => !item.image)?.length || 0;
  const missingGalleryImages = content.galleryImages?.filter((item) => !item.src)?.length || 0;
  const hiddenSections = [
    "showDough",
    "showSpecials",
    "showGallery",
    "showMax",
    "showFloatingOrder"
  ].filter((key) => content.layout?.[key] === false).length;

  return {
    items:
      (content.topDeals?.length || 0) +
      (content.menuItems?.length || 0) +
      (content.orderCategoryTiles?.length || 0) +
      (content.customizationOptions?.length || 0) +
      (content.specials?.length || 0) +
      (content.galleryImages?.length || 0),
    images: dealImages + menuImages + tileImages + galleryImages,
    missingImages:
      missingDealImages + missingMenuImages + missingTileImages + missingGalleryImages,
    hiddenSections
  };
}

function StatusMessage({ type = "status", children }) {
  const isError = type === "error";

  return (
    <p
      className={`mb-4 flex items-start gap-3 rounded-md border bg-white p-4 text-base font-bold ${
        isError
          ? "border-tomato/25 text-tomato"
          : "border-ocean/20 text-ocean"
      }`}
    >
      <Icon
        name={isError ? "CircleAlert" : "CheckCircle2"}
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <span>{children}</span>
    </p>
  );
}

function IconButton({ icon, label, onClick, disabled = false, tone = "default" }) {
  const toneClasses =
    tone === "danger"
      ? "border-tomato/25 text-tomato hover:bg-tomato hover:text-white"
      : "border-charcoal/15 text-charcoal hover:border-ocean hover:text-ocean";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-35 ${toneClasses}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  readOnly = false,
  placeholder = ""
}) {
  const classes =
    "w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-base font-semibold text-charcoal outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20 disabled:bg-ivory disabled:text-charcoal/60";

  return (
    <label className="grid gap-1.5 text-sm font-black uppercase text-charcoal/65">
      {label}
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={readOnly}
          className={`${classes} min-h-24 resize-y normal-case leading-relaxed`}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={readOnly}
          className={classes}
        />
      )}
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="grid gap-1.5 text-sm font-black uppercase text-charcoal/65">
      {label}
      <input
        type="number"
        step="0.01"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-base font-semibold text-charcoal outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
      />
    </label>
  );
}

function TagsField({ label, value, onChange }) {
  const textValue = Array.isArray(value) ? value.join(", ") : value || "";

  return (
    <Field
      label={label}
      value={textValue}
      placeholder="customize, veggie, meat"
      onChange={(nextValue) =>
        onChange(
          nextValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      }
    />
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="grid gap-1.5 text-sm font-black uppercase text-charcoal/65">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-md border border-charcoal/15 bg-white px-3 text-base font-bold text-charcoal outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function MenuOptionsEditor({ label, value, onChange }) {
  const options = Array.isArray(value) && value.length
    ? value
    : [{ label: "Regular", price: 0 }];

  function updateOption(index, key, nextValue) {
    onChange(
      options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [key]: nextValue } : option
      )
    );
  }

  function addOption() {
    onChange([...options, { label: "New option", price: 0 }]);
  }

  function removeOption(index) {
    onChange(options.filter((_, optionIndex) => optionIndex !== index));
  }

  return (
    <div className="grid gap-3 rounded-md border border-charcoal/10 bg-ivory p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase text-charcoal/65">{label}</p>
        <button
          type="button"
          onClick={addOption}
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-charcoal px-3 text-sm font-black uppercase text-white transition hover:bg-ocean"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Add Option
        </button>
      </div>

      <div className="grid gap-2">
        {options.map((option, index) => (
          <div key={`${option.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_140px_auto]">
            <Field
              label={`Option ${index + 1}`}
              value={option.label}
              onChange={(nextValue) => updateOption(index, "label", nextValue)}
            />
            <NumberField
              label="Price"
              value={option.price}
              onChange={(nextValue) => updateOption(index, "price", nextValue)}
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              disabled={options.length <= 1}
              className="min-h-11 self-end rounded-md border border-tomato/25 px-3 text-sm font-black uppercase text-tomato transition hover:bg-tomato hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex min-h-14 items-center justify-between gap-4 rounded-md border border-charcoal/10 bg-white px-4 text-left text-base font-black text-charcoal transition hover:border-ocean"
      aria-pressed={checked}
    >
      <span>{label}</span>
      <span
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-ocean" : "bg-charcoal/20"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function ImageUploader({ label, value, onUploaded, onError, onStatus, pin }) {
  const [uploading, setUploading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [value]);

  async function upload(file) {
    if (!file) {
      return;
    }

    setUploading(true);
    onError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (pin) {
        formData.append("pin", pin);
      }

      const response = await fetch("/api/uploads", {
        method: "POST",
        headers: pin ? { "x-admin-pin": pin } : undefined,
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      onUploaded(data.url);
      onStatus(`${file.name} uploaded. Save changes to publish it.`);
    } catch (uploadError) {
      onError(uploadError.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function copyPath() {
    if (!value || !navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
    onStatus("Image path copied.");
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-3 rounded-md border border-charcoal/10 bg-ivory p-3 sm:grid sm:grid-cols-[164px_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-md border border-charcoal/10 bg-white">
          {value && !imageFailed ? (
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
              onLoad={() => setImageFailed(false)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-charcoal/35">
              <Icon name={value ? "ImageOff" : "Image"} className="h-8 w-8" />
              {value ? (
                <span className="px-3 text-center text-xs font-black uppercase text-tomato">
                  Image not found
                </span>
              ) : null}
            </div>
          )}
        </div>
        <div className="grid content-center gap-3">
          <Field label={label} value={value || "Upload JPG or PNG"} readOnly onChange={() => {}} />
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-charcoal px-4 text-base font-bold text-white transition hover:bg-ocean">
              <Icon name="Upload" className="h-4 w-4" />
              {uploading ? "Uploading" : "Upload JPG/PNG"}
              <input
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(event) => {
                  upload(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <a
              href={value || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${label}`}
              title={`Open ${label}`}
              className={`inline-flex h-11 w-full items-center justify-center rounded-md border border-charcoal/15 text-charcoal transition hover:border-ocean hover:text-ocean sm:w-11 ${
                value ? "" : "pointer-events-none opacity-35"
              }`}
            >
              <Icon name="ExternalLink" className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={copyPath}
              disabled={!value}
              aria-label={`Copy ${label} path`}
              title={`Copy ${label} path`}
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-charcoal/15 text-charcoal transition hover:border-ocean hover:text-ocean disabled:pointer-events-none disabled:opacity-35 sm:w-11"
            >
              <Icon name="Copy" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState("content");
  const [activeCollection, setActiveCollection] = useState("topDeals");
  const [content, setContent] = useState(null);
  const [savedContent, setSavedContent] = useState(null);
  const [defaults, setDefaults] = useState(null);
  const [requiresPin, setRequiresPin] = useState(false);
  const [pin, setPin] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  const activeCollectionMeta = collections.find((section) => section.id === activeCollection);
  const hasChanges = useMemo(
    () => serializeContent(content) !== serializeContent(savedContent),
    [content, savedContent]
  );
  const contentStats = useMemo(() => buildContentStats(content), [content]);
  const activeEntries = useMemo(
    () => {
      const items = content?.[activeCollection] || [];
      const query = searchQuery.trim().toLowerCase();

      return items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !query || itemSearchText(item).includes(query));
    },
    [activeCollection, content, searchQuery]
  );

  useEffect(() => {
    let alive = true;

    async function loadContent() {
      setError("");

      try {
        const response = await fetch("/api/site-content", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load content.");
        }

        if (alive) {
          setContent(data.content);
          setSavedContent(data.content);
          setDefaults(data.defaults);
          setRequiresPin(Boolean(data.requiresPin));
        }
      } catch (loadError) {
        if (alive) {
          setError(loadError.message || "Could not load content.");
        }
      }
    }

    loadContent();

    return () => {
      alive = false;
    };
  }, []);

  function updateItem(section, index, key, value) {
    setContent((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  }

  function updateLayout(key, value) {
    setContent((current) => ({
      ...current,
      layout: {
        ...current.layout,
        [key]: value
      }
    }));
  }

  function updateHero(key, value) {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [key]: value
      }
    }));
  }

  function updateStoreStatus(key, value) {
    setContent((current) => ({
      ...current,
      storeStatus: {
        ...current.storeStatus,
        [key]: value
      }
    }));
  }

  function updateHour(dayId, key, value) {
    setContent((current) => ({
      ...current,
      weeklyHours: current.weeklyHours.map((row) =>
        row.id === dayId ? { ...row, [key]: value } : row
      )
    }));
  }

  function addItem(section) {
    setContent((current) => ({
      ...current,
      [section]: [...current[section], { ...blankItems[section] }]
    }));
    setStatus("Item added. Save changes to publish it.");
  }

  function duplicateItem(section, index) {
    setContent((current) => {
      const next = [...current[section]];
      const item = next[index];

      if (!item) {
        return current;
      }

      next.splice(index + 1, 0, { ...item, ...duplicateTitle(item) });
      return { ...current, [section]: next };
    });
    setStatus("Item duplicated. Save changes to publish it.");
  }

  function removeItem(section, index) {
    setContent((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }));
    setStatus("Item removed. Save changes to publish it.");
  }

  function moveItem(section, index, direction) {
    setContent((current) => {
      const next = [...current[section]];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, [section]: next };
    });
    setStatus("Item reordered. Save changes to publish it.");
  }

  function applyLayoutPreset(values) {
    setContent((current) => ({
      ...current,
      layout: {
        ...current.layout,
        ...values
      }
    }));
    setStatus("Layout preset applied. Save changes to publish it.");
  }

  async function saveContent(nextContent = content) {
    if (!nextContent) {
      return;
    }

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(pin ? { "x-admin-pin": pin } : {})
        },
        body: JSON.stringify({ content: nextContent, pin })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save content.");
      }

      setContent(data.content);
      setSavedContent(data.content);
      setStatus("Saved. Refresh the website to see the latest content.");
    } catch (saveError) {
      setError(saveError.message || "Could not save content.");
    } finally {
      setSaving(false);
    }
  }

  async function runAi(instruction = aiInstruction) {
    if (!content) {
      return;
    }

    setAiLoading(true);
    setStatus("");
    setError("");
    setAiReport(null);

    try {
      const response = await fetch("/api/admin-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(pin ? { "x-admin-pin": pin } : {})
        },
        body: JSON.stringify({ instruction, content, pin })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI could not apply changes.");
      }

      setContent(data.content);
      setAiReport({ summary: data.summary, checks: data.checks || [] });
      setStatus("AI applied changes to the draft. Save to publish.");
    } catch (aiError) {
      setError(aiError.message || "AI could not apply changes.");
    } finally {
      setAiLoading(false);
    }
  }

  function resetDefaults() {
    if (!defaults) {
      return;
    }

    setContent(defaults);
    setError("");
    setStatus("Defaults loaded. Save to publish them.");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-charcoal">
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-tomato text-white">
              <Icon name="Command" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                  South Pizza Command Center
                </h1>
                <span
                  className={`inline-flex min-h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-black uppercase ${
                    hasChanges
                      ? "bg-tomato/10 text-tomato"
                      : "bg-ocean/10 text-ocean"
                  }`}
                >
                  <Icon name={hasChanges ? "PencilLine" : "Check"} className="h-3.5 w-3.5" />
                  {hasChanges ? "Unsaved" : "Saved"}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-charcoal/60">
                Refine copy, layout, hours, posters, and store status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-charcoal/15 bg-white px-4 text-base font-bold text-charcoal transition hover:border-ocean hover:text-ocean"
            >
              <Icon name="ExternalLink" className="h-4 w-4" />
              View Site
            </a>
            <button
              type="button"
              onClick={() => saveContent()}
              disabled={!content || saving || !hasChanges}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tomato px-4 text-base font-bold text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Icon name="Save" className="h-4 w-4" />
              {saving ? "Saving" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <nav className="grid gap-2" aria-label="Admin panels">
            {panels.map((panel) => {
              const active = activePanel === panel.id;

              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-md border px-4 text-left text-base font-black transition ${
                    active
                      ? "border-ocean bg-ocean text-white"
                      : "border-charcoal/10 bg-white text-charcoal hover:border-ocean"
                  }`}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Icon name={panel.icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{panel.label}</span>
                  </span>
                  {panel.id === "content" ? (
                    <span className={active ? "text-white/75" : "text-charcoal/45"}>
                      {contentStats.items}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="rounded-md border border-charcoal/10 bg-white p-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Items", contentStats.items, "PanelsTopLeft"],
                ["Images", contentStats.images, "Image"],
                ["Missing", contentStats.missingImages, "ImageOff"],
                ["Hidden", contentStats.hiddenSections, "EyeOff"]
              ].map(([label, value, icon]) => (
                <div key={label} className="border-b border-charcoal/10 pb-3 last:border-b-0">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-charcoal/50">
                    <Icon name={icon} className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  <p className="mt-1 text-2xl font-black leading-none text-charcoal">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-charcoal/10 bg-white p-4">
            {requiresPin ? (
              <Field label="Admin PIN" value={pin} onChange={setPin} />
            ) : (
              <div className="flex items-start gap-2 text-sm font-bold leading-relaxed text-charcoal/65">
                <Icon name="ShieldCheck" className="mt-0.5 h-5 w-5 shrink-0 text-ocean" />
                <span>Local editing is enabled. Add ADMIN_PIN before publishing.</span>
              </div>
            )}
            <button
              type="button"
              onClick={resetDefaults}
              disabled={!defaults}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-charcoal/15 bg-ivory px-3 text-sm font-black uppercase text-charcoal transition hover:border-tomato hover:text-tomato disabled:opacity-55"
            >
              <Icon name="RotateCcw" className="h-4 w-4" />
              Load Defaults
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          {error ? (
            <StatusMessage type="error">{error}</StatusMessage>
          ) : null}
          {status ? (
            <StatusMessage>{status}</StatusMessage>
          ) : null}

          {!content ? (
            <div className="rounded-md border border-charcoal/10 bg-white p-8 text-center text-lg font-bold text-charcoal/65">
              Loading command center...
            </div>
          ) : null}

          {content && activePanel === "content" ? (
            <div>
              <div className="mb-5 grid gap-2 sm:grid-cols-3">
                {collections.map((collection) => {
                  const active = activeCollection === collection.id;

                  return (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => setActiveCollection(collection.id)}
                      className={`flex min-h-12 items-center justify-between rounded-md border px-4 text-left text-base font-black transition ${
                        active
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-charcoal/10 bg-white text-charcoal hover:border-ocean"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon name={collection.icon} className="h-4 w-4" />
                        {collection.label}
                      </span>
                      <span className={active ? "text-white/75" : "text-charcoal/45"}>
                        {content[collection.id]?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase text-ocean">
                    {activeCollectionMeta?.label}
                  </p>
                  <h2 className="text-3xl font-black leading-tight">
                    Edit Website Content
                  </h2>
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(220px,320px)_auto]">
                  <label className="relative block">
                    <span className="sr-only">Search content</span>
                    <Icon
                      name="Search"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45"
                    />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={`Search ${activeCollectionMeta?.label || "items"}`}
                      className="min-h-11 w-full rounded-md border border-charcoal/15 bg-white py-2 pl-9 pr-3 text-base font-bold text-charcoal outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => addItem(activeCollection)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-charcoal px-4 text-base font-bold text-white transition hover:bg-ocean"
                  >
                    <Icon name="Plus" className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {!activeEntries.length ? (
                  <div className="rounded-md border border-charcoal/10 bg-white p-8 text-center text-base font-bold text-charcoal/60">
                    No matching items.
                  </div>
                ) : null}
                {activeEntries.map(({ item, index }) => (
                  <article
                    key={`${activeCollection}-${index}`}
                    className="rounded-md border border-charcoal/10 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase text-charcoal/45">
                          Item {index + 1}
                        </p>
                        <h3 className="truncate text-xl font-black leading-tight">
                          {itemTitle(item, index)}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <IconButton
                          icon="ArrowUp"
                          label="Move item up"
                          onClick={() => moveItem(activeCollection, index, -1)}
                          disabled={index === 0}
                        />
                        <IconButton
                          icon="ArrowDown"
                          label="Move item down"
                          onClick={() => moveItem(activeCollection, index, 1)}
                          disabled={index === (content[activeCollection]?.length || 1) - 1}
                        />
                        <IconButton
                          icon="CopyPlus"
                          label="Duplicate item"
                          onClick={() => duplicateItem(activeCollection, index)}
                        />
                        <IconButton
                          icon="Trash2"
                          label="Remove item"
                          onClick={() => removeItem(activeCollection, index)}
                          tone="danger"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {fieldGroups[activeCollection].map(([key, label, type]) => (
                        <div
                          key={key}
                          className={
                            ["textarea", "image", "tags", "options"].includes(type)
                              ? "md:col-span-2"
                              : ""
                          }
                        >
                          {type === "image" ? (
                            <ImageUploader
                              label={label}
                              value={item[key]}
                              pin={pin}
                              onError={setError}
                              onStatus={setStatus}
                              onUploaded={(url) => {
                                updateItem(activeCollection, index, key, url);
                              }}
                            />
                          ) : type === "select" ? (
                            <SelectField
                              label={label}
                              value={item[key]}
                              options={fieldGroups[activeCollection].find((field) => field[0] === key)?.[3] || []}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          ) : type === "number" ? (
                            <NumberField
                              label={label}
                              value={item[key]}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          ) : type === "toggle" ? (
                            <ToggleField
                              label={label}
                              checked={Boolean(item[key])}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          ) : type === "tags" ? (
                            <TagsField
                              label={label}
                              value={item[key]}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          ) : type === "options" ? (
                            <MenuOptionsEditor
                              label={label}
                              value={item[key]}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          ) : (
                            <Field
                              label={label}
                              value={item[key]}
                              multiline={type === "textarea"}
                              onChange={(value) => updateItem(activeCollection, index, key, value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {content && activePanel === "layout" ? (
            <div>
              <div className="mb-5">
                <p className="text-sm font-black uppercase text-ocean">Refine</p>
                <h2 className="text-3xl font-black leading-tight">
                  Control The Homepage Feel
                </h2>
              </div>

              <div className="grid gap-4">
                <article className="rounded-md border border-charcoal/10 bg-white p-4 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs font-black uppercase text-charcoal/45">Hero</p>
                    <h3 className="text-xl font-black leading-tight">Main Welcome Copy</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Homepage headline"
                      value={content.hero?.headline}
                      onChange={(value) => updateHero("headline", value)}
                    />
                    <Field
                      label="Small section label"
                      value={content.hero?.tabKicker}
                      onChange={(value) => updateHero("tabKicker", value)}
                    />
                    <div className="md:col-span-2">
                      <Field
                        label="Homepage description"
                        value={content.hero?.subheadline}
                        multiline
                        onChange={(value) => updateHero("subheadline", value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Field
                        label="Homepage quote"
                        value={content.hero?.tabHeadline}
                        onChange={(value) => updateHero("tabHeadline", value)}
                      />
                    </div>
                  </div>
                </article>

                <article className="rounded-md border border-charcoal/10 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-charcoal/45">Layout</p>
                      <h3 className="text-xl font-black leading-tight">Structure And Visibility</h3>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {layoutPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyLayoutPreset(preset.values)}
                          className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-charcoal/10 bg-ivory px-4 text-sm font-black uppercase text-charcoal transition hover:border-ocean hover:text-ocean"
                        >
                          <Icon name={preset.icon} className="h-4 w-4" />
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {layoutOptions.map((option) => {
                      if (Array.isArray(option)) {
                        const [key, label] = option;
                        return (
                          <ToggleField
                            key={key}
                            label={label}
                            checked={Boolean(content.layout?.[key])}
                            onChange={(value) => updateLayout(key, value)}
                          />
                        );
                      }

                      return (
                        <div
                          key={option.key}
                          className="rounded-md border border-charcoal/10 bg-ivory p-4"
                        >
                          <SelectField
                            label={option.label}
                            value={content.layout?.[option.key]}
                            options={option.options}
                            onChange={(value) => updateLayout(option.key, value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-md border border-ocean/20 bg-ocean/5 p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Flame" className="mt-1 h-5 w-5 shrink-0 text-ocean" />
                    <div>
                      <h3 className="text-xl font-black leading-tight">Hot Deals Posters</h3>
                      <p className="mt-1 text-base font-semibold leading-relaxed text-charcoal/65">
                        Header Hot Deals uses the posters in Content &gt; Hot Deal Posters.
                        Upload ready-made deal artwork there, then save to publish it.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ) : null}

          {content && activePanel === "hours" ? (
            <div>
              <div className="mb-5">
                <p className="text-sm font-black uppercase text-ocean">Hours</p>
                <h2 className="text-3xl font-black leading-tight">
                  Store Status And Timings
                </h2>
              </div>

              <div className="grid gap-4">
                <article className="rounded-md border border-charcoal/10 bg-white p-4 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs font-black uppercase text-charcoal/45">Live Badge</p>
                    <h3 className="text-xl font-black leading-tight">Open Or Closed Control</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <SelectField
                        label="Store status mode"
                        value={content.storeStatus?.mode || "auto"}
                        options={[
                          ["auto", "Automatic from weekly hours"],
                          ["open", "Force open"],
                          ["closed", "Force closed"]
                        ]}
                        onChange={(value) => updateStoreStatus("mode", value)}
                      />
                    </div>
                    <Field
                      label="Open badge text"
                      value={content.storeStatus?.openLabel}
                      onChange={(value) => updateStoreStatus("openLabel", value)}
                    />
                    <Field
                      label="Open detail"
                      value={content.storeStatus?.openDetail}
                      onChange={(value) => updateStoreStatus("openDetail", value)}
                    />
                    <Field
                      label="Closed badge text"
                      value={content.storeStatus?.closedLabel}
                      onChange={(value) => updateStoreStatus("closedLabel", value)}
                    />
                    <Field
                      label="Closed detail"
                      value={content.storeStatus?.closedDetail}
                      onChange={(value) => updateStoreStatus("closedDetail", value)}
                    />
                  </div>
                </article>

                <article className="rounded-md border border-charcoal/10 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex flex-col gap-1">
                    <p className="text-xs font-black uppercase text-charcoal/45">Weekly Hours</p>
                    <h3 className="text-xl font-black leading-tight">Change Opening Timings</h3>
                    <p className="text-sm font-bold text-charcoal/55">
                      Use 24-hour time like 11:00, 22:00, or 24:00 for midnight closing.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {(content.weeklyHours || []).map((row) => (
                      <div
                        key={row.id}
                        className="grid gap-3 rounded-md border border-charcoal/10 bg-ivory p-3 md:grid-cols-[150px_1fr_1fr_150px] md:items-end"
                      >
                        <div>
                          <p className="text-xs font-black uppercase text-charcoal/45">
                            Day
                          </p>
                          <p className="mt-1 text-lg font-black text-charcoal">{row.day}</p>
                        </div>
                        <Field
                          label="Open"
                          value={row.open}
                          placeholder="11:00"
                          onChange={(value) => updateHour(row.id, "open", value)}
                        />
                        <Field
                          label="Close"
                          value={row.close}
                          placeholder="22:00"
                          onChange={(value) => updateHour(row.id, "close", value)}
                        />
                        <ToggleField
                          label="Closed"
                          checked={Boolean(row.closed)}
                          onChange={(value) => updateHour(row.id, "closed", value)}
                        />
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          ) : null}

          {content && activePanel === "ai" ? (
            <div>
              <div className="mb-5">
                <p className="text-sm font-black uppercase text-ocean">AI Control</p>
                <h2 className="text-3xl font-black leading-tight">
                  Ask AI To Edit The Draft
                </h2>
              </div>

              <div className="rounded-md border border-charcoal/10 bg-white p-4">
                <Field
                  label="Instruction"
                  value={aiInstruction}
                  multiline
                  placeholder="Example: make the weekend offer stronger and tighten the homepage copy."
                  onChange={setAiInstruction}
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold text-charcoal/45">
                    {aiInstruction.trim().length}/1600
                  </p>
                  <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => runAi()}
                    disabled={aiLoading || !aiInstruction.trim()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tomato px-4 text-base font-bold text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    <Icon name="WandSparkles" className="h-4 w-4" />
                    {aiLoading ? "Applying" : "Apply AI Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runAi("Review all editable content and layout settings. Fix mistakes, missing fields, weak copy, and unsafe layout choices.")
                    }
                    disabled={aiLoading}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-charcoal/15 bg-ivory px-4 text-base font-bold text-charcoal transition hover:border-ocean hover:text-ocean disabled:opacity-55"
                  >
                    <Icon name="ShieldCheck" className="h-4 w-4" />
                    Auto-Fix Draft
                  </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {aiPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAiInstruction(preset);
                      runAi(preset);
                    }}
                    disabled={aiLoading}
                    className="rounded-md border border-charcoal/10 bg-white p-4 text-left text-base font-bold leading-snug text-charcoal transition hover:border-ocean hover:text-ocean disabled:opacity-55"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {aiReport ? (
                <div className="mt-4 rounded-md border border-ocean/20 bg-white p-4">
                  <h3 className="text-xl font-black">AI Report</h3>
                  <p className="mt-2 text-base font-semibold leading-relaxed text-charcoal/70">
                    {aiReport.summary}
                  </p>
                  {aiReport.checks?.length ? (
                    <ul className="mt-3 grid gap-2">
                      {aiReport.checks.map((check) => (
                        <li key={check} className="flex gap-2 text-base font-bold text-charcoal/70">
                          <Icon name="CheckCircle2" className="mt-0.5 h-5 w-5 shrink-0 text-ocean" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
