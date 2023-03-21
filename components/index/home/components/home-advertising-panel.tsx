import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Banner, BannerService } from "../../../../lib/repo/banner.repo";
import { Img, Spinner } from "../../../shared/utilities/misc";

export function HomeAdvertisingPanel({}) {
  const screenLg = useScreen("lg");
  const bannerCrud = useCrud(BannerService, {
    limit: 100,
    filter: { position: { $in: ["Middle"] } },
  });

  const getBannerHref = (item: Banner) => {
    switch (item.actionType) {
      case "PRODUCT":
        return `/store/${item.shop?.code}/?product=${item.product?.code}`;
      case "WEBSITE":
        return item.link;
      case "VOUCHER":
        return `/store/${item.shop?.code}/?voucher=${item.voucher?.code}`;
      case "SHOP":
        return `/store/${item.shop?.code}`;
    }
  };

  if (!bannerCrud.items) return <Spinner />;
  if (bannerCrud.items.length == 0) return <></>;

  return (
    <section className="py-2 xl:py-4 main-container">
      <Swiper
        className=""
        spaceBetween={24}
        slidesPerView={1}
        grabCursor
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        freeMode={false}
      >
        {bannerCrud.items.map((item) => (
          <SwiperSlide className="w-full rounded-sm xs:w-3/4 sm:w-2/3" key={item.id}>
            <Link href={getBannerHref(item)}>
              <a>
                {screenLg ? (
                  <img
                    src={item.image}
                    className="object-cover w-full rounded-md"
                    style={{ height: "360px" }}
                  />
                ) : (
                  <Img
                    src={item.image}
                    className="w-full rounded-md"
                    style={screenLg ? { maxHeight: "360px" } : {}}
                    ratio169
                  />
                )}
              </a>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
