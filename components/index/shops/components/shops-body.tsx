import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { RiStore3Line } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { useOnScreen } from "../../../../lib/hooks/useOnScreen";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useLocation } from "../../../../lib/providers/location-provider";
import { ProductImg } from "../../../shared/product/product-img";
import { ProductPrice } from "../../../shared/product/product-price";
import { ProductRating } from "../../../shared/product/product-rating";
import { Button } from "../../../shared/utilities/form/button";
import { Img, NotFound, Spinner } from "../../../shared/utilities/misc";
import { useShopsContext } from "../providers/shops-provider";
import { ShopCard } from "./shop-card";

interface PropsType extends ReactProps {}
export function ShopsBody({ ...props }: PropsType) {
  const { listMode } = useShopsContext();

  return (
    <>
      {listMode !== "products" && <CategoryHead />}
      {!listMode && <NearbyShopList />}
      {(!listMode || listMode == "shops") && <ShopList />}
      {(!listMode || listMode == "products") && <ProductList />}
    </>
  );
}

function CategoryHead() {
  const { categories, selectedCategory, setSelectedCategory } = useShopsContext();
  const screenSm = useScreen("sm");
  if (!categories) return <Spinner />;
  return (
    <div className="mt-2 bg-white shadow-sm">
      <Swiper slidesPerView={screenSm ? 5 : 4} className="px-2 py-4" grabCursor={true}>
        {categories.map(
          (item, index) =>
            item.shopCount !== 0 && (
              <SwiperSlide key={index}>
                <div
                  className="flex flex-col items-center text-xs cursor-pointer sm:text-sm group"
                  onClick={() => setSelectedCategory(item.id)}
                >
                  <Img
                    className={`border w-16 sm:w-20 p-1 mb-3 transition rounded-lg ${
                      item.id === selectedCategory
                        ? "border-primary"
                        : "border-gray-200 group-hover:border-gray-400"
                    }`}
                    src={item.image || "/assets/default/default.png"}
                  />
                  <div
                    className={`transition-colors text-ellipsis-2 px-1 text-center ${
                      item.id === selectedCategory
                        ? "text-primary font-bold"
                        : "text-gray-600 group-hover:text-gray-800 font-semibold"
                    }`}
                  >
                    {item.name}
                  </div>
                </div>
              </SwiperSlide>
            )
        )}
      </Swiper>
    </div>
  );
}

