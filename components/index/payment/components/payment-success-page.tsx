import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Button } from "../../../shared/utilities/form";

export function PaymentSuccessPage({ ...props }) {
  return <BodyPage />;
}

function BodyPage() {
  const router = useRouter();
  const { clearCartProducts } = useCart();
  const { shopCode, getCustomer } = useShopContext();
  let [countDown, setCountDown] = useState(5);

  useEffect(() => {
    setCountDown(5);
    const interval = setInterval(() => {
      countDown -= 1;
      setCountDown(countDown);
      if (countDown === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearCartProducts();
      localStorage.removeItem(`${shopCode}-cart-products`);
    };
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      router.replace(`/profile/order-history/${router.query.orderCode}`);
      getCustomer();
    }
  }, [countDown]);

  return (
    <div className="flex-1 w-full pt-32 bg-white">
      <div className="gap-6 text-center main-container flex-cols">
        <div className="flex-center">
          <i className="" style={{ fontSize: "7rem", color: "rgb(83, 209, 182)" }}>
            <RiCheckboxCircleFill />
          </i>
        </div>
        <div className="text-2xl font-bold text-accent">Thanh toán thành công</div>
        <div className="text-sm font-normal text-gray-500">Cám ơn bạn đã đặt hàng.</div>
        <Button
          className="w-64 mx-auto h-14"
          text={`Xem chi tiết đơn hàng (${countDown})`}
          href={`/profile/order-history/${router.query.orderCode}`}
          primary
        />
      </div>
    </div>
  );
}
