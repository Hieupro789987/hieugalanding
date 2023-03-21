import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { Img, Spinner } from "../../../../shared/utilities/misc";

export function ServiceImages({ images }: { images: string[] }) {
  const [image, setImage] = useState<string>();
  const screenLg = useScreen("lg");

  useEffect(() => {
    if (images?.length <= 0 && images == undefined) return;
    setImage(images["0"]);
  }, [images]);

  if (!images) return <Spinner />;

  return (
    <div className="lg:w-[445px] w-full shrink-0 grow-0 lg:mr-8 mr-0 ">
      {screenLg ? (
        <>
          <Img default={image} src={image} alt="image-service" rounded />
          <div className="flex flex-row gap-3 mt-3">
            {images?.length > 0 &&
              images?.map((item, index) => (
                <Img
                  src={item}
                  alt="image-service"
                  rounded
                  className={`w-[70px] relative ${
                    image == images[index] && "border-2 border-primary rounded-md"
                  }`}
                  onClick={() => setImage(item)}
                  key={index}
                >
                  {/* {image == images[index] && (
                    <div className="absolute top-0 left-0 w-full h-full backdrop-brightness-75 group-hover:backdrop-brightness-[80%] flex-center">
                      <img srcSet="/assets/img/play-video.png 2x" className="scale-[0.65]" />
                    </div>
                  )} */}
                </Img>
              ))}
          </div>
        </>
      ) : (
        <ImageSlider images={images} />
      )}
    </div>
  );
}

export function ImageSlider({ images, ...props }: { images: string[] }) {
  const isLg = useScreen("lg");
  return (
    <Swiper
      className=""
      spaceBetween={24}
      slidesPerView={1}
      grabCursor
      pagination={true}
      loop
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      freeMode={false}
    >
      {images.map((item, index) => (
        <SwiperSlide className="w-full rounded-sm xs:w-3/4 sm:w-2/3" key={index}>
          <Img src={item} className="w-full" style={isLg ? { maxHeight: "360px" } : {}} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
