import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useLocation } from "../../../../lib/providers/location-provider";
import { Pagination } from "../../../../lib/repo/crud.repo";

import { Member, MemberService } from "../../../../lib/repo/member.repo";
import { ShopCategory, ShopCategoryService } from "../../../../lib/repo/shop-category.repo";
import { PublicShop, ShopService } from "../../../../lib/repo/shop.repo";

export const StoresContext = createContext<
  Partial<{
    memberCrud: CrudProps<Member>;
    setPage: Function;
    data: {
      shops: PublicShop[];
      pagination: Pagination;
    };
  }>
>({});

export function StoresProvider(props) {
  const [data, setData] = useState<{
    shops: PublicShop[];
    pagination: Pagination;
  }>();
  const [categories, setCategories] = useState<ShopCategory[]>(null);
  const categoryQuery = useQuery("category");
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>();
  const { userLocation } = useLocation();

  const limit = 10;
  const [page, setPage] = useState<number>(1);
  const searchQuery = useQuery("search");
  const search: string = useMemo(() => searchQuery, [searchQuery]);

  const loadCategories = () => {
    ShopCategoryService.getAll({
      query: { limit: 0, order: { priority: -1 } },
      cache: false,
    })
      .then((res) => {
        setCategories([
          {
            id: "",
            createdAt: "",
            updatedAt: "",
            name: "Tất cả",
            image: "/assets/img/cat-default.png",
            desc: "",
            shopCount: null,
            priority: 100,
          },
          ...res.data,
        ]);
      })
      .catch((err) => {
        setCategories([]);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      if (categoryQuery) {
        setSelectedCategory(categories.find((x) => x.name == categoryQuery));
      } else {
        setSelectedCategory(categories[0]);
      }
    }
  }, [categoryQuery, categories]);

  const getAllMember = async () => {
    try {
      const { data, pagination } = await ShopService.getAllShopWithPagination(
        userLocation?.lat,
        userLocation?.lng,
        selectedCategory?.id,
        true,
        search,
        limit,
        page
      );

      setData({
        shops: data,
        pagination: pagination,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!userLocation?.lat && !userLocation?.lng) return;
    getAllMember();
  }, [userLocation?.lat, userLocation?.lng, search, page]);

  return (
    <StoresContext.Provider value={{ data, setPage }}>{props.children}</StoresContext.Provider>
  );
}

export const useStoresContext = () => useContext(StoresContext);
