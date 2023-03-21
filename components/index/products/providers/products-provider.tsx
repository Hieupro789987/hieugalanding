import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useMemoCompare } from "../../../../lib/hooks/useMemoCompare";
import { useQuery } from "../../../../lib/hooks/useQuery";
import {
  GlobalProductCategory,
  GlobalProductCategoryService,
} from "../../../../lib/repo/global-product-category.repo";
import { MemberService, StoreProvince } from "../../../../lib/repo/member.repo";
import { ProductTag, ProductTagService } from "../../../../lib/repo/product-tag.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";

export const ProductsContext = createContext<
  Partial<{
    search: string;
    sortBy: string;
    productTag: string;
    productTags: ProductTag[];
    provinces: StoreProvince[];
    provinceIds: string[];

    productCategories: any[];
  }> &
    Partial<CrudProps<Product>>
>({});

export function ProductsProvider(props) {
  const LIMIT_PRODUCTS = 12;
  const search: string = useQuery("search");
  const productTag: string = useQuery("productTag");
  const sortBy: string = useQuery("sortBy") || "popular";
  const provinceQuery: string = useQuery("province");
  const provinceIds: string[] = useMemo(() => (provinceQuery ? JSON.parse(provinceQuery) : []), [
    provinceQuery,
  ]);
  const [provinces, setProvinces] = useState<StoreProvince[]>();
  const productTagCrud = useCrud(
    ProductTagService,
    { limit: 0, order: { name: 1 } },
    { fragment: "id name" }
  );

  const { items } = useCrud(GlobalProductCategoryService, {
    limit: 99999,
    order: { priority: -1 },
  });

  const getCategoriesTree = () => {
    const newList = [];
    const categoryListsChild = [...(items || [])];
    categoryListsChild.forEach((child) => {
      const { parentCategory, parentId, id, name } = { ...child };
      const data = {
        id: parentId ? parentCategory?.id : id,
        name: parentId ? parentCategory?.name : name,
        childCategories: parentId ? [{ id: id, name: name }] : [],
      };
      const index = newList.findIndex((x) => (parentId ? x?.id === parentId : x?.id == id));

      if (index > -1) {
        newList[index].childCategories?.push({ id: id, name: name });
      } else {
        newList.push(data);
      }
    });
    return newList;
  };

  useEffect(() => {
    if (!items) return;
    getCategoriesTree();
  }, [items]);

  const loadDone = useMemo(() => !!(provinces && productTagCrud.items), [
    provinces,
    productTagCrud.items,
  ]);

  const query = useMemo(() => {
    if (!loadDone) return {};
    let queryObj = {
      filter: {},
      search,
      order: {},
      page: 1,
    };

    queryObj.filter["allowSale"] = true;

    if (sortBy) {
      switch (sortBy) {
        case "popular":
          queryObj.order = {};
          break;
        case "new":
          queryObj.order = { _id: -1 };
          break;
        case "priceAsc":
          queryObj.order = { basePrice: 1 };
          break;
        case "priceDesc":
          queryObj.order = { basePrice: -1 };
          break;
      }
    }

    if (productTag) {
      queryObj.filter = { ...queryObj.filter, globalProductCategoryIds: productTag };
    } else {
      queryObj.filter = { ...queryObj.filter, globalProductCategoryIds: undefined };
    }

    if (!provinceIds.length) {
      queryObj.filter = { ...queryObj.filter, branchIds: undefined };
    } else {
      let brandIds = [];
      provinceIds.forEach((provinceId) => {
        const store = provinces.find((province) => province.provinceId == provinceId);
        if (store) {
          brandIds = [...brandIds, ...store.shopIds];
        }
      });

      queryObj.filter = {
        ...queryObj.filter,
        memberId: { $in: brandIds },
      };
    }
    return queryObj;
  }, [sortBy, productTag, search, provinceIds, loadDone]);

  const productCrud = useCrud(
    ProductService,
    { ...query, limit: LIMIT_PRODUCTS },

    {
      fetchingCondition: loadDone,
      cache: true,
      token: "global-customer",
    }
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await MemberService.getAListOfStoresByProvince();
        setProvinces(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        productCategories: getCategoriesTree(),
        search,
        productTag,
        productTags: productTagCrud.items,
        sortBy,
        provinces,
        provinceIds,
        ...(productCrud as any),
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
}

export const useProductsContext = () => useContext(ProductsContext);

export type SortType = "popular" | "new" | "priceAsc" | "priceDesc";
export const SORT_TYPES: Option<SortType>[] = [
  {
    value: "popular",
    label: "Phổ biến",
  },
  {
    value: "new",
    label: "Mới nhất",
  },

  {
    value: "priceAsc",
    label: "Giá thấp nhất",
  },
  {
    value: "priceDesc",
    label: "Giá cao nhất",
  },
];
