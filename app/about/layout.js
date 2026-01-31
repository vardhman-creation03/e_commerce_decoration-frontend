export const metadata = {
  title: "About Us | Vardhman Decoration | Our Story & Mission",
  description:
    "Learn about Vardhman Decoration - our story, mission, and values. We create magical celebrations with premium decoration products for birthdays, anniversaries, baby showers, and more.",
  keywords: [
    "About Vardhman Decoration",
    "Vardhman Decoration Story",
    "Our Mission",
    "Company History",
    "Decoration Company",
    "About Us",
    "Our Values",
    "Company Information",
    "Decoration Business",
    "Party Decoration Company",
    "Event Decoration",
    "Celebration Decorations",
    "Decoration Services",
    "Jamnagar Decoration",
    "Gujarat Decoration",
    "Decoration Company India",
    "Premium Decorations",
    "Quality Decorations",
    "Creative Decorations",
    "Decoration Experts",
    "Decoration Team",
    "Our Story",
    "Company Background",
    "Decoration Business Story",
    "About Our Company",
  ].join(", "),
  metadataBase: new URL("https://www.thevardhmancreation.com/"),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/about/",
  },
  openGraph: {
    title: "About Us | Vardhman Decoration",
    description:
      "Learn about Vardhman Decoration - our story, mission, and values. We create magical celebrations with premium decoration products.",
    url: "https://www.thevardhmancreation.com/about/",
    siteName: "Vardhman Decoration",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Vardhman Decoration",
    description:
      "Learn about Vardhman Decoration - our story, mission, and values. We create magical celebrations with premium decoration products.",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    keywords: [
      "About Vardhman Decoration",
      "Vardhman Decoration Story",
      "Our Mission",
      "Company History",
      "Decoration Company",
      "About Us",
      "Our Values",
      "Company Information",
      "Decoration Business",
      "Party Decoration Company",
      "Event Decoration",
      "Celebration Decorations",
      "Decoration Services",
      "Jamnagar Decoration",
      "Gujarat Decoration",
      "Decoration Company India",
      "Premium Decorations",
      "Quality Decorations",
      "Creative Decorations",
      "Decoration Experts",
      "Decoration Team",
      "Our Story",
      "Company Background",
      "Decoration Business Story",
      "About Our Company",
    ].join(", "),
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}

