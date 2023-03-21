import { useRouter } from "next/router";
import { useMemo } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { CartProduct, useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { usePaymentContext } from "../../index/payment/providers/payment-provider";
import { Img } from "../utilities/misc";
import { ProductQuantity } from "./product-quantity";

interface Props extends ReactProps {
  cartProduct: CartProduct;
  index: number;
  editable?: boolean;
  quantityEditable?: boolean;
  isDiscountProduct?: boolean;
}
export function CardProductItem({
  cartProduct,
  index,
  editable = false,
  quantityEditable = true,
  isDiscountProduct = false,
  className = "",
  ...props
}: Props) {
  const router = useRouter();
  const { changeProductQuantity, removeProductFromCart } = useCart();
  const { changeDiscountItemQuantity } = usePaymentContext();

  const showEditProduct = () => {
    if (editable) {
      const url = new URL(location.href);
      url.searchParams.set(
        isDiscountProduct ? "editDiscountProduct" : "editProduct",
        index.toString()
      );
      router.replace(url.toString(), null, { shallow: true });
    }
  };
  const { customer } = useShopContext();
  const appliedPricePolicyActor = useMemo(() => {
    let currentActor = "";
    if (cartProduct.product.pricePolicy && cartProduct.product.policyBestPrice?.length) {
      for (let bestPrice of cartProduct.product.policyBestPrice) {
        if (bestPrice.minQty <= cartProduct.qty && cartProduct.price == bestPrice.price) {
          if (customer.isCollaborator) {
            currentActor = "cho cộng tác viên";
          } else if (customer.isAgency) {
            currentActor = "cho đại lý";
          } else if (customer.isDistributor) {
            currentActor = "cho nhà phân phối";
          } else {
            currentActor = "bán lẻ";
          }
        }
      }
    }
    return currentActor;
  }, [cartProduct]);

  return (
    <div className={`p-4 border rounded-md ${className}`}>
      <div className="flex items-center justify-between w-full gap-3">
        <Img
          src={cartProduct?.product?.image}
          className="grow-0 shrink-0 w-20 rounded-md shadow-sm"
        />
        <div className="flex-1 cursor-pointer">
          <div className="flex justify-between">
            <div className="flex-1">
              <div
                className="text-sm font-semibold text-accent text-ellipsis-2"
                onClick={showEditProduct}
              >
                {cartProduct?.product?.name}
              </div>
              {!!cartProduct.product.selectedToppings?.length && (
                <div
                  className={`inline-flex items-center text-xs md:text-sm font-light text-gray-600 ${
                    editable ? "group-hover:text-primary" : ""
                  }`}
                  onClick={showEditProduct}
                >
                  {cartProduct.product.selectedToppings
                    .map((topping) => topping.optionName)
                    .join(", ")}
                </div>
              )}
            </div>
            <i
              className="text-xl text-gray-400 hover:text-danger"
              onClick={() => removeProductFromCart(index)}
            >
              <RiDeleteBin7Line />
            </i>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start w-full gap-0.5 lg:items-center lg:flex-row">
              <div className="flex flex-col flex-wrap flex-1 gap-1 lg:flex-row">
                <div
                  className="text-sm font-semibold text-right md:text-base text-primary"
                  onClick={showEditProduct}
                >
                  {parseNumber(cartProduct.amount, true)}
                </div>
                {/* {isDiscountProduct && (
                <div className="text-xs text-right text-gray-500 line-through md:text-sm">
                  {parseNumber(cartProduct.product.basePrice * cartProduct.qty, true)}
                </div>
              )} */}
                {isDiscountProduct && (
                  <div className="ml-2 text-xs text-right text-gray-600 line-through sm:ml-0">
                    {parseNumber(cartProduct.product.price * cartProduct.qty, true)}
                  </div>
                )}
              </div>
              <ProductQuantity
                className="justify-end"
                inputClassName=""
                quantity={cartProduct.qty}
                setQuantity={(qty) => {
                  if (isDiscountProduct) {
                    changeDiscountItemQuantity(index, qty);
                  } else {
                    changeProductQuantity(index, qty);
                  }
                }}
                disabled={!quantityEditable}
              />
            </div>
          </div>
        </div>
      </div>

      {appliedPricePolicyActor && (
        <div className="mt-1 text-xs font-medium text-accent">
          *Sản phẩm đang được áp dụng bảng giá {appliedPricePolicyActor}
        </div>
      )}
      {cartProduct.note && (
        <div className="flex mt-2 text-sm text-gray-500 text-ellipsis-1" onClick={showEditProduct}>
          <div className="px-2 font-medium underline">Ghi chú: </div>
          {cartProduct.note}
        </div>
      )}
    </div>
  );
}
