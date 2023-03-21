import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { SectionTitle } from "../../../shared/common/section-title";
import { ShowRating } from "../../../shared/common/show-rating";
import { Button } from "../../../shared/utilities/form";
import { Img, Spinner } from "../../../shared/utilities/misc";
import { useShopsContext } from "../../shops/providers/shops-provider";

type Props = {};

export function HomeStoreNear({ ...props }) {
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const { nearByShops } = useShopsContext();

  if (!nearByShops) return <Spinner />;
  if (nearByShops.length == 0) return <></>;

  return (
    <div className="bg-primary">
      <section className="py-6 xl:py-14 main-container ">
        <div className="flex flex-row items-center justify-between">
          <SectionTitle className="!text-white">Cửa hàng gần bạn</SectionTitle>
          <Button
            text="Xem thêm"
            textWhite
            href={"/stores"}
            className="px-1 text-sm md:text-base hover:underline"
          />
        </div>
        <div className="mt-2">
          {!screenLg ? (
            <Swiper
              slidesPerView={screenMd ? 2 : 1}
              grabCursor
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              freeMode={false}
              spaceBetween={screenMd ? 18 : 10}
            >
              {nearByShops.slice(0, 8).map((shop, index) => (
                <SwiperSlide className="" key={index}>
                  <StoreItem shop={shop} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-3 gap-5 mb-4 xl:grid-cols-4">
              {nearByShops
                .slice(0, 8)
                .map(
                  (shop, index) => shop.shopCount !== 0 && <StoreItem shop={shop} key={index} />
                )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function StoreItem({ ...props }) {
  const { shop } = props;

  return (
    <Link href={`/store/${shop.shopCode}`}>
      <a>
        <div className="flex flex-row items-start justify-start p-3 bg-white border rounded-md shadow-sm hover:border-primary">
          <Img src={shop?.coverImage} className="object-cover border rounded-lg min-w-20 bg-" />
          <div className="pl-5 overflow-hidden">
            <div className="h-6 ml-1 font-semibold truncate text-accent">{shop?.name}</div>
            <div className="flex flex-row items-center my-2">
              <ShowRating rating={shop?.rating} />
            </div>
            <div className="text-gray-400 whitespace-pre-wrap "></div>
            <div className="flex flex-row items-center text-xs">
              <span>
                <IoLocationOutline className="font-semibold text-gray-500" />
              </span>
              <span className="ml-1 leading-6 whitespace-pre-wrap text-accent lg:text-sm">
                {shop?.distance}km
              </span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
