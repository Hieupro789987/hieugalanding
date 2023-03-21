import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "../../lib/providers/toast-provider";
import { Topic, TopicService } from "../../lib/repo/topic.repo";

export type SubMenu = {
  id?: string;
  name?: string;
  href?: string;
  group?: any;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  __typename?: string;
};

export type MenuOption = {
  name?: string;
  href?: string;
  group?: any;
  query?: any;
  icon?: any;
  isHomePage?: boolean;
  isAboutPage?: boolean;
  isVideoPage?: boolean;
  isNewPage?: boolean;
  subMenu?: SubMenu[];
};

export const DefaultHeaderContext = createContext<
  Partial<{
    seasonalInfoTopicList: Topic[];
    marketInfoTopicList: Topic[];
    menu: MenuOption[];
  }>
>({});

interface DefaultHeaderProviderProps extends ReactProps {}

export function DefaultHeaderProvider({ ...props }: DefaultHeaderProviderProps) {
  const toast = useToast();
  const [seasonalInfoTopicList, setSeasonalInfoTopicList] = useState<Topic[]>();
  const [marketInfoTopicList, setMarketInfoTopicList] = useState<Topic[]>();

  const addSubmenuInMenu = () => {
    if (!seasonalInfoTopicList || !marketInfoTopicList) return;

    const newMenu = [...MENU_OPTIONS];

    const seasonalInfoTopicIndex = newMenu.findIndex((menu) => menu.href === "/thong-tin-mua-vu");
    if (seasonalInfoTopicIndex >= 0) {
      const seasonalInfoTopicSubmenuList = seasonalInfoTopicList.map((topic) => ({
        name: topic.name,
        href: `/thong-tin-mua-vu/${topic.slug}`,
      }));
      newMenu[seasonalInfoTopicIndex] = {
        ...newMenu[seasonalInfoTopicIndex],
        subMenu: [...seasonalInfoTopicSubmenuList, { name: "Video", href: "/videos" }],
      };
    }

    let marketInfoTopicIndex = newMenu.findIndex((menu) => menu.href === "/thong-tin-thi-truong");
    if (marketInfoTopicIndex >= 0) {
      const marketInfoTopicSubmenuList = marketInfoTopicList.map((topic) => ({
        name: topic.name,
        href: `/thong-tin-thi-truong/${topic.slug}`,
      }));
      newMenu[marketInfoTopicIndex] = {
        ...newMenu[marketInfoTopicIndex],
        subMenu: marketInfoTopicSubmenuList,
      };
    }

    return newMenu;
  };

  const menu = useMemo(() => addSubmenuInMenu(), [seasonalInfoTopicList, marketInfoTopicList]);

  useEffect(() => {
    getTopicListData();
  }, []);

  const getTopicListData = async () => {
    try {
      const { data } = await TopicService.getAll({ query: { limit: 10000 } });

      const seasonalInfoTopicList = data.filter((topic) => topic.group === "thong-tin-mua-vu");
      setSeasonalInfoTopicList(seasonalInfoTopicList);

      const marketInfoTopicList = data.filter((topic) => topic.group === "thong-tin-thi-truong");
      setMarketInfoTopicList(marketInfoTopicList);
    } catch (error) {
      console.debug(error);
      toast.error("Lấy thông tin chủ đề phần header thất bại.", `${error.message}`);
    }
  };

  return (
    <DefaultHeaderContext.Provider
      value={{
        menu,
      }}
    >
      {props.children}
    </DefaultHeaderContext.Provider>
  );
}

export const useDefaultHeaderContext = () => useContext(DefaultHeaderContext);

const MENU_OPTIONS: MenuOption[] = [
  {
    href: "/",
    name: "Trang chủ",
    isHomePage: true,
  },
  {
    href: "/products",
    name: "Sản phẩm",
  },
  {
    href: "/services",
    name: "Dịch vụ",
  },
  { href: "/stores", name: "Cửa hàng" },
  { href: "/thong-tin-mua-vu", name: "Thông tin mùa vụ" },
  { href: "/thong-tin-thi-truong", name: "Thông tin thị trường" },
  { href: "/questions", name: "Hỏi đáp" },
];
