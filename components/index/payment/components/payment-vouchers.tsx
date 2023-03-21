import { useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { RiCheckboxCircleFill } from "react-icons/ri";
import SwiperCore, { Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatDate } from "../../../../lib/helpers/parser";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { ShopVoucher } from "../../../../lib/repo/shop-voucher.repo";
import { VoucherDetailsDialog } from "../../../shared/voucher/voucher-details-dialog";
import { usePaymentContext } from "../providers/payment-provider";

SwiperCore.use([Navigation]);

export function PaymentVouchers(props) {
  const screenMd = useScreen("md");
  const { vouchers, setSelectedVoucher } = usePaymentContext();

  const [openVoucherDetails, setOpenVoucherDetails] = useState<ShopVoucher>();

  if (!vouchers) return <></>;
  if (vouchers.length == 0) return <></>;
  return (
    <div className="mt-1 mb-4 border border-gray-100 shadow-sm">
      <Swiper
        className="px-3"
        spaceBetween={screenMd ? 24 : 12}
        slidesPerView={screenMd ? 2 : 1}
        grabCursor
      >
        {vouchers.map((item: ShopVoucher, index) => {
          return (
            <SwiperSlide key={index} className="w-full xs:w-3/4 sm:w-2/3">
              <VoucherItem
                voucher={item}
                onApply={() => {
                  setSelectedVoucher(item);
                  // checkVoucherDiscount(item.code);
                  // setOrderInput({ ...orderInput, promotionCode: item.code });
                }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <VoucherDetailsDialog
        voucher={openVoucherDetails}
        isOpen={!!openVoucherDetails}
        onClose={() => setOpenVoucherDetails(null)}
      />
    </div>
  );
}

function VoucherItem({ voucher, onApply }) {
  const { selectedVoucher, setSelectedVoucher } = usePaymentContext();

  return (
    <div className="flex justify-between w-full py-3 px-2.5 min-h-24 bg-white border-l-4 rounded shadow-sm text-accent border-primary">
      <div className="justify-between flex-1 flex-cols">
        <div className="flex items-center gap-2">
          <i className="text-lg text-primary">
            <BiPurchaseTag />
          </i>
          <div className="font-bold text-ellipsis-2">{voucher.description}</div>
        </div>
        <div className="text-xs md:text-sm">{`HSD: ${formatDate(
          voucher?.endDate,
          "dd/MM/yyyy"
        )}`}</div>
      </div>
      <div className="w-12 border-l border-gray-300 flex-center">
        {selectedVoucher?.id === voucher?.id ? (
          <div
            className="p-2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVoucher(null);
            }}
          >
            <i className={`text-lg text-primary`}>
              <RiCheckboxCircleFill />
            </i>
          </div>
        ) : (
          <div
            className="p-2"
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 border-gray-400`}></div>
          </div>
        )}
      </div>
    </div>
  );
}
