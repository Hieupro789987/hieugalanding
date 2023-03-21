import { createContext, useContext, useEffect, useState } from "react";
import { useCrud } from "../../../lib/hooks/useCrud";
import { WriterNotificationService } from "../../../lib/repo/writer/writer-notification.repo";

export const WriterLayoutContext = createContext<
  Partial<{
    notificationList: any;
    setNotificationList: (notificationList: any) => void;
    notSeenNotifications: number;
    checkNotSeenNotifications: () => any;
  }>
>({});
export function WriterLayoutProvider(props) {
  const [notificationList, setNotificationList] = useState<any>();
  const [notSeenNotifications, setNotSeenNotifications] = useState(0);
  const {items} = useCrud(WriterNotificationService, { limit: 0, order: { createdAt: -1 } });

  useEffect(() => {
    getNotificationList();
    // checkNotSeenNotifications();
  }, []);

  useEffect(() => {
    if (!notificationList?.length) return;

    checkNotSeenNotifications();
  }, [notificationList]);

  const getNotificationList = () => {
    setNotificationList(items);
  };

  const checkNotSeenNotifications = () => {
    const notSeenNotiCount = notificationList.filter((noti) => !noti.seen).length;
    setNotSeenNotifications(notSeenNotiCount);
  };

  return (
    <WriterLayoutContext.Provider
      value={{
        notificationList,
        setNotificationList,
        notSeenNotifications,
        checkNotSeenNotifications,
      }}
    >
      {props.children}
    </WriterLayoutContext.Provider>
  );
}

export const useWriterLayoutContext = () => useContext(WriterLayoutContext);

// export const NOTIFICATION_LIST = [
//   {
//     id: "noti1",
//     createdAt: "2022-06-16T01:16:01.090Z",
//     post: {
//       id: "62a80c62cd14f71f488606ad",
//       title: "Hội thảo: “Các giải pháp công nghệ trong quản lý sâu keo mùa thu (FAW) tại Việt Nam”",
//     },
//     approveStatus: "APPROVED",
//     reject: null,
//     seen: false,
//   },
//   {
//     id: "noti2",
//     createdAt: "2022-06-17T01:16:01.090Z",
//     post: {
//       id: "62a3217266fb3332a8780f19",
//       title:
//         "Tình hình sinh vật gây hại cây trồng (Từ ngày 24 tháng 02 đến ngày 03 tháng 3 năm 2022)",
//     },
//     approveStatus: "DRAFT",
//     rejectReason: "Bài viết có nội dung không phù hợp",
//     seen: true,
//   },
//   {
//     id: "noti3",
//     createdAt: "2022-06-17T01:20:01.090Z",
//     post: {
//       id: "62a80c62cd14f71f488606ad",
//       title: "Hội thảo: “Các giải pháp công nghệ trong quản lý sâu keo mùa thu (FAW) tại Việt Nam”",
//     },
//     approveStatus: "DRAFT",
//     rejectReason: "Bài viết sai chính tả",
//     seen: false,
//   },
//   {
//     id: "noti4",
//     createdAt: "2022-06-07T06:20:01.090Z",
//     post: {
//       id: "62a3217266fb3332a8780f19",
//       title:
//         "Tình hình sinh vật gây hại cây trồng (Từ ngày 24 tháng 02 đến ngày 03 tháng 3 năm 2022)",
//     },
//     approveStatus: "DRAFT",
//     rejectReason: "Spam nội dung quá nhiều",
//     seen: false,
//   },
//   {
//     id: "noti5",
//     createdAt: "2022-06-27T08:20:01.090Z",
//     post: {
//       id: "62a80c62cd14f71f488606ad",
//       title: "Hội thảo: “Các giải pháp công nghệ trong quản lý sâu keo mùa thu (FAW) tại Việt Nam”",
//     },
//     approveStatus: "PENDING",
//     rejectReason: null,
//     seen: true,
//   },
//   {
//     id: "noti6",
//     createdAt: "2022-06-07T06:20:01.090Z",
//     post: {
//       id: "62a80c62cd14f71f488606ad",
//       title: "Hội thảo: “Các giải pháp công nghệ trong quản lý sâu keo mùa thu (FAW) tại Việt Nam”",
//     },
//     approveStatus: "DRAFT",
//     rejectReason: "Bài viết không đầy đủ",
//     seen: false,
//   },
// ];
