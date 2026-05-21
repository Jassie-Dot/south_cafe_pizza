export const contact = {
  name: "South Pizza",
  tagline: "Authentic Flavours, Freshly Baked Every Day",
  phoneDisplay: "+1 (519) 832-5008",
  phoneHref: "tel:+15198325008",
  email: "southpizza2025@gmail.com",
  address: "1110 Goderich St Unit D2/3, Port Elgin, ON N0H 2C3",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=1110%20Goderich%20St%20Unit%20D2%2F3%2C%20Port%20Elgin%2C%20ON%20N0H%202C3",
  mapEmbed:
    "https://www.google.com/maps?q=1110%20Goderich%20St%20Unit%20D2%2F3%2C%20Port%20Elgin%2C%20ON%20N0H%202C3&output=embed",
  orderUrl: "https://southpizza.ca/",
  doorDashUrl:
    "https://www.doordash.com/en-CA/store/south-pizza-port-elgin-40829957/",
  reviewUrl:
    "https://www.google.com/search?q=South+Pizza+1110+Goderich+St+Port+Elgin+reviews",
  instagramUrl: "https://www.instagram.com/explore/search/keyword/?q=south%20pizza%20port%20elgin"
};

export const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Specials", href: "#specials" },
  { label: "Story", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
  { label: "Admin", href: "/admin" }
];

export const ordering = {
  currency: "CAD",
  taxRate: 0.13,
  deliveryFee: 4.99,
  minimumDeliverySubtotal: 18,
  pickupTimes: ["ASAP", "20 min", "30 min", "45 min", "60 min"]
};

export const heroContent = {
  headline: "South Pizza in Port Elgin",
  subheadline:
    "Stone-baked pizzas, Indian-inspired favourites, sides, ice cream, and cold drinks for beach days, family takeout, and easy local dinners.",
  tabKicker: "Order, browse, or plan your visit",
  tabHeadline: "Everything you need, right where you need it."
};

export const storeStatusSettings = {
  mode: "auto",
  openLabel: "Open now",
  openDetail: "Taking orders today",
  closedLabel: "Closed now",
  closedDetail: "Please check today's hours"
};

export const weeklyHours = [
  { id: "Sun", day: "Sunday", shortDay: "Sun", open: "11:00", close: "22:00", closed: false },
  { id: "Mon", day: "Monday", shortDay: "Mon", open: "11:00", close: "22:00", closed: false },
  { id: "Tue", day: "Tuesday", shortDay: "Tue", open: "11:00", close: "22:00", closed: false },
  { id: "Wed", day: "Wednesday", shortDay: "Wed", open: "11:00", close: "22:00", closed: false },
  { id: "Thu", day: "Thursday", shortDay: "Thu", open: "11:00", close: "23:00", closed: false },
  { id: "Fri", day: "Friday", shortDay: "Fri", open: "11:00", close: "24:00", closed: false },
  { id: "Sat", day: "Saturday", shortDay: "Sat", open: "11:00", close: "24:00", closed: false }
];

export const layoutSettings = {
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
};

export const topDeals = [
  {
    eyebrow: "Top Deal",
    title: "Beach Day Pizza Combo",
    price: "From $24.99",
    description:
      "A customer-friendly combo with a hot pizza, garlic bread, and cold drinks for an easy beach-day meal.",
    image:
      "/uploads/south-pizza-photo-01.jpg"
  },
  {
    eyebrow: "Family Favourite",
    title: "Family Takeout Night",
    price: "Order Online",
    description:
      "Build a larger order with pizza, fries, sides, and a 2L drink for the whole table.",
    image:
      "/uploads/south-pizza-photo-02.jpg"
  },
  {
    eyebrow: "Lunch Pick",
    title: "Quick Slice & Drink",
    price: "Ask Today",
    description:
      "A simple lunch stop for locals, seniors, and visitors who want clear choices and fast service.",
    image:
      "/uploads/south-pizza-photo-03.jpg"
  }
];

export const menuCategories = [
  { id: "all", label: "All", helper: "Everything" },
  { id: "pizza", label: "Pizza", helper: "22 items" },
  { id: "sides", label: "Sides", helper: "15 items" },
  { id: "drinks", label: "Drinks", helper: "18 items" },
  { id: "cafe", label: "Cafe", helper: "Coffee" },
  { id: "dessert", label: "Dessert", helper: "Ice cream" }
];

export const customizationOptions = [
  "Extra cheese",
  "Light cheese",
  "Well done",
  "Extra sauce",
  "No onions",
  "Spicy finish"
];

