import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineChat } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { parseNumber } from "../../../lib/helpers/parser";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useCart } from "../../../lib/providers/cart-provider";
import { LocationProvider } from "../../../lib/providers/location-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Product } from "../../../lib/repo/product.repo";
import { RequestDialog } from "../../shared/common/request-dialog";
import {
  ProductDetailsProvider,
  useProductDetailsContext,
} from "../../shared/product-details/product-details-provider";
import { Button } from "../../shared/utilities/form";
import { BreadCrumbs, Img, NotFound, Spinner } from "../../shared/utilities/misc";
import { usePaymentContext } from "../payment/providers/payment-provider";
import { ProductDetailQuantityButtons } from "./components/product-detail-quantity-buttons";
import { ProductDetailSimilar } from "./components/product-detail-similar";
import { ProductImgSlider } from "./components/product-img-slider";
import { ProductInfo } from "./components/product-info";
import { ProductSpecs } from "./components/product-specs";
import { ProductTabInformation } from "./components/product-tab-information";

export function ProductDetailPage({ ...props }) {
  const screenLg = useScreen("lg");

  // if (!screenLg) return <></>;
  return (
    <ProductDetailsProvider>
      <LocationProvider>
        <ProductDetailComponents />
      </LocationProvider>
    </ProductDetailsProvider>
  );
}

function ProductDetailComponents() {
  const { customer, selectedBranch } = useShopContext();
  const [openRequestLoginDialog, setOpenRequestLoginDialog] = useState(false);
  const {
    isDiscountItems,
    product,
    onChangeQuantity,
    qty,
    totalAmount,
    editCartProductIndex,
    cartProduct,
  } = useProductDetailsContext();
  const { addProductToCart, updateCartProduct } = useCart();
  const { selectedVoucher, updateDiscountItem, orderInput, isGroup, isOffer } = usePaymentContext();
  const alert = useAlert();
  const isLg = useScreen("lg");

  const [note, setNote] = useState("");

  const maxValue = useMemo(() => {
    let max = 0;
    if (isDiscountItems && selectedVoucher && cartProduct) {
      if (!isGroup && !isOffer) {
        const offerItem = selectedVoucher.offerItems[editCartProductIndex];
        return offerItem?.qty || 0;
      } else if (isGroup && isOffer) {
        const offerItem =
          selectedVoucher.offerItemGroups2[orderInput.offerGroupIndex]?.items[editCartProductIndex];
        return offerItem?.qty || 0;
      }
    }
    return max;
  }, [isDiscountItems, selectedVoucher, cartProduct, editCartProductIndex]);

  if (!product) return <Spinner />;
  return (
    <div className="lg:pb-20">
      <section className={isLg ? "main-container" : ""}>
        <div className="bg-white lg:bg-transparent">
          <div className={!isLg ? "main-container" : ""}>
            <BreadCrumbs
              className="relative z-10 py-6"
              breadcrumbs={[
                {
                  href: "/",
                  label: "Trang chủ",
                },
                {
                  href: `/store/${product?.member?.code}`,
                  label: `${product?.member?.shopName}`,
                },
                {
                  label: `${product?.name}`,
                },
              ]}
            />
          </div>
        </div>

        <div className="p-5 bg-white">
          <div className="grid grid-cols-1 gap-5 lg:gap-10 lg:grid-cols-2">
            <ProductImgSlider />
            <ProductInfo maxValue={maxValue} />
          </div>
        </div>
        {/* {product.pricePolicy && (
          <div className="p-5 my-8 bg-white">
            <SectionTitle className="mb-4">Bảng giá ưu đãi</SectionTitle>
            <QuantityMatrix
              priceOnly
              currentQty={qty}
              bestPrices={product.policyBestPrice}
              basePrice={product.basePrice}
              unit={product.pricePolicy.adjustUnit}
              qtyMatrixes={product.pricePolicy.qtyMatrix}
            />
          </div>
        )} */}
        <div className="p-5 my-4 bg-white lg:my-8">
          <div className="flex flex-col justify-between lg:items-center lg:flex-row">
            <div className="flex flex-row items-center justify-start">
              <Img src={product?.member?.shopCover} className="w-20 rounded-full" alt="" />
              <div className="flex flex-col ml-2 lg:ml-4">
                <div className="text-xl font-semibold leading-8 text-accent">
                  {product?.member?.shopName}
                </div>
                <div>
                  <div className="flex flex-col items-center lg:flex-row">
                    <div className="flex flex-row items-center  font-medium text-gray-500">
                      <i className="mr-2 text-lg">
                        <IoLocationOutline />
                      </i>
                      {isLg ? (
                        <span>
                          {selectedBranch?.district} - {selectedBranch?.province}
                        </span>
                      ) : (
                        <span>{selectedBranch?.province}</span>
                      )}
                    </div>
                    {isLg && (
                      <div className="leading-6 whitespace-pre-wrap lg:ml-2 text-accent ">
                        (cách tôi {selectedBranch?.distance >= 0 && selectedBranch?.distance} km)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full gap-3 mt-4 lg:mt-0 lg:w-auto ">
              <Button
                icon={<HiOutlineChat />}
                iconPosition="start"
                text={"Chat"}
                outline
                textPrimary
                className="w-full lg:w-auto"
                onClick={() => {
                  if (customer) {
                    const el: HTMLElement = document.querySelector("#chat-widget");
                    if (el) {
                      el.click();
                      setTimeout(() => {
                        const typeEl: HTMLElement = document.querySelector(
                          "#chat-widget-type-input"
                        );
                        if (typeEl) {
                          typeEl.focus();
                        }
                      }, 100);
                    }
                  } else {
                    setOpenRequestLoginDialog(true);
                  }
                }}
              />
              <Button
                text="Đến cửa hàng"
                primary
                textPrimary
                className="w-full lg:w-auto"
                href={`/store/${product?.member?.code}`}
              />
            </div>
          </div>
        </div>
        <ProductTabInformation product={product} />
        <ProductSpecs product={product} />
        {/* <ProductFeedback /> */}
        {/* <div className="w-full my-7"></div> */}

        <ProductDetailSimilar />

        <div className="lg:hidden block sticky bottom-0 left-0  z-100">
          <div className="flex flex-row items-center border-t p-5 justify-start bg-white w-full">
            <div className="flex flex-row items-center w-auto mr-5">
              <ProductDetailQuantityButtons
                value={qty}
                onChange={onChangeQuantity}
                disabled={isDiscountItems && isOffer}
                maxValue={maxValue}
              />
            </div>
            <Button
              text={`Thêm ${parseNumber(totalAmount)}đ`}
              primary
              className="w-full shadow-xl lg:mx-6 h-14 lg:w-auto"
              onClick={() => {
                if (isDiscountItems) {
                  updateDiscountItem(product, qty, note, editCartProductIndex);
                } else {
                  if (cartProduct) {
                    updateCartProduct(product, qty, note, editCartProductIndex);
                  } else {
                    addProductToCart(product, qty, note);
                  }
                }
                setNote("");
                alert.success("Sản phẩm đã được thêm vào giỏ hàng!");
              }}
            />
          </div>
        </div>
      </section>

      <RequestDialog
        hasRequestLogin
        isOpen={openRequestLoginDialog}
        onClose={() => {
          setOpenRequestLoginDialog(false);
        }}
      />
    </div>
  );
}
