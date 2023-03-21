import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { ProductItem } from "../../../shared/common/product-item";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";
import { useShopsContext } from "../../shops/providers/shops-provider";

type Props = {};

export function HomeSelling({}: Props) {
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const { products } = useShopsContext();
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="main-container">
      <div className="flex flex-row items-center justify-between">
        <SectionTitle>Sản phẩm nổi bật</SectionTitle>
        {!screenLg && (
          <Button
            text="Xem thêm"
            href={"/products"}
            className="px-1 text-sm text-primary md:text-base"
          />
        )}
      </div>
      <div className="mt-1">
        {!products ? (
          <Spinner />
        ) : (
          <>
            {/* {!screenLg ? ( */}
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
              <div className="grid auto-rows-fr auto-cols-fr">
                {products.slice(0, 5).map((product, index) => (
                  <SwiperSlide className="h-auto" key={index}>
                    <ProductItem product={product} />
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
            {/* ) : (
              <div className="grid grid-cols-5 gap-5">
                {products.slice(0, 5).map((product, index) => (
                  <ProductItem product={product} key={index} />
                ))}
              </div>
            )} */}
            {}
          </>
        )}
      </div>
    </section>
  );
}
