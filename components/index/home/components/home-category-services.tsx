import { useCrud } from "../../../../lib/hooks/useCrud";
import { ProductTagService } from "../../../../lib/repo/product-tag.repo";
import { ServiceTagService } from "../../../../lib/repo/services/service-tag.repo";
import { CircleSwiper } from "../../../shared/common/circle-swiper";
import { SectionTitle } from "../../../shared/common/section-title";
import { Img, Spinner } from "../../../shared/utilities/misc";

import Link from "next/link";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { ServiceProvider, useServiceContext } from "../../services/provider/services-provider";
import { useRouter } from "next/router";

export function HomeCategoryService({ ...props }) {
  const serviceTagCrud = useCrud(ServiceTagService, {
    limit: 0,
    order: { createdAt: -1 },
  });

  if (!serviceTagCrud.items) return <Spinner />;

  return (
    <div className="mt-5 main-container">
      <SectionTitle>Danh mục dịch vụ</SectionTitle>
      <ServiceProvider>
        <CircleServiceSwiper
          items={serviceTagCrud.items.map((x) => ({
            image: x.image,
            name: x.name,
            href: `/services?serviceTag=${JSON.stringify([x.id])}`,
            id: x.id,
          }))}
        />
      </ServiceProvider>
    </div>
  );
}

SwiperCore.use([Autoplay, Navigation]);

interface Props extends ReactProps {
  items: { image: string; name: string; href: string; id: string }[];
}
export function CircleServiceSwiper({ items, ...props }: Props) {
  const screenXs = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const router = useRouter();
  const { onSubmit, serviceTagIds, onFilterChange } = useServiceContext();

  const handleClick = (id: string) => {
    if (!id) return;
    const newServiceTagIds = [...serviceTagIds];
    newServiceTagIds.push(id);

    router.push({
      pathname: "/services",
      query: { serviceTag: newServiceTagIds.length > 0 ? JSON.stringify(newServiceTagIds) : [] },
    });
  };

  if (!items.length) return <></>;
  return (
    <Swiper
      slidesPerView={screenLg ? 8 : screenMd ? 6 : screenXs ? "auto" : "auto"}
      grabCursor={true}
      loop={screenLg ? false : true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
    >
      {items?.map((item) => (
        <SwiperSlide key={item.name} className="w-24">
          {screenLg ? (
            <Link href={item.href} shallow={true}>
              <a
                {...(item.href.startsWith("http") ? { target: "_blank" } : {})}
                className="flex flex-col items-center p-3 text-xs cursor-pointer sm:text-sm group"
              >
                <Img
                  src={item?.image}
                  className="w-20 transition-all bg-white border rounded-full shadow-md xl:w-24 hover:transform hover:scale-110"
                />
                <div className="mt-2.5 font-semibold text-center whitespace-pre-wrap text-accent group-hover:text-primary">
                  {item?.name}
                </div>
              </a>
            </Link>
          ) : (
            <div className="flex flex-col items-center p-3 text-xs cursor-pointer sm:text-sm group">
              <Img
                src={item?.image}
                className="w-20 transition-all bg-white border rounded-full shadow-md xl:w-24 hover:transform hover:scale-110"
                onClick={() => handleClick(item.id)}
              />
              <div className="mt-2.5 font-semibold text-center whitespace-pre-wrap text-accent group-hover:text-primary">
                {item?.name}
              </div>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
