import HomePage from "../components/HomePage";
import { restaurantJsonLd } from "../lib/siteData";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <HomePage />
    </>
  );
}
