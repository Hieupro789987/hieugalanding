import React, { useState } from "react";
import { FaReceipt } from "react-icons/fa";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { CardProductItem } from "../../../shared/product/cart-product-item";
import { Button } from "../../../shared/utilities/form/button";
import { NotFound, Spinner } from "../../../shared/utilities/misc";

export function PaymentItems(props) {
  const { cartProducts } = useCart();
  const { shopCode } = useShopContext();

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
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <div className="text-base font-bold md:text-lg">Đơn hàng</div>
        <div className="font-semibold">{`${cartProducts.length || 0} sản phẩm`}</div>
      </div>
      <div className="gap-3 mt-2 flex-cols">
        {cartProducts.map((cartProduct, index) => (
          <CardProductItem
            className="bg-white"
            editable
            cartProduct={cartProduct}
            index={index}
            key={cartProduct.productId + index}
          />
        ))}
      </div>
    </div>
  );
}
