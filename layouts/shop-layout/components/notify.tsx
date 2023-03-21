import { useRouter } from "next/router";
import React, { useState } from "react";
import { NotFound, Spinner } from "../../../components/shared/utilities/misc";
import { PaginationComponent } from "../../../components/shared/utilities/pagination/pagination-component";
import { formatDate } from "../../../lib/helpers/parser";
import { useCrud } from "../../../lib/hooks/useCrud";
import { Notification, NotificationService } from "../../../lib/repo/notification.repo";

export function Notify({ ...props }: ReactProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { items, pagination, loadAll, setPage } = useCrud(NotificationService, {
    limit: 5,
    order: { _id: -1 },
    search,
  });
  async function handleNotiOnClick(noti: Notification) {
    try {
      await NotificationService.readNotification(noti.id);
      await loadAll(true);
      router.push(
        noti
          ? noti.type == "SUPPORT_TICKET"
            ? `/shop/support-ticket/?id=${noti.ticket.id}`
            : noti.type == "ORDER"
            ? `/shop/orders`
            : location.href
          : location.href
      );
      // handle notification action type
      switch (noti.type) {
        case "WEBSITE": {
          window.open(noti.link, "__blank");
          break;
        }
        case "ORDER": {
          router.push(`/shop/orders?id=${noti.orderId}`, null, { shallow: true });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  try {
    return (
      <div className="py-3 overflow-auto bg-white w-80 sm:w-96" style={{ maxHeight: 600 }}>
        {items ? (
          items.length > 0 ? (
            <div className="flex flex-col py-3">
              {items.map((noti, index) => (
                <a
                  key={index}
                  className={`cursor-pointer p-3 ${noti.seen ? "" : "bg-primary-light"} ${
                    index < items.length - 1 ? "border-b" : ""
                  }`}
                  onClick={() => handleNotiOnClick(noti)}
                >
                  <div className="mb-2 font-medium">{noti.title}</div>
                  <div className="mb-2 font-small">{noti.body}</div>
                  <span>{formatDate(noti.createdAt, "HH:mm dd-MM-yyyy")}</span>
                </a>
              ))}
              <div className="self-center mt-2">
                <PaginationComponent
                  page={pagination.page}
                  limit={pagination.limit}
                  total={pagination.total}
                  onPageChange={(page) => setPage(page)}
                />
              </div>
              {/* <Button
                text={"Xem thêm"}
                className="mt-2"
                onClick={() => loadAll({ page: pagination.page + 1 })}
              /> */}
            </div>
          ) : (
            <NotFound text="Không có thông báo" />
          )
        ) : (
          <Spinner />
        )}
      </div>
    );
  } catch (err) {
    console.error(err);
    return <NotFound text="Có lỗi xảy ra" />;
  }
}