export const orderCategoryTiles = [
  {
    id: "customize",
    label: "Customize",
    heading: "Build Your Own Pizza",
    category: "pizza",
    filter: "customize",
    image:
      "/uploads/south-pizza-photo-04.jpg"
  },
  {
    id: "meat",
    label: "Meat",
    heading: "Meat Pizza Picks",
    category: "pizza",
    filter: "meat",
    image:
      "/uploads/south-pizza-photo-05.jpg"
  },
  {
    id: "veggie",
    label: "Veggie",
    heading: "Veggie Pizza Picks",
    category: "pizza",
    filter: "veggie",
    image:
      "/uploads/south-pizza-photo-06.jpg"
  },
  {
    id: "vegan",
    label: "Vegan",
    heading: "Vegan Friendly Picks",
    category: "pizza",
    filter: "vegan",
    image:
      "/uploads/south-pizza-photo-07.jpg"
  },
  {
    id: "gluten-free",
    label: "Gluten Free",
    heading: "Gluten Free & Cauliflower",
    category: "pizza",
    filter: "gluten-free",
    image:
      "/uploads/south-pizza-photo-08.jpg"
  },
  {
    id: "sides",
    label: "Sides",
    heading: "Sides & Shareables",
    category: "sides",
    image:
      "/uploads/south-pizza-photo-09.jpg"
  },
  {
    id: "drinks",
    label: "Drinks",
    heading: "Cold Drinks",
    category: "drinks",
    image:
      "/uploads/south-pizza-photo-10.jpg"
  },
  {
    id: "desserts",
    label: "Desserts",
    heading: "Desserts & Ice Cream",
    category: "dessert",
    image:
      "/uploads/south-pizza-photo-11.jpg"
  }
];

