import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { MemberService } from "../../../../lib/repo/member.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";

export const SearchingContext = createContext<
  Partial<{
    search: string;
    sortBy: string;
    productTag: string;
    storeLocationList: any;
    locationStores: any;
  }> &
    Partial<CrudProps<Product>>
>({});

export function SearchingProvider(props) {
  const search: string = useQuery("keyword");
  const productTag: string = useQuery("productTag");
  const sortBy: string = useQuery("sortBy");
  const storeLocation: string = useQuery("storeLocation");
  const [locationStores, setLocationStores] = useState(null);
  const [storeLocationList, setStoreLocationList] = useState<string[]>();
  const query = useMemo(() => {
    let queryObj = {
      limit: 20,
      filter: {},
      search,
      order: {},
    };
    if (sortBy) {
      switch (sortBy) {
        case "popular":
          queryObj.order = {};
          break;
        case "new":
          queryObj.order = { _id: -1 };
          break;
        case "priceASC":
          queryObj.order = { basePrice: 1 };
          break;
        case "priceDESC":
          queryObj.order = { basePrice: -1 };
          break;
      }
    }

    if (productTag) {
      queryObj.filter = { ...queryObj.filter, productTagIds: productTag };
    } else {
      queryObj.filter = { ...queryObj.filter, productTagIds: undefined };
    }

    if (!storeLocation || !locationStores) {
      setStoreLocationList(null);
      queryObj.filter = { ...queryObj.filter, branchIds: undefined };
    } else {
      const storeLocationListParse = JSON.parse(storeLocation);
      setStoreLocationList(storeLocationListParse);

      let branchIdList = [];
      storeLocationListParse.forEach((provinceId) => {
        const store = locationStores.find((store) => store.provinceId == provinceId);

        if (store) {
          branchIdList = [...branchIdList, ...store.shopIds];
        }
      });

      queryObj.filter = {
        ...queryObj.filter,
        memberId: { $in: branchIdList },
      };
    }
    return queryObj;
  }, [sortBy, productTag, search, storeLocation, locationStores]);
  const productCrud = useCrud(ProductService, query, {
    cache: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await MemberService.getAListOfStoresByProvince();
        setLocationStores(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <SearchingContext.Provider
      value={{
        search,
        productTag,
        sortBy,
        locationStores,
        storeLocationList,
        ...(productCrud as any),
      }}
    >
      {props.children}
    </SearchingContext.Provider>
  );
}

export const useSearchingContext = () => useContext(SearchingContext);
