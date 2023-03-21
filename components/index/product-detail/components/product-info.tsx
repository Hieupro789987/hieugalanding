import copy from "copy-to-clipboard";
import QRCode from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaRegCopy, FaShareAlt } from "react-icons/fa";
import { RiDownload2Line } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { FbIcon, IconViber, QRIcon, TgIcon } from "../../../../public/assets/svg/svg";
import { useProductDetailsContext } from "../../../shared/product-details/product-details-provider";
import { ProductToppings } from "../../../shared/product-details/product-toppings";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form";
import { usePaymentContext } from "../../payment/providers/payment-provider";
import { ProductDetailQuantityButtons } from "./product-detail-quantity-buttons";

type Props = {};

export function ProductInfo({ maxValue }: Props & { maxValue: number }) {
  const alert = useAlert();
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
  const [note, setNote] = useState("");
  const [linkShare, setLinkShare] = useState("");
  const [openDialogShareLink, setOpenDialogShareLink] = useState(false);

  useEffect(() => {
    if (cartProduct) {
      setNote(cartProduct.note);
    }
  }, [cartProduct]);

  // const maxValue = useMemo(() => {
  //   let max = 0;
  //   if (isDiscountItems && selectedVoucher && cartProduct) {
  //     if (!isGroup && !isOffer) {
  //       const offerItem = selectedVoucher.offerItems[editCartProductIndex];
  //       return offerItem?.qty || 0;
  //     } else if (isGroup && isOffer) {
  //       const offerItem =
  //         selectedVoucher.offerItemGroups2[orderInput.offerGroupIndex]?.items[editCartProductIndex];
  //       return offerItem?.qty || 0;
  //     }
  //   }
  //   return max;
  // }, [isDiscountItems, selectedVoucher, cartProduct, editCartProductIndex]);
  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="text-2xl font-semibold leading-10 whitespace-pre-wrap lg:text-3xl text-accent">
          {product?.name}
        </div>
        <div className="flex flex-row items-center justify-between p-3 mt-3 lg:p-0 lg:bg-transparent bg-gray-light">
          <div className="flex flex-row items-center">
            <div className="mr-3 text-2xl font-semibold text-primary">
              {parseNumber(product?.price)}đ
            </div>
            {product.downPrice > 0 && product.downPrice > product?.basePrice && (
              <del className="mr-3 text-xs text-left text-gray-500">
                {parseNumber(product?.downPrice)}đ
              </del>
            )}

            {product?.saleRate > 0 && (
              <div className="font-semibold text-white rounded-md bg-primary">
                {-product?.saleRate}%
              </div>
            )}
          </div>
          {/* <div className="flex flex-row items-center">
            <span className="mr-5 text-gray-400 cursor-pointer">
              <BiLink className="text-2xl hover:text-primary" />
            </span>
            <span className="text-gray-400 cursor-pointer ">
              <BiLink
                className="text-2xl"
                data-tooltip={"Copy Link"}
                onClick={() => {
                  copy(getProductUrl(product));
                }}
              />
            </span>
            <span
              className="ml-3 text-gray-400 cursor-pointer"
              onClick={() => {
                setOpenDialogShareLink(true);
              }}
            >
              <RiShareForwardLine className="text-2xl" data-tooltip={"Chia sẻ"} />
            </span>
          </div> */}
        </div>
        {product?.subtitle?.trim() && (
          <div className="mt-2 text-sm font-medium text-ellipsis-2 lg:text-base">
            {product?.subtitle}
          </div>
        )}
        {/* <div className="border-t-2 border-gray-100"></div> */}
        {/* <div className="flex flex-row items-center justify-start my-5">
          <ShowRating rating={product?.rating} />
          <div className="flex flex-row items-center ml-5">
            <span>
              <FiShoppingBag />
            </span>
            <div className="ml-3 text-accent">{parseNumber(product?.soldQty)} Đã bán</div>
          </div>
        </div> */}
        {/* <div className="border-t-2 border-gray-100"></div> */}
        <div className="my-5">
          <ProductToppings className="mt-3 border-b" />
        </div>
        {/* {product.pricePolicies && (
          <>
            {selectedPolicy ? (
              <div className="px-3 py-2 bg-white border border-gray-300 rounded shadow-semibold">
                <div className="flex justify-between">
                  <span>
                    Bảng giá đang chọn: <strong>{selectedPolicy?.name}</strong>
                  </span>
                  <Button
                    icon={<RiCloseFill />}
                    hoverDanger
                    iconClassName="text-xl"
                    className="h-auto px-0"
                    onClick={() => setSelectedPolicy(null)}
                  />
                </div>
                <div>
                  <PricePolicyDisplay pricePolicy={selectedPolicy} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => setOpenPricePolicies(true)}
                className="flex items-center px-3 py-2 mb-4 bg-white border border-gray-300 rounded shadow-sm cursor-pointer hover:border-primary col-span-full hover:shadow hover:text-primary"
              >
                <i className="mb-0.5 mr-1">
                  <RiErrorWarningLine />
                </i>
                <span>Bảng giá ưu đãi</span>
                <span className="ml-auto font-semibold">Chọn bảng giá</span>
              </div>
            )}

          </>
        )} */}
        {/* <div className="my-5">
          <div className="mb-3 font-semibold leading-5 text-accent">Ghi chú cho cửa hàng</div>
          <Input
            placeholder="Vui lòng nhập nội dung"
            value={note}
            onChange={(val) => setNote(val)}
          />
        </div> */}
      </div>

      <div className="lg:flex flex-row items-center lg:shadow-none hidden shadow-sm shadow-black lg:p-0 p-5 justify-start hidden lg:my-8 bg-white z-100 left-0 lg:w-auto w-full">
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
  );
}

