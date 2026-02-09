export const metadata = {
  title: "About Us | Vardhman Decoration | Premier Event Management Company",
  description:
    "We are a leading Event Management & Decoration company in India. Specializing in Birthday, Wedding (Haldi, Mehndi), Baby Shower, Car, First Night, and Flower decorations.",
  keywords: [
    "About Vardhman Decoration",
    "Event Management Company",
    "Decoration Services",
    "Birthday Decoration",
    "Anniversary Decoration",
    "Baby Shower Decoration",
    "Car Decoration",
    "First Night Decoration",
    "Welcome Baby Decoration",
    "Bon Voyage Decoration",
    "Wedding Decoration",
    "Haldi Decoration",
    "Mehndi Decoration",
    "Kankotri Lekhan",
    "Naming Ceremony",
    "Mundan Decoration",
    "Annaprashan Decoration",
    "Artificial Flower Decoration",
    "Real Flower Decoration",
    "Event Planners India",
    "Ahmedabad Event Management",
    "Jamnagar Decoration",
    "Premium Event Services",
    "Our Story",
    "About Us"
  ].join(", "),
  metadataBase: new URL("https://www.thevardhmancreation.com/"),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/about/",
  },
  openGraph: {
    title: "About Us | Vardhman Decoration | Event Management Experts",
    description:
      "Discover our journey in creating magical events. From Birthdays to Weddings, we provide premium decoration and management services.",
    url: "https://www.thevardhmancreation.com/about/",
    siteName: "Vardhman Decoration",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Vardhman Decoration",
    description:
      "Leading Event Management & Decoration company offering comprehensive services for all your special occasions.",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    keywords: [
      "About Vardhman Decoration",
      "Event Management Company",
      "Decoration Services",
      "Birthday Decoration",
      "Anniversary Decoration",
      "Baby Shower Decoration",
      "Car Decoration",
      "First Night Decoration",
      "Welcome Baby Decoration",
      "Bon Voyage Decoration",
      "Wedding Decoration",
      "Haldi Decoration",
      "Mehndi Decoration",
      "Kankotri Lekhan",
      "Naming Ceremony",
      "Mundan Decoration",
      "Annaprashan Decoration",
      "Artificial Flower Decoration",
      "Real Flower Decoration",
      "Event Planners India",
      "Ahmedabad Event Management",
      "Jamnagar Decoration",
      "Premium Event Services"
    ].join(", "),
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}

