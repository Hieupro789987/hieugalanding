import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Img } from "../utilities/misc";
// install Swiper modules
SwiperCore.use([Pagination, Autoplay, Navigation]);
interface Propstype extends ReactProps {
  images: string[];
  cover?: string;
  youtubeLink?: string;
}
export function ProductDetailsBanners({ images, cover, youtubeLink, ...props }: Propstype) {
  const paginationRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`${props.className || ""} `}>
      <Swiper
        className="relative pb-8"
        spaceBetween={10}
        loop={true}
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
          bulletActiveClass: "bg-primary hover:bg-primary-dark",
          bulletClass:
            "inline-block w-2 h-2 bg-gray-300 hover:bg-gray-600 rounded-full transition-all cursor-pointer",
          renderBullet: function (index, className) {
            return `<span class="${className}"></span>`;
          },
        }}
        onSlideChange={() => {
          setPlaying(false);
        }}
      >
        <div
          className="absolute z-50 w-full gap-1.5 flex-center bottom-0.5"
          ref={paginationRef}
        ></div>
        {youtubeLink && (
          <SwiperSlide className="">
            <div className="cursor-pointer">
              <Img percent={75} noImage>
                <div className="absolute top-0 left-0 w-full h-full bg-black flex-center">
                  <ReactPlayer
                    url={youtubeLink}
                    width="100%"
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
        )}
        {cover && (
          <SwiperSlide>
            <Img src={cover} lazyload={false} compress={600} percent={75} />
          </SwiperSlide>
        )}
        {images.map((item: string, index) => (
          <SwiperSlide key={index} className={`cursor-pointer`}>
            <Img src={item} lazyload={false} compress={600} percent={75} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
