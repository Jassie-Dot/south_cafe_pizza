import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://southpizza.ca"),
  title: {
    default: "South Pizza | Fresh Pizza by the Beach in Port Elgin",
    template: "%s | South Pizza"
  },
  description:
    "South Pizza in Port Elgin serves freshly baked pizza, sides, drinks, and beach-side cafe comfort at 1110 Goderich St Unit D2/3.",
  keywords: [
    "South Pizza",
    "Port Elgin pizza",
    "beach pizza",
    "Port Elgin restaurant",
    "pizza delivery Port Elgin",
    "pizza near Lake Huron"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "South Pizza | Fresh Pizza by the Beach",
    description:
      "Handcrafted pizza, warm service, and a relaxed beach-side cafe feel in Port Elgin.",
    url: "https://southpizza.ca/",
    siteName: "South Pizza",
    images: [
      {
        url: "/south-pizza-logo.png",
        width: 1200,
        height: 1200,
        alt: "South Pizza stone baked pizza logo"
      }
    ],
    locale: "en_CA",
    type: "website"
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#216e82"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  );
}
