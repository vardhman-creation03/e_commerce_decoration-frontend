import HomePage from "../components/home-client";

// SEO Metadata for the Homepage
export const metadata = {
  title: "Vardhman Decoration | Premium Party & Event Decorations",
  description:
    "Discover decorations for birthdays, anniversaries, baby showers, and more at Vardhman Decoration. Shop high-quality with fast delivery across India.",
  keywords: [
    "party decorations",
    "event decor",
    "birthday decorations",
    "anniversary decorations",
    "baby shower decor",
    "foil balloons",
    "balloon decorations",
    "baby shower decorations",
    "premium decor",
    "eco-friendly decorations",
    "party supplies",
    "trending decorations",
    "home decor",
    "wedding decorations",
    "festive decorations",
    "themed decorations",
    "event planning",
    "celebration decor",
    "decorative items",
    "festive decor",
    "party planning",
    "event supplies",
    "decorations online",
    "premium party supplies",
    "home decoration",
    "shop online",
    "Vardhman Decoration",
  ].join(", "),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/",
  },
  openGraph: {
    title: "Vardhman Decoration | Premium Party & Event Decorations",
    description:
      "Explore premium decorations for all your celebrations at Vardhman Decoration. High-quality, eco-friendly decor delivered to your door.",
    url: "https://www.thevardhmancreation.com/",
    siteName: "Vardhman Decoration",
    images: [
      {
        url: "https://res.cloudinary.com/dsobipud5/image/upload/v1750513763/main-categories/udpr62u7zquzuguhgvgr.webp",
        width: 1200,
        height: 630,
        alt: "Vardhman Decoration Homepage",
      },
      {
        url: "https://res.cloudinary.com/dsobipud5/image/upload/v1751443366/products/xr7leekorgryuk0q9gjy.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Event Decor Items",
      },
      {
        url: "https://res.cloudinary.com/dsobipud5/image/upload/v1751996268/products/haasfbecqg8qxbt3thho.jpg",
        width: 1200,
        height: 630,
        alt: "Baby Shower and Anniversary Decorations",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vardhman Decoration | Premium Party & Event Decorations",
    description:
      "Shop premium decorations for birthdays, anniversaries, and more at Vardhman Decoration.",
    images: ["https://res.cloudinary.com/dsobipud5/image/upload/v1750513763/main-categories/udpr62u7zquzuguhgvgr.webp"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function HomeRoute() {
  return <HomePage />;
}