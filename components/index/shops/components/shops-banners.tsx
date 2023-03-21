import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SwiperCore, { Navigation, Autoplay } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { Banner, BannerService } from "../../../../lib/repo/banner.repo";
import { Img } from "../../../shared/utilities/misc";

SwiperCore.use([Navigation, Autoplay]);

interface Propstype extends ReactProps {}
export function ShopsBanners(props: Propstype) {
  const bannerCrud = useCrud(BannerService, {
    limit: 10,
  });

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

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

  if (!bannerCrud.items?.length) return <></>;
  return (
    <div>
      <Swiper
        spaceBetween={8}
        grabCursor
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }}
        loop
        slidesPerView={"auto"}
        className="w-full px-2 py-3"
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
      >
        <div
          ref={navigationPrevRef}
          className="absolute left-0 h-10 pl-0 pr-2 text-white transform -translate-y-1/2 rounded-r-full cursor-pointer top-1/2 flex-center group-hover:text-primary z-100 w-9"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
        >
          <i className="text-lg">
            <FaChevronLeft />
          </i>
        </div>
        <div
          ref={navigationNextRef}
          className="absolute right-0 h-10 pl-2 pr-0 text-white transform -translate-y-1/2 rounded-l-full cursor-pointer top-1/2 flex-center group-hover:text-primary z-100 w-9"
          style={{ background: "rgba(0, 0, 0, 0.7)" }}
        >
          <i className="text-lg">
            <FaChevronRight />
          </i>
        </div>
        {bannerCrud.items
          .filter((x) => x.image)
          .map((item: Banner, index) => (
            <SwiperSlide key={item.id} className={`cursor-pointer w-5/6`}>
              <Link href={getBannerHref(item)}>
                <a {...(item.actionType == "WEBSITE" ? { target: "_blank" } : {})}>
                  <Img key={index} src={item.image} ratio169 compress={800} />
                </a>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
