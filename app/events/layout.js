export const metadata = {
  title: {
    default: "Event Decoration Services | Birthday, Baby Shower, Ring Ceremony",
    template: "%s | Vardhman Decoration"
  },
  description: "Transform your special moments with Vardhman Decoration. We offer premium balloon, flower, and theme-based decoration services for Birthdays, Baby Showers, Ring Ceremonies, First Nights, and more in Ahmedabad & Jamnagar.",
  keywords: [
    "event decoration Ahmedabad",
    "birthday decoration Jamnagar",
    "baby shower decorators",
    "ring ceremony themes",
    "first night decoration services",
    "balloon decoration price",
    "flower decoration for events",
    "best event organizers Ahmedabad",
    "luxury event decoration",
    "Vardhman Decoration events",
    "party planners Ahmedabad",
    "anniversary decoration ideas",
    "welcome baby decoration",
    "car boot decoration",
    "stage decoration for engagement"
  ],
  authors: [{ name: "Vardhman Decoration" }],
  creator: "Vardhman Decoration",
  publisher: "Vardhman Decoration",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.thevardhmancreation.com/events",
  },
  openGraph: {
    title: "Premium Event Decoration Services | Vardhman Decoration",
    description: "Luxury theme-based decoration for all your celebrations. Expert decorators for Birthdays, Weddings, and more.",
    url: "https://www.thevardhmancreation.com/events",
    siteName: "Vardhman Decoration",
    images: [
      {
        url: "https://www.thevardhmancreation.com/images/event/event-1.png",
        width: 1200,
        height: 630,
        alt: "Vardhman Decoration - Hero Event Designs",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Decoration Services | Vardhman Decoration",
    description: "Creating magical experiences with our unique decoration themes.",
    images: ["https://www.thevardhmancreation.com/images/event/event-1.png"],
    creator: "@vardhmandecor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function EventsLayout({ children }) {
  return children;
}
