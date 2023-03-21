import { useCart } from "../../../../lib/providers/cart-provider";
import { OrderItem } from "../../cart/cart-page";

export function PaymentOrderItems(props) {
  const { cartProducts } = useCart();

  return (
    <div className="p-5 bg-white rounded-md">
      <div className="mb-5 font-semibold text-accent">Đơn hàng</div>
      <div>
        {cartProducts.map((item, index) => (
          <OrderItem key={index} cartProduct={item} index={index} />
        ))}
      </div>
    </div>
  );
}
