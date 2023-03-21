import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { NotFound, Scrollbar, Spinner } from "../../../components/shared/utilities/misc";
import { formatDate } from "../../../lib/helpers/parser";
import { useCrud } from "../../../lib/hooks/useCrud";
import { useOnScreen } from "../../../lib/hooks/useOnScreen";
import { useToast } from "../../../lib/providers/toast-provider";
import { Notification, NotificationService } from "../../../lib/repo/notification.repo";
import { TopicService } from "../../../lib/repo/topic.repo";

export function NotificationList({
  notificationCurd,
  isPopoverMode = true,
  shopCode = "",
  onRead,
  ...props
}: {
  isPopoverMode?: boolean;
  notificationCurd: any;
  onClickSeenNotification: (val) => Promise<any>;
  shopCode?: string;
  onRead?: () => any;
} & ReactProps) {
  const router = useRouter();
  // const { items, loadMore, setItems, pagination, loading, updateItem } = useCrud(
  //   TopicService,
  //   // {
  //   //   limit: 5,
  //   //   order: { _id: -1 },
  //   // },
  //   undefined,
  //   { dummyItems: DUMMY_NOTIFICATION_LIST, dummyMoreItems: DUMMY_LOAD_MORE_NOTIFICATION_LIST }
  // );

  // async function handleClickNotification(notification: Notification) {
  //   if (!notification.seen) {
  //     try {
  //       await NotificationService.readNotification(notification.id);
  //       updateItem({ id: notification.id, data: { seen: true } });
  //       onRead();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   switch (notification.type) {
  //     case "WEBSITE": {
  //       window.open(notification.link, "__blank");
  //       break;
  //     }
  //     case "ORDER": {
  //       if (shopCode) {
  //         router.push(`/${shopCode}/order/${notification.order.code}`, null, { shallow: true });
  //       } else {
  //         router.push(`/shop/orders?id=${notification.orderId}`, null, { shallow: true });
  //       }
  //       break;
  //     }
  //     case "SUPPORT_TICKET": {
  //       router.push(`/shop/ticket?id=${notification.ticketId}`, null, { shallow: true });
  //       break;
  //     }
  //     case "PRODUCT": {
  //       router.push(`/shop/products?id=${notification.productId}`, null, { shallow: true });
  //       break;
  //     }
  //   }
  //   onClose();
  // }

  const NotificationContent = () => {
    const ref = useRef();
    const onScreen = useOnScreen(ref, "-10px");
    useEffect(() => {
      if (onScreen && notificationCurd.items?.length < notificationCurd.pagination?.total) {
        notificationCurd.loadMore();
      }
    }, [onScreen]);

    return (
      <>
        {notificationCurd.items ? (
          notificationCurd.items.length > 0 ? (
            <div className="flex flex-col">
              {notificationCurd.items.map((notification) => (
                // <a
                //   key={notification.id}
                //   className={`cursor-pointer p-2 rounded ${
                //     notification.seen ? "hover:bg-slate-light" : "bg-blue-50 hover:bg-blue-100"
                //   }`}
                //   href={notification.link}
                //   // onClick={() => handleClickNotification(notification)}
                // >
                //   <div
                //     className={`text-base font-medium ${notification.seen ? "" : "text-blue-500"}`}
                //   >
                //     {notification.title}
                //   </div>
                //   <div className="text-sm text-gray-600">{notification.body}</div>
                //   <div className="text-xs font-medium text-gray-500">
                //     {formatDistanceToNowStrict(new Date(notification.createdAt), { locale: vi })}{" "}
                //     trước
                //   </div>
                // </a>
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClickSeenNotification={(val) => props.onClickSeenNotification(val)}
                />
              ))}

              {notificationCurd.loading ? (
                <div className="pt-3 font-semibold text-center loading-ellipsis text-primary">
                  Đang tải thêm
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
            hideTracksWhenNotNeeded
            innerClassName="bg-white"
            height={450}
            wrapperStyle={{ maxHeight: "80vh", width: 320 }}
          >
            <NotificationContent />
          </Scrollbar>
        ) : (
          <NotificationContent />
        )}
      </>
    );
  } catch (err) {
    console.error(err);
    return <NotFound text="Có lỗi xảy ra" />;
  }
}

function NotificationItem({
  notification,
  ...props
}: ReactProps & { onClickSeenNotification: (val: any) => Promise<any> } & {
  notification: Notification;
}) {
  return (
    <Link href={`/questions/${notification?.question?.slug}`}>
      <a>
        <div
          className={`py-2 border-t flex gap-1 overflow-hidden flex-wrap items-center cursor-pointer hover:bg-gray-50 ${
            !notification?.seen && "bg-primary-light"
          }`}
        >
          <div
            className="flex-1 pl-5 leading-6"
            onClick={() => props.onClickSeenNotification(notification)}
          >
            {messageOfNotification(notification)}
          </div>
          <div className="w-8 shrink-0 grow-0 flex-center">
            {!notification?.seen && (
              <div className="p-2.5 cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}

export const messageOfNotification = (notification: Notification) => {
  const {
    interactorId,
    interactionActionType,
    interactWithId,
    createdAt,
    body,
    question,
    interactorGlobalCustomer,
    interactorExpert,
    globalId,
    expertId,
    interactorType,
  } = notification;

  if (!interactorId) return <div>{body}</div>;
  const name =
    interactorType == "GLOBAL_CUSTOMER"
      ? interactorGlobalCustomer?.name
      : `${interactorExpert?.name} (Chuyên gia)`;

  switch (interactionActionType) {
    case "LIKE_QUESTION_OWNER": {
      return convertMessage(name, "đã thích câu hỏi của bạn vào", createdAt);
    }
    case "LIKE_COMMENT_OWNER": {
      return convertMessage(name, "đã thích bình luận của bạn vào", createdAt);
    }
    case "COMMENT_QUESTION_OWNER": {
      return convertMessage(name, "đã bình luận vào câu hỏi của bạn vào", createdAt);
    }
    case "COMMENT_QUESTION_OTHER": {
      return convertMessage(
        name,
        `đã bình luận vào câu hỏi ${
          question?.title.length >= 10
            ? question?.title.replace(
                question?.title.substring(10, question?.title.length),
                "..."
              )
            : question?.title
        } vào`,
        createdAt
      );
    }
  }
};

export const convertMessage = (name: string, text: string | JSX.Element, date: string) => {
  return (
    <div>
      <b>{name} </b>
      {text}
      <b> {formatDate(date, "HH:mm - dd/MM/yyyy ")}</b>
    </div>
  );
};

