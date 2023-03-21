import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiCalendarTodoLine,
  RiHome6Line,
  RiMore2Fill,
  RiPhoneLine,
  RiStickyNoteLine,
  RiUser5Line,
} from "react-icons/ri";
import { formatDate, parseAddress, parseNumber } from "../../../lib/helpers/parser";
import { useAlert } from "../../../lib/providers/alert-provider";
import { DeliveryLog, DeliveryLogService } from "../../../lib/repo/delivery-log.repo";
import { OrderLog, OrderLogService } from "../../../lib/repo/order-log.repo";
import { Order, OrderService, ORDER_STATUS, PaymentLogs } from "../../../lib/repo/order.repo";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form/button";
import { Img, Spinner, StatusLabel } from "../utilities/misc";
import { Dropdown } from "../utilities/popover/dropdown";
import { useDataTable } from "../utilities/table/data-table";

interface PropsType extends DialogProps {
  orderId: string;
  onOpenDeliveryDialog?: () => void;
  onOpenCancelDialog?: (order: Order) => void;
  updateOrder?: Order;
  isAdmin?: boolean;
  isStaff?: boolean;
}
export function OrderDetailsDialog({
  orderId,
  onOpenDeliveryDialog,
  onOpenCancelDialog,
  updateOrder,
  isAdmin = false,
  isStaff = false,
  ...props
}: PropsType) {
  const ORDER_TABS: Option[] = [
    { value: "products", label: "Danh sách sản phẩm" },
    { value: "order_history", label: "Lịch sử đơn hàng" },
    { value: "delivery_history", label: "Lịch sử giao hàng" },
    { value: "payment_history", label: "Lịch sử thanh toán" },
  ];
  const alert = useAlert();
  const { loadAll } = useDataTable();
  const changeStatusRef = useRef(null);
  const [order, setOrder] = useState<Order>(null);
  const [selectedTab, setSelectedTab] = useState("products");

  const hasOutOfStockProduct = useMemo(
    () => order?.items?.some((item) => item?.warehouseProduct?.inStockCount < item.qty),
    [order]
  );

  const isShowMoreVisible = useMemo(() => {
    return ["PENDING", "CONFIRMED", "DELIVERING"].includes(order?.status) && !isAdmin && !isStaff;
  }, [order]);

  useEffect(() => {
    if (props.isOpen && orderId) {
      loadOrder(orderId);
    } else {
      setOrder(null);
    }
  }, [props.isOpen, orderId]);

  useEffect(() => {
    if (!updateOrder?.id) return;

    setOrder(updateOrder);
  }, [updateOrder]);

  const loadOrder = (orderId: string) => {
    OrderService.getOne({ id: orderId, cache: false })
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => {
        console.error(err);
        alert.error("Xem chi tiết đơn hàng thất bại", err.message);
        props.onClose();
      });
  };

  const approveOrder = async (orderId: string, status: string, note?: string) => {
    try {
      await OrderService.approveOrder(orderId, status, note);
      await loadAll(true);
      loadOrder(orderId);
      alert.success("Đã hoàn tất đơn hàng");
    } catch (error) {
      alert.error("Hoàn tất đơn hàng thất bại");
    }
  };

  const confirmOrder = async (orderId: string, note: string) => {
    try {
      await OrderService.confirmOrder(orderId, note);
      await loadAll(true);
      loadOrder(orderId);
      alert.success("Đã duyệt đơn hàng");
    } catch (error) {
      alert.error("Duyệt đơn hàng thất bại " + error);
    }
  };

  return (
    <Dialog
      {...props}
      title="Chi tiết đơn hàng"
      extraDialogClass="bg-transparent"
      extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
      extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
      width={830}
    >
      {!order ? (
        <Spinner />
      ) : (
        <Dialog.Body>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-primary">{order.code}</div>
            <div className="flex items-center gap-2">
              <StatusLabel options={ORDER_STATUS} value={order?.status} />
              <i
                className={`text-2xl text-gray-500 cursor-pointer ${
                  !isShowMoreVisible && "hidden"
                }`}
                ref={changeStatusRef}
              >
                <RiMore2Fill />
              </i>
              <Dropdown reference={changeStatusRef} trigger="click" placement="auto-start">
                <Dropdown.Item
                  className={`justify-start ${order.status !== "PENDING" && "line-through"}`}
                  text="Xác nhận"
                  disabled={order.status !== "PENDING"}
                  onClick={async () => await confirmOrder(order.id, order.note)}
                />
                {order.pickupMethod == "DELIVERY" && (
                  <Dropdown.Item
                    className={`justify-start ${order.status !== "CONFIRMED" && "line-through"}`}
                    text="Giao hàng"
                    disabled={order.status !== "CONFIRMED"}
                    onClick={onOpenDeliveryDialog}
                  />
                )}
                <Dropdown.Item
                  className={`justify-start ${
                    ((order.pickupMethod == "DELIVERY" && order.status !== "DELIVERING") ||
                      (order.pickupMethod == "STORE" && order.status !== "CONFIRMED")) &&
                    "line-through"
                  }`}
                  text="Hoàn tất"
                  disabled={
                    (order.pickupMethod == "DELIVERY" && order.status !== "DELIVERING") ||
                    (order.pickupMethod == "STORE" && order.status !== "CONFIRMED")
                  }
                  onClick={async () => await approveOrder(order.id, "COMPLETED", order.note)}
                />
                <Dropdown.Item
                  className={`justify-start ${
                    (order.status === "CANCELED" || order.status == "COMPLETED") && "line-through"
                  }`}
                  text="Hủy"
                  hoverDanger
                  disabled={order.status === "CANCELED" || order.status == "COMPLETED"}
                  onClick={() => onOpenCancelDialog(order)}
                />
              </Dropdown>
            </div>
          </div>
          <div className="flex items-start mt-1 text-gray-700 gap-x-2">
            <i className="mt-1">
              <RiCalendarTodoLine />
            </i>
            <span>
              <strong className="font-semibold">Ngày đặt: </strong>
              {formatDate(order.createdAt, "dd-MM-yyyyy HH:mm")}
            </span>
          </div>
          <div className="flex items-start mt-1 text-gray-700 gap-x-2">
            <i className="mt-1">
              <RiUser5Line />
            </i>
            <span>
              <strong className="font-semibold">Khách hàng: </strong>
              {order.buyerName}
            </span>
          </div>
          <div className="flex items-start mt-1 text-gray-700 gap-x-2">
            <i className="mt-1">
              <RiPhoneLine />
            </i>
            <span>
              <strong className="font-semibold">Số điện thoại: </strong>
              {order.buyerPhone}
            </span>
          </div>
          {order.pickupMethod == "DELIVERY" && (
            <div className="flex items-start mt-1 text-gray-700 gap-x-2">
              <i className="mt-1">
                <RiHome6Line />
              </i>
              <span>
                <strong className="font-semibold">Địa chỉ: </strong>
                {order.buyerFullAddress}
              </span>
            </div>
          )}
          <div className="flex items-start mt-1 text-gray-700 gap-x-2">
            <i className="mt-1">
              <RiStickyNoteLine />
            </i>
            <span>
              <strong className="font-semibold">Ghi chú: </strong>
              {order.note || <span className="text-gray-400">Không có</span>}
            </span>
          </div>
          <hr className="my-3 border-gray-300" />
          <div className="grid grid-cols-3 gap-2 mb-1">
            <div className="col-span-1 text-gray-700">
              <div className="font-semibold mb-0.5">Phương thức thanh toán</div>
              <div>{order.paymentMethodText}</div>
            </div>
            {order.paymentMethod == "BANK_TRANSFER" && (
              <div className="col-span-2 text-gray-700">
                <div className="font-semibold mb-0.5">Đã thanh toán</div>
                <div className="font-semibold text-success">
                  {parseNumber(order.paymentFilledAmount, true)}
                </div>
              </div>
            )}
            <div className="text-gray-700">
              <div className="font-semibold mb-0.5">Phương thức lấy hàng</div>
              <div>{order.pickupMethod == "DELIVERY" ? "Giao hàng" : "Nhận tại cửa hàng"}</div>
            </div>
            <div className="text-gray-700">
              <div className="font-semibold mb-0.5">Tình trạng giao hàng</div>
              <div>{order.deliveryInfo?.statusText || "[Không có]"}</div>
            </div>
            <div className="text-gray-700">
              <div className="font-semibold">Chi nhánh xử lý</div>
              <div className="flex-cols">
                <div className="">{order.shopBranch?.name}</div>
                <div className="text-sm">{`【${parseAddress(order.shopBranch)}】`}</div>
              </div>
            </div>
            {order.pickupMethod == "STORE" && (
              <div className="text-gray-700">
                <div className="font-semibold">Thời gian lấy hàng</div>
                <div>{formatDate(order.pickupTime, "HH:mm dd-MM-yyyy")}</div>
              </div>
            )}
          </div>
          {order.driverId && (
            <>
              <hr className="my-3 border-gray-300" />
              <div className="grid grid-cols-3 gap-2 mb-1">
                <div className="text-gray-700">
                  <div className="font-semibold">Tên tài xế</div>
                  <div>{order.driverName}</div>
                </div>
                <div className="text-gray-700">
                  <div className="font-semibold">SĐT tài xế</div>
                  <div>{order.driverPhone}</div>
                </div>
                <div className="text-gray-700">
                  <div className="font-semibold">Biển số xe tài xế</div>
                  <div>{order.driverLicense}</div>
                </div>
              </div>
            </>
          )}
          <div className="my-3 rounded-sm border-group">
            {ORDER_TABS.map((tab, index) => (
              <Button
                key={index}
                outline={selectedTab != tab.value}
                primary={selectedTab == tab.value}
                className="border"
                medium
                text={tab.label}
                onClick={() => setSelectedTab(tab.value)}
              />
            ))}
          </div>
          {
            {
              products: <ProductsTab order={order} />,
              order_history: <OrderHistoryTabs order={order} />,
              delivery_history: <DeliveryHistoryTabs order={order} />,
              payment_history: <PaymentHistoryTabs order={order} />,
            }[selectedTab]
          }
          <div
            className={`flex justify-end gap-4 mt-7 ${
              (order.status === "CANCELED" || order.status == "COMPLETED" || !isStaff) && "hidden"
            }`}
          >
            <Button
              text="Hủy"
              danger
              outline
              className={`w-40 h-12`}
              onClick={() => onOpenCancelDialog(order)}
            />
            <Button
              text="Xác nhận"
              primary
              className={`w-40 h-12 ${order.status !== "PENDING" && "hidden"}`}
              onClick={async () => await confirmOrder(order.id, order.note)}
            />
            {order.pickupMethod == "DELIVERY" && (
              <Button
                primary
                text="Giao hàng"
                className={`w-40 h-12 ${order.status !== "CONFIRMED" && "hidden"}`}
                disabled={hasOutOfStockProduct}
                onClick={onOpenDeliveryDialog}
              />
            )}
            <Button
              primary
              text="Hoàn tất"
              className={`w-40 h-12 ${
                ((order.pickupMethod == "DELIVERY" && order.status !== "DELIVERING") ||
                  (order.pickupMethod == "STORE" && order.status !== "CONFIRMED")) &&
                "hidden"
              }`}
              disabled={hasOutOfStockProduct}
              onClick={async () => await approveOrder(order.id, "COMPLETED", order.note)}
            />
          </div>
        </Dialog.Body>
      )}
    </Dialog>
  );
}

