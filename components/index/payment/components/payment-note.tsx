import { Textarea } from "../../../shared/utilities/form";
import { usePaymentContext } from "../providers/payment-provider";

export function PaymentNote() {
  const { orderInput, setOrderInput } = usePaymentContext();

  return (
    <>
      <div className="mt-6 mb-2 text-base font-bold md:text-lg">Ghi chú cho đơn hàng</div>
      <div className="flex items-start px-2 py-1 bg-white border border-gray-100 rounded-md shadow-sm cursor-text focus-within:border-primary">
        <Textarea
          placeholder="Ghi chú đơn hàng..."
          className="flex-1 px-2"
          rows={1}
          controlClassName="border-none resize-none whitespace-preline"
          value={orderInput?.note}
          onChange={(val) => setOrderInput({ ...orderInput, note: val })}
        />
      </div>
    </>
  );
}
