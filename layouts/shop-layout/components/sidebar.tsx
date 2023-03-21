import { useRouter } from "next/router";
import {
  RiAddCircleLine,
  RiBillLine,
  RiChat4Line,
  RiClipboardLine,
  RiFileList2Line,
  RiFileListLine,
  RiGroupLine,
  RiHistoryLine,
  RiHomeSmile2Line,
  RiLineChartLine,
  RiListCheck2,
  RiQrCodeLine,
  RiSettings3Line,
  RiShoppingBag3Line,
  RiStore2Line,
  RiSurveyLine,
  RiTruckLine,
  RiUserFollowLine,
  RiUserStarLine,
} from "react-icons/ri";
import { useAuth } from "../../../lib/providers/auth-provider";
import { Footer } from "../../admin-layout/components/footer";
import DefaultSidebar from "../../default-sidebar";

interface PropsType extends ReactProps {}
export default function Sidebar({ ...props }: PropsType) {
  const router = useRouter();
  const { member } = useAuth();

  return (
    <div
      className={`bg-white shadow w-60 fixed flex flex-col z-10`}
      style={{ height: "calc(100vh)" }}
    >
      <div className="absolute z-50 w-full p-4 bg-white shadow h-18 ">
        <img className="w-32" src="/assets/img/logo-icon.png" />
      </div>
      <div className="relative flex-1 pt-2 border-t border-b border-gray-300">
        {/* <Scrollbars
          hideTracksWhenNotNeeded={true}
          autoHideTimeout={0}
          autoHideDuration={300}
          autoHide
        >
          {SIDEBAR_MENUS.map((menu, index) => (
            <div className="mb-2" key={index}>
              {menu.subMenus.map((submenu, index) => {
                const isActive =
                  router.pathname == submenu.path || router.pathname.startsWith(`${submenu.path}/`);
                const ref = useRef<HTMLButtonElement>();
                useEffect(() => {
                  if (isActive && ref.current) {
                    ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                }, [ref.current, isActive]);

                return (
                  <Button
                    innerRef={ref}
                    key={index}
                    primary={isActive}
                    className={`h-9 text-sm mt-0.5 w-full pl-6 pr-0 justify-start rounded-none ${
                      isActive ? "" : "hover:bg-primary-light"
                    }`}
                    icon={submenu.icon}
                    iconClassName={"text-xl"}
                    href={submenu.path}
                    text={
                      <div className="flex items-center">
                        <span>{submenu.title}</span>
                        {!!pendingDistributorRegistrations &&
                          submenu.pendingDistributorRegistrations && (
                            <BadgeShowNumberNoti numberNoti={pendingDistributorRegistrations} />
                          )}
                      </div>
                    }
                  />
                );
              })}
              </Accordion>
            </div>
          ))}
        </Scrollbars> */}
        <DefaultSidebar widthClassName="w-60" top={65} name="shop" menus={SIDEBAR_MENUS} closable />
      </div>
      {/* <div className="relative p-3 border-t border-t-gray-300">
        <div className="flex-col items-stretch border border-gray-300 rounded flex-center">
          <div className="flex items-center justify-between w-full px-3 py-2 border-b border-gray-300 rounded-t">
            <StatusLabel
              options={SUBSCRIPTION_PLANS}
              value={member.subscription.plan}
              type="text"
              extraClassName="pl-0"
            />
            <div className="text-xs text-gray-600">
              còn{" "}
              {formatDistanceToNow(new Date(member.subscription?.expiredAt), {
                locale: vi,
                addSuffix: true,
              })}
            </div>
          </div>
          <Button
            small
            light
            hoverPrimary
            className="w-full rounded-t-none"
            text={
              member.subscription.plan == "FREE" ? "Đăng ký gói tính phí" : "Gia hạn gói dịch vụ"
            }
            href={"/shop/settings/subscription"}
          />
        </div>
      </div> */}
      <Footer className="text-gray-600" />
    </div>
  );
}

