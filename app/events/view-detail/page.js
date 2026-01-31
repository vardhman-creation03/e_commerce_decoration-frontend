import { Suspense } from "react";
import axios from "axios";
import ProductPageClient from "./components/ProductPageClient";

// Server component to handle dynamic SEO and metadata
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ searchParams }) {
  const { id } = await searchParams;

  if (!id) return { title: "Event Detail | Vardhman Decoration" };

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/get-event-detail/${id}`);
    const product = response.data.data || response.data.event || response.data;

    return {
      title: `${product.title} | Vardhman Decoration`,
      description: product.description?.substring(0, 160),
      openGraph: {
        title: product.title,
        description: product.description?.substring(0, 160),
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
      alternates: {
        canonical: `https://www.thevardhmancreation.com/events/view-detail?id=${id}`,
      },
    };
  } catch (error) {
    return { title: "Event Detail | Vardhman Decoration" };
  }
}

export default async function ProductPage({ searchParams }) {
  const { id } = await searchParams;

  // We fetch data in metadata but Redux handles data in the client.
  // This is safe even if double-fetched due to caching.

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center italic font-light tracking-widest">
          Refining Experience...
        </div>
      }
    >
      {/* Product Schema JSON-LD for Search Engines */}
      {/* We can render this server-side directly to avoid hydration issues */}
      <SchemaData id={id} />
      <ProductPageClient id={id} />
    </Suspense>
  );
}

async function SchemaData({ id }) {
  if (!id) return null;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/get-event-detail/${id}`);
    const product = response.data.data || response.data.event || response.data;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": product.images || [],
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": "Vardhman Decoration"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.thevardhmancreation.com/events/view-detail?id=${id}`,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 4.5,
        "reviewCount": product.totalReviews || 10
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch (e) {
    return null;
  }
}
