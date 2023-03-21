import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AiOutlineUser, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { FaRegAddressBook } from "react-icons/fa";
import { RiArrowRightSLine, RiFileList2Line } from "react-icons/ri";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form";
import { BreadCrumbs, Img, Spinner } from "../../shared/utilities/misc";
import { PROFILE_MENUS } from "./profile-page";

export const ProfilePageWebapp = () => {
  const router = useRouter();
  const alert = useAlert();
  const toast = useToast();
  const { globalCustomer, logoutGlobalCustomer } = useAuth();

  useEffect(() => {
    if (globalCustomer === null) {
      router.replace("/login");
    }
  }, [globalCustomer]);

  // const selectedMenu = useMemo(() => PROFILE_WEBAPP_MENUS.find((x) => router.pathname === x.href), [
  //   router.pathname,
  // ]);

  if (!globalCustomer) return <Spinner />;
  return (
    <>
      <div className="px-3 bg-white border-b boder-b-neutralGrey">
        <BreadCrumbs
          className="relative z-10 my-3"
          breadcrumbs={[
            {
              href: "/",
              label: "Trang chủ",
            },
            {
              label: "Tài khoản",
            },

            // ...(selectedMenu
            //   ? [
            //       selectedMenu?.href.includes("/profile/") && {
            //         href: "/profile",
            //         label: "Tài khoản",
            //       },

            //       {
            //         label: selectedMenu.label as string,
            //       },
            //     ]
            //   : []),
          ]}
        />
      </div>
      <div className="flex-1 bg-white">
        <div className="px-3 py-6 text-sm main-container text-accent md:text-base">
          <div className="flex flex-col items-center gap-2">
            <Img className="w-20" avatar src={globalCustomer?.avatar} />
            <div className="pl-2.5 text-center">
              <div className="text-neutralGrey">Tài khoản của</div>
              <div className="text-base font-bold md:text-lg">
                {globalCustomer?.name || globalCustomer?.phone}
              </div>
            </div>
          </div>
          <div className="gap-1 my-2 flex-cols">
            {PROFILE_MENUS.map((menu, index) => (
              <Link href={menu.href} key={index}>
                <a>
                  <div className="flex-between-center" key={index}>
                    <div className="flex items-center flex-1 gap-2">
                      <i className="text-lg text-primary">{menu.icon}</i>
                      <div className="font-semibold">{menu.label}</div>
                    </div>
                    <Button
                      icon={<RiArrowRightSLine />}
                      iconClassName="text-gray-400 text-2xl"
                      className="px-0"
                    />
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div
            className="flex items-center gap-2 mt-3"
            onClick={async () => {
              const res = await alert.warn("Đăng xuất");
              if (!res) return;
              await logoutGlobalCustomer();
              toast.success("Đăng xuất thành công!");
            }}
          >
            <i className="text-xl text-primary">
              <BiExit />
            </i>
            <div className="font-semibold">Đăng xuất</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const PROFILE_WEBAPP_MENUS = [
  {
    href: "/profile",
    label: "Tài khoản",
  },
  {
    href: "/profile/account",
    label: "Hồ sơ của tôi",
    icon: <AiOutlineUser />,
  },
  {
    href: "/profile/question-history",
    label: "Lịch sử câu hỏi",
    icon: <AiOutlineQuestionCircle />,
  },
  {
    href: "/profile/interaction-history",
    label: "Lịch sử tương tác",
    icon: <RiFileList2Line />,
  },
  {
    href: "/profile/address",
    label: "Danh sách địa chỉ",
    icon: <FaRegAddressBook />,
  },
  {
    href: "/profile/address/?create=true",
    label: "Tạo địa chỉ",
  },
  {
    href: "/profile/address?edit=true",
    label: "Chi tiết địa chỉ",
  },
  // {
  //   href: "/profile/order-history",
  //   label: "Lịch sử đơn hàng",
  //   icon: <FiShoppingBag />,
  // },
  // {
  //   href: "/profile/collaborators",
  //   label: "Cộng tác viên",
  //   icon: <AiOutlineUsergroupAdd />,
  // },
  // {
  //   href: "/profile/shops",
  //   label: "Danh sách cửa hàng",
  //   icon: <RiStore2Line />,
  // },
];