export const SIDEBAR_MENUS = [
  {
    title: "Quản trị",
    subMenus: [
      {
        title: "Tổng quan",
        path: "/shop/dashboard",
        icon: <RiLineChartLine />,
      },
      {
        title: "Báo cáo",
        path: "/shop/report",
        icon: <RiBillLine />,
      },
      {
        title: "Lịch sử thanh toán",
        path: "/shop/payment-history",
        icon: <RiHistoryLine />,
      },
      {
        title: "Cấu hình cửa hàng",
        path: "/shop/settings",
        icon: <RiSettings3Line />,
      },
    ],
  },
  {
    title: "Cửa hàng",
    subMenus: [
      {
        title: "Chi nhánh",
        path: "/shop/branches",
        icon: <RiStore2Line />,
      },
      {
        title: "Khách hàng",
        path: "/shop/customers",
        icon: <RiGroupLine />,
      },
      {
        title: "Nhân viên",
        path: "/shop/staffs",
        icon: <RiUserFollowLine />,
      },
      {
        title: "Tài xế nội bộ",
        path: "/shop/drivers",
        icon: <RiTruckLine />,
      },
      {
        title: "Đánh giá",
        path: "/shop/comments",
        icon: <RiChat4Line />,
      },
      {
        title: "Kho hàng",
        path: "/shop/warehouse",
        icon: <RiHomeSmile2Line />,
      },
      {
        title: "Phiếu kho",
        path: "/shop/inventory-vouchers",
        icon: <RiFileListLine />,
      },
    ],
  },
  {
    title: "Sản phẩm",
    subMenus: [
      {
        title: "Đơn hàng",
        path: "/shop/orders",
        icon: <RiSurveyLine />,
      },
      {
        title: "Sản phẩm",
        path: "/shop/products",
        icon: <RiShoppingBag3Line />,
      },
      {
        title: "Mẫu thông số SP",
        path: "/shop/specs-template",
        icon: <RiClipboardLine />,
      },
      {
        title: "Thuộc tính",
        path: "/shop/toppings",
        icon: <RiAddCircleLine />,
      },

      {
        title: "QR Code",
        path: "/shop/qr-code-management",
        icon: <RiQrCodeLine />,
      },
    ],
  },
  {
    title: "Dịch vụ",
    subMenus: [
      {
        title: "Dịch vụ",
        path: "/shop/services",
        icon: <RiListCheck2 />,
      },
      {
        title: "Lịch hẹn",
        path: "/shop/service-reservations",
        icon: <RiFileList2Line />,
      },
      {
        title: "Chuyên viên",
        path: "/shop/shop-service-specialist",
        icon: <RiUserStarLine />,
      },
    ],
  },
];

// {
//   title: "Khuyến mãi",
//   path: "/shop/vouchers",
//   icon: <RiCoupon3Line />,
// },

// {
//   title: "Đăng ký cộng tác",
//   path: "/shop/distributor-registrations",
//   icon: <IconDistributor />,
//   pendingDistributorRegistrations: true,
// },

// {
//   title: "Cộng tác viên",
//   path: "/shop/collaborators",
//   icon: <RiUserAddLine />,
// },

// {
//   title: "Vòng quay",
//   path: "/shop/lucky-wheels",
//   icon: <RiEditCircleLine />,
// },

// {
//   title: "Bảng giá",
//   path: "/shop/price-policy",
//   icon: <RiPriceTag2Line />,
// },
// {
//   title: "Điểm bán",
//   path: "/shop/sale-points",
//   icon: <RiMapPinLine />,
// },
// {
//   title: "Giải ngân",
//   path: "/shop/disburses",
//   icon: <IconDisburses  />,
// },
// {
//   title: "Đăng bán",
//   path: "/shop/sale-feeds",
//   icon: <RiFileEditLine />,
// },

// {
//   title: "Chiến dịch",
//   path: "/shop/triggers",
//   icon: <RiCoupon4Line />,
// },