export const menuItems = [
  {
    category: "pizza",
    name: "Create Your Own Pizza",
    price: "$11.99",
    priceValue: 11.99,
    options: [
      { label: "Medium (8 slices)", price: 11.99 },
      { label: "Large (10 slices)", price: 16.99 },
      { label: "XLarge (12 slices)", price: 22.99 },
      { label: "Party (24 slices)", price: 31.99 }
    ],
    badge: "Top selling",
    groups: ["customize", "veggie"],
    description:
      "Start with South Pizza dough, sauce, and cheese, then build it your way.",
    image:
      "/uploads/south-pizza-photo-12.jpg",
    alt: "Fresh cheese pizza with herbs on a table"
  },
  {
    category: "pizza",
    name: "Corn Cheese Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "Vegetarian",
    groups: ["veggie"],
    description:
      "A warm, creamy favourite with sweet corn, mozzarella, and a golden bake.",
    image:
      "/uploads/south-pizza-photo-13.jpg",
    alt: "Handmade pizza with melted cheese and vegetables"
  },
  {
    category: "pizza",
    name: "Paneer Tikka Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "House style",
    groups: ["veggie"],
    description:
      "Paneer tikka flavour layered over a classic pizza base for a bold finish.",
    image:
      "/uploads/south-pizza-photo-14.jpg",
    alt: "Pizza topped with colourful vegetables and herbs"
  },
  {
    category: "pizza",
    name: "Chicken Tikka Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "Top rated",
    groups: ["meat"],
    description:
      "Tender chicken tikka notes, melted cheese, and a freshly baked crust.",
    image:
      "/uploads/south-pizza-photo-15.jpg",
    alt: "Chicken pizza sliced on a wooden board"
  },
  {
    category: "pizza",
    name: "Pepperoni Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "Classic",
    groups: ["meat"],
    description:
      "A simple favourite with pepperoni, cheese, and South Pizza sauce.",
    image:
      "/uploads/south-pizza-photo-16.jpg",
    alt: "Pepperoni pizza with crisp edges"
  },
  {
    category: "pizza",
    name: "Gluten Free Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Gluten Free Small (6 slices)", price: 14.99 },
      { label: "Gluten Free Medium (8 slices)", price: 18.99 },
      { label: "Cauliflower Small (6 slices)", price: 16.99 },
      { label: "Cauliflower Medium (8 slices)", price: 20.99 }
    ],
    badge: "Special",
    groups: ["gluten-free", "veggie"],
    description:
      "A gluten-free option for guests who still want a fresh pizza night.",
    image:
      "/uploads/south-pizza-photo-17.jpg",
    alt: "Vegetable pizza on a light table"
  },
  {
    category: "pizza",
    name: "Vegan Garden Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "Vegan",
    groups: ["vegan", "veggie"],
    description:
      "Fresh vegetables, tomato sauce, and a dairy-free cheese option for a lighter pizza night.",
    image:
      "/uploads/south-pizza-photo-18.jpg",
    alt: "Vegan pizza with vegetables"
  },
  {
    category: "pizza",
    name: "Margherita Pizza",
    price: "$14.99",
    priceValue: 14.99,
    options: [
      { label: "Medium (8 slices)", price: 14.99 },
      { label: "Large (10 slices)", price: 19.99 },
      { label: "XLarge (12 slices)", price: 24.99 },
      { label: "Party (24 slices)", price: 32.99 }
    ],
    badge: "Fresh basil",
    groups: ["veggie"],
    description:
      "A clean classic with tomato sauce, mozzarella, basil, and a golden stone-baked finish.",
    image:
      "/uploads/south-pizza-photo-19.jpg",
    alt: "Margherita pizza with basil"
  },
  {
    category: "sides",
    name: "Paneer Tikka",
    price: "$13.99",
    priceValue: 13.99,
    options: [{ label: "12 pcs", price: 13.99 }],
    badge: "12 pcs",
    groups: ["sides"],
    description:
      "A shareable paneer side with warm spices and a cafe-table finish.",
    image:
      "/uploads/south-pizza-photo-20.jpg",
    alt: "Paneer tikka served with onion and herbs"
  },
  {
    category: "sides",
    name: "Jalapeno Poppers",
    price: "$13.99",
    priceValue: 13.99,
    options: [{ label: "8 pcs", price: 13.99 }],
    badge: "8 pcs",
    groups: ["sides"],
    description:
      "Crisp, warm poppers with enough kick for a beach-day snack.",
    image:
      "/uploads/south-pizza-photo-21.jpg",
    alt: "Golden fried side dish with dipping sauce"
  },
  {
    category: "sides",
    name: "Garlic Bread",
    price: "$2.49 - $4.49",
    priceValue: 2.49,
    options: [
      { label: "Regular", price: 2.49 },
      { label: "Cheese", price: 4.49 }
    ],
    badge: "Easy add-on",
    groups: ["sides"],
    description:
      "Buttery garlic bread, baked hot and simple for the whole table.",
    image:
      "/uploads/south-pizza-photo-22.jpg",
    alt: "Garlic bread slices with herbs"
  },
  {
    category: "sides",
    name: "Samosas",
    price: "$5.00",
    priceValue: 5,
    options: [{ label: "2 pcs", price: 5 }],
    badge: "2 pcs",
    groups: ["sides"],
    description:
      "A crisp, comforting side that pairs well with pizza and cold drinks.",
    image:
      "/uploads/south-pizza-photo-22.jpg",
    alt: "Crisp samosas on a plate"
  },
  {
    category: "sides",
    name: "Fries",
    price: "$4.89 - $6.99",
    priceValue: 4.89,
    options: [
      { label: "Regular", price: 4.89 },
      { label: "Large", price: 6.99 }
    ],
    badge: "Beach snack",
    groups: ["sides"],
    description:
      "Hot fries for sharing, carrying out, or adding to a combo.",
    image:
      "/uploads/south-pizza-photo-23.jpg",
    alt: "Basket of hot fries"
  },
  {
    category: "drinks",
    name: "Coca Cola Pop",
    price: "$5.99",
    priceValue: 5.99,
    options: [
      { label: "Regular 2L", price: 5.99 },
      { label: "Diet 2L", price: 5.99 }
    ],
    badge: "2L",
    groups: ["drinks"],
    description:
      "Regular or Diet Coca Cola for family pizza nights and takeout.",
    image:
      "/uploads/south-pizza-photo-24.jpg",
    alt: "Cold cola bottles"
  },
  {
    category: "drinks",
    name: "Sprite",
    price: "$2.99",
    priceValue: 2.99,
    options: [{ label: "500 ml", price: 2.99 }],
    badge: "500 ml",
    groups: ["drinks"],
    description:
      "A bright, cold drink for slices on the go.",
    image:
      "/uploads/south-pizza-photo-25.jpg",
    alt: "Cold lemon lime soda with ice"
  },
  {
    category: "drinks",
    name: "Orange Vitamin Water",
    price: "$3.99",
    priceValue: 3.99,
    options: [{ label: "591 ml", price: 3.99 }],
    badge: "591 ml",
    groups: ["drinks"],
    description:
      "A lighter refreshment after the beach, a walk, or a late lunch.",
    image:
      "/uploads/south-pizza-photo-26.jpg",
    alt: "Orange drink bottle near fruit"
  },
  {
    category: "cafe",
    name: "Fresh Coffee",
    price: "In store",
    priceValue: null,
    orderable: false,
    badge: "Cafe counter",
    groups: ["cafe"],
    description:
      "Simple hot coffee for slow mornings, errands, and relaxed visits.",
    image:
      "/uploads/south-pizza-photo-27.jpg",
    alt: "Fresh coffee being poured at a cafe"
  },
  {
    category: "dessert",
    name: "Scoop Ice Cream",
    price: "In store",
    priceValue: null,
    orderable: false,
    badge: "Seasonal",
    groups: ["desserts"],
    description:
      "A cool beach-town dessert for kids, families, and summer evenings.",
    image:
      "/uploads/south-pizza-photo-28.jpg",
    alt: "Colourful scoops of ice cream"
  }
];

