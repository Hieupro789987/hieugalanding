import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Banner } from "../../../../lib/repo/banner.repo";
SwiperCore.use([Pagination, Autoplay, Navigation]);

export function StoreDetailBanner({ ...props }) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const paginationRef = useRef(null);
  const { shop } = useShopContext();

  return (
    <div>
      <Swiper
        className=""
        spaceBetween={24}
        slidesPerView={1}
        grabCursor
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          el: paginationRef.current,
          clickable: true,
          type: "bullets",
          bulletActiveClass: "bg-primary hover:bg-primary-dark w-4",
          bulletClass:
            "inline-block w-2 h-2 bg-black bg-opacity-60 hover:bg-gray-700 rounded-full transition-all cursor-pointer",
          renderBullet: function (index, className) {
            return `<span class="${className}"></span>`;
          },
        }}
        freeMode={false}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
      >
        <div
          ref={navigationPrevRef}
          className="absolute w-8 pl-0 text-gray-600 transform -translate-y-1/2 cursor-pointer left-10 h-9 top-1/2 flex-center group-hover:text-primary z-100"
        >
          <i className="text-lg">
            <FaChevronLeft />
          </i>
        </div>
        <div
          ref={navigationNextRef}
          className="absolute w-8 pr-0 text-gray-600 transform -translate-y-1/2 cursor-pointer right-10 h-9 top-1/2 flex-center group-hover:text-primary z-100"
        >
          <i className="text-lg">
            <FaChevronRight />
          </i>
        </div>
        <div
          className="absolute z-50 w-full gap-1.5 flex-center bottom-2"
          ref={paginationRef}
        ></div>
        {shop?.config?.banners.length > 0 &&
          shop?.config?.banners
            .filter((x) => x.image)
            .map((item, index) => (
              <SwiperSlide className="w-full rounded-sm xs:w-3/4 sm:w-2/3" key={index}>
                <div
                  className="items-center py-5 bg-center bg-no-repeat bg-cover rounded-md lg:flex bg-blue-50"
                  style={{
                    height: "400px",
                    width: "100%",
                    backgroundImage: `url("${item.image}")`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
