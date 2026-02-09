import HomePage from "../components/home-client";

// SEO Metadata for the Homepage
export const metadata = {
  title: "Vardhman Decoration | Best Event Planners & Decoration Services",
  description:
    "Premium Event Management & Decoration Services for Birthdays, Weddings, Anniversaries, Baby Showers, Car Decoration, First Night, and more. Creating magical moments in Ahmedabad & Jamnagar.",
  keywords: [
    "Birthday Decoration",
    "Anniversary Decoration",
    "Baby Shower Decoration",
    "Car Decoration",
    "First Night Decoration",
    "Welcome Baby Decoration",
    "Bon Voyage Decoration",
    "Wedding Decoration",
    "Haldi Ceremony",
    "Mehndi Ceremony",
    "Kankotri Lekhan",
    "Naming Ceremony",
    "Mundan Decoration",
    "Annaprashan Decoration",
    "Artificial Flower Decoration",
    "Real Flower Decoration",
    "Event Management",
    "Party Planners",
    "Event Decorators",
    "Vardhman Decoration"
  ].join(", "),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/",
  },
  openGraph: {
    title: "Vardhman Decoration | Premium Event & Party Decorators",
    description:
      "Your trusted partner for all event decorations: Birthday, Wedding, Baby Shower, Corporate Events, and more. Book the best decorators online.",
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
    title: "Vardhman Decoration | Top Event Management Services",
    description:
      "Experts in Birthday, Wedding, Anniversary, and Baby Shower decorations. Quality services for all your special occasions.",
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