import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../../../lib/hooks/useQuery";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../../../lib/providers/shop-provider";
import { AdditionalShopServiceService } from "../../../../../../lib/repo/services/additional-service.repo";
import { Service, ShopServiceService } from "../../../../../../lib/repo/services/service.repo";
import {
  ShopServiceCategory,
  ShopServiceCategoryService,
} from "../../../../../../lib/repo/services/shop-service-category.repo";

export const StoreDetailServiceContext = createContext<
  Partial<{
    servicesCrud: CrudProps<Service>;
    shopServiceCategoryCrud: CrudProps<ShopServiceCategory>;
    categoryTag: string;
    onFilterChange: (val: any) => void;
    onSubmit: () => any;
    countQuery: number;
  }>
>({});

export function StoreDetailServiceProvider({ children }) {
  //Danh sách service tại shop
  const router = useRouter();
  const isLg = useScreen("lg");
  const { shop } = useShopContext();
  const search: string = useQuery("search");
  const categoryTag: string = useQuery("categoryTag");
  const sortBy: string = useQuery("sortBy");
  const [params, setParams] = useState<any>({
    search: search,
    categoryTag: categoryTag,
    sortBy: sortBy || "latest",
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const shopServiceCategoryCrud = useCrud(ShopServiceCategoryService, {
    limit: 0,
    order: { createdAt: -1 },
    filter: { memberId: shop?.id },
  });
  const loadDone = useMemo(() => !!shopServiceCategoryCrud.items, [shopServiceCategoryCrud.items]);

  const handleFilterChange = (val: any) => {

    const newObj = { ...params, ...val };
    const objFilter = {};

    Object.keys(newObj).forEach((key) => {
      if (newObj[key]) {
        objFilter[key] = newObj[key];
      }
    });
    setParams(objFilter);
  };

  const handleSubmit = () => {
    router.push({
      pathname: window.location.pathname,
      query: search ? { ...params, search: search } : params,
    });
    setIsSubmit(true);
  };

  const countQuery = useMemo(() => {
    if (sortBy == "latest") {
      return Object.keys(router.query).length - 2;
    }
    return Object.keys(router.query).length - 1;
  }, [router.query]);

  const filter = () => {
    let queryObj = {
      limit: 12,
      filter: { memberId: shop?.id },
      search,
      order: {},
    };
    if (sortBy) {
      switch (sortBy) {
        case "latest":
          queryObj.order = { _id: -1 };
          break;
        case "priceAsc":
          queryObj.order = { price: 1 };
          queryObj.filter = { ...queryObj.filter, ...{ servicePriceType: "FIXED" } };
          break;
        case "priceDesc":
          queryObj.order = { price: -1 };
          queryObj.filter = { ...queryObj.filter, ...{ servicePriceType: "FIXED" } };

          break;
      }
    }
    if (categoryTag) {
      queryObj.filter = { ...queryObj.filter, ...{ shopServiceCategoryId: categoryTag } };
    } else {
      queryObj.filter = { ...queryObj.filter, ...{ shopServiceCategoryId: undefined } };
    }
    return queryObj;
  };

  const query = useMemo(() => {
    if (!loadDone) return {};

    if (isLg) {
      return filter();
    } else {
      if (isSubmit || search || categoryTag || sortBy) {
        return filter();
      }
    }
  }, [sortBy, search, loadDone, categoryTag, isSubmit]);

  const servicesCrud = useCrud(
    ShopServiceService,
    {
      ...query,
      limit: 12,
      ...(!sortBy && {
        order: { _id: -1 },
      }),
    },
    {
      fetchingCondition: loadDone,
      cache: true,
    }
  );

  return (
    <StoreDetailServiceContext.Provider
      value={{
        servicesCrud,
        shopServiceCategoryCrud,
        categoryTag,
        onFilterChange: handleFilterChange,
        onSubmit: handleSubmit,
        countQuery,
      }}
    >
      {children}
    </StoreDetailServiceContext.Provider>
  );
}

export const useStoreDetailServiceContext = () => useContext(StoreDetailServiceContext);
