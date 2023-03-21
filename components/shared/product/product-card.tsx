import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Product, ProductService } from "../../../lib/repo/product.repo";
import { useShopDetailsContext } from "../../index/shop-details/providers/shop-details-provider";
import { ShowRating } from "../common/show-rating";
import { ProductImg } from "./product-img";
import { ProductPrice } from "./product-price";
import { ProductQuantityButtons } from "./product-quantity-buttons";
import { ProductRating } from "./product-rating";

interface Props extends ReactProps {
  product: Product;
  hasQuantityButtons?: boolean;
  lazyload?: boolean;
  hasLabel?: boolean;
  hasInteractionInfo?: boolean;
  onlyAdd?: boolean;
  onlyShow?: boolean;
}
export function ProductCard({
  product,
  hasQuantityButtons = false,
  className = "",
  lazyload = true,
  hasLabel = false,
  style = {},
  onlyAdd,
  hasInteractionInfo = true,
  onlyShow = false,
  ...props
}: Props) {
  const { cartProducts, changeProductQuantity, addToCartNoTopping } = useCart();
  const { setShowDialogCart } = useShopDetailsContext();
  const { shopCode } = useShopContext();
  let [productQty, setProductQty] = useState(0);
  useEffect(() => {
    if (!cartProducts) return;
    productQty = 0;
    cartProducts.forEach((item) => {
      if (item.productId === product.id) productQty += item.qty;
    });
    setProductQty(productQty);
  }, [cartProducts]);

  return (
    <Link href={`/store/${shopCode}/product/${product.code}`} shallow>
      <a className={`block p-3 transition border-gray-100 cursor-pointer ${className}`}>
        <div className="flex">
          <div className={`relative`}>
            <ProductImg
              lazyload={lazyload}
              src={product.image}
              className="w-20 rounded-sm md:w-24"
              compress={120}
              saleRate={product.saleRate}
            />
          </div>
          <div className="flex flex-col justify-start flex-1 gap-0.5 pl-3 leading-6 min-h-20 md:min-h-24 lg:min-h-28">
            <span className="text-sm font-semibold products-start text-ellipsis-2 text-accent md:text-base">
              {product.name}
            </span>
            {product.subtitle && (
              <span className="overflow-hidden text-xs text-gray-500 md:text-sm text-ellipsis-2">
                {product.subtitle}
              </span>
            )}
            {/* {!!product.rating && hasInteractionInfo && (
              <div className="flex flex-col items-start justify-between xs:items-center xs:flex-row">
                <ShowRating rating={Math.round(product.rating)} className="" />
                <ProductRating soldQty={product.soldQty} />
              </div>
            )} */}
            {hasLabel && (
              <div className="flex flex-wrap gap-2 my-0.5">
                {product.labels?.map((label, index) => (
                  <div
                    className="px-2.5 py-0.5 text-xs md:text-sm font-semibold text-white rounded cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: label.color }}
                    key={index}
                  >
                    <span className="">{label.name}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col mt-auto mb-0">
              <div className="flex flex-wrap">
                <ProductPrice price={product.basePrice} downPrice={product.downPrice} />
                {hasQuantityButtons && (
                  <ProductQuantityButtons
                    className="ml-auto mr-0 transform translate-x-2"
                    isTextPrimaryButton={false}
                    buttonClassName="text-gray-500"
                    quantity={productQty}
                    hasToppings={!!product.toppings?.length}
                    onlyAdd
                    onAdd={() => {
                      if (onlyShow) {
                        router.push(`/store/${shopCode}/product/${product.code}`);
                        return;
                      }

                      let index = cartProducts.findIndex((item) => item.productId === product.id);
                      if (index !== -1) {
                        changeProductQuantity(index, cartProducts[index].qty + 1);
                      } else {
                        ProductService.getOne({ id: product.id }).then((res) => {
                          addToCartNoTopping(res, 1);
                        });
                      }
                    }}
                    onMinus={() => {
                      setShowDialogCart(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
