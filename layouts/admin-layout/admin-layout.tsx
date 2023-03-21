import { cloneDeep } from "lodash";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { ImNewspaper } from "react-icons/im";
import {
  RiBillLine,
  RiEdit2Line,
  RiFileList2Line,
  RiFileList3Line,
  RiFileListLine,
  RiImageLine,
  RiListCheck,
  RiMapPinLine,
  RiNotificationBadgeLine,
  RiPlantLine, RiProductHuntLine,
  RiQuestionAnswerLine,
  RiQuestionnaireLine,
  RiSettings3Line,
  RiStore2Line, RiTicket2Line,
  RiUser2Line,
  RiUser5Line,
  RiVideoLine,
  RiVirusLine
} from "react-icons/ri";
import { ErrorCatcher, Spinner } from "../../components/shared/utilities/misc";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import DefaultSidebar, { SidebarMenu } from "../default-sidebar";
import { Header } from "./components/header";
import { AdminLayoutProvider } from "./providers/admin-layout-provider";

interface Props extends ReactProps {}
export function AdminLayout({ ...props }: Props) {
  const { user, redirectToAdminLogin } = useAuth();

  useEffect(() => {
    if (user === null) {
      redirectToAdminLogin();
    }
  }, [user]);

  return (
    <>
      <DefaultHead />
      {!user ? (
        <div className="min-h-screen w-h-screen">
          <Spinner />
        </div>
      ) : (
        <AdminLayoutContent>{props.children}</AdminLayoutContent>
      )}
    </>
  );
}

function AdminLayoutContent({ ...props }: ReactProps) {
  const [menus, setMenus] = useState(cloneDeep(SIDEBAR_MENUS));

  // useEffect(() => {
  //   const subMenu = menus[1].subMenus.find((x) => x.id == "shop-registration");
  //   subMenu.badge = 3;
  //   setMenus([...menus]);
  // }, []);

  if (!menus) return <></>;
  return (
    <AdminLayoutProvider>
      <NextSeo title="GreenAgri Admin" />
      {/* <ChatProvider senderRole="ADMIN" senderId={user.id}> */}
      <Header />
      <div className="relative flex w-full min-h-screen pt-14">
        <DefaultSidebar widthClassName="w-64" top={56} name="admin" menus={menus} closable />
        <div className="flex flex-col flex-1 pl-64">
          <div className="p-6">
            <ErrorCatcher>{props.children}</ErrorCatcher>
            {/* {!props.scope || (props.scope && user.scopes.includes(props.scope)) ? (
            <ErrorCatcher>{props.children}</ErrorCatcher>
          ) : (
            <Card>
              <NotFound icon={<HiOutlineExclamation />} text="Không đủ quyền truy cập" />
            </Card>
          )} */}
          </div>
        </div>
      </div>
      {/* </ChatProvider> */}
    </AdminLayoutProvider>
  );
}

export const SIDEBAR_MENUS: SidebarMenu[] = [
  {
    title: "Quản trị",
    subMenus: [
      {
        title: "Tài khoản",
        path: "/admin/users",
        icon: <RiUser2Line />,
      },
      {
        title: "Cấu hình",
        path: "/admin/settings",
        icon: <RiSettings3Line />,
      },
    ],
  },
  {
    title: "Cửa hàng",
    subMenus: [
      {
        title: "Cửa hàng",
        path: "/admin/members",
        icon: <RiStore2Line />,
      },
      {
        title: "Khách hàng",
        path: "/admin/customers",
        icon: <RiUser5Line />,
      },
      {
        title: "Đơn hàng",
        path: "/admin/orders",
        icon: <RiBillLine />,
      },
      {
        title: "Sản phẩm",
        path: "/admin/global-product-categories",
        icon: <RiProductHuntLine />,
      },
      {
        title: "Khuyến mãi",
        path: "/admin/vouchers",
        icon: <RiTicket2Line />,
      },
      // {
      //   title: "Danh mục cửa hàng",
      //   path: "/admin/shop-categories",
      //   icon: <RiStore3Line />,
      // },
      {
        title: "Banner cửa hàng",
        path: "/admin/banners",
        icon: <RiImageLine />,
      },
      {
        title: "Đăng ký cửa hàng",
        path: "/admin/registrations",
        icon: <RiEdit2Line />,
        id: "shop-registration",
      },
      // {
      //   title: "Tag sản phẩm",
      //   path: "/admin/product-tags",
      //   icon: <RiPriceTag3Line />,
      // },
      {
        title: "Báo cáo",
        path: "/admin/report",
        icon: <RiFileList3Line />,
      },
      {
        title: "Loại dịch vụ",
        path: "/admin/service-tags",
        icon: <RiListCheck />,
      },
      {
        title: "Quản lý lịch hẹn",
        path: "/admin/service-reservations",
        icon: <RiFileList2Line />,
      },
    ],
  },
  {
    title: "Đăng tin",
    subMenus: [
      {
        title: "Người đăng tin",
        path: "/admin/writers",
        icon: <RiFileListLine />,
      },
      {
        title: "Tin tức",
        path: "/admin/posts",
        icon: <ImNewspaper />,
      },
      {
        title: "Video",
        path: "/admin/videos",
        icon: <RiVideoLine />,
      },
      {
        title: "Khu vực",
        path: "/admin/areas",
        icon: <RiMapPinLine />,
      },
    ],
  },
  {
    title: "Hỏi đáp",
    subMenus: [
      {
        title: "Câu hỏi",
        path: "/admin/questions",
        icon: <RiQuestionnaireLine />,
      },
      {
        title: "Chủ đề câu hỏi",
        path: "/admin/questions-topic",
        icon: <RiQuestionAnswerLine />,
      },
      {
        title: "Chuyên gia",
        path: "/admin/experts",
        icon: <RiNotificationBadgeLine />,
      },
      {
        title: "Loại cây",
        path: "/admin/plants",
        icon: <RiPlantLine />,
      },
      {
        title: "Loại bệnh",
        path: "/admin/diseases",
        icon: <RiVirusLine />,
      },
    ],
  },
];
