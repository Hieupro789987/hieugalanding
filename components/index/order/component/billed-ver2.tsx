import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Order, OrderInput, OrderItem } from "../../../../lib/repo/order.repo";
import { Img } from "../../../shared/utilities/misc";

interface PropsType extends ReactProps {
  status: Option;
  order?: Order;
  reOrder?: (items: OrderItem[], infoPay: OrderInput) => any;
}
export function Billed({ order, status, reOrder, ...props }: PropsType) {
  const { shopCode, shop } = useShopContext();
  const [showStatus, setShowStatus] = useState("");
  useEffect(() => {
    if (order.logs) {
      order.logs.forEach((item) => {
        switch (item.statusText) {
          case "Chờ duyệt":
            setShowStatus("Đã đặt");
            break;
          case "Đang giao":
            setShowStatus("Đang giao");
            break;
          case "Hoàn thành":
            setShowStatus("Hoàn thành");
            break;
          case "Đã huỷ":
            setShowStatus("Đã huỷ");
            break;
          case "Thất bại":
            setShowStatus("Thất bại");
            break;
        }
      });
    }
  }, [order.logs]);
  const screenSm = useScreen("sm");
  return (
    <Link href={`/store/${shopCode}/order/${order.code}`}>
      <a>
        <div
          className={`flex items-center flex-wrap w-full bg-white text-sm sm:text-base border-b py-3 ${
            props.className || ""
          }`}
        >
          <Img src={shop.shopLogo} className="w-16 sm:w-20" />
          <div className="flex flex-col justify-start flex-1 h-full">
            <div className="font-medium text-ellipsis-2">
              {order.seller.shopName} - {order.shopBranch.name}
            </div>
            <div className="text-sm sm:text-base">
              {screenSm ? "Mã đơn hàng" : "MDH"}: {order.code}
            </div>
            <div className="flex flex-wrap mt-auto mb-0 text-xs font-light">
              <span>{formatDate(order.createdAt, "dd MMM HH:mm")}</span>
              {screenSm && <span> - </span>}
              <span>
                {order.itemCount} sản phẩm - {parseNumber(order.subtotal)}đ
              </span>
            </div>
          </div>
          <div className="flex justify-end w-20 sm:w-28">
            <span
              className={`py-1 px-3 border sm:text-base text-xs rounded-full whitespace-nowrap ${
                showStatus == "Đang giao" || showStatus == "Hoàn thành"
                  ? "border-primary text-primary"
                  : "border-danger text-danger"
              }`}
            >
              {showStatus}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
