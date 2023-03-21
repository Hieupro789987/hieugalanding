import { Textarea } from "../../../shared/utilities/form";
import { usePaymentContext } from "../../payment/providers/payment-provider";

export function PaymentOrderNote() {
  const { orderInput, setOrderInput } = usePaymentContext();

  return (
    <>
      <div className="flex items-start px-2 py-1 mt-6 bg-white border border-gray-100 rounded-md shadow-sm cursor-text focus-within:border-primary">
        <Textarea
          placeholder="Nhập ghi chú đơn hàng..."
          className="flex-1 px-2"
          rows={1}
          controlClassName="border-none resize-none"
          value={orderInput?.note}
          onChange={(val) => setOrderInput({ ...orderInput, note: val })}
        />
      </div>
    </>
  );
}