export const specials = [
  {
    title: "Daily Pizza Feature",
    price: "from $14.99",
    description:
      "Rotating house pizzas such as Tandoori Paneer, Spicy Butter Paneer, Greek, and Margherita.",
    tag: "Daily"
  },
  {
    title: "Beach Lunch Combo",
    price: "Ask today",
    description:
      "A quick lunch pairing with a hot slice, a simple side, and a cold drink.",
    tag: "Lunch"
  },
  {
    title: "Senior-Friendly Deal",
    price: "Ask in store",
    description:
      "Easy portions, clear pricing, and staff help for guests who prefer a simple order.",
    tag: "Community"
  },
  {
    title: "Family Takeout Night",
    price: "Order online",
    description:
      "Build a larger order with pizza, garlic bread, fries, and 2L drinks.",
    tag: "Takeout"
  }
];

export const galleryImages = [
  {
    src: "/uploads/south-pizza-photo-29.jpg",
    alt: "Fresh pizza served on a warm restaurant table",
    title: "Handcrafted pizza"
  },
  {
    src: "/uploads/south-pizza-photo-30.jpg",
    alt: "Sunny beach shoreline near blue water",
    title: "Beach-side mood"
  },
  {
    src: "/uploads/south-pizza-photo-31.jpg",
    alt: "Warm cafe interior with wood tables",
    title: "Cafe warmth"
  },
  {
    src: "/uploads/south-pizza-photo-32.jpg",
    alt: "Coffee prepared at a cafe counter",
    title: "Fresh coffee"
  },
  {
    src: "/uploads/south-pizza-photo-33.jpg",
    alt: "Friends enjoying food at a restaurant table",
    title: "Friendly visits"
  },
  {
    src: "/uploads/south-pizza-photo-34.jpg",
    alt: "Ice cream scoops for dessert",
    title: "Summer dessert"
  }
];

export const testimonials = [
  {
    name: "Local Guest",
    initials: "LG",
    quote:
      "The pizza is hot, fresh, and easy to order. It feels like the right stop after a walk by the water.",
    detail: "Takeout visit"
  },
  {
    name: "Beach Visitor",
    initials: "BV",
    quote:
      "Friendly service, clear menu choices, and a relaxed cafe feel. The garlic bread is a simple favourite.",
    detail: "Family lunch"
  },
  {
    name: "Port Elgin Neighbour",
    initials: "PN",
    quote:
      "A welcoming place for a quick dinner. Good portions, good flavour, and the staff make ordering comfortable.",
    detail: "Dinner pickup"
  }
];

export const hours = [
  { day: "Sun - Wed", time: "11:00 AM - 10:00 PM" },
  { day: "Thursday", time: "11:00 AM - 11:00 PM" },
  { day: "Fri - Sat", time: "11:00 AM - 12:00 AM" }
];

export const experienceHighlights = [
  {
    title: "Beach-day easy",
    description:
      "A relaxed place for locals, families, and visitors to get a hot meal before or after the shoreline."
  },
  {
    title: "Fresh and familiar",
    description:
      "Handmade pizza choices, vegetarian favourites, classic pepperoni, sides, cold drinks, and cafe comfort."
  },
  {
    title: "Clear for everyone",
    description:
      "Large menu sections, simple calls to action, and staff-friendly ordering for guests who prefer less fuss."
  }
];

export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "South Pizza",
  url: "https://southpizza.ca/",
  telephone: "+15198325008",
  email: contact.email,
  image:
    "https://southpizza.ca/south-pizza-logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1110 Goderich St Unit D2/3",
    addressLocality: "Port Elgin",
    addressRegion: "ON",
    postalCode: "N0H 2C3",
    addressCountry: "CA"
  },
  servesCuisine: ["Pizza", "Cafe", "Sides", "Beverages"],
  priceRange: "$$",
  menu: "https://southpizza.ca/",
  acceptsReservations: "True",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday"],
      opens: "11:00",
      closes: "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: "11:00",
      closes: "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "11:00",
      closes: "23:59"
    }
  ],
  sameAs: [contact.doorDashUrl, contact.instagramUrl]
};
