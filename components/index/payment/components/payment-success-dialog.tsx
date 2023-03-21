import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Order } from "../../../../lib/repo/order.repo";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Img } from "../../../shared/utilities/misc";
import { usePaymentContext } from "../providers/payment-provider";
interface Propstype extends DialogProps {
  order: Order;
}

export function PaymentSuccessDialog({ order, ...props }: Propstype) {
  const { shopCode, getCustomer } = useShopContext();
  const { clearCartProducts } = useCart();
  const { orderInput, setOrderInput } = usePaymentContext();
  let [countDown, setCountDown] = useState(3);
  let [interval] = useState<any>();
  const router = useRouter();

  const handleConfirmSuccess = () => {
    let pathname = "";
    if (orderInput.paymentMethod == "BANK_TRANSFER") {
      pathname = `/store/${shopCode}/order/bank-transfer/${order.code}`;
    } else if (orderInput.paymentMethod == "MOMO") {
      pathname = order?.paymentMeta?.payUrl;
    } else {
      pathname = `/profile/order-history/${order?.code}`;
    }
    router.push(pathname);
  };

  useEffect(() => {
    if (order) {
      setCountDown(3);
      interval = setInterval(() => {
        countDown -= 1;
        setCountDown(countDown);
        if (countDown === 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (order) {
        clearInterval(interval);
        setOrderInput({ ...orderInput, note: "", promotionCode: "" });
        clearCartProducts();
        localStorage.removeItem(`${shopCode}-cart-products`);
      }
    };
  }, [order]);

  useEffect(() => {
    if (countDown === 1) {
      handleConfirmSuccess();
      getCustomer();
    }
  }, [countDown]);

  return (
    <Dialog
      {...props}
      width="400px"
      onClose={() => {}}
      slideFromBottom="none"
      dialogClass="rounded-3xl overflow-hidden relative bg-white"
    >
      <Dialog.Body>
        <div className="flex flex-col items-center sm:p-2">
          <Img src="/assets/img/animation/Ordered.gif" className="w-2/3 rounded-full sm:m-4" />
          <h3 className="p-2 text-lg font-bold text-center">Đặt hàng thành công</h3>
          <Button
            text={`${
              orderInput.paymentMethod == "BANK_TRANSFER"
                ? "Đi đến chuyển khoản"
                : orderInput.paymentMethod == "MOMO"
                ? "Đi đến thanh toán Momo"
                : "Đi đến đơn hàng"
            } (${countDown})`}
            className="my-3 font-medium rounded-full"
            primary
            onClick={() => handleConfirmSuccess()}
          />
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
