import { useRouter } from "next/router";
import SwiperCore, { Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useCart } from "../../../../lib/providers/cart-provider";
import { CUSTOMER_LOGIN_PATHNAME, useShopContext } from "../../../../lib/providers/shop-provider";
import { Product } from "../../../../lib/repo/product.repo";
import { DialogHeader } from "../../../shared/default-layout/dialog-header";
import { CardProductItem } from "../../../shared/product/cart-product-item";
import { ProductCard } from "../../../shared/product/product-card";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Scrollbar } from "../../../shared/utilities/misc";
SwiperCore.use([Navigation]);

interface Propstype extends DialogProps {}
export function ShopDetailsCartDialog(props: Propstype) {
  const router = useRouter();
  const { customer, shopCode } = useShopContext();
  const { cartProducts, totalAmount, totalQty, clearCartProducts } = useCart();

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode
      bodyClass="relative bg-white rounded bg-white"
      slideFromBottom="all"
      extraFooterClass=" z-40"
      headerClass=" "
      className="text-accent"
    >
      <DialogHeader title="Giỏ hàng của bạn" onClose={props.onClose} />
      <Scrollbar height={`calc(100vh - 150px)`}>
        {/* <div className="flex items-center justify-between px-4 py-5">
          <div className="text-lg font-semibold text-accent sm:text-base">Giỏ hàng của bạn</div>
          <i className="text-2xl text-gray-400" onClick={props.onClose}>
            <RiCloseLine />
          </i>
        </div> */}
        <div className="flex items-center pt-3 pb-1 pl-4 border-t text-accent">
          <div className="flex-1 text-sm font-medium">{totalQty} sản phẩm</div>
          <Button
            text="Xóa hết"
            small
            textPrimary
            className="px-0"
            onClick={() => clearCartProducts()}
          />
        </div>
        <div className="flex flex-col gap-4 px-4 mb-3">
          {cartProducts?.map((cartProduct, index) => (
            <CardProductItem
              editable
              cartProduct={cartProduct}
              index={index}
              key={cartProduct.productId + index}
            />
          ))}
        </div>
        <UpsaleProducts />
        {/* <div
          className={`flex flex-col text-sm sm:text-base v-scrollbar overflow-hidden text-gray-600 ${
            isMobile ? "pb-12" : ""
          }`}
          style={{ maxHeight: `calc(100vh - 94px)`, minHeight: `calc(100vh - 94px)` }}
        ></div> */}
        <div className="sticky bottom-0 p-3 bg-white border-t">
          <Button
            primary
            text={`Xác nhận ${parseNumber(totalAmount, true)}`}
            className="z-40 w-full mb-2 font-medium text-center h-14"
            onClick={() => {
              if (customer) {
                router.push(`/store/${shopCode}/payment`);
              } else {
                sessionStorage.setItem(CUSTOMER_LOGIN_PATHNAME, `/store/${shopCode}/payment`);
              }
            }}
          />
        </div>
      </Scrollbar>
      {/* <Dialog.Footer>
      </Dialog.Footer> */}
    </Dialog>
  );
}

interface UpsaleProductProps extends ReactProps {}
export function UpsaleProducts(props: UpsaleProductProps) {
  const { shop } = useShopContext();
  const { upsaleProducts } = useCart();

  if (!upsaleProducts?.length) return <></>;
  return (
    <div className="relative mt-auto mb-3">
      <div className="px-4 pt-2 mb-2 text-sm font-medium text-gray-600">
        {shop?.config.upsaleTitle || "Sản phẩm thường mua kèm"}
      </div>
      <Swiper freeMode={true} grabCursor slidesPerView={"auto"} className="px-4" spaceBetween={18}>
        {upsaleProducts.map((item: Product, index: number) => (
          <SwiperSlide
            key={item.id}
            className={`w-full border border-gray-200 rounded-md`}
            // style={{ width: screenMd ? "85%" : "90%" }}
          >
            <ProductCard
              onlyAdd
              hasInteractionInfo={false}
              hasQuantityButtons
              product={item}
              lazyload={false}
              className="mx-2"
              onlyShow
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