function NearbyShopList() {
  const { nearByShops } = useShopsContext();
  const screenSm = useScreen("sm");

  if (!nearByShops || !nearByShops.length) return <></>;
  return (
    <div className="p-4 mt-2 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2 text-lg font-semibold">
        <span>Gần tôi</span>
        <span className="text-sm font-medium">{nearByShops.length} cửa hàng</span>
      </div>
      <Swiper slidesPerView={screenSm ? 3.6 : 2.8} grabCursor={true} spaceBetween={16}>
        {nearByShops.map(
          (shop, index) =>
            shop.shopCount !== 0 && (
              <SwiperSlide className={`cursor-pointer text-sm h-full`} key={index}>
                <Link href={`/store/${shop.shopCode}`}>
                  <a className="flex flex-col min-h-full bg-white group">
                    <Img
                      src={shop.coverImage}
                      className="w-full border border-gray-100 rounded-sm shadow-sm"
                    />
                    <div className="flex flex-col min-h-18">
                      <div className="mt-3 mb-1 font-semibold break-words text-ellipsis-2 group-hover:text-primary">
                        {shop.name}
                      </div>
                      <div className="flex mt-auto">
                        <span className="flex items-center">
                          <i className="mr-1 mb-0.5 text-slate">
                            <FaMapMarkerAlt />
                          </i>
                          <span>{shop.distance}km</span>
                        </span>
                        {shop.rating > 0 && (
                          <span className="flex items-center ml-auto">
                            <i className="mr-1 mb-0.5 text-yellow-300">
                              <FaStar />
                            </i>
                            {shop.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
              </SwiperSlide>
            )
        )}
      </Swiper>
    </div>
  );
}

function ShopList() {
  const { listMode, shops, isLoadingMore, loadMore, noLoadMore, openAddress } = useShopsContext();
  const router = useRouter();
  const { userLocation, openLocation } = useLocation();

  return (
    <div className="p-4 mt-2 bg-white shadow-sm">
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Danh sách cửa hàng</span>
        {!listMode && (
          <Button
            className="h-8 px-0"
            href={{ pathname: router.pathname, query: { ...router.query, list: "shops" } }}
            text="Xem tất cả"
            icon={<HiChevronRight />}
            iconClassName="text-lg"
            iconPosition="end"
          />
        )}
      </div>

      {!shops ? (
        <Spinner />
      ) : (
        <div>
          {!shops.length && (
            <NotFound icon={<RiStore3Line />} text="Không tìm thấy cửa hàng gần bạn">
              {!userLocation?.lat && (
                <Button
                  className="mt-2"
                  primary
                  text="Chọn địa chỉ"
                  icon={<FaMapMarkerAlt />}
                  onClick={() => openLocation()}
                />
              )}
            </NotFound>
          )}
          {shops.map((shop, index) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              className={`${index < shops.length - 1 ? "border-b" : "pb-0"}`}
            />
          ))}
          {listMode == "shops" && !!shops.length && !noLoadMore && (
            <div className="pt-3 mt-3 border-t border-gray-200 flex-center">
              <Button
                primary
                isLoading={isLoadingMore}
                text={"Xem thêm"}
                className="px-8"
                onClick={loadMore}
              />
            </div>
          )}
          {!listMode && isLoadingMore && (
            <div className="pt-3 font-semibold text-center loading-ellipsis text-primary">
              Đang tải
            </div>
          )}
          <LoadingObserver />
        </div>
      )}
    </div>
  );
}

function LoadingObserver() {
  const { listMode, loadMore, noLoadMore } = useShopsContext();
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-10px");
  useEffect(() => {
    if (onScreen && !noLoadMore && !listMode) {
      loadMore();
    }
  }, [onScreen]);
  return <div ref={ref}></div>;
}

function ProductList() {
  const { listMode, products, isLoadingMore, loadMore, noLoadMore } = useShopsContext();
  const router = useRouter();

  return (
    <div className="p-4 mt-2 bg-white shadow-sm">
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Danh sách sản phẩm</span>
        {!listMode && (
          <Button
            className="h-8 px-0"
            href={{ pathname: router.pathname, query: { ...router.query, list: "products" } }}
            text="Xem tất cả"
            icon={<HiChevronRight />}
            iconClassName="text-lg"
            iconPosition="end"
          />
        )}
      </div>

      {!products ? (
        <Spinner />
      ) : (
        <div>
          {!products.length && <NotFound icon={<RiStore3Line />} text="Không tìm thấy sản phẩm" />}
          {products.map((product, index) => (
            <Link
              key={index}
              href={{
                pathname: `/store/${product?.member?.code}`,
                query: { product: product?.code },
              }}
            >
              <a className="group">
                <div
                  className={`py-3 px-4 -mx-4 bg-white cursor-pointer ${
                    index < products.length - 1 ? "border-b" : "pb-0"
                  }`}
                >
                  <div className="flex">
                    <div className="flex flex-col justify-start flex-1">
                      <span className="items-start font-semibold text-ellipsis-2 group-hover:text-primary">
                        {product.name}
                      </span>
                      <ProductRating rating={product.rating} soldQty={product.soldQty} />
                      <span className="mt-1 text-sm text-gray-500 text-ellipsis-2">
                        {product.subtitle}
                      </span>
                      <ProductPrice
                        price={product.basePrice}
                        downPrice={product.downPrice}
                        className="mt-auto mb-0"
                      />
                    </div>
                    <ProductImg
                      src={product.image}
                      className="w-20 border border-gray-100 rounded-sm shadow-sm sm:w-24"
                      compress={100}
                      saleRate={product.saleRate}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.labels?.map((label, index) => (
                      <div
                        className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full whitespace-nowrap"
                        style={{ backgroundColor: label.color }}
                        key={label.name}
                      >
                        <span>{label.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {listMode == "products" && !!products.length && !noLoadMore && (
            <div className="pt-3 mt-3 border-t border-gray-200 flex-center">
              <Button
                primary
                isLoading={isLoadingMore}
                text={"Xem thêm"}
                className="px-8"
                onClick={loadMore}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
