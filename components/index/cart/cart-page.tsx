import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { parseNumber } from "../../../lib/helpers/parser";
import { CartProduct, useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Product } from "../../../lib/repo/product.repo";
import { RequestDialog } from "../../shared/common/request-dialog";
import { ProductQuantity } from "../../shared/product/product-quantity";
import { Button } from "../../shared/utilities/form";
import { Img, NotFound, Spinner } from "../../shared/utilities/misc";

export function CartPage() {
  const router = useRouter();
  const { customer, shopCode } = useShopContext();
  const { totalQty, totalAmount, cartProducts, clearCartProducts } = useCart();
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  if (cartProducts === undefined) return <Spinner />;
  if (!cartProducts.length)
    return (
      <div className="flex-center min-h-xl">
        <NotFound text="Chưa có sản phẩm trong giỏ hàng">
          <Button
            text="Về trang cửa hàng"
            primary
            className="mt-4 rounded-full"
            href={`/store/${shopCode}`}
          />
        </NotFound>
      </div>
    );

  return (
    <section className="pb-20 main-container">
      <div className="my-8 text-3xl font-semibold leading-10 text-center text-accent">
        Giỏ hàng của bạn
      </div>
      <div>
        <div className="flex flex-row items-center justify-between">
          <div>
            <span className="font-semibold text-accent">Tổng: </span> {totalQty} sản phẩm
          </div>
          <Button text="Xóa hết" className="text-primary" onClick={clearCartProducts} />
        </div>
        <div>
          {cartProducts.map((item, index) => (
            <OrderItem key={index} index={index} cartProduct={item} />
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button
            primary
            text={`Xác nhận ${parseNumber(totalAmount, true)}`}
            className="h-14 w-72"
            onClick={() => {
              if (customer) {
                router.push(`/store/${shopCode}/payment`, null, { shallow: true });
              } else {
                setOpenRequestDialog(true);
              }
            }}
          />
        </div>
      </div>
      <RequestDialog
        title="Vui lòng đăng nhập để tiếp tục."
        hasRequestLogin
        isOpen={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
      />
    </section>
  );
}

export function OrderItem({
  cartProduct,
  index,
}: ReactProps & { cartProduct?: CartProduct; index?: number }) {
  const { removeProductFromCart, changeProductQuantity } = useCart();
  const { customer } = useShopContext();
  const appliedPricePolicyActor = useMemo(() => {
    let currentActor = "";
    if (cartProduct.product.pricePolicy && cartProduct.product.policyBestPrice?.length) {
      for (let bestPrice of cartProduct.product.policyBestPrice) {
        if (bestPrice.minQty <= cartProduct.qty && cartProduct.price == bestPrice.price) {
          if (customer?.isCollaborator) {
            currentActor = "cho cộng tác viên";
          } else if (customer?.isAgency) {
            currentActor = "cho đại lý";
          } else if (customer?.isDistributor) {
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
    <div className="flex flex-col items-center justify-between p-5 my-3 bg-white border border-blue-100 rounded-md md:flex-row">
      <div className="flex flex-row items-center flex-1 gap-4">
        <Img
          src={cartProduct?.product?.image}
          className="w-24 rounded-md"
          alt={`${cartProduct?.product?.name}-image`}
        />
        <div className="flex flex-col gap-0.5 ml-3 text-accent">
          <div className="font-semibold whitespace-pre-wrap">{cartProduct?.product?.name}</div>
          <div>{displayToppings(cartProduct?.product)}</div>
          {/* {appliedPricePolicyActor && (
            <div className="text-sm font-medium text-accent">
              *Sản phẩm đang được áp dụng bảng giá {appliedPricePolicyActor}
            </div>
          )} */}
        </div>
      </div>
      <div className="flex items-center justify-end gap-6 pl-4">
        <div className="font-semibold text-primary">{parseNumber(cartProduct?.amount, true)}</div>
        <ProductQuantity
          className="justify-end"
          quantity={cartProduct?.qty}
          setQuantity={(qty) => changeProductQuantity(index, qty)}
        />
        <Button
          icon={<AiOutlineDelete />}
          className="px-0 text-xl"
          onClick={() => removeProductFromCart(index)}
        />
      </div>
    </div>
  );
}

export const displayToppings = (product: Product) => {
  if (!product) return;
  const { selectedToppings } = product;
  if (!selectedToppings?.length) return;
  let displaySelectedTopping = [...selectedToppings]
    .map((topping) => `${topping?.toppingName}: ${topping?.optionName}`)
    .join(", ");
  return <div className="text-sm italic text-gray-500">{`${displaySelectedTopping}`}</div>;
};
