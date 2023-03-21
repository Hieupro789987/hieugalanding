import React, { useEffect, useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { FaMoneyBillAlt, FaTimes } from "react-icons/fa";
import { RiWindow2Line } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { OrderService } from "../../../../lib/repo/order.repo";
import { Momo } from "../../../../public/assets/svg/svg";
import { DialogHeader } from "../../../shared/default-layout/dialog-header";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { VoucherDetailsDialog } from "../../../shared/voucher/voucher-details-dialog";
import { VoucherListDialog } from "../../../shared/voucher/voucher-list-dialog";
import { usePaymentContext } from "../providers/payment-provider";

interface Props extends ReactProps {}
export function PaymentFooter(props: Props) {
  const {
    generateOrder,
    orderInput,
    draftOrder,
    selectedVoucher,
    setSelectedVoucher,
    order,
    isSubmittingDraft,
  } = usePaymentContext();
  const [openVoucherList, setOpenVoucherList] = useState(false);
  const [openPaymenMethods, setOpenPaymenMethods] = useState(false);
  const [openVoucherDetails, setOpenVoucherDetails] = useState(null);

  return (
    <div className="flex w-full text-sm md:text-base">
      <div className="w-full max-w-lg pb-6 mx-auto">
        <div className="grid grid-cols-12 gap-2 px-3 mb-3">
          <button
            className="flex items-center h-12 col-span-12 p-2 px-3 bg-white border border-gray-100 rounded-md shadow-sm xs:col-span-6 group"
            onClick={() => setOpenPaymenMethods(true)}
          >
            <i className="flex items-center w-5 h-5 text-xl text-primary">
              {(orderInput.paymentMethod == "COD" && <FaMoneyBillAlt />) ||
                (orderInput.paymentMethod == "MOMO" && <Momo />) || <RiWindow2Line />}
            </i>
            <div className="px-2 text-sm font-medium text-gray-700 whitespace-nowrap sm:text-base group-hover:text-primary">
              {orderInput.paymentMethod == "COD"
                ? "Thanh toán khi nhận hàng"
                : orderInput.paymentMethod == "MOMO"
                ? "Ví MoMo"
                : "Chuyển khoản"}
            </div>
          </button>

          {/* <button
            className="flex items-center h-12 col-span-6 p-2 px-3 bg-white border border-gray-100 rounded-md shadow-sm xs:col-span-6 group"
            onClick={() =>
              selectedVoucher ? setOpenVoucherDetails(selectedVoucher) : setOpenVoucherList(true)
            }
          >
            <i className="text-xl text-primary">
              <BiPurchaseTag />
            </i>
            <div
              className={`px-1 text-sm font-medium xs:text-base whitespace-nowrap ${
                selectedVoucher
                  ? "text-accent underline hover:text-accent-dark"
                  : "text-gray-700 group-hover:text-primary"
              }`}
            >
              {selectedVoucher?.code || "Khuyến mãi"}
            </div>
            {selectedVoucher && (
              <i
                className="h-12 pl-1 ml-auto text-sm text-gray-500 flex-center hover:text-danger sm:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVoucher(null);
                }}
              >
                <FaTimes />
              </i>
            )}
          </button> */}
        </div>
        <div className="w-full px-3 pt-1.5">
          <Button
            disabled={draftOrder.invalid || !!order}
            text={
              !isSubmittingDraft
                ? draftOrder.order
                  ? `Xác nhận ${parseNumber(draftOrder?.order?.amount)}đ`
                  : "Đặt hàng"
                : "Đang tính"
            }
            primary
            className={`w-full h-12 text-sm md:text-base ${
              isSubmittingDraft ? "loading-ellipsis" : ""
            }`}
            onClick={async () => {
              if (isSubmittingDraft) return;
              await generateOrder();
            }}
          />
        </div>
        <PaymentSelectionDialog
          isOpen={openPaymenMethods}
          onClose={() => setOpenPaymenMethods(false)}
        />
        <VoucherListDialog
          isOpen={openVoucherList}
          onClose={() => setOpenVoucherList(false)}
          onApply={(voucher) => {
            setSelectedVoucher(voucher);
          }}
        />
        <VoucherDetailsDialog
          voucher={openVoucherDetails}
          isOpen={openVoucherDetails ? true : false}
          onClose={() => {
            setOpenVoucherDetails(null);
          }}
        />
      </div>
    </div>
  );
}

function PaymentSelectionDialog({ ...props }: DialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("COD");
  const { orderInput, setOrderInput } = usePaymentContext();
  const [paymentMethods, setPaymentMethods] = useState<
    { value: string; label: string; icon: JSX.Element }[]
  >([]);
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return <FaMoneyBillAlt />;
      case "MOMO":
        return <Momo />;
      default:
        return <RiWindow2Line />;
    }
  };
  const getPaymentLabel = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "MOMO":
        return "Ví MoMo";
      default:
        return "";
    }
  };

  useEffect(() => {
    OrderService.getAllPaymentMethod().then((res) => {
      setPaymentMethods(
        res.map((x) => ({
          value: x.value,
          label: getPaymentLabel(x.value) || x.label,
          icon: getPaymentMethodIcon(x.value),
        }))
      );
    });
  }, []);

  return (
    <Dialog {...props} mobileSizeMode title="Chọn phương thức thanh toán" headerClass=" ">
      <DialogHeader title="Chọn phương thức thanh toán" onClose={props.onClose} />
      <div className="flex flex-col w-full gap-3 my-4">
        {paymentMethods.map((item) => (
          <div
            key={item.value}
            className={`p-3 flex items-center text-accent rounded cursor-pointer ${
              orderInput.paymentMethod == item.value ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              setSelectedMethod(item.value);
            }}
          >
            <i className="w-8 h-8 text-3xl flex-center text-primary">{item.icon}</i>
            <div className="pl-3 font-bold">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="px-3">
        <Button
          primary
          text="Xác nhận"
          className="w-full h-14"
          onClick={() => {
            setOrderInput({ ...orderInput, paymentMethod: selectedMethod });
            props.onClose();
          }}
        />
        <div className="w-32 md:w-48 h-1.5 mx-auto mt-8 mb-4 bg-gray-200 rounded"></div>
      </div>
    </Dialog>
  );
}
