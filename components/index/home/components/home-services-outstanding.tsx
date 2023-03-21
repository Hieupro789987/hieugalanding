import Link from "next/link";
import { useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { ShopServiceService } from "../../../../lib/repo/services/service.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { ServiceItem } from "../../../shared/common/service-item";
import { Button } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";

SwiperCore.use([Autoplay, Navigation]);

export function HomeServicesOutStanding() {
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const { items } = useCrud(ShopServiceService, { limit: 0, order: { createdAt: -1 } });

  if (!items) return <Spinner />;
  if (items.length <= 0) return <></>;

  return (
    <div className="main-container">
      <div className="flex flex-row items-center justify-between mb-3">
        <SectionTitle>Dịch vụ nổi bật</SectionTitle>
        {!screenLg && (
          <Button
            text="Xem thêm"
            href={"/services"}
            className="px-1 text-sm text-primary md:text-base"
          />
        )}
      </div>
      <Swiper
        slidesPerView={screenMd ? 4.5 : screenSm ? 3 : 2}
        loop={true}
        spaceBetween={screenLg ? 16: 8}
        grabCursor={true}
        className={`w-full`}
        style={
          screenLg
            ? {
                paddingRight: "50px",
                paddingTop: screenLg ? "8px" : "",
                paddingBottom: screenLg ? "8px" : "",
              }
            : {}
        }
        autoplay={
          playing
            ? false
            : {
                delay: 5000,
                disableOnInteraction: true,
              }
        }
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onSlideChange={() => {
          setPlaying(false);
        }}
      >
        <div
          ref={navigationPrevRef}
          className="absolute w-10 h-10 pl-0 text-gray-600 transform -translate-y-1/2 bg-white border rounded-full shadow cursor-pointer left-3 group hover:bg-gray-100 top-1/2 flex-center group-hover:text-primary z-100"
        >
          <i className="text-lg">
            <FaChevronLeft />
          </i>
        </div>
        <div
          ref={navigationNextRef}
          className="absolute w-10 h-10 pr-0 text-gray-600 transform -translate-y-1/2 bg-white border rounded-full shadow cursor-pointer right-3 group hover:bg-gray-100 top-1/2 flex-center group-hover:text-primary z-100"
        >
          <i className="text-lg">
            <FaChevronRight />
          </i>
        </div>
        {items.map((service) => (
          <SwiperSlide key={service.id} className="h-auto">
            <ServiceItem service={service} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    // </div>
  );
}
