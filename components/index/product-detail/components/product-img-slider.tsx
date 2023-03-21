import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReactPlayer from "react-player";
import { Thumbs } from "swiper";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useProductDetailsContext } from "../../../shared/product-details/product-details-provider";
import { Img, Spinner } from "../../../shared/utilities/misc";
type Props = {};
SwiperCore.use([Navigation, Pagination, Autoplay, Thumbs]);

export function ProductImgSlider({}: Props) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const paginationRef = useRef(null);
  const { product } = useProductDetailsContext();
  const [playing, setPlaying] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(product?.image);
  const isLg = useScreen("lg");
  return (
    <div>
      <div>
        {isLg ? (
          !product ? (
            <Spinner />
          ) : (
            <div className="h-auto">
              <Img percent={75} src={thumbsSwiper} className="w-full rounded-md" />
            </div>
          )
        ) : (
          <Swiper
            grabCursor
            loop={true}
            slidesPerView={1}
            spaceBetween={20}
            className={!isLg && "pb-8"}
            autoplay={
              playing
                ? false
                : {
                    delay: 5000,
                    disableOnInteraction: true,
                  }
            }
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
              className="absolute w-10 h-10 pl-0 text-gray-600 transform -translate-y-1/2 rounded-full cursor-pointer left-2 top-1/2 flex-center group-hover:text-primary z-100"
            >
              <i className="text-lg">
                <FaChevronLeft />
              </i>
            </div>
            <div
              ref={navigationNextRef}
              className="absolute w-10 h-10 pr-0 text-gray-600 transform -translate-y-1/2 rounded-full cursor-pointer right-2 top-1/2 flex-center group-hover:text-primary z-100"
            >
              <i className="text-lg">
                <FaChevronRight />
              </i>
            </div>
            <div
              className="absolute z-50 w-full gap-1.5 rounded-full flex-center bottom-2"
              ref={paginationRef}
            ></div>
            {product != null && product?.youtubeLink ? (
              <SwiperSlide className="w-1/3 h-auto">
                <div className="cursor-pointer">
                  <Img percent={75} noImage>
                    <div className="absolute top-0 left-0 w-full h-full bg-black flex-center">
                      <ReactPlayer
                        url={product?.youtubeLink}
                        width="100%"
                        height="100%"
                        controls
                        playing={playing}
                        onPlay={() => {
                          setPlaying(true);
                        }}
                        onPause={() => {
                          setPlaying(false);
                        }}
                        config={{
                          youtube: {
                            playerVars: { showinfo: 1 },
                          },
                          file: {
                            attributes: {
                              controlsList: "nodownload",
                            },
                          },
                        }}
                      />
                    </div>
                  </Img>
                </div>
              </SwiperSlide>
            ) : null}
            {!product ? (
              <Spinner />
            ) : product?.images && product?.images.length == 0 ? (
              <>
                <SwiperSlide className="w-1/3 h-auto">
                  <div>
                    <Img percent={75} src={product?.image} className="w-full rounded-md" />
                  </div>
                </SwiperSlide>
              </>
            ) : (
              product?.images &&
              product?.images.map((item, index) => (
                <SwiperSlide className="w-1/3 h-auto" key={index}>
                  <div>
                    <Img percent={75} src={item} className="w-full rounded-md" />
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        )}
      </div>
      {isLg && (
        <div className="flex flex-row items-center gap-3 mt-3">
          {!product ? (
            <Spinner />
          ) : product?.images && product?.images.length == 0 ? (
            <>
              <div className="w-1/4 h-full cursor-pointer">
                <Img
                  src={product?.image}
                  className="w-auto rounded-md"
                />
              </div>
            </>
          ) : (
            product?.images &&
            product?.images.map((item, index) => (
              <div className="w-1/4 h-full cursor-pointer" key={index}>
                <Img
                  src={item}
                  className="w-auto rounded-md"
                  onClick={() => setThumbsSwiper(item)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
