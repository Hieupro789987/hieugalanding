import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import {
  RiAccountBoxLine,
  RiArchiveLine,
  RiFileList2Line,
  RiIndeterminateCircleFill,
  RiListCheck2,
  RiStoreLine,
} from "react-icons/ri";
import { ErrorCatcher, NotFound, Spinner } from "../../components/shared/utilities/misc";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import DefaultSidebar from "../default-sidebar";
import { Header } from "./components/header";
import { StaffLayoutProvider } from "./providers/staff-layout-provider";

interface PropsType extends ReactProps {
  scope?: string;
}

export function StaffLayout({ ...props }: PropsType) {
  const router = useRouter();
  const { staff, redirectToStaffLogin } = useAuth();

  useEffect(() => {
    if (staff === null) {
      redirectToStaffLogin();
      return;
    }

    if (
      !!staff?.id &&
      router.asPath === "/staff" &&
      staff?.scopes?.includes("ORDER") &&
      !staff?.scopes?.includes("WAREHOUSE")
    ) {
      router.replace(`/staff/orders`);
      return;
    }

    if (
      !!staff?.id &&
      router.asPath === "/staff" &&
      !staff?.scopes?.includes("ORDER") &&
      staff?.scopes?.includes("WAREHOUSE")
    ) {
      router.replace(`/staff/inventory-vouchers`);
      return;
    }

    if (!!staff?.id && router.asPath === "/staff") {
      router.replace(`${SIDEBAR_MENUS[0]["subMenus"][0]["path"]}`);
      return;
    }
  }, [staff]);

  return (
    <>
      <DefaultHead />
      {!staff ? (
        <div className="min-h-screen w-h-screen">
          <Spinner />
        </div>
      ) : (
        <StaffLayoutTemplate children={props.children} />
      )}
    </>
  );
}

export function StaffLayoutTemplate({ scope, children, ...props }: PropsType) {
  const router = useRouter();
  const { staff, staffPermission } = useAuth();

  const hasPermission = useMemo(() => {
    if (staff === undefined) return undefined;
    const subMenu = SIDEBAR_MENUS[0].subMenus.find(
      (y) => router.pathname === y?.path || router.pathname.startsWith(y?.path + "/")
    );

    // cho phép truy cập vào menu sản phẩm và đơn hàng khi không cấp quyền gì cho nhân viên
    if (
      !staff.scopes.includes("ORDER") &&
      !staff.scopes.includes("WAREHOUSE") &&
      ["/staff/products", "/staff/warehouse"].includes(subMenu?.path)
    )
      return true;

    return subMenu?.permission ? staffPermission(subMenu.permission) : true;
  }, [router.pathname, staff]);

  const menu = useMemo(() => {
    if (!staff?.id) return [];

    let newMenu: any = [...SIDEBAR_MENUS];
    if (!staff.scopes.includes("ORDER")) {
      newMenu[0].subMenus = newMenu[0].subMenus?.filter((menu) => menu.path !== "/staff/orders");
    }

    if (!staff.scopes.includes("WAREHOUSE")) {
      newMenu[0].subMenus = newMenu[0].subMenus?.filter(
        (menu) => menu.path !== "/staff/inventory-vouchers"
      );
    }

    return newMenu;
  }, [staff]);

  return (
    <StaffLayoutProvider>
      <NextSeo title="GreenAgri Staff" />
      <Header />
      <div className="relative flex w-full min-h-screen pt-14">
        <DefaultSidebar widthClassName="w-64" menus={menu} top={56} name="staff" closable />
        <div className="flex flex-col flex-1 pl-64">
          <div className="p-6">
            <ErrorCatcher>
              {hasPermission ? (
                <>{children}</>
              ) : hasPermission === false ? (
                <NotFound
                  icon={<RiIndeterminateCircleFill />}
                  text="Không có quyền truy cập tính năng này"
                />
              ) : (
                <></>
              )}
            </ErrorCatcher>
          </div>
        </div>
      </div>
    </StaffLayoutProvider>
  );
}

export const SIDEBAR_MENUS: any = [
  {
    title: "Danh mục",
    subMenus: [
      {
        title: "Tài khoản",
        path: "/staff/profile",
        icon: <RiAccountBoxLine />,
      },
      {
        title: "Sản phẩm",
        path: "/staff/products",
        icon: <RiArchiveLine />,
        permission: "READ_PRODUCTS",
      },
      {
        title: "Đơn hàng",
        path: "/staff/orders",
        icon: <RiListCheck2 />,
        permission: "READ_ORDERS",
      },
      {
        title: "Kho",
        path: "/staff/warehouse",
        icon: <RiStoreLine />,
        permission: "READ_WAREHOUSE",
      },
      {
        title: "Phiếu kho",
        path: "/staff/inventory-vouchers",
        icon: <RiFileList2Line />,
        permission: "READ_INVENTORY_VOUCHERS",
      },
    ],
  },
];
