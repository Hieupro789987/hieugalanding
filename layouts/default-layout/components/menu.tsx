import { HiOutlineX } from "react-icons/hi";
import {
  RiChat1Line,
  RiCustomerService2Line,
  RiDoorLockLine,
  RiHome4Line,
  RiInformationLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiRegisteredLine,
  RiShieldUserLine,
  RiStore2Line,
} from "react-icons/ri";
import { DialogProps } from "../../../components/shared/utilities/dialog/dialog";
import { Slideout } from "../../../components/shared/utilities/dialog/slideout";
import { Button } from "../../../components/shared/utilities/form";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Footer } from "../../default-layout/components/footer";

interface Propstype extends DialogProps {}
export function Menu({ ...props }: Propstype) {
  const { shop, customer, shopCode } = useShopContext();
  const { logout } = useAuth();

  const menus: {
    label: string;
    icon: JSX.Element;
    onClick?: Function;
    href?: string;
  }[] = [
    {
      label: "Trang cửa hàng",
      icon: <RiStore2Line />,
      href: `/store/${shopCode}`,
    },
    {
      label: "Trang chủ",
      icon: <RiHome4Line />,
      href: `/`,
    },
    {
      label: "Giới thiệu",
      icon: <RiInformationLine />,
      href: `/store/${shopCode}/informartion`,
    },
    // ...(shop.config.collaborator
    //   ? customer?.isCollaborator
    //     ? [
    //         {
    //           label: "Thông tin CTV cửa hàng",
    //           icon: <RiShieldUserLine />,
    //           href: `/store/${shopCode}/collaborator/info`,
    //         },
    //       ]
    //     : [
    //         {
    //           label: "Đăng ký CTV cửa hàng",
    //           icon: <RiRegisteredLine />,
    //           href: `/store/${shopCode}/collaborator/register`,
    //         },
    //       ]
    //   : []),
    // ,
    // {
    //   label: "Vòng quay may mắn",
    //   icon: <RiDoorLockLine />,
    //   href: `/store/${shopCode}/wheel`,
    // },
    // {
    //   label: "Đăng ký điểm bán",
    //   icon: <RiMapPinLine />,
    //   href: `/store/${shopCode}/register-sale-point`,
    // },
    // {
    //   label: "Hỗ trợ",
    //   icon: <RiCustomerService2Line />,
    //   href: `/store/${shopCode}/support`,
    // },
    {
      label: "Chat với chúng tôi",
      icon: <RiChat1Line />,
      href: `/store/${shopCode}/chat`,
    },
    {
      label: "Đăng xuất",
      icon: <RiLogoutBoxRLine />,
      onClick: () => {
        props.onClose();
        logout();
      },
    },
  ];

  return (
    <>
      <Slideout
        {...props}
        minWidth="84vw"
        maxWidth={300}
        placement="right"
        hasCloseButton={false}
        mobileSizeMode
      >
        <div className="flex flex-col h-full px-3 py-4 ml-auto overflow-y-auto text-white bg-primary max-w-2xs sm:max-w-xs">
          <div className="flex items-center justify-between h-14">
            <span className="text-lg font-bold text-gray-100">Menu</span>
            <button
              className="w-10 h-10 px-0 text-2xl text-gray-100 transform translate-x-3 btn hover:text-white hover:bg-primary-dark"
              onClick={() => props.onClose()}
            >
              <i className="">
                <HiOutlineX />
              </i>
            </button>
          </div>
          <div className="flex-1">
            {menus.map((menu, index) => (
              <Button
                hoverWhite
                className={`py-2 text-base sm:py-3 h-auto w-full text-gray-50 justify-start px-2 border-b border-gray-100 rounded-none border-opacity-60`}
                iconClassName={"mr-2.5 text-lg"}
                key={index}
                href={menu.href}
                icon={menu.icon}
                text={menu.label}
                onClick={() => {
                  if (menu.href) {
                    props.onClose();
                  } else {
                    menu.onClick();
                  }
                }}
              />
            ))}
          </div>
          <Footer className="text-xs text-center text-gray-100 sm:text-base" />
        </div>
      </Slideout>
    </>
  );
}
