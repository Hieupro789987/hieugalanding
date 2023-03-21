import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useClickSearchOutside } from "../../../../../lib/hooks/useClickSearchOutside";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
import { ShopProductGroup } from "../../../../../lib/repo/shop-config.repo";
import { ProductItem } from "../../../../shared/common/product-item";
import { SearchInput } from "../../../../shared/common/search-input";
import { SearchNotFound } from "../../../../shared/common/search-not-found";
import { Spinner } from "../../../../shared/utilities/misc";
import { PaginationRound } from "../../../../shared/utilities/pagination/pagination-round";
import { useShopDetailsContext } from "../../../shop-details/providers/shop-details-provider";
import { StoreDetailFeedback } from "../store-detail-feedback";
import { StoreDetailProductsFilter } from "./components/store-detail-products-filter";
import { StoreDetailProductsFilterSlideout } from "./components/store-detail-products-filter-slideout";
import { StoreDetailProductsSort } from "./components/store-detail-products-sort";

interface Propstype extends ReactProps {
  productGroups: ShopProductGroup[];
}

export function StoreDetailProducts({ productGroups }: Propstype) {
  const router = useRouter();
  const { shopCode } = useShopContext();
  const isLg = useScreen("lg");

  const {
    categories,
    products: { items, loadingAll, total, setPage, page },
    productTag,
    countQuery,
  } = useShopDetailsContext();
  const [openFilter, setOpenFilter] = useState(false);
  const { elementRef, openSearch, setOpenSearch, value, setValue } = useClickSearchOutside();

  useEffect(() => {
    if (router.query.cate) {
      const contactEle = document.getElementById(`${router.query.cate as string}`);
      if (contactEle) contactEle.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [router.query]);
  if (!items || !categories) return <Spinner />;
  return (
    <div className="pt-5 pb-10">
      <section className="flex flex-col lg:gap-5 lg:justify-between lg:flex-row">
        <div className="lg:rounded-md lg:pr-5 lg:w-1/4 lg:h-screen">
          {isLg ? (
            <>
              <StoreDetailProductsFilter categories={categories} productTag={productTag} />{" "}
              <StoreDetailProductsSort />
            </>
          ) : (
            <div className="flex flex-row items-center justify-between mb-3">
              <div className="lg:min-w-none w-[93%]">
                {openSearch ? (
                  <div ref={elementRef} className="mt-2">
                    <SearchInput
                      onValueChange={(val) => setValue(val.trim())}
                      onClear={() => {
                        if (!!value) {
                          setOpenSearch(false);
                          setValue("");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-lg font-bold">Sản phẩm</div>
                )}
              </div>

              <div className="flex flex-row items-center">
                {!openSearch && (
                  <i className="mr-2 text-2xl" onClick={() => setOpenSearch(true)}>
                    <FiSearch />
                  </i>
                )}
                <div className="relative">
                  <i
                    className={`text-2xl mt-3 ${countQuery > 0 ? "text-primary" : ""}`}
                    onClick={() => {
                      setOpenFilter(true);
                    }}
                  >
                    <BiFilterAlt />
                  </i>

                  {countQuery > 0 && (
                    <div className="absolute top-0 z-20 w-2 h-2 p-1 border-2 border-white rounded-full bg-danger left-3 lg:left-6"></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1">
          {!categories ? (
            <Spinner />
          ) : (
            <>
              {
                <div>
                  {isLg && (
                    <div className="mb-5 lg:ml-auto lg:w-fit">
                      <SearchInput />
                    </div>
                  )}
                  {loadingAll ? (
                    <Spinner />
                  ) : items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-5 mt-2 mb-6 sm:grid-cols-3 lg:grid-cols-4">
                      {items?.map((item, index) => (
                        <ProductItem product={item} key={item.id} hasShop={false} />
                      ))}
                    </div>
                  ) : (
                    <SearchNotFound />
                  )}
                </div>
              }
              <div className="flex justify-end w-full mt-8 mb-14">
                {items?.length < total && (
                  <PaginationRound
                    limit={12}
                    page={page}
                    total={total}
                    onPageChange={(page: number) => setPage(page)}
                  />
                )}
              </div>
            </>
          )}
          {/* <StoreDetailFeedback /> */}
        </div>
      </section>

      <StoreDetailProductsFilterSlideout
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        categories={categories}
        productTag={productTag}
      />
    </div>
  );
}
