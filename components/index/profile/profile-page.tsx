import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AiOutlineQuestionCircle, AiOutlineUser } from "react-icons/ai";
import { FaRegAddressBook } from "react-icons/fa";
import { RiBillLine, RiFileList2Line, RiFileListLine } from "react-icons/ri";
import { useAuth } from "../../../lib/providers/auth-provider";
import { BreadCrumbs, Spinner } from "../../shared/utilities/misc";
import { ProfileAccount } from "./components/profile-account";
import { ProfileAddress } from "./components/profile-address";
import { ProfileInteractionHistory } from "./components/profile-interaction-history";
import { ProfileOrderHistory } from "./components/profile-order-history";
import { ProfileQuestionHistory } from "./components/profile-question-history";
import { ProfileReservations } from "./components/profile-reservations";
import { ProfileReservationsDetail } from "./components/profile-reservations-detail";
import { ProfileMenu } from "./profile-menu";

export function ProfilePage({ ...props }) {
  const router = useRouter();
  const { globalCustomer } = useAuth();

  useEffect(() => {
    if (globalCustomer === null) {
      router.replace("/");
    }
  }, [globalCustomer]);

  const selectedMenu = useMemo(() => PROFILE_MENUS.find((x) => router.pathname.includes(x.href)), [
    router.pathname,
  ]);

  useEffect(() => {
    if (!selectedMenu) {
      router.replace("/profile/account");
    }
  }, [selectedMenu]);

  if (!globalCustomer) return <Spinner />;
  return (
    <section className="py-5 main-container">
      <BreadCrumbs
        className="relative z-10 py-6"
        breadcrumbs={[
          {
            href: "/",
            label: "Trang chủ",
          },
          {
            href: `/profile`,
            label: `Tài khoản`,
          },
          ...(selectedMenu
            ? [
                {
                  label: selectedMenu.label as string,
                },
              ]
            : []),
        ]}
      />
      <div className="flex justify-between">
        <ProfileMenu selectedMenu={selectedMenu} />
        <div className="flex-1 ml-5 max-w-[80%]">
          {
            <div className="p-5 mb-8 bg-white rounded-md">
              {selectedMenu ? (
                <>
                  {
                    {
                      "/profile/account": <ProfileAccount />,
                      "/profile/interaction-history": <ProfileInteractionHistory />,
                      "/profile/question-history": <ProfileQuestionHistory />,
                      "/profile/address": <ProfileAddress />,
                      "/profile/order-history": <ProfileOrderHistory />,
                      "/profile/reservations": router?.query?.id ? (
                        <ProfileReservationsDetail />
                      ) : (
                        <ProfileReservations />
                      ),
                    }[selectedMenu.href]
                  }
                </>
              ) : (
                <></>
              )}
            </div>
          }
        </div>
      </div>
    </section>
  );
}

export const PROFILE_MENUS = [
  {
    href: "/profile/account",
    label: "Hồ sơ của tôi",
    icon: <AiOutlineUser />,
  },
  {
    href: "/profile/question-history",
    label: "Lịch sử câu hỏi của tôi",
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
    href: "/profile/order-history",
    label: "Lịch sử đơn hàng",
    icon: <RiBillLine />,
  },
  {
    href: "/profile/reservations",
    label: "Lịch sử đặt lịch",
    icon: <RiFileListLine />,
  },
];
