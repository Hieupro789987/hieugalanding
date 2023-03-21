import { ShopsProvider } from "../shops/providers/shops-provider";
import { HomeBanners } from "./components/home-banners";
import { HomeCategoryService } from "./components/home-category-services";
import { HomeCategoryTag } from "./components/home-category-tag";
import { HomeMarketInfo } from "./components/home-market-info";
import { HomeQuestion } from "./components/home-question/home-question";
import { HomeSeasonalInfo } from "./components/home-seasonal-info";
import { HomeSelling } from "./components/home-selling";
import { HomeServicesOutStanding } from "./components/home-services-outstanding";

export function HomePage() {
  return (
    <ShopsProvider>
      <HomeComponent />
    </ShopsProvider>
  );
}

function HomeComponent() {
  return (
    <>
      <div className="flex flex-col gap-5 py-10 lg:bg-gray-100">
        {/* <HomeWeather /> */}
        <HomeBanners />
        <HomeSeasonalInfo />
        <HomeMarketInfo />
        <HomeQuestion />
        <HomeCategoryTag />
        <HomeSelling />
        <HomeCategoryService />
        <HomeServicesOutStanding />

        {/* <HomeBanners />
        <HomeSelling />
        {/* <HomeCategory /> */}
        {/* <HomeAdvertisingPanel /> */}
        {/* <HomeVoucher /> */}
        {/* <HomeStoreNear />
        <HomeCategoryTag />
        <HomeBuyOfDay /> */}
      </div>
    </>
  );
}
