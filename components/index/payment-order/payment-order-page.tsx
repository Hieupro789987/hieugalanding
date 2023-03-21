import { useRouter } from "next/router";
import { useEffect } from "react";
import { parseNumber } from "../../../lib/helpers/parser";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Button } from "../../shared/utilities/form";
import { NotFound, Spinner } from "../../shared/utilities/misc";
import { PaymentPage } from "../payment/payment-page";
import { PaymentContext, PaymentProvider } from "../payment/providers/payment-provider";
import { PaymentOrderDeliveryInfo } from "./components/payment-order-delivery-info";
import { PaymentOrderItems } from "./components/payment-order-items";
import { PaymentOrderMethods } from "./components/payment-order-methods";
import { PaymentOrderNote } from "./components/payment-order-note";
import { PaymentOrderSummary } from "./components/payment-order-summary";
import { PaymentOrderVouchers } from "./components/payment-order-vouchers";

export function PaymentOrderPage({ ...props }) {
  const screenLg = useScreen("lg");

  return <>{screenLg ? <PaymentDesktopPage /> : <PaymentPage />}</>;
}

export function PaymentDesktopPage() {
  const { cartProducts } = useCart();
  const { customer, shopCode } = useShopContext();
  const router = useRouter();

  if (cartProducts === undefined) return <Spinner />;
  if (!cartProducts.length)
    return (
      <NotFound text="Chưa có sản phẩm trong giỏ hàng">
        <Button
          text="Về trang chủ"
          primary
          className="mt-4 rounded-full"
          href={`/store/${shopCode}`}
        />
      </NotFound>
    );

  useEffect(() => {
    if (customer === null) {
      router.replace(`/store/${shopCode}`);
    }
  }, [customer]);

  return (
    <PaymentProvider>
      <PaymentContext.Consumer>
        {({ isSubmitting, draftOrder, generateOrder, order, isSubmittingDraft }) => (
          <>
            <div
              className={`relative min-h-screen ${
                isSubmitting ? "pointer-events-none opacity-70" : ""
              }`}
            >
              <section className="pb-20 main-container">
                <div className="my-8 text-3xl font-semibold leading-10 text-center text-accent">
                  Thanh toán
                </div>
                <div className="flex flex-row justify-between">
                  <div className="w-2/3">
                    <PaymentOrderItems />
                    <PaymentOrderMethods />
                  </div>
                  <div className="flex-1 ml-10">
                    <PaymentOrderDeliveryInfo />
                    <PaymentOrderNote />
                    {/* <PaymentOrderVouchers /> */}
                    <div className="my-5 text-xl font-semibold text-accent">Thanh toán</div>
                    <PaymentOrderSummary />
                    <Button
                      primary
                      disabled={draftOrder?.invalid || !!order}
                      text={
                        !isSubmittingDraft
                          ? draftOrder.order
                            ? `Thanh toán ${parseNumber(draftOrder?.order?.amount)}đ`
                            : "Thanh toán"
                          : "Đang tính"
                      }
                      className={`h-14 mt-5 w-full ${isSubmittingDraft ? "loading-ellipsis" : ""}`}
                      onClick={async () => {
                        if (isSubmittingDraft) return;
                        await generateOrder();
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </PaymentContext.Consumer>
    </PaymentProvider>
  );
}
