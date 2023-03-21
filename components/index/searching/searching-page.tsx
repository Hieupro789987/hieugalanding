import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseNumber } from "../../../lib/helpers/parser";
import { useCrud } from "../../../lib/hooks/useCrud";
import { ProductTagService } from "../../../lib/repo/product-tag.repo";
import { ProductItem } from "../../shared/common/product-item";
import { Button, Checkbox } from "../../shared/utilities/form";
import { NotFound, Spinner } from "../../shared/utilities/misc";
import { SearchingProvider, useSearchingContext } from "./provider/searching-provider";

export function SearchingPage() {
  return (
    <SearchingProvider>
      <section className="flex justify-between pt-10 pb-28 main-container">
        <div className="w-1/5 p-5 bg-white rounded-md">
          <ProductTagSection />
          <LocationSection />
        </div>
        <div className="flex-1 ml-8">
          <SearchInfoSection />
          <SearchResultSection />
        </div>
      </section>
    </SearchingProvider>
  );
}

function ProductTagSection() {
  return (
    <>
      <div className="text-xl font-semibold text-accent">Danh mục</div>
      <ProductTagList />
    </>
  );
}

function ProductTagList() {
  const router = useRouter();
  const { productTag } = useSearchingContext();
  const productTagCrud = useCrud(
    ProductTagService,
    { limit: 20, order: { name: 1 } },
    { fragment: "id name" }
  );

  if (!productTagCrud.items) return <Spinner />;
  if (productTagCrud.items.length == 0) return <></>;

  return (
    <div className="flex flex-col items-start justify-start my-8">
      <Button
        text={"Tất cả"}
        className={`${!productTag ? "text-primary" : "text-accent "} pl-0 mb-3 font-normal`}
        onClick={() => {
          delete router.query.productTag;
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
            },
          });
        }}
      />
      {productTagCrud.items.map((cate, index) => (
        <Button
          key={index}
          text={cate.name}
          className={`${
            productTag == cate.id ? "text-primary" : "text-accent "
          } pl-0 mb-3 font-normal`}
          onClick={() =>
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                productTag: cate.id,
              },
            })
          }
        />
      ))}
    </div>
  );
}

function LocationSection() {
  const router = useRouter();
  const { locationStores, storeLocationList } = useSearchingContext();

  const handleChecked = (selected: boolean, store: any) => {
    let locationQueryList = storeLocationList ? [...storeLocationList] : [];

    if (!selected) {
      locationQueryList = locationQueryList.filter((item) => item !== store.provinceId);

      if (locationQueryList.length === 0) {
        delete router.query.storeLocation;
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
          },
        });
        return;
      }

      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          storeLocation: JSON.stringify(locationQueryList),
        },
      });
      return;
    }

    locationQueryList = [...locationQueryList, store.provinceId];
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        storeLocation: JSON.stringify(locationQueryList),
      },
    });
  };

  if (!locationStores) return <Spinner />;
  if (locationStores.length == 0) return <></>;

  return (
    <>
      <div className="mb-8 text-xl font-semibold text-accent">Nơi bán</div>
      {locationStores.length > 0 &&
        locationStores.map((store, index) => (
          <Checkbox
            key={index}
            placeholder={store.province}
            value={storeLocationList?.includes(store.provinceId)}
            onChange={(selected) => handleChecked(selected, store)}
          />
        ))}
    </>
  );
}

function SearchInfoSection() {
  const TYPE_SEARCH: Option[] = [
    { value: "popular", label: "Phổ biến" },
    { value: "new", label: "Mới nhất" },
    { value: "priceASC", label: "Giá thấp nhất" },
    { value: "priceDESC", label: "Giá cao nhất" },
  ];
  const router = useRouter();
  const { search, pagination, sortBy } = useSearchingContext();
  const [selectedType, setSelectedType] = useState<string>("popular");

  useEffect(() => {
    if (!sortBy) return;
    setSelectedType(sortBy);
  }, [sortBy]);

  return (
    <>
      <div className="text-2xl text-accent">
        Kết quả tìm kiếm
        <span className="ml-3 text-2xl font-semibold text-accent">{search}</span>
      </div>
      <div className="flex flex-row items-center justify-between mt-5">
        <div>{parseNumber(pagination?.total)} Kết quả</div>
        <div className="flex flex-row items-center justify-start">
          {TYPE_SEARCH.map((item) => {
            return (
              <Button
                text={item.label}
                key={item.value}
                className={`${
                  selectedType == item.value ? "underline text-primary" : ""
                } text-accent`}
                onClick={() =>
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, sortBy: item.value },
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function SearchResultSection() {
  const { items, hasMore, loadMore, loading } = useSearchingContext();

  if (!items || loading) return <Spinner />;
  if (items.length == 0) return <NotFound text={"Không có sản phẩm bạn muốn tìm"} />;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 my-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product, index) => (
          <ProductItem product={product} key={index} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center">
          <Button
            text="Xem thêm"
            light
            className="shadow-sm "
            isLoading={loading}
            onClick={loadMore}
          />
        </div>
      )}
    </>
  );
}
