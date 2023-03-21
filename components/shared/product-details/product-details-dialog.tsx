import copy from "copy-to-clipboard";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BiLink } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { HiChevronDown, HiOutlineX } from "react-icons/hi";
import { RiCloseLine, RiShareForwardLine } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { PricePolicyActor, PRICE_POLICY_ACTORS } from "../../../lib/repo/price-policy.repo";
import { Product } from "../../../lib/repo/product.repo";
import { usePaymentContext } from "../../index/payment/providers/payment-provider";
import { Share } from "../../index/product-detail/components/product-info";
import { QuantityMatrix } from "../../shop/price-policy/components/quantity-matrix";
import { ShowRating } from "../common/show-rating";
import { ProductPrice } from "../product/product-price";
import { ProductRating } from "../product/product-rating";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Select } from "../utilities/form";
import { Button } from "../utilities/form/button";
import { Img, Spinner } from "../utilities/misc";
import { ProductDetailsBanners } from "./product-details-banners";
import { useProductDetailsContext } from "./product-details-provider";
import { ProductDetailsQuantityButtons } from "./product-details-quantity-buttons";
import { ProductToppings } from "./product-toppings";

interface PropsType extends DialogProps {}
export function ProductDetailsDialog({ ...props }: PropsType) {
  const {
    isDiscountItems,
    productCode,
    editCartProductIndex,
    product,
    cartProduct,
    totalAmount,
    qty,
    onChangeQuantity,
    setQty,
  } = useProductDetailsContext();
  const router = useRouter();
  const { addProductToCart, updateCartProduct } = useCart();
  const { shopCode } = useShopContext();
  const { selectedVoucher, updateDiscountItem, orderInput, isGroup, isOffer } = usePaymentContext();
  const [note, setNote] = useState("");
  const [showMore, setShowMore] = useState<any>();
  const [linkShare, setLinkShare] = useState("");
  const [openDialogShareLink, setOpenDialogShareLink] = useState(false);
  const [pricePolicyActor, setPricePolicyActor] = useState<PricePolicyActor>();

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

  function checkHeight(code: string) {
    let el = document.getElementById(code);
    if (el) {
      let bounding = el.getBoundingClientRect();
      if (bounding.height > 200) {
        setShowMore(false);
      } else {
        setShowMore(undefined);
      }
    }
  }
  useEffect(() => {
    if (product) {
      checkHeight(`${product.code}-intro`);
    } else {
      setShowMore(undefined);
    }
  }, [product]);

  useEffect(() => {
    if (cartProduct) {
      setNote(cartProduct.note);
    }
  }, [cartProduct]);

  const bestPrice = useMemo(() => {
    if (product) {
      if (product.policyBestPrice) {
        let price = product.basePrice;
        for (let bestPrice of product.policyBestPrice) {
          if (bestPrice.minQty <= qty) {
            price = bestPrice.price;
          }
        }
        return price;
      }
      return product.basePrice;
    } else {
      return 0;
    }
  }, [product, qty]);

  useEffect(() => {
    if (product?.policyBestPrice) {
      let index = 0;
      for (let i = 0; i < product.pricePolicy.qtyMatrix.length - 1; i++) {
        if (product.pricePolicy.qtyMatrix[i].minQty <= qty) {
          index = i;
        }
      }
      const currentPolicy = product.pricePolicy.qtyMatrix[index];
      if (bestPrice == currentPolicy.normal) {
        setPricePolicyActor("normal");
      } else if (bestPrice == currentPolicy.ctv) {
        setPricePolicyActor("ctv");
      } else if (bestPrice == currentPolicy.ctvSan) {
        setPricePolicyActor("ctvSan");
      } else if (bestPrice == currentPolicy.dl) {
        setPricePolicyActor("dl");
      } else if (bestPrice == currentPolicy.npp) {
        setPricePolicyActor("npp");
      } else {
        setPricePolicyActor("normal");
      }
    } else {
      setPricePolicyActor("normal");
    }
  }, [product, bestPrice, qty]);

  const onClose = () => {
    router.replace(`/store/${shopCode}`, null, { shallow: true });
    setQty(1);
  };

  return (
    <Dialog
      isOpen={!!(productCode || cartProduct)}
      onClose={onClose}
      mobileSizeMode
      slideFromBottom="all"
      extraFooterClass="border-t border-gray-300 items-center"
    >
      <div className="no-scrollbar text-accent" style={{ height: `calc(100vh - 94px)` }}>
        <div
          className={`w-7 h-7 absolute right-2 top-2 z-100 rounded-full flex-center cursor-pointer bg-black hover:bg-gray-800 text-gray-300 hover:text-gray-200`}
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => {
            onClose();
          }}
        >
          <i className="text-xl">
            <HiOutlineX />
          </i>
        </div>
        {!product ? (
          <Spinner />
        ) : (
          <>
            <div className="relative overflow-hidden shadow-inner">
              {product.images?.length > 0 || product.youtubeLink || product.cover ? (
                <ProductDetailsBanners
                  images={product.images}
                  youtubeLink={product.youtubeLink}
                  cover={product.cover}
                />
              ) : (
                <>
                  <div className="absolute top-0 left-0 flex w-full">
                    <Img
                      lazyload={false}
                      src={product.image}
                      compress={400}
                      contain
                      className="z-50 w-3/4 mx-auto"
                    />
                  </div>
                  <Img
                    lazyload={false}
                    src={product.image}
                    compress={400}
                    percent={75}
                    imageClassName="filter blur-lg opacity-40"
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-1 bg-white">
              <div className="px-4 py-3">
                <div className="text-2xl font-semibold">{product.name}</div>
                <div className="flex flex-wrap items-center justify-between my-3">
                  <ProductPrice
                    price={isDiscountItems ? cartProduct?.price : product.basePrice}
                    saleRate={product.saleRate}
                    downPrice={isDiscountItems ? product.basePrice : product.downPrice}
                    priceClassName="text-lg pb-1 font-bold"
                  />
                  <div className="flex flex-row items-center pl-3">
                    <span className="text-gray-400 cursor-pointer ">
                      <BiLink
                        className="text-xl"
                        data-tooltip={"Copy Link"}
                        onClick={() => {
                          // copy(getProductUrl(product));
                        }}
                      />
                    </span>
                    <span
                      className="ml-3 text-gray-400 cursor-pointer"
                      onClick={() => {
                        setOpenDialogShareLink(true);
                      }}
                    >
                      <RiShareForwardLine className="text-xl" data-tooltip={"Chia sẻ"} />
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b">
                  <div className="flex items-center gap-2">
                    <ShowRating rating={Math.round(product?.rating)} className="pb-1" />
                    {/* <div className="text-sm underline cursor-pointer text-primary text-medium">{`Xem 0 đánh giá`}</div> */}
                  </div>
                  <ProductRating soldQty={product?.soldQty} soldQtyIconClassName="text-lg" />
                </div>
                <div className="text-sm text-gray-500">{product.subtitle}</div>
                {/* {product.pricePolicy && (
                  <>
                    <div className="flex flex-col gap-2 my-3">
                      <div className="flex items-center">
                        <div className="text-base font-extrabold text-accent">Bảng giá áp dụng</div>
                        <div className="relative ml-auto">
                          <Select
                            native
                            controlClassName=" "
                            className="w-32 px-2.5 py-1.5 text-xs pr-3 font-bold border-0 rounded appearance-none bg-primary-light text-primary"
                            options={PRICE_POLICY_ACTORS}
                            value={pricePolicyActor}
                            onChange={setPricePolicyActor}
                          />
                          <i className="absolute text-lg transform -translate-y-1/2 right-2 top-1/2 text-primary">
                            <HiChevronDown />
                          </i>
                        </div>
                      </div>
                      {product.pricePolicy.qtyMatrix.map((matrix) => {
                        const price =
                          product.pricePolicy.adjustUnit == "AMOUNT"
                            ? product.basePrice - matrix[pricePolicyActor]
                            : product.basePrice -
                              (product.basePrice * matrix[pricePolicyActor]) / 100;

                        return (
                          <div key={matrix.minQty} className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Trên {matrix.minQty} sản phẩm
                            </div>
                            <div
                              className={`font-medium ${
                                bestPrice == price ? "text-primary font-bold" : "text-accent"
                              }`}
                            >
                              {parseNumber(price > 0 ? price : 0)}đ
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )} */}
                <ProductToppings className="mt-3 text-lg" />
                <div className="flex flex-col gap-1 my-3">
                  <div className="mb-1 text-base font-extrabold text-accent">
                    Ghi chú cho cửa hàng
                  </div>
                  <input
                    className="p-3 border border-gray-200 rounded-md"
                    placeholder="Vui lòng nhập nội dung ghi chú..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div id={`${product.code}-intro`} className="pt-3 text-gray-700">
                  {product.intro && (
                    <>
                      <div className="font-medium">Mô tả sản phẩm</div>
                      <div className="relative pt-3">
                        <div
                          className={`text-sm overflow-hidden transition-all`}
                          style={{
                            maxHeight:
                              showMore !== undefined ? (showMore ? "10000px" : "80px") : "",
                          }}
                          dangerouslySetInnerHTML={{ __html: product.intro }}
                        ></div>
                        {showMore !== undefined && (
                          <div
                            className={`w-full h-16 bg-gradient-to-t from-white absolute bottom-0 left-0 pointer-events-none transition-opacity ${
                              showMore ? "opacity-0" : "opacity-100"
                            }`}
                          ></div>
                        )}
                      </div>
                      {showMore !== undefined && (
                        <div className="flex-center">
                          <Button
                            small
                            className="w-full underline"
                            text={`${showMore ? "Thu gọn" : "Xem thêm"}`}
                            onClick={() => setShowMore(!showMore)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <ProductDetailsQuantityButtons
                  value={qty}
                  onChange={onChangeQuantity}
                  disabled={isDiscountItems && isOffer}
                  maxValue={maxValue}
                />
              </div>
              <div className="sticky bottom-0 flex flex-row items-center w-full gap-2 px-4 py-4 mt-auto bg-white">
                <Button
                  text="Chat"
                  icon={<BsChatDots />}
                  iconClassName="text-xl"
                  textPrimary
                  className="h-12 text-base text-white bg-primary-light"
                  href={`/store/${shopCode}/chat`}
                />
                <Button
                  primary
                  text={`${cartProduct ? "Cập nhật" : "Thêm"} ${parseNumber(totalAmount)}đ`}
                  className="w-full h-12 text-base whitespace-nowrap"
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
                    onClose();
                  }}
                />
              </div>
            </div>
          </>
        )}
        <Dialog
          width="600px"
          isOpen={openDialogShareLink}
          onClose={() => {
            setOpenDialogShareLink(false);
          }}
        >
          <Dialog.Body>
            <Share link={linkShare} />
          </Dialog.Body>
        </Dialog>
      </div>
    </Dialog>
  );
}

const QuantityMatrixDialog = ({
  product,
  isOpen,
  onClose,
  ...props
}: ReactProps & { product: Product; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} width="600px">
      <Dialog.Header>
        <div className={`pl-3 w-full rounded-t-none cursor-pointer bg-white flex-center group`}>
          <div className="flex-1 font-bold text-accent group-hover:text-accent-dark">Bảng giá</div>
          <Button
            className="text-xl text-gray-400 group-hover:text-gray-600"
            hoverWhite
            icon={<RiCloseLine />}
            onClick={onClose}
          />
        </div>
      </Dialog.Header>
      <Dialog.Body>
        <div className="w-full overflow-scroll">
          <QuantityMatrix
            basePrice={product?.basePrice}
            unit={product?.pricePolicy?.adjustUnit}
            qtyMatrixes={product?.pricePolicy?.qtyMatrix}
          />
        </div>
      </Dialog.Body>
    </Dialog>
  );
};
