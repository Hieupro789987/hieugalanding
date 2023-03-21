import React, { useRef } from "react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Spinner } from "../../../shared/utilities/misc";
import { ProductItem } from "../../../shared/common/product-item";
import { useProductDetailsContext } from "../../../shared/product-details/product-details-provider";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button } from "../../../shared/utilities/form";

export function ProductDetailSimilar({ ...props }) {
  const { similarProducts } = useProductDetailsContext();
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const paginationRef = useRef(null);
  return (
    <div className="py-2 bg-white lg:mt-7 lg:bg-transparent lg:py-0">
      <div className={screenLg ? "" : "main-container"}>
        <div className="flex flex-row items-center justify-between">
          <SectionTitle>Sản phẩm tương tự</SectionTitle>
          {!screenLg && (
            <Button
              text="Xem thêm"
              href={"/products"}
              className="px-1 text-sm text-primary md:text-base"
            />
          )}
        </div>
        <Swiper
          slidesPerView={screenLg ? 5 : screenMd ? 4 : screenSm ? 3 : 2}
          spaceBetween={20}
          className="py-2 lg:py-4"
          grabCursor={true}
          freeMode={false}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
        >
          <div
            ref={navigationPrevRef}
            className="absolute left-0 w-10 pl-0 text-gray-600 transform -translate-y-1/2 rounded-full cursor-pointer bg-blue-50 h-10 top-1/2 flex-center group-hover:text-primary z-100"
          >
            <i className="text-lg">
              <FaChevronLeft />
            </i>
          </div>
          <div
            ref={navigationNextRef}
            className="absolute right-0 w-10 pr-0 text-gray-600 transform -translate-y-1/2 rounded-full cursor-pointer bg-blue-50 h-10 top-1/2 flex-center group-hover:text-primary z-100"
          >
            <i className="text-lg">
              <FaChevronRight />
            </i>
          </div>
          {similarProducts?.length &&
            similarProducts?.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductItem product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
