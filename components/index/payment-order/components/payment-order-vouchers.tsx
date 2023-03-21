import { useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { RiAddCircleLine } from "react-icons/ri";
import { VoucherListDialog } from "../../../shared/voucher/voucher-list-dialog";
import { usePaymentContext } from "../../payment/providers/payment-provider";

export function PaymentOrderVouchers() {
  const { setSelectedVoucher, selectedVoucher, draftOrder } = usePaymentContext();
  const [openVoucherList, setOpenVoucherList] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between my-5 font-semibold">
        <div className="text-accent text-xl">Khuyến mãi</div>
        <div className="pr-3 cursor-pointer text-primary" onClick={() => setOpenVoucherList(true)}>
          <i className="text-3xl">
            <RiAddCircleLine />
          </i>
        </div>
      </div>
      {selectedVoucher && (
        <>
          <div className="p-3 my-5 bg-white rounded-md">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <span>
                  <BiPurchaseTag className="text-2xl text-primary" />
                </span>
                <span className="ml-3 font-semibold leading-6 text-accent">
                  {selectedVoucher?.code}
                </span>
              </div>
              <i
                className="h-12 px-2 ml-auto text-sm text-gray-500 cursor-pointer flex-center hover:text-danger sm:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVoucher(null);
                }}
              >
                <FaTimes />
              </i>
            </div>
          </div>
        </>
      )}
      <VoucherListDialog
        isOpen={openVoucherList}
        onClose={() => setOpenVoucherList(false)}
        onApply={(voucher) => {
          setSelectedVoucher(voucher);
        }}
      />
    </>
  );
}
