import Link from "next/link";
import { useRef, useState } from "react";
import { RiLogoutBoxRLine, RiNotification3Line, RiStore2Line, RiUser3Fill } from "react-icons/ri";
import { parseAddressTypePlace } from "../../../components/shared/question/commons/commons";
import { Button } from "../../../components/shared/utilities/form";

import { Img, Scrollbar } from "../../../components/shared/utilities/misc";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { Popover } from "../../../components/shared/utilities/popover/popover";

import { useAuth } from "../../../lib/providers/auth-provider";
import { Notification } from "../../../lib/repo/notification.repo";
import { messageOfNotification } from "../../default-layout/components/notification-list";

interface PropsType extends ReactProps {}
export function Header({ ...props }: PropsType) {
  const staffRef = useRef();
  const notificationRef = useRef();
  const { staff, logoutStaff } = useAuth();
  const [total, setTotal] = useState<number>();

  // const NotificationCrud = useCrud(NotificationService, { limit: 6, order: { createdAt: -1 } });

  // const handleSeenNotification = async (data: Notification) => {
  //   if (!data) return;
  //   try {
  //     (notificationRef.current as any)?._tippy?.hide();
  //     await NotificationService.readNotification(data?.id);
  //     await NotificationCrud.loadAll(true);
  //     getAllNotificationNotSeen();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleSeenAllNotification = async () => {
  //   try {
  //     await NotificationService.readAllNotification();
  //     (notificationRef.current as any)?._tippy?.hide();
  //     await NotificationCrud.loadAll(true);
  //     setTotal(0);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const getAllNotificationNotSeen = async () => {
  //   const totalNotiNotSeen = await NotificationService.getAll({
  //     query: { limit: 0, filter: { seen: false } },
  //   });
  //   const total = totalNotiNotSeen.data.filter((item) => item.seen == false).length;
  //   setTotal(total);
  // };

  // useEffect(() => {
  //   getAllNotificationNotSeen();
  // }, []);

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center w-full py-2 bg-white shadow h-18">
        <Link href="/staff/profile">
          <a className="block w-64 grow-0 shrink-0">
            <div className="flex items-center h-full px-8 py-3 text-xl font-bold border-r text-primary">
              <img className="object-contain" height={"100%"} src="/assets/img/logo-icon.png" />
              <div className="w-24 h-5 -ml-2 text-lg">| Staff</div>
            </div>
          </a>
        </Link>
        <div className="flex items-center w-full px-8">
          <div className="flex items-center w-3/4 gap-2 grow-0 shrink-0">
            <Img
              className="w-10 border border-gray-100 rounded-full"
              default={staff?.member?.shopLogo}
              src={staff?.member?.shopLogo}
              avatar
              alt="shop-logo"
            />
            <div className="pl-2">
              <div className="mt-1 font-semibold text-gray-700">{staff?.member?.shopName}</div>
              <Button
                className="h-auto px-0 text-sm font-medium underline hover:underline"
                textPrimary
                targetBlank
                icon={<RiStore2Line />}
                iconClassName="pb-0.5"
                text="Xem cửa hàng của tôi"
                href={location.origin + "/store/" + staff?.member?.code}
              />
            </div>
            <div className="px-3 py-1 lg:py-1.5 ml-8 bg-gray-100 rounded-md">
              <div className="font-semibold uppercase">{staff?.branch?.name}</div>
              <div className="text-sm">{parseAddressTypePlace(staff?.branch)}</div>
            </div>
          </div>
          <div className="flex items-center justify-end flex-1">
            <Button
              icon={<RiNotification3Line />}
              iconClassName="text-xl text-primary"
              tooltip="Thông báo"
              className="relative rounded-none h-14 hover:bg-gray-100"
              innerRef={notificationRef}
            >
              {total > 0 && (
                <span className="z-20 inline-block w-2 h-2 ml-4  rounded-full bg-red  absolute right-[21px] top-[16px]"></span>
              )}
            </Button>

            <div
              className="flex items-center p-1 transition-colors cursor-pointer group hover:bg-accent-light"
              ref={staffRef}
            >
              <Img
                className="w-10 border border-gray-100 rounded-full"
                default={staff?.avatar}
                src={staff?.avatar}
                avatar
              />

              <div className="pl-2 whitespace-nowrap">
                <div className="mb-1 font-semibold leading-4 text-gray-700 group-hover:text-primary">
                  {staff?.name}
                </div>
                <div className="text-sm leading-3 text-gray-600 group-hover:text-primary">
                  {staff?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Popover placement="bottom" reference={notificationRef} trigger="click">
          <div style={{ margin: "-5px -9px" }} className="overflow-hidden min-w-xs">
            <div className="flex items-center justify-between p-5 border-b-2 border-b-gray-200 ">
              <div className="text-base font-semibold">Thông báo</div>
              <Button
                textPrimary
                className="h-auto pr-0 text-sm"
                // onClick={total > 0 && handleSeenAllNotification}
                text={total > 0 ? "Xem tất cả" : "Đã đọc hết"}
              />
            </div>
            <Scrollbar
              hideTracksWhenNotNeeded
              innerClassName="bg-white"
              height={450}
              wrapperStyle={{ maxHeight: "36.5vh", width: 320 }}
            >
              {/* {NotificationCrud?.items?.length > 0 ? (
                NotificationCrud?.items.map((item) => (
                  <NotificationItem
                    notification={item}
                    key={item.id}
                    onClickSeenNotification={(data) => handleSeenNotification(data)}
                  />
                ))
              ) : (
                <NotFound text="Thông báo trống" />
              )} */}
            </Scrollbar>
            {/* {NotificationCrud.hasMore && (
              <Button
                text="Xem thêm"
                primary
                isLoading={NotificationCrud.loading}
                asyncLoading={false}
                onClick={() => NotificationCrud.loadMore()}
                className="w-full rounded-t-none"
              />
            )} */}
          </div>
        </Popover>

        <Dropdown reference={staffRef} trigger="click" placement="bottom-start" arrow>
          <Dropdown.Item
            icon={<RiUser3Fill />}
            text="Hồ sơ"
            href={{ pathname: "/staff/profile" }}
          />
          <Dropdown.Divider />
          <Dropdown.Item
            hoverDanger
            icon={<RiLogoutBoxRLine />}
            text="Đăng xuất"
            onClick={logoutStaff}
          />
        </Dropdown>
      </div>
    </>
  );
}

export function NotificationItem({
  notification,
  ...props
}: { onClickSeenNotification: (val: any) => Promise<any> } & { notification: Notification }) {
  return (
    <Link href={`/staff/questions?id=${notification?.questionId}`}>
      <a className="cursor-pointer" onClick={() => props.onClickSeenNotification(notification)}>
        <div
          className={`${
            !notification?.seen && "flex"
          } items-center  py-2  px-5 border-b border-b-gray-100 justify-between ${
            !notification?.seen ? "bg-primary-light" : ""
          }`}
        >
          {/* <div className="w-full flex-center">{notification?.body}</div> */}
          {messageOfNotification(notification)}
          {!notification?.seen && <div className="w-2 h-2 ml-4 rounded-full bg-primary"></div>}
        </div>
      </a>
    </Link>
  );
}
