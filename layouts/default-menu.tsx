import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import {
  RiArrowRightSLine,
  RiChat1Line,
  RiCompassLine,
  RiCustomerService2Line,
  RiFileList2Line,
  RiFootballLine,
  RiHome5Line,
  RiHome6Line,
  RiHotelLine,
  RiInboxLine,
  RiListCheck,
  RiListCheck2,
  RiMapPinAddLine,
  RiNewspaperLine,
  RiQuestionnaireLine,
  RiShoppingBag3Line,
  RiStore2Line,
  RiUser2Line,
  RiUser3Line,
  RiUserAddLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { Slideout, SlideoutProps } from "../components/shared/utilities/dialog/slideout";
import { Button } from "../components/shared/utilities/form";
import { Img } from "../components/shared/utilities/misc";
import { useAuth } from "../lib/providers/auth-provider";
import { useShopContext } from "../lib/providers/shop-provider";
import { useToast } from "../lib/providers/toast-provider";

export const GLOBAL_MENUS = [
  {
    href: "/",
    label: "Trang chủ",
    icon: <RiHome5Line />,
  },
  {
    href: "/stores",
    label: "Cửa hàng",
    icon: <RiStore2Line />,
  },
  {
    href: "/products",
    label: "Sản phẩm",
    icon: <RiInboxLine />,
  },
  {
    href: "/services",
    label: "Dịch vụ",
    icon: <RiListCheck2 />,
  },
  {
    href: "/thong-tin-mua-vu",
    label: "Thông tin mùa vụ",
    icon: <RiListCheck />,
  },
  {
    href: "/thong-tin-thi-truong",
    label: "Thông tin thị trường",
    icon: <RiNewspaperLine />,
  },
  {
    href: "/questions",
    label: "Hỏi đáp",
    icon: <RiQuestionnaireLine />,
  },
  {
    href: "/about-us",
    label: "Giới thiệu",
    icon: <RiFileList2Line />,
  },

  {
    href: "/profile",
    label: "Tài khoản",
    icon: <RiUser3Line />,
  },
];
export const SHOP_MENUS = [
  {
    href: "",
    label: "Sản phẩm",
    icon: <RiShoppingBag3Line />,
  },
  {
    href: "/services",
    label: "Dịch vụ",
    icon: <RiListCheck2 />,
  },
  {
    href: "/information",
    label: "Giới thiệu",
    icon: <RiFileList2Line />,
  },
  // {
  //   href: "/wheel",
  //   label: "Vòng quay may mắn",
  //   icon: <RiFootballLine />,
  //   requireLogin: true,
  // },
  // {
  //   href: "/register-sale-point",
  //   label: "Đăng ký Điểm bán",
  //   icon: <RiMapPinAddLine />,
  //   requireLogin: true,
  // },
  // {
  //   onClick: "agencyRegister",
  //   label: "Đăng ký Đại lý",
  //   icon: <RiHome6Line />,
  //   requireLogin: true,
  // },
  // {
  //   onClick: "distributorRegister",
  //   label: "Đăng ký Nhà phân phối",
  //   icon: <RiHotelLine />,
  //   requireLogin: true,
  // },
  {
    label: "Chat với chúng tôi",
    icon: <RiChat1Line />,
    href: `/chat`,
    requireLogin: true,
  },
  // {
  //   label: "Hỗ trợ",
  //   icon: <RiCustomerService2Line />,
  //   href: `/support`,
  // },
];
export function DefaultMenu({ ...props }: SlideoutProps) {
  const router = useRouter();
  const { globalCustomer, logoutGlobalCustomer } = useAuth();
  const { shop, customer, shopCode } = useShopContext();
  const [shopMenus, setShopMenus] = useState(SHOP_MENUS);
  const [type, setType] = useState<"AGENCY" | "DISTRIBUTOR">();

  useEffect(() => {
    props.onClose();
  }, [router.pathname]);

  // useEffect(() => {
  //   if (shop) {
  //     let menus = [...SHOP_MENUS];
  //     if (shop?.config.collaborator) {
  //       if (customer?.isCollaborator) {
  //         menus.splice(1, 0, {
  //           href: "/collaborator/info",
  //           label: "Thông tin CTV",
  //           icon: <RiUser2Line />,
  //         });
  //       } else {
  //         menus.splice(1, 0, {
  //           href: "/collaborator/register",
  //           label: "Đăng ký CTV",
  //           icon: <RiUserAddLine />,
  //         });
  //       }
  //     }

  //     if (customer?.isAgency) {
  //       menus = menus.filter((menu) => menu.label !== "Đăng ký Đại lý");
  //     }

  //     if (customer?.isDistributor) {
  //       menus = menus.filter((menu) => menu.label !== "Đăng ký Nhà phân phối");
  //     }

  //     setShopMenus(menus);
  //   }
  // }, [shop, customer]);

  return (
    <>
      <Slideout
        {...props}
        width="84vw"
        maxWidth={300}
        minWidth={290}
        placement="right"
        hasCloseButton={false}
      >
        <div
          className="flex items-center justify-between h-12 pl-5"
          onClick={() => props.onClose()}
        >
          <div className="font-extrabold text-accent">Menu</div>
          <Button textAccent icon={<HiOutlineX />} />
        </div>
        <div className="grid grid-cols-3 gap-3 px-3">
          {GLOBAL_MENUS.map((menu) => (
            <Img noImage key={menu.label}>
              <Link href={menu.href}>
                <a className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full p-2 border border-gray-200 rounded cursor-pointer hover:border-primary">
                  <i className="text-2xl text-primary">{menu.icon}</i>
                  <div className="mt-1 text-xs font-semibold text-center text-accent">
                    {menu.label}
                  </div>
                </a>
              </Link>
            </Img>
          ))}
        </div>
        {shop && (
          <>
            <Link href={`/store/${shopCode}`}>
              <a className="flex items-center h-12 px-4 mt-4 text-white bg-primary">
                <Img src={shop.shopLogo} className="bg-white border rounded-full w-7" />
                <div className="flex-1 px-2 text-sm font-semibold text-ellipsis-1">
                  {shop.shopName}
                </div>
                <i className="text-xl">
                  <RiArrowRightSLine />
                </i>
              </a>
            </Link>
            <div className="flex flex-col px-4">
              {shopMenus.map((menu) => (
                <ShopMenuItem
                  menu={menu}
                  setType={(val) => setType(val)}
                  key={menu.label}
                  onClose={props.onClose}
                />
              ))}
            </div>
          </>
        )}
        {globalCustomer && (
          <Button
            textPrimary
            hoverDanger
            text={"Đăng xuất"}
            className="justify-start px-4 mt-3 text-sm font-bold"
            onClick={() => {
              logoutGlobalCustomer();
              props.onClose();
            }}
          />
        )}
      </Slideout>
    </>
  );
}

function ShopMenuItem({ menu, setType, ...props }) {
  const router = useRouter();
  const toast = useToast();
  const { customer, shopCode } = useShopContext();

  const Wrapper: any = menu.href ? Link : "div";

  return (
    <Wrapper
      {...(menu.href
        ? {
            href: menu.requireLogin && !customer ? router.asPath : `/store/${shopCode}${menu.href}`,
          }
        : {
            onClick: () => {
              if (menu.requireLogin && !customer) {
                props.onClose();
                return;
              }

              if (menu.onClick === "agencyRegister") {
                setType("AGENCY");
                return;
              }
              if (menu.onClick === "distributorRegister") {
                setType("DISTRIBUTOR");
                return;
              }

              return;
            },
          })}
    >
      <a
        className="flex items-center border-b border-gray-200 py-2.5 px-0.5 cursor-pointer text-accent hover:text-accent-dark"
        onClick={() => {
          if (menu.requireLogin && !customer) {
            toast.info("Vui lòng đăng nhập để dùng tính năng này");
            props.onClose();
          }
        }}
      >
        <i className="text-primary">{menu.icon}</i>
        <div className="pl-2 text-sm font-medium">{menu.label}</div>
      </a>
    </Wrapper>
  );
}
