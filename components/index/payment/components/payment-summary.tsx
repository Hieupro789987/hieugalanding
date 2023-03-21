import { useEffect, useMemo, useRef } from "react";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Switch } from "../../../shared/utilities/form";
import { usePaymentContext } from "../providers/payment-provider";

function AmountRow({
  label,
  subtext,
  value,
  className = "",
  isValueTextPrimary = false,
  isMinus = false,
  isPlus = false,
  parentClassName = "",
  isCurrency = true,
}: {
  label: string;
  subtext?: string;
  value: number;
  isValueTextPrimary?: boolean;
  isMinus?: boolean;
  parentClassName?: string;
  isPlus?: boolean;
  isCurrency?: boolean;
} & ReactProps) {
  return (
    <div className={`flex items-center justify-between font-medium text-accent ${parentClassName}`}>
      <div className="text-gray-500">
        {label} {subtext && <span className="text-sm text-accent">({subtext})</span>}
      </div>
      <div className={`${className} ${isValueTextPrimary && "text-primary"}`}>
        {`${isMinus ? "-" : isPlus ? "+" : ""}${
          isCurrency ? parseNumber(value, true) : parseNumber(value)
        }`}
      </div>
    </div>
  );
}

export function PaymentSummary() {
  const {
    draftOrder,
    orderInput,
    discountItems,
    isSubmittingDraft,
    setOrderInput,
  } = usePaymentContext();
  const { totalQty, totalAmount } = useCart();
  const { shop, customer } = useShopContext();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (draftOrder?.invalidReason) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [draftOrder]);

  const finalTotalQty = useMemo(
    () => discountItems?.filter((x) => x.selected).reduce((total, item) => total + item.qty, 0),
    [discountItems, totalQty]
  );

  if (!draftOrder?.order)
    return (
      <div className="py-4 font-medium text-primary flex-center loading-ellipsis animate-emerge">
        Đang tính
      </div>
    );

  return (
    <div className="mt-6 mb-4">
      <div className="mb-3 text-base font-bold md:text-lg">Thanh toán</div>
      {shop.config.rewardPointConfig.active && (
        <div className="px-4 py-0.5 bg-white border border-gray-100 rounded-md shadow-sm flex-between-center">
          <div className="flex-cols">
            <div className="font-medium text-gray-500">{`Dùng điểm thưởng`}</div>
            {customer.rewardPointStats?.total > 0 && (
              <div className="font-medium text-primary">
                {parseNumber(customer.rewardPointStats?.total)}
              </div>
            )}
          </div>
          <Switch
            onChange={(val) => setOrderInput({ ...orderInput, useRewardPoint: val })}
            className="mb-1.5 font-medium"
          />
        </div>
      )}
      <div
        className={`bg-white mt-4 p-4 flex-cols gap-3 border rounded-md border-gray-100 shadow-sm ${
          isSubmittingDraft ? "opacity-50" : ""
        }`}
      >
        <AmountRow
          label="Tạm tính"
          subtext={`${draftOrder?.order?.itemCount || finalTotalQty} sản phẩm`}
          value={draftOrder?.order?.subtotal}
        />
        <AmountRow
          label="Phí giao hàng"
          subtext={draftOrder?.order?.shipDistance ? `${draftOrder?.order?.shipDistance} km` : ""}
          value={draftOrder?.order?.shipfee}
        />
        {draftOrder?.order?.discount > 0 &&
          draftOrder?.order?.discount !== draftOrder?.order?.discountPoint && (
            <AmountRow
              label="Khuyến mãi"
              value={
                draftOrder?.order?.discount > 0
                  ? draftOrder.order.discount - draftOrder.order.discountPoint
                  : 0
              }
              isMinus
              isValueTextPrimary
            />
          )}
        {draftOrder?.order?.discountPoint > 0 && (
          <AmountRow
            label="Giảm giá điểm thưởng"
            isMinus
            isValueTextPrimary
            value={draftOrder?.order?.discount || 0}
            isCurrency={false}
          />
        )}
        {draftOrder?.order?.rewardPoint > 0 && (
          <AmountRow
            label="Điểm thưởng từ đơn hàng"
            isValueTextPrimary
            value={draftOrder?.order?.rewardPoint || 0}
            isCurrency={false}
          />
        )}
        <div className="pt-2 border-t-2 border-dashed">
          <AmountRow
            parentClassName="font-bold text-accent"
            isValueTextPrimary
            label="Tổng tiền"
            value={draftOrder?.order?.amount || totalAmount}
          />
          {((draftOrder && draftOrder.invalid) || (orderInput && !orderInput.buyerFullAddress)) && (
            <div className="p-2 mt-2 font-medium rounded bg-danger-light text-danger" ref={ref}>
              {draftOrder.invalidReason
                ? draftOrder.invalidReason
                : "Vui lòng chọn đia chỉ giao hàng"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