function ProductsTab({ order }: { order: Order }) {
  return (
    <div className="animate-emerge">
      <table className="w-full border border-collapse border-gray-400 rounded">
        <thead>
          <tr className="font-semibold text-gray-700 border-b border-gray-400 whitespace-nowrap">
            <th className="w-6 p-2 text-center">STT</th>
            <th className="p-2 text-left">Sản phẩm</th>
            <th className="p-2 text-center">Số lượng</th>
            <th className="p-2 text-right">Giá</th>
            <th className="p-2 text-right">Tổng giá</th>
          </tr>
        </thead>
        <tbody>
          {!order.items?.length && (
            <tr>
              <td colSpan={6} className="table-cell text-center text-gray-300">
                Không có sản phẩm
              </td>
            </tr>
          )}
          {order.items?.map((item, index) => (
            <tr
              className={`text-gray-700 ${
                index != order.items?.length - 1 ? "border-b border-gray-300" : ""
              }`}
              key={item.id}
            >
              <td className="w-6 p-2 text-center">{index + 1}</td>
              <td className="p-2 text-left">
                <div className="flex">
                  <Img
                    compress={200}
                    className="rounded w-14"
                    src={item.product.image}
                    showImageOnClick
                  />
                  <div className="flex flex-col justify-center flex-1 pl-2">
                    <div className="flex gap-2.5">
                      <div className="font-semibold">{item.productName}</div>
                      {item.warehouseProduct?.inStockCount < item.qty && (
                        <div className="text-danger whitespace-nowrap">[Hết hàng]</div>
                      )}
                    </div>
                    {item.toppings?.length > 0 && (
                      <div className="text-gray-500">
                        {item.toppings?.map((x) => x.optionName).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-2 text-center">{item.qty}</td>
              <td className="p-2 text-right">
                {parseNumber(
                  item.basePrice +
                    item.toppings.reduce((total, topping) => total + topping.price, 0),
                  true
                )}
              </td>
              <td className="p-2 text-right">{parseNumber(item.amount, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid pr-1 mt-3 ml-auto font-semibold text-gray-800 w-72 gap-y-1">
        <div className="flex justify-between">
          <div>Tiền hàng</div>
          <div>{parseNumber(order.subtotal, true)}</div>
        </div>
        <div className="flex justify-between">
          <div>Phí ship</div>
          <div>{parseNumber(order.shipfee, true)}</div>
        </div>
        {order.deliveryInfo?.promotionCode && (
          <div className="flex justify-between">
            <div>
              Giảm ship: <span>[{order.deliveryInfo.promotionCode}]</span>
            </div>
            <div>{parseNumber(-order.deliveryInfo.partnerDiscount, true)}</div>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold">
          <div>Tổng tiền</div>
          <div className="text-danger">{parseNumber(order.amount, true)}</div>
        </div>
      </div>
    </div>
  );
}

function OrderHistoryTabs({ order }: { order: Order }) {
  const [orderLogs, setOrderLogs] = useState<OrderLog[]>(null);

  useEffect(() => {
    OrderLogService.getAll({ query: { limit: 0, filter: { orderId: order.id } } }).then((res) => {
      setOrderLogs(res.data);
    });
  }, []);

  if (!orderLogs) return <Spinner />;
  return (
    <div className="animate-emerge">
      <table className="w-full border border-collapse border-gray-400 rounded">
        <thead>
          <tr className="font-semibold text-gray-700 border-b border-gray-400 whitespace-nowrap">
            <th className="w-6 p-2 text-center">Thời điểm</th>
            <th className="p-2 text-left">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {!orderLogs.length ? (
            <tr>
              <td colSpan={6} className="table-cell h-32 text-center text-gray-300">
                Không có lịch sử đơn hàng
              </td>
            </tr>
          ) : (
            orderLogs.map((orderLog, index) => (
              <tr
                key={orderLog.id}
                className={`text-gray-700 ${
                  index != orderLogs.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <td className="p-2 text-center whitespace-nowrap">
                  {formatDate(orderLog.createdAt, "dd-MM-yyyy HH:mm")}
                </td>
                <td className="p-2 text-left">{orderLog.note}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeliveryHistoryTabs({ order }: { order: Order }) {
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>(null);

  useEffect(() => {
    DeliveryLogService.getAll({ query: { limit: 0, filter: { orderId: order.id } } }).then(
      (res) => {
        setDeliveryLogs(res.data);
      }
    );
  }, []);

  if (!deliveryLogs) return <Spinner />;
  return (
    <div className="animate-emerge">
      <table className="w-full border border-collapse border-gray-400 rounded">
        <thead>
          <tr className="font-semibold text-gray-700 border-b border-gray-400 whitespace-nowrap">
            <th className="w-6 p-2 text-center">Thời điểm</th>
            <th className="p-2 text-left">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {!deliveryLogs.length ? (
            <tr>
              <td colSpan={6} className="table-cell h-32 text-center text-gray-300">
                Không có lịch sử giao hàng
              </td>
            </tr>
          ) : (
            deliveryLogs.map((deliveryLog, index) => (
              <tr
                key={deliveryLog.id}
                className={`text-gray-700 ${
                  index != deliveryLogs.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <td className="p-2 text-center whitespace-nowrap">
                  {formatDate(deliveryLog.createdAt, "dd-MM-yyyy HH:mm")}
                </td>
                <td className="p-2 text-left">
                  {deliveryLog.statusName}{" "}
                  {`${
                    order?.deliveryInfo?.orderId ? `【MVD - ${order?.deliveryInfo?.orderId} 】` : ""
                  }`}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function PaymentHistoryTabs({ order }: { order: Order }) {
  const [paymentLogs, setPaymentLogs] = useState<PaymentLogs[]>();

  useEffect(() => {
    setPaymentLogs(order?.paymentLogs);
  }, []);

  if (!paymentLogs) return <Spinner />;
  return (
    <div className="animate-emerge">
      <table className="w-full border border-collapse border-gray-400 rounded">
        <thead>
          <tr className="font-semibold text-gray-700 border-b border-gray-400 whitespace-nowrap">
            <th className="w-6 p-2 text-center">Thời điểm</th>
            <th className="p-2 text-left">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {!paymentLogs?.length ? (
            <tr>
              <td colSpan={6} className="table-cell h-32 text-center text-gray-300">
                Không có lịch sử giao hàng
              </td>
            </tr>
          ) : (
            paymentLogs?.map((log, index) => (
              <tr
                key={log?.meta?.id}
                className={`text-gray-700 ${
                  index != paymentLogs?.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <td className="p-2 text-center whitespace-nowrap">{log?.meta?.when}</td>
                <td className="p-2 text-left whitespace-pre-line">{log?.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
