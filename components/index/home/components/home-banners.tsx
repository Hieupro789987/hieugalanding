import Link from "next/link";
import { useRef } from "react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Banner, BannerService } from "../../../../lib/repo/banner.repo";
import { Img } from "../../../shared/utilities/misc";

SwiperCore.use([Pagination, Autoplay, Navigation]);
export function HomeBanners({ ...props }) {
  const lg = useScreen("lg");
  const bannerCrud = useCrud(BannerService, {
    limit: 100,
    filter: { position: { $in: ["Top", "TopRight"] } },
  });
  const paginationRef = useRef(null);

  if (!bannerCrud.items?.length) return <></>;
  const topBanners = bannerCrud.items.filter((item) => item.position === "Top");

  // filter top right banners and limit to 2
  const topRighBanners = bannerCrud.items
    .filter((item) => item.position === "TopRight")
    .slice(0, 2);

  return (
    <section className="main-container">
      <div className="lg:grid gap-y-2 gap-x-6 xl:pb-5 sm:grid-flow-row-dense grid-row-3 sm:grid-cols-3 sm:grid-rows-2">
        <div className="sm:col-span-2 sm:row-span-2">
          <Swiper
            className={` ${!lg && "pb-8"}`}
            slidesPerView={1}
            spaceBetween={28}
            grabCursor
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: paginationRef.current,
              clickable: true,
              type: "bullets",
              bulletActiveClass: `bg-primary hover:bg-primary-dark`,
              bulletClass: `inline-block w-2 h-2 bg-gray-100 hover:bg-white rounded-full transition-all cursor-pointer`,
              renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
              },
            }}
            freeMode={false}
          >
            <div
              className={`absolute z-50 w-full gap-1.5 flex-center ${
                !lg ? "bottom-2" : "bottom-4"
              }`}
              ref={paginationRef}
            />
            {topBanners.map((item: Banner, index) => (
              <SwiperSlide className="w-full rounded-md xs:w-3/4 sm:w-2/3" key={index}>
                <Link href={getBannerHref(item)}>
                  <a {...(item.actionType == "WEBSITE" ? { target: "_blank" } : {})}>
                    <Img src={item.image} ratio169 className="w-full rounded-md" />
                  </a>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {lg && (
          <>
            {topRighBanners.map((item: Banner, index) => {
              return (
                <Link href={getBannerHref(item)} key={item.id}>
                  {/* <a {...(item.actionType == "WEBSITE" ? { target: "_blank" } : {})}> */}
                  <div
                    className="hidden rounded-md shadow-sm cursor-pointer sm:block"
                    style={{
                      minHeight: "auto",
                      width: "100%",
                      backgroundImage: `url("${item.image}")`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  {/* </a> */}
                </Link>
              );
            })}

            <div
              className="hidden rounded-md shadow-sm sm:block"
              style={{
                minHeight: "auto",
                width: "100%",
                backgroundImage: `url("https://inanaz.com.vn/wp-content/uploads/2020/02/mau-banner-quang-cao-dep-3.jpg")`,
                backgroundSize: "cover",
              }}
            ></div>
          </>
        )}
      </div>
    </section>
  );
}

export const getBannerHref = (item: Banner) => {
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
