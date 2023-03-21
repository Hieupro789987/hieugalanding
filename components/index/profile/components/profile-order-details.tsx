import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineCreditCard } from "react-icons/ai";
import { RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { OrderLog, OrderService } from "../../../../lib/repo/order.repo";
import { Button, Field, Form, Textarea } from "../../../shared/utilities/form";
import { BreadCrumbs, Img, Spinner } from "../../../shared/utilities/misc";
import {
  ProfileOrderDetailsProvider,
  useProfileOrderDetailContext,
} from "../providers/profile-order-details-provider";

export function ProfileOrderDetailsPage() {
  const orderCode = useQuery("orderCode");
  return (
    <ProfileOrderDetailsProvider code={orderCode}>
      <OrderDetails />
    </ProfileOrderDetailsProvider>
  );
}

const OrderDetails = () => {
  const router = useRouter();
  const toast = useToast();
  const alert = useAlert();
  const { order, loading } = useProfileOrderDetailContext();
  const [cancelOrder, setCancelOrder] = useState(false);
  const screenLg = useScreen("lg");
  const [openReview, setOpenReview] = useState(false);

  useEffect(() => {
    if (!order) return;
    if (
      order.paymentMethod == "MOMO" &&
      order.paymentStatus == "pending" &&
      order.status !== "CANCELED"
    )
      router.push(order?.paymentMeta?.payUrl);
  }, [order]);

  const handleRePurChaseClick = async (itemList) => {
    if (!Array.isArray(itemList) || itemList.length === 0) return;
    try {
      let localCartList =
        JSON.parse(localStorage.getItem(`${order?.sellerCode}-cart-products`)) || [];
      let newItemList = cloneDeep(itemList);

      // delete key __typename in data
      newItemList.forEach((item) => {
        item.toppings.forEach((topping) => {
          delete topping["__typename"];
        });
        delete item["product"]["__typename"];
        item.product.selectedToppings = item.toppings;
      });

      //convert data -> cartProducts data
      newItemList = newItemList.map((x) => ({
        productId: x.productId,
        product: x.product,
        note: x.note,
        qty: x.qty,
        price: x.basePrice,
        amount: x.amount,
        topping: x.toppings,
        selectedToppings: x.toppings,
      }));

      // increase qty product if exist item in local storage else push it
      const res = await alert.question(
        "Xác nhận mua lại?",
        "Thêm vào giỏ hàng và chuyển đến trang giỏ hàng để thanh toán."
      );
      if (res) {
        let newLocalCartList = [];
        newItemList.forEach((item) => {
          let productIndex = localCartList.findIndex(
            (x) =>
              x.productId === item.productId &&
              JSON.stringify(x.product.selectedToppings) === JSON.stringify(item.selectedToppings)
          );
          if (productIndex >= 0) {
            item.qty += localCartList[productIndex].qty;
          }
          newLocalCartList = [...newLocalCartList, item];
        });
        localStorage.removeItem(`${order?.sellerCode}-cart-products`);
        localStorage.setItem(
          `${order?.sellerCode}-cart-products`,
          JSON.stringify(newLocalCartList)
        );
        router.push(`/store/${order.sellerCode}/cart`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Mua lại đơn hàng thất bại. Lý do: ${error.message}.`);
    }
  };

  if (!order || loading) return <Spinner />;

  // webapp
  if (!screenLg)
    return (
      <div className="text-sm text-accent md:text-base">
        <div className="p-4 pt-4 pb-2 bg-white">
          <div className="text-lg font-bold text-center">Đơn hàng #{order?.code}</div>
          <div className="font-medium text-center text-gray-400 mt-0.5">{`Ngày đặt hàng: ${formatDate(
            order?.createdAt,
            "HH:mm dd/MM/yyyy"
          )}`}</div>
          <div className="my-2">
            <StatusOrder />
          </div>
        </div>
        <div className="px-3">
          <RecieveInfo />
          <DeliveryInfo />
          <ProductOrderList />
          <CheckOut />
          <div className="gap-4 mt-10 mb-16 flex-cols">
            {/* {order.status === "COMPLETED" && !order.commented && (
              <Button
                text="Đánh giá"
                outline
                className="w-full bg-white h-14 whitespace-nowrap text-primary border-primary hover:text-primary-dark hover:border-primary-dark"
                {...(screenLg
                  ? {
                      onClick: () => {
                        setOpenReview(true);
                      },
                    }
                  : {
                      href: `/profile/order-history/${order.code}/review`,
                    })}
              />
            )} */}
            <Button
              text="Mua lại"
              primary
              className="w-full shadow-lg h-14"
              onClick={() => handleRePurChaseClick(order?.items)}
            />
          </div>
        </div>
        <CancelOrderFormDialog
          isOpen={cancelOrder}
          onClose={() => setCancelOrder(false)}
          setCancelOrder={setCancelOrder}
        />
      </div>
    );

  //desktop
  return (
    <section className="pb-20 main-container">
      <div className="">
        <BreadCrumbs
          className="relative z-10 py-6"
          breadcrumbs={[
            {
              href: "/",
              label: "Trang chủ",
            },
            {
              href: `/profile`,
              label: `Tài khoản`,
            },
            {
              href: `/profile/order-history`,
              label: `Lịch sử đơn hàng`,
            },
            {
              label: `Chi tiết đơn hàng`,
            },
          ]}
        />
      </div>
      <div className="text-3xl font-bold text-center text-accent">{`Chi tiết đơn hàng #${order?.code}`}</div>
      <div className="my-6">
        <StatusOrder />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-6 auto-rows-fr">
        <RecieveInfo />
        <DeliveryInfo />
      </div>
      <div className="p-4 py-2 bg-white rounded-md lg:p-5">
        <ProductOrderList />
        <div className="w-1/3 mt-6 ml-auto">
          <CheckoutInfoList />
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-3 my-8">
        {/* {order.status === "COMPLETED" && !order.commented && (
          <ReviewForm
            orderCode={order.code}
            orderId={order.id}
            width={450}
            dialog
            isOpen={openReview}
            onClose={() => setOpenReview(false)}
            onSuccess={() => setOpenReview(false)}
            title="Đánh giá đơn hàng"
          />
        )} */}
        <Button
          text="Quay lại đơn hàng của tôi"
          outline
          className="bg-white text-primary border-primary h-14 hover:text-primary-dark hover:border-primary-dark"
          href={"/profile/order-history"}
        />
        {/* {order.status === "COMPLETED" && !order.commented && (
          <Button
            text="Đánh giá"
            outline
            className="bg-white text-primary border-primary h-14 hover:text-primary-dark hover:border-primary-dark"
            {...(screenLg
              ? {
                  onClick: () => {
                    setOpenReview(true);
                  },
                }
              : {
                  href: `/profile/order-history/${order.code}/review`,
                })}
          />
        )} */}
        <Button
          text="Mua lại"
          primary
          className="w-64 shadow-lg h-14"
          onClick={() => handleRePurChaseClick(order?.items)}
        />
      </div>
      <CancelOrderFormDialog
        isOpen={cancelOrder}
        onClose={() => setCancelOrder(false)}
        setCancelOrder={setCancelOrder}
      />
    </section>
  );
};

function CancelOrderFormDialog({ setCancelOrder, isOpen, onClose }) {
  const toast = useToast();
  const { order } = useProfileOrderDetailContext();

  return (
    <Form
      grid
      dialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={async (data) => {
        try {
          await OrderService.cancelOrder(order.id, data.note);
          setCancelOrder(false);
          toast.success("Hủy đơn hàng thành công");
        } catch (error) {
          toast.error("Hủy đơn hàng thất bại " + error);
        }
      }}
      title="Hủy đơn hàng"
    >
      <Field label="Lý do hủy đơn" name="note" cols={12}>
        <Textarea placeholder="Vui lòng cho chúng tôi biết lý do"></Textarea>
      </Field>
      <Form.Footer />
    </Form>
  );
}

function RecieveInfo() {
  const { order } = useProfileOrderDetailContext();
  return (
    <div className="gap-2 flex-cols">
      <div className="flex flex-row items-center justify-between mt-6 lg:mt-0">
        <div className="text-base font-bold md:text-lg text-accent">Thông tin nhận hàng</div>
      </div>
      <div className="flex h-full p-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm lg:p-5 flex-cols">
        <div className="lg:flex-1">
          <InfoShipMethodRow
            label={order?.pickupMethod === "DELIVERY" ? "Giao từ:" : "Lấy tại:"}
            value={`${order?.seller?.shopName} - ${order?.shopBranch?.name}`}
            isEmphasizing
          />
          <InfoShipMethodRow label="Số điện thoại:" value={order?.shopBranch?.phone} />
          <InfoShipMethodRow
            label="Địa chỉ:"
            value={`${combineAddress(
              order?.seller?.address,
              order?.shopBranch?.ward,
              order?.shopBranch?.district,
              order?.shopBranch?.province
            )} ${order?.pickupMethod === "DELIVERY" ? `(${order?.shipDistance}km)` : ""}`}
          />
          {order?.pickupMethod !== "DELIVERY" && (
            <InfoShipMethodRow
              label="Lấy vào lúc:"
              value={formatDate(order?.pickupTime, "dd-MM-yyyy HH:mm")}
            />
          )}
        </div>
        <div className="border-t-2 border-dashed lg:flex-1">
          <InfoShipMethodRow
            label={order?.pickupMethod === "DELIVERY" ? "Giao đến:" : "Người lấy:"}
            value={order?.buyerName}
            isEmphasizing
          />
          <InfoShipMethodRow label="Số điện thoại:" value={order?.buyerPhone} />
          <InfoShipMethodRow label="Địa chỉ:" value={order?.buyerFullAddress} />
        </div>
      </div>
    </div>
  );
}

function DeliveryInfo() {
  const { order } = useProfileOrderDetailContext();

  return (
    <div className="gap-2 flex-cols">
      <div className="flex flex-row items-center justify-between mt-6 lg:mt-0">
        <div className="text-base font-bold md:text-lg text-accent">Thông tin giao hàng</div>
      </div>
      <div className="flex h-full p-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm lg:p-5 flex-cols">
        <div className="lg:flex-1">
          <InfoShipMethodRow label="Tài xế:" value={order?.driverName || ""} isEmphasizing />
          <InfoShipMethodRow label="Số điện thoại:" value={order?.driverPhone || ""} />
          <InfoShipMethodRow label="Ghi chú tài xế:" value={order?.buyerAddressNote || ""} />
        </div>
        <div className="border-t-2 border-dashed lg:flex-1">
          <InfoShipMethodRow
            label="Phương thức thanh toán:"
            value={
              <div className="flex items-center gap-2 transform translate-y-1">
                <i className="text-xl text-primary">
                  <AiOutlineCreditCard />
                </i>
                <div className="">{order?.paymentMethod}</div>
              </div>
            }
            isEmphasizing
          />
          {/* <InfoShipMethodRow label="Mã giới thiệu:" value={order.referralCode || ""} /> */}
          <InfoShipMethodRow label="Ghi chú đơn hàng:" value={order.note || ""} />
          {order.status === "CANCELED" && (
            <InfoShipMethodRow label="Lý do:" value={order.cancelReason || ""} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductOrderList() {
  const screenLg = useScreen("lg");
  const { order } = useProfileOrderDetailContext();
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2 mt-6 overflow-hidden lg:mt-0">
        <div className="text-base font-bold md:text-lg text-accent whitespace-nowrap">
          Danh sách sản phẩm
        </div>
        {screenLg ? (
          <div className="font-medium text-center text-gray-400 mt-0.5">{`Ngày đặt hàng: ${formatDate(
            order?.createdAt,
            "dd/MM/yyyy"
          )}`}</div>
        ) : (
          <div className="font-semibold text-ellipsis-1">{`${order.itemIds?.length} sản phẩm`}</div>
        )}
      </div>
      <div className="gap-3 my-2 flex-cols">
        {order?.items.map((item, index) => (
          <ProductOrderItem key={index} item={item} />
        ))}
      </div>
    </>
  );
}

function CheckOut() {
  return (
    <>
      <div className="mt-6 mb-2 text-base font-bold md:text-lg text-accent">Thanh toán</div>
      <CheckoutInfoList />
    </>
  );
}

function CheckoutInfoList() {
  const { order, discountByPoint } = useProfileOrderDetailContext();

  return (
    <div className="p-4 overflow-hidden bg-white border border-gray-100 rounded-md shadow-sm lg:py-0 lg:shadow-none lg:border-none lg:p-2">
      <div className="flex flex-row items-center justify-between gap-1 my-3 overflow-hidden">
        <div className="flex flex-row gap-1 overflow-hidden text-gray-400">
          <div className="overflow-hidden whitespace-nowrap">Tạm tính</div>
          <div className="ml-2 font-medium text-accent">{order.itemCount} sản phẩm</div>
        </div>
        <div className="font-medium text-accent">{parseNumber(order.subtotal, true)}</div>
      </div>
      <div className="flex flex-row items-center justify-between my-3">
        <div className="flex flex-row overflow-hidden text-gray-400">
          Phí ship
          <span className="ml-2 font-medium text-accent">{order.shipDistance} km</span>
        </div>
        <div className="font-medium text-accent">{parseNumber(order.shipfee, true)}</div>
      </div>
      {order.discountPoint > 0 && (
        <div className="flex flex-row items-center justify-between my-3">
          <div className="flex flex-row overflow-hidden text-gray-400 whitespace-nowrap">
            Giảm giá điểm thưởng
          </div>
          <div className="font-medium text-accent">{`-${parseNumber(order.discount)}`}</div>
        </div>
      )}
      {order.rewardPoint > 0 && (
        <div className="flex flex-row items-center justify-between my-3">
          <div className="flex flex-row overflow-hidden text-gray-400">Điểm thưởng từ đơn hàng</div>
          <div className="font-medium text-primary">{`+${parseNumber(order.rewardPoint)}`}</div>
        </div>
      )}
      {order.discount > 0 && order.discount !== discountByPoint && (
        <div className="flex flex-row justify-between gap-2 my-3">
          <div className="flex flex-row gap-1 overflow-hidden text-gray-400">
            <div className="whitespace-nowrap">Khuyến mãi: </div>
            <div className="font-semibold text-accent text-ellipsis-3">{order.discountDetail}</div>
          </div>
          <div className="font-medium text-danger">
            {order.discount > 0
              ? parseNumber(-(order.discount - discountByPoint), true)
              : parseNumber(order.discount, true)}
          </div>
        </div>
      )}
      <div className="flex flex-row items-center justify-between pt-3 pb-2 overflow-hidden border-t border-dashed">
        <div className="text-base font-bold md:text-lg text-accent">Tổng:</div>
        <div className="text-base font-bold text-primary lg:text-lg max-w-40 text-ellipsis-1">
          {parseNumber(order.amount, true)}
        </div>
      </div>
      {(order.paymentMethod == "BANK_TRANSFER" || order.paymentMethod == "MOMO") && (
        <div className="flex flex-row items-center justify-between my-3">
          <div className="font-bold text-accent">Thanh toán:</div>
          <div className="font-bold">
            {order?.status == "CANCELED" ? (
              <div className="text-danger">Thất bại</div>
            ) : order.paymentFilledAmount >= order.amount ? (
              <div className="text-success">Hoàn tất</div>
            ) : (
              <div className="text-warning">Chưa hoàn tất</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoShipMethodRow({ label = "", value, isEmphasizing = false }) {
  return (
    <div className="flex flex-row items-baseline gap-2 my-2 overflow-hidden">
      <div className="font-medium text-gray-400 whitespace-nowrap">{label}</div>
      <div
        className={`text-accent font-medium text-ellipsis-3 ${
          isEmphasizing && !!value && "text-base lg:text-lg font-bold"
        }`}
      >
        {value || "Không có"}
      </div>
    </div>
  );
}

export const combineAddress = (address = "", ward = "", district = "", province = "") => {
  return [address, ward, district, province].filter(Boolean).join(", ");
};

interface ItemStatusOrderProps {
  status?: OrderLog;
  text?: string;
  actived?: boolean;
}

function ItemStatusOrder({ status, text, actived, ...props }: ItemStatusOrderProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {actived ? (
        <>
          {text == "Đã hủy" || text == "Thất bại" ? (
            <i className="text-3xl text-danger">
              <RiCloseCircleFill />
            </i>
          ) : (
            <i className="text-3xl text-primary">
              <RiCheckboxCircleFill />
            </i>
          )}
        </>
      ) : (
        <i className="text-3xl text-gray-300">
          <RiCheckboxCircleFill />
        </i>
      )}
      <div
        className={`py-1 font-semibold ${
          actived && (text == "Đã hủy" || text == "Thất bại")
            ? "text-danger"
            : actived
            ? "text-primary"
            : ""
        } flex-1 text-left whitespace-nowrap`}
      >
        {text}
      </div>
      {status && (
        <div className="text-sm text-gray-400">
          {formatDate(status.updatedAt || status.createdAt, "HH:mm")}
        </div>
      )}
    </div>
  );
}

function StatusOrder(props) {
  const { order } = useProfileOrderDetailContext();
  const [pending, setPending] = useState<OrderLog>();
  const [approval, setApproval] = useState<OrderLog>();
  const [shipping, setShipping] = useState<OrderLog>();
  const [finished, setFinished] = useState<OrderLog>();
  const [failure, setFailure] = useState<OrderLog>();
  const [canceled, setCanceled] = useState<OrderLog>();

  useEffect(() => {
    if (order.logs) {
      order.logs.forEach((item) => {
        switch (item.statusText) {
          case "Chờ duyệt":
            setPending(item);
            break;
          case "Xác nhận":
            setApproval(item);
            break;
          case "Đang giao":
            setShipping(item);
            break;
          case "Hoàn thành":
            setFinished(item);
            break;
          case "Đã huỷ":
            setCanceled(item);
            break;
          case "Thất bại":
            setFailure(item);
            break;
        }
      });
    }
  }, [order.logs]);

  return (
    <div className="flex flex-col w-full px-0 m-auto text-sm lg:w-1/2 lg:px-4 md:text-base">
      <div className="flex flex-wrap items-start justify-center w-full mx-auto mt-2 text-sm md:text-base">
        <ItemStatusOrder
          status={pending}
          actived={true}
          text={order.pickupMethod == "DELIVERY" ? "Chờ xác nhận" : "Đã xác nhận"}
        />
        <div
          className={`h-1 mt-3 rounded-full flex-1 max-w-12 lg:max-w-28 ${
            order.status !== "PENDING" && order.status !== "FAILURE" ? "bg-primary" : "bg-gray-200"
          }`}
        ></div>
        {!canceled ? (
          <>
            {order.status !== "CANCELED" && (
              <>
                <ItemStatusOrder
                  status={approval}
                  actived={["COMPLETED", "DELIVERING", "FAILURE", "CONFIRMED"].includes(
                    order.status
                  )}
                  text="Xác nhận"
                />
                <div
                  className={`h-1 mt-3 rounded-full flex-1 max-w-12 lg:max-w-28 ${
                    ["COMPLETED", "DELIVERING", "FAILURE", "CONFIRMED"].includes(order.status)
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                ></div>
              </>
            )}
            {order.pickupMethod == "DELIVERY" && (
              <>
                <ItemStatusOrder
                  status={shipping}
                  actived={order.status == "COMPLETED" || order.status == "DELIVERING"}
                  text="Đang giao"
                />
                <div
                  className={`h-1 mt-3 rounded-full flex-1 max-w-12 lg:max-w-28 ${
                    order.status == "COMPLETED" ? "bg-primary" : "bg-gray-200"
                  }`}
                ></div>
              </>
            )}
            {order.status != "FAILURE" ? (
              <ItemStatusOrder
                status={finished}
                actived={order.status == "COMPLETED"}
                // text={order.pickupMethod == "DELIVERY" ? "Đã đến nơi" : "Đã hoàn thành"}
                text={"Đã hoàn thành"}
              />
            ) : (
              <ItemStatusOrder
                status={failure}
                actived={order.status == "FAILURE"}
                text="Thất bại"
              />
            )}
          </>
        ) : (
          <ItemStatusOrder status={canceled} actived={order.status == "CANCELED"} text="Đã hủy" />
        )}
      </div>
    </div>
  );
}

function ProductOrderItem({ item }) {
  return (
    <div className="flex gap-2 px-5 py-3 bg-white border border-gray-100 rounded shadow-sm cursor-pointer">
      <Img src={item.product?.image} className="rounded-md lg:w-16 w-14" />
      <div className="flex flex-col justify-between flex-1 gap-1 overflow-hidden lg:flex-row">
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-bold md:text-base lg:text-lg text-ellipsis-2">
            {item.product?.name}
          </div>
          {!!item.toppings?.length && (
            <div className="text-sm text-gray-500 text-ellipsis-2">
              {item.toppings.map((topping) => topping.optionName).join(", ")}
            </div>
          )}
          {item.note && (
            <div className="text-sm text-gray-500 text-ellipsis-1">Ghi chú: {item.note}</div>
          )}
        </div>
        <div className="flex flex-row justify-between w-auto gap-1 pt-2 overflow-hidden lg:justify-center lg:gap-3 lg:flex-col lg:w-1/5 whitespace-nowrap">
          <div className="text-ellipsis-1">
            Số lượng: <span className="font-bold">{item.qty}</span>
          </div>
          <div className="font-bold text-primary text-ellipsis-1">
            {parseNumber(item.amount, true)}
          </div>
        </div>
      </div>
    </div>
  );
}
