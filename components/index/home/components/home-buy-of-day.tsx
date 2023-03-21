import { useScreen } from "../../../../lib/hooks/useScreen";
import { ProductItem } from "../../../shared/common/product-item";
import { Button } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { useShopsContext } from "../../shops/providers/shops-provider";
import { Swiper, SwiperSlide } from "swiper/react";
import { SectionTitle } from "../../../shared/common/section-title";

type Props = {};

export default function HomeBuyOfDay({ ...props }) {
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const { products, isLoadingMore, loadMore, noLoadMore } = useShopsContext();

  if (!products) return <Spinner />;
  if (products.length == 0) return <NotFound text="Không có sản phẩm nào" />;

  return (
    <section className="xl:py-10 main-container">
      <SectionTitle>Mua nhiều trong ngày</SectionTitle>
      <div className="mt-4">
        {!screenLg ? (
          <Swiper
            slidesPerView={screenMd ? 4 : screenSm ? 3 : 2}
            spaceBetween={16}
            grabCursor
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            freeMode={false}
          >
            <div className="grid auto-rows-fr auto-cols-fr">
              {products.map((product, index) => (
                <SwiperSlide className="h-auto" key={index}>
                  <ProductItem product={product} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        ) : (
          <div className="grid grid-cols-5 gap-5 auto-rows-fr">
            {products.map((product, index) => (
              <ProductItem product={product} key={index} />
            ))}
          </div>
        )}
      </div>

      {screenLg && !noLoadMore && (
        <div className="mt-2 text-center">
          <Button
            text="Xem thêm"
            textPrimary
            isLoading={isLoadingMore}
            onClick={loadMore}
            href="/products"
          />
        </div>
      )}
    </section>
  );
}
