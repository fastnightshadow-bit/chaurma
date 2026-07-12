import { AppStateProvider } from "@/components/app/AppStateProvider";
import { SiteApp } from "@/components/app/SiteApp";
import { locations } from "@/data/locations";
import { menuCategories, menuItems } from "@/data/menu";
import { siteConfig } from "@/data/siteConfig";
import { createRestaurantStructuredData } from "@/seo/structuredData";
import { validateProjectData } from "@/utils/validateConfig";

validateProjectData({ menuCategories, menuItems, locations, siteConfig });

export default function HomePage() {
  const structuredData = createRestaurantStructuredData(siteConfig, locations);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <AppStateProvider>
        <SiteApp />
      </AppStateProvider>
    </>
  );
}