export function Share({ link, ...props }: { link: string }) {
  const toast = useToast();
  function copyToClipboard(text) {
    copy(text);
    toast.success("Đã sao chép");
  }

  const [showQRcode, setShowQRcode] = useState(false);
  const [showShareType, setShowShareType] = useState(false);
  const screenSm = useScreen("sm");

  const download = () => {
    let canvas: any = document.getElementById("RefQR");
    if (canvas) {
      let a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = "QR.png";
      a.click();
    }
  };

  return (
    <div className="px-4 py-4">
      <span className="font-medium">Link giới thiệu:</span>
      <div className="flex w-full mt-1 mb-4 border-b rounded-md min-h-12">
        <span className="flex-1 my-auto text-sm font-light whitespace-nowrap text-ellipsis-2 sm:text-base">
          {link}
        </span>
        {/* {showShareType ? ( */}
        {/* <Button
          icon={<AiOutlineClose />}
          className="w-10 h-12 pl-2 pr-0 ml-auto mr-0"
          iconClassName="text-[28px]"
          onClick={() => setShowShareType(false)}
        /> */}
        {/* ) : ( */}
        <Button
          icon={<FaShareAlt />}
          className="w-10 h-12 pl-2 pr-0 ml-auto mr-0"
          iconClassName="text-[28px]"
          onClick={() => setShowShareType(true)}
        />
        {/* )} */}
      </div>
      {/* {showShareType == true && ( */}
      <div className="flex rounded-md border-group animate-scale-up">
        <Button
          icon={<FaRegCopy />}
          outline
          className="flex-1"
          iconClassName="text-[28px]"
          tooltip="Sao chép"
          onClick={() => copyToClipboard(link)}
        />
        <Button
          href={{ pathname: "https://www.facebook.com/sharer/sharer.php", query: { u: link } }}
          className="flex-1 text-white hover:text-white"
          icon={<FbIcon />}
          iconPosition="end"
          style={{ backgroundColor: "#4267b2" }}
          iconClassName="w-6 h-6 "
          tooltip="Chia sẻ lên facebook"
        />
        <Button
          href={{ pathname: "https://telegram.me/share/url", query: { url: link } }}
          className="flex-1 text-white hover:text-white"
          icon={<TgIcon />}
          iconPosition="end"
          style={{ backgroundColor: "#37AFE2" }}
          iconClassName="w-6 h-6 "
          tooltip="Chia sẻ lên telegram"
        />
        <Button
          href={{ pathname: "viber://forward", query: { text: link } }}
          className="flex-1 text-white hover:text-white"
          icon={<IconViber />}
          iconPosition="end"
          style={{ backgroundColor: "#59267c" }}
          iconClassName="w-6 h-6 "
          tooltip="Chia sẻ lên viber"
        />
        <Button
          icon={<QRIcon />}
          outline
          className="flex-1"
          iconPosition="end"
          tooltip="Xem mã QR"
          iconClassName="w-6 h-6"
          onClick={() => setShowQRcode(!showQRcode)}
        />
      </div>
      {/* )} */}
      <Dialog isOpen={showQRcode} onClose={() => setShowQRcode(false)} slideFromBottom="none">
        <div className="relative flex flex-col items-center w-full p-3">
          <QRCode value={link} size={screenSm ? 300 : 230} id="RefQR" />
          <Button
            primary
            className="absolute h-12 shadow-lg -bottom-16"
            icon={<RiDownload2Line />}
            text="Tải QR Code"
            onClick={() => download()}
          />
        </div>
      </Dialog>
    </div>
  );
}
