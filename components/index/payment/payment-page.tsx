import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { ProductDetailsDialog } from "../../shared/product-details/product-details-dialog";
import { ProductDetailsProvider } from "../../shared/product-details/product-details-provider";
import { Spinner } from "../../shared/utilities/misc";
import { PaymentDeliveryInfo } from "./components/payment-delivery-info";
import { PaymentDiscountItems } from "./components/payment-discount-items";
import { PaymentFooter } from "./components/payment-footer";
import { PaymentItems } from "./components/payment-items";
import { PaymentNote } from "./components/payment-note";
import { PaymentSummary } from "./components/payment-summary";
import { PaymentVoucherItemsDialog } from "./components/payment-voucher-items-dialog";
import { PaymentVouchers } from "./components/payment-vouchers";
import { PaymentContext, PaymentProvider } from "./providers/payment-provider";

export function PaymentPage() {
  const router = useRouter();
  const { cartProducts } = useCart();
  const { customer, shop, shopCode } = useShopContext();

  useEffect(() => {
    if (customer === null) {
      router.push(`/store/${shopCode}`);
    }
  }, [customer]);

  if (!customer || !shop || !cartProducts) return <Spinner />;
  return (
    <PaymentProvider>
      <PaymentContext.Consumer>
        {({ isSubmitting }) => (
          <>
            <div
              className={`relative text-accent text-sm md:text-base min-h-screen ${
                isSubmitting ? "pointer-events-none opacity-70" : ""
              }`}
            >
              <PaymentDeliveryInfo />
              <div className="px-3">
                <PaymentItems />
                <PaymentDiscountItems />
                <PaymentNote />
                <PaymentSummary />
              </div>
              <PaymentVouchers />
              <PaymentFooter />
              <PaymentVoucherItemsDialog />
              <ProductDetailsProvider isDiscountItems>
                <ProductDetailsDialog />
              </ProductDetailsProvider>
            </div>
          </>
        )}
      </PaymentContext.Consumer>
    </PaymentProvider>
  );
}
