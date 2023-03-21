import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiEyeLine, RiFileListLine } from "react-icons/ri";
import { formatDate } from "../../../lib/helpers/parser";
import { useAlert } from "../../../lib/providers/alert-provider";
import {
  Order,
  OrderService,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PICKUP_METHODS,
} from "../../../lib/repo/order.repo";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { OrderDetailsDialog } from "../shop-layout/order-details-dialog";
import { ShopPageTitle } from "../shop-layout/shop-page-title";
import { Field, Form, Input, Select, Textarea } from "../utilities/form";
import { DataTable } from "../utilities/table/data-table";
import { DeliveryDialog } from "./components/delivery-dialog";
import { ExportOrderDialog } from "./components/export-orders-dialog";

interface OrdersMenuProps extends ReactProps {
  isShop?: boolean;
  isStaff?: boolean;
}

export function OrdersMenu({ isShop = false, isStaff = false, ...props }: OrdersMenuProps) {
  const alert = useAlert();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [openExportOrder, setOpenExportOrder] = useState(false);
  const [openDetailsOrderDialog, setOpenDetailsOrderDialog] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<Order>(null);
  const [openDelivery, setOpenDelivery] = useState<string>("");
  const [updateOrder, setUpdateOrder] = useState<Order>();

  useEffect(() => {
    if (router.query.id) {
      setOrderId(router.query.id as string);
    }
  }, [router.query]);

  const approveOrder = async (orderId: string, status: string, note?: string) => {
    try {
      await OrderService.approveOrder(orderId, status, note);
      alert.success("Đã hoàn tất đơn hàng");
    } catch (error) {
      alert.error("Hoàn tất đơn hàng thất bại");
    }
  };

  const confirmOrder = async (orderId: string, note: string) => {
    try {
      await OrderService.confirmOrder(orderId, note);
      alert.success("Đã duyệt đơn hàng");
    } catch (error) {
      alert.error("Duyệt đơn hàng thất bại " + error);
    }
  };

  const cancelOrder = async (orderId: string, note: string) => {
    try {
      const res = await OrderService.cancelOrder(orderId, note);
      setCancelOrderId(null);
      if (openDetailsOrderDialog) {
        setUpdateOrder(res);
      }

      alert.success("Đã hủy đơn hàng");
    } catch (error) {
      alert.error("Hủy đơn hàng thất bại " + error);
    }
  };

  const handleCloseDetailsDialog = () => {
    const url = new URL(location.href);
    url.searchParams.delete("id");
    router.replace(url.toString(), null, { shallow: true });
    setOrderId("");
    setOpenDetailsOrderDialog(false);
  };

  const handleOpenCancelDialog = (order: Order) => {
    setCancelOrderId(order);
  };

  return (
    <>
      <DataTable<Order> crudService={OrderService} order={{ createdAt: -1 }} autoRefresh={30000}>
        <DataTable.Header>
          <ShopPageTitle title="Đơn hàng" subtitle="Kiểm tra trạng thái đơn hàng" />
          <DataTable.Buttons>
            {isShop && (
              <DataTable.Button
                primary
                className="h-12"
                text="Xuất danh sách đơn hàng"
                onClick={() => setOpenExportOrder(true)}
              />
            )}
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="w-12 h-12 bg-white"
            />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12" />
          <DataTable.Filter>
            <div className="flex flex-wrap justify-end gap-2">
              <Field name="shopBranchId" noError>
                <Select
                  className="inline-grid h-12"
                  autosize
                  clearable
                  placeholder="Tất cả cửa hàng"
                  optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
                />
              </Field>
              <Field name="pickupMethod" noError>
                <Select
                  className="inline-grid h-12"
                  autosize
                  clearable
                  placeholder="Tất cả hình thức lấy hàng"
                  options={PICKUP_METHODS}
                />
              </Field>
              <Field name="paymentMethod" noError>
                <Select
                  className="inline-grid h-12"
                  autosize
                  clearable
                  placeholder="Tất cả hình thức thanh toán"
                  options={PAYMENT_METHODS}
                />
              </Field>
              <Field name="status" noError>
                <Select
                  className="inline-grid h-12"
                  autosize
                  clearable
                  placeholder="Tất cả trạng thái"
                  options={ORDER_STATUS}
                />
              </Field>
            </div>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Đơn hàng"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="font-bold text-primary">{item.code}</div>
                    <div className="text-sm text-gray-600">{item.itemCount} sản phẩm</div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            label="Khách hàng"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="font-semibold text-gray-800">{item.buyerName}</div>
                    <div className="text-sm text-gray-600">{item.buyerPhone}</div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            label="Hình thức lấy hàng"
            render={(item: Order) => (
              <DataTable.CellText
                className="font-semibold"
                value={PICKUP_METHODS.find((x) => x.value == item.pickupMethod)?.label}
                subText={
                  item.pickupMethod == "DELIVERY"
                    ? `${item.deliveryInfo?.statusText || ""} ${
                        item.deliveryInfo?.orderId
                          ? `【MVD - ${item.deliveryInfo?.orderId || ""}】`
                          : ""
                      }`
                    : `【${formatDate(item.pickupTime, "HH:mm dd-MM")}】`
                }
              />
            )}
          />
          <DataTable.Column
            label="Thanh toán"
            render={(item: Order) => (
              <DataTable.CellText
                value={
                  PAYMENT_METHODS.find((x) => x.value || item.paymentMethod)?.label ||
                  item.paymentMethod
                }
                className="uppercase"
                subText={
                  item.paymentMethod == "COD" && item.status == "COMPLETED"
                    ? "Hoàn thành"
                    : PAYMENT_STATUS.find((x) => x.value == item.paymentStatus)?.label
                }
                subTextClassName={`text-sm font-semibold text-${
                  PAYMENT_STATUS.find((x) => x.value == item.paymentStatus)?.color
                }`}
              />
            )}
          />
          <DataTable.Column
            label="Ngày tạo"
            render={(item: Order) => (
              <DataTable.CellDate value={item.createdAt} format="dd-MM-yyyy HH:mm" />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: Order) => (
              <DataTable.CellStatus value={item.status} options={ORDER_STATUS} />
            )}
          />
          <DataTable.Column
            right
            label="Tổng tiền"
            render={(item: Order) => <DataTable.CellNumber currency value={item.amount} />}
          />
          <DataTable.Column
            right
            render={(item: Order) => (
              <>
                <DataTable.CellButton
                  className={`${isShop && "hidden"}`}
                  value={item}
                  icon={<RiFileListLine />}
                  tooltip="Xem chi tiết"
                  onClick={() => {
                    setOrderId(item.id);
                    setOpenDetailsOrderDialog(true);
                  }}
                />
                <DataTable.CellButton
                  className={`${isStaff && "hidden"}`}
                  value={item}
                  icon={<RiEyeLine />}
                  tooltip="Xem chi tiết"
                  onClick={() => {
                    setOrderId(item.id);
                    setOpenDetailsOrderDialog(true);
                  }}
                />
                <DataTable.CellButton
                  className={`${isStaff && "hidden"}`}
                  value={item}
                  moreItems={[
                    {
                      text: "Xác nhận",
                      disabled: item.status !== "PENDING",
                      onClick: async () => await confirmOrder(item.id, item.note),
                      refreshAfterTask: true,
                    },
                    ...(item.pickupMethod == "DELIVERY"
                      ? [
                          {
                            text: "Giao hàng",
                            disabled: item.status !== "CONFIRMED",
                            onClick: () => {
                              setOpenDelivery(item.id);
                            },
                          },
                        ]
                      : []),
                    ,
                    {
                      text: "Hoàn tất",
                      disabled:
                        (item.pickupMethod == "DELIVERY" && item.status !== "DELIVERING") ||
                        (item.pickupMethod == "STORE" && item.status !== "CONFIRMED"),
                      onClick: async () => await approveOrder(item.id, "COMPLETED", item.note),
                      refreshAfterTask: true,
                    },
                    {
                      text: "Hủy",
                      disabled: item.status === "CANCELED" || item.status == "COMPLETED",
                      onClick: () => setCancelOrderId(item),
                    },
                  ]}
                />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ filter, loadAll, formItem }) => (
            <>
              <ExportOrderDialog
                isOpen={openExportOrder}
                onClose={() => {
                  setOpenExportOrder(false);
                }}
                shopBranchId={filter.shopBranchId}
                pickupMethod={filter.pickupMethod}
                paymentMethod={filter.paymentMethod}
                status={filter.status}
              />
              <Form
                grid
                dialog
                defaultValues={{ note: "" }}
                width={400}
                isOpen={cancelOrderId ? true : false}
                onClose={() => {
                  setCancelOrderId(null);
                  if (openDetailsOrderDialog) {
                    setOpenDetailsOrderDialog(false);
                  }
                }}
                onSubmit={async (data) => {
                  await cancelOrder(cancelOrderId.id, data.note);
                  loadAll(true);
                }}
                title="Hủy đơn hàng"
              >
                <Field label="Mã đơn hàng" cols={12}>
                  <Input value={cancelOrderId?.code} readOnly></Input>
                </Field>
                <Field label="Lý do hủy đơn" name="note" cols={12}>
                  <Textarea />
                </Field>
                <Form.Footer />
              </Form>
              <DeliveryDialog
                isOpen={!!openDelivery}
                onClose={() => {
                  setOpenDelivery("");
                }}
                orderId={openDelivery}
                onConfirm={async () => {
                  await loadAll(true);
                }}
                openDetailsOrderDialog={openDetailsOrderDialog}
                onReloadDetailsDialog={(order: Order) => setUpdateOrder(order)}
              />
              <OrderDetailsDialog
                orderId={orderId}
                isOpen={!!orderId}
                onClose={handleCloseDetailsDialog}
                onOpenDeliveryDialog={() => setOpenDelivery(orderId)}
                onOpenCancelDialog={handleOpenCancelDialog}
                updateOrder={updateOrder}
                isStaff={isStaff}
              />
            </>
          )}
        </DataTable.Consumer>
      </DataTable>
    </>
  );
}
