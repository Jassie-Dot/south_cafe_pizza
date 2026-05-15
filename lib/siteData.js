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
  { label: "About", href: "#about" },
  { label: "Specials", href: "#specials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" }
];

export const heroStats = [
  { label: "Open 7 days", value: "11 AM daily" },
  { label: "Pizza from", value: "$11.99" },
  { label: "Beach town stop", value: "Port Elgin" }
];

export const ordering = {
  currency: "CAD",
  taxRate: 0.13,
  deliveryFee: 4.99,
  minimumDeliverySubtotal: 18,
  pickupTimes: ["ASAP", "20 min", "30 min", "45 min", "60 min"]
};

export const menuCategories = [
  { id: "all", label: "All", helper: "Everything" },
  { id: "pizza", label: "Pizza", helper: "22 items" },
  { id: "sides", label: "Sides", helper: "15 items" },
  { id: "drinks", label: "Drinks", helper: "18 items" },
  { id: "cafe", label: "Cafe", helper: "Coffee" },
  { id: "dessert", label: "Dessert", helper: "Ice cream" }
];

export const orderCategoryTiles = [
  {
    label: "Customize",
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Meat",
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Veggie",
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Vegan",
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Gluten Free",
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Sides",
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Drinks",
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=700&q=82"
  },
  {
    label: "Desserts",
    category: "dessert",
    image:
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=700&q=82"
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
    description:
      "Start with South Pizza dough, sauce, and cheese, then build it your way.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82",
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
    description:
      "A warm, creamy favourite with sweet corn, mozzarella, and a golden bake.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=82",
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
    description:
      "Paneer tikka flavour layered over a classic pizza base for a bold finish.",
    image:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=900&q=82",
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
    description:
      "Tender chicken tikka notes, melted cheese, and a freshly baked crust.",
    image:
      "https://images.unsplash.com/photo-1601924582975-7e67e3f6f655?auto=format&fit=crop&w=900&q=82",
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
    description:
      "A simple favourite with pepperoni, cheese, and South Pizza sauce.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=82",
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
    description:
      "A gluten-free option for guests who still want a fresh pizza night.",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=82",
    alt: "Vegetable pizza on a light table"
  },
  {
    category: "sides",
    name: "Paneer Tikka",
    price: "$13.99",
    priceValue: 13.99,
    options: [{ label: "12 pcs", price: 13.99 }],
    badge: "12 pcs",
    description:
      "A shareable paneer side with warm spices and a cafe-table finish.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=82",
    alt: "Paneer tikka served with onion and herbs"
  },
  {
    category: "sides",
    name: "Jalapeno Poppers",
    price: "$13.99",
    priceValue: 13.99,
    options: [{ label: "8 pcs", price: 13.99 }],
    badge: "8 pcs",
    description:
      "Crisp, warm poppers with enough kick for a beach-day snack.",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=82",
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
    description:
      "Buttery garlic bread, baked hot and simple for the whole table.",
    image:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=900&q=82",
    alt: "Garlic bread slices with herbs"
  },
  {
    category: "sides",
    name: "Samosas",
    price: "$5.00",
    priceValue: 5,
    options: [{ label: "2 pcs", price: 5 }],
    badge: "2 pcs",
    description:
      "A crisp, comforting side that pairs well with pizza and cold drinks.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82",
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
    description:
      "Hot fries for sharing, carrying out, or adding to a combo.",
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=82",
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
    description:
      "Regular or Diet Coca Cola for family pizza nights and takeout.",
    image:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=82",
    alt: "Cold cola bottles"
  },
  {
    category: "drinks",
    name: "Sprite",
    price: "$2.99",
    priceValue: 2.99,
    options: [{ label: "500 ml", price: 2.99 }],
    badge: "500 ml",
    description:
      "A bright, cold drink for slices on the go.",
    image:
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=82",
    alt: "Cold lemon lime soda with ice"
  },
  {
    category: "drinks",
    name: "Orange Vitamin Water",
    price: "$3.99",
    priceValue: 3.99,
    options: [{ label: "591 ml", price: 3.99 }],
    badge: "591 ml",
    description:
      "A lighter refreshment after the beach, a walk, or a late lunch.",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=82",
    alt: "Orange drink bottle near fruit"
  },
  {
    category: "cafe",
    name: "Fresh Coffee",
    price: "In store",
    priceValue: null,
    orderable: false,
    badge: "Cafe counter",
    description:
      "Simple hot coffee for slow mornings, errands, and relaxed visits.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82",
    alt: "Fresh coffee being poured at a cafe"
  },
  {
    category: "dessert",
    name: "Scoop Ice Cream",
    price: "In store",
    priceValue: null,
    orderable: false,
    badge: "Seasonal",
    description:
      "A cool beach-town dessert for kids, families, and summer evenings.",
    image:
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=900&q=82",
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
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=82",
    alt: "Fresh pizza served on a warm restaurant table",
    title: "Handcrafted pizza"
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    alt: "Sunny beach shoreline near blue water",
    title: "Beach-side mood"
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=82",
    alt: "Warm cafe interior with wood tables",
    title: "Cafe warmth"
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=82",
    alt: "Coffee prepared at a cafe counter",
    title: "Fresh coffee"
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=82",
    alt: "Friends enjoying food at a restaurant table",
    title: "Friendly visits"
  },
  {
    src: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=1200&q=82",
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
