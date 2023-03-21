import formatDistanceToNowStrict from "date-fns/formatDistanceToNow";
import vi from "date-fns/locale/vi";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  RiBillLine,
  RiPriceTag3Line,
  RiProductHuntLine,
  RiRegisteredLine,
  RiSideBarFill,
  RiTicket2Line,
} from "react-icons/ri";
import { NotFound, Scrollbar, Spinner } from "../../../components/shared/utilities/misc";
import { useCrud } from "../../../lib/hooks/useCrud";
import { useOnScreen } from "../../../lib/hooks/useOnScreen";
import { Notification, NotificationService } from "../../../lib/repo/notification.repo";

export function NotificationList({
  onClose,
  isPopoverMode = true,
  onRead,
  ...props
}: {
  onClose: () => any;
  isPopoverMode?: boolean;
  onRead?: () => any;
} & ReactProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const { items, loadMore, pagination, loading, updateItem } = useCrud(NotificationService, {
    limit: 10,
    order: { _id: -1 },
    filter: selectedType ? { type: selectedType } : {},
  });
  async function handleClickNotification(notification: Notification) {
    switch (notification.type) {
      case "WEBSITE": {
        window.open(notification.link, "__blank");
        break;
      }
      // case "ORDER": {
      //   if (shopCode) {
      //     router.push(`/store/${shopCode}/order/${notification.order.code}`, null, {
      //       shallow: true,
      //     });
      //   } else {
      //     router.push(`/shop/orders?id=${notification.orderId}`, null, { shallow: true });
      //   }
      //   break;
      // }
      case "SUPPORT_TICKET": {
        router.push(`/shop/ticket?id=${notification.ticketId}`, null, { shallow: true });
        break;
      }
      case "PRODUCT": {
        router.push(`/shop/products?id=${notification.productId}`, null, { shallow: true });
        break;
      }
    }
    onClose();
    if (!notification.seen) {
      try {
        await NotificationService.readNotification(notification.id);
        updateItem({ id: notification.id, data: { seen: true } });
        onRead();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const NotificationContent = () => {
    const ref = useRef();
    const onScreen = useOnScreen(ref, "-10px");

    useEffect(() => {
      if (onScreen && items?.length < pagination?.total) {
        loadMore();
      }
    }, [onScreen]);

    return (
      <>
        {items ? (
          items.length > 0 ? (
            <div className="flex flex-col gap-2 py-2">
              {items.map((notification) => (
                <a
                  key={notification.id}
                  className={`cursor-pointer p-4 flex gap-3 justify-between ${
                    notification.seen ? "hover:bg-gray-100" : "bg-primary-light"
                  }`}
                  href={notification.link}
                  onClick={() => handleClickNotification(notification)}
                >
                  <i
                    className={`text-2xl ${notification.seen ? "text-yellow-400" : "text-primary"}`}
                  >
                    {getIconNoti(notification.type)}
                  </i>
                  <div
                    className={`${
                      notification.seen ? "text-gray-400" : "text-accent"
                    } flex-1 gap-1 flex-cols`}
                  >
                    <div className={`text-sm md:text-base font-bold`}>{notification.title}</div>
                    <div className="text-xs text-gray-700 md:text-sm">{notification.body}</div>
                    <div className="text-xs font-medium text-gray-500">
                      {formatDistanceToNowStrict(new Date(notification.sentAt), {
                        locale: vi,
                      })}{" "}
                      trước
                    </div>
                  </div>
                </a>
              ))}

              {loading ? (
                <div className="pt-3 font-semibold text-center loading-ellipsis text-primary">
                  Đang xem thêm
                </div>
              ) : (
                <div className="h-2" ref={ref}></div>
              )}
            </div>
          ) : (
            <NotFound text="Không có thông báo" />
          )
        ) : (
          <Spinner />
        )}
      </>
    );
  };

  try {
    return (
      <>
        {isPopoverMode ? (
          <Scrollbar
            wrapperClassName="p-2 pr-3 bg-white"
            height={450}
            wrapperStyle={{ maxHeight: "80vh", width: 320 }}
          >
            {/* <NotiTypeListHeader setSelectedType={setSelectedType} selectedType={selectedType} /> */}
            <NotificationContent />
          </Scrollbar>
        ) : (
          <>
            {/* <NotiTypeListHeader setSelectedType={setSelectedType} selectedType={selectedType} /> */}
            <NotificationContent />
          </>
        )}
      </>
    );
  } catch (err) {
    console.error(err);
    return <NotFound text="Có lỗi xảy ra" />;
  }
}

const NotiTypeListHeader = ({
  selectedType,
  setSelectedType,
  ...props
}: ReactProps & {
  selectedType: string | undefined;
  setSelectedType: (selectedType: string | undefined) => void;
}) => {
  const [notiList, setNotiList] = useState<Notification[]>();

  useEffect(() => {
    (async () => {
      try {
        const res = await NotificationService.getAll({
          query: {
            limit: 0,
            filter: {
              seen: false,
            },
          },
          fragment: "id",
        });
        setNotiList(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="flex items-center w-full px-2.5 pt-2 pb-3 overflow-x-auto border-b border-gray-200 lg:flex-wrap no-scrollbar">
      {NOTI_TYPE_LIST.map((type) => (
        <div
          key={type.label}
          className={`text-gray-400 items-center flex gap-2 border-2 rounded-md p-2 whitespace-nowrap mr-4 ${
            selectedType === type.value
              ? `bg-primary-light text-primary border-primary-light`
              : `border-gray-100 hover:border-primary hover:text-primary`
          }`}
          onClick={(el) => {
            setSelectedType(type.value);
            el.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }}
        >
          {type.icon && <i className="flex items-center text-2xl">{type.icon}</i>}{" "}
          <span
            className={`text-sm md:text-base ${selectedType === type.value && "font-semibold"}`}
          >
            {type.label}
          </span>
          {notiList?.filter((noti) => noti.type === type.value)?.length > 0 && (
            <span
              className={`p-1 text-xs md:text-sm bg-yellow-300 px-2 text-white rounded-full border border-white`}
            >
              {notiList?.filter((noti) => noti.type === type.value)?.length}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const getIconNoti = (type: string) => {
  if (!type) return;

  const notiType = NOTI_TYPE_LIST.find((x) => x.value === type);
  return notiType.icon;
};

const NOTI_TYPE_LIST = [
  {
    label: "Tất cả",
    value: undefined,
  },
  {
    label: "Tin khuyến mãi",
    icon: <RiPriceTag3Line />,
    value: "MESSAGE",
  },
  {
    label: "Đơn hàng",
    icon: <RiBillLine />,
    value: "ORDER",
  },
  {
    label: "Sản phẩm",
    icon: <RiProductHuntLine />,
    value: "PRODUCT",
  },
  {
    label: "Website",
    icon: <RiSideBarFill />,
    value: "WEBSITE",
  },
  {
    label: "SUPPORT_TICKET",
    icon: <RiTicket2Line />,
    value: "Yêu cầu hỗ trợ",
  },
  {
    label: "GLOBAL_COLL_REGIST",
    icon: <RiRegisteredLine />,
    value: "Đăng ký cộng tác viên",
  },
];
