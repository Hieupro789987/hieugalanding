import { useEffect, useMemo, useRef } from "react";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Switch } from "../../../shared/utilities/form";
import { usePaymentContext } from "../../payment/providers/payment-provider";

export function PaymentOrderSummary() {
  const { shop, customer } = useShopContext();
  const {
    draftOrder,
    discountItems,
    isSubmittingDraft,
    selectedVoucher,
    orderInput,
    setOrderInput,
  } = usePaymentContext();
  const { totalQty, totalAmount } = useCart();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (draftOrder?.invalidReason && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [draftOrder]);

  const finalTotalQty = useMemo(
    () => discountItems?.filter((x) => x.selected).reduce((total, item) => total + item.qty, 0),
    [discountItems, totalQty]
  );

  if (!draftOrder?.order)
    return (
      <div className="py-4 font-medium bg-white text-primary flex-center loading-ellipsis animate-emerge">
        Đang tính
      </div>
    );
  return (
    <div className="gap-5 flex-cols">
      {shop.config.rewardPointConfig.active && (
        <div className="p-5 bg-white rounded-md flex-between-center">
          <div className="gap-1 flex-cols">
            <div className="font-medium text-accent">{`Dùng điểm thưởng`}</div>
            {customer.rewardPointStats?.total > 0 && (
              <div className="font-medium text-primary">
                {parseNumber(customer.rewardPointStats?.total)}đ
              </div>
            )}
          </div>
          <Switch
            onChange={(val) => setOrderInput({ ...orderInput, useRewardPoint: val })}
            className="mb-1.5 font-medium"
          />
        </div>
      )}
      {draftOrder && draftOrder.invalid && (
        <div className="p-2 font-medium rounded bg-danger-light text-danger">
          {draftOrder.invalidReason ? draftOrder.invalidReason : ""}
        </div>
      )}
      <div className={`p-5 bg-white rounded-md ${isSubmittingDraft ? "opacity-50" : ""}`}>
        <AmountRow
          label="Tạm tính"
          {...((draftOrder?.order?.itemCount || finalTotalQty) && {
            subtext: `${draftOrder?.order?.itemCount || finalTotalQty} sản phẩm`,
          })}
          value={draftOrder?.order?.subtotal}
        />
        <AmountRow
          label="Phí ship"
          subtext={draftOrder?.order?.shipDistance ? `${draftOrder?.order?.shipDistance} km` : ""}
          value={draftOrder?.order?.shipfee}
        />

        {draftOrder?.order?.rewardPoint > 0 && (
          <AmountRow
            label="Điểm thưởng từ đơn hàng"
            value={draftOrder?.order?.rewardPoint || 0}
            textPrimary
            isCurrency={false}
          />
        )}
        {draftOrder?.order?.discountPoint > 0 && (
          <AmountRow
            label="Giảm giá điểm thưởng"
            value={-draftOrder?.order?.discount || 0}
            textPrimary
            isCurrency={false}
          />
        )}
        {draftOrder?.order?.discount > 0 &&
          draftOrder?.order?.discount !== draftOrder?.order?.discountPoint && (
            <AmountRow
              label="Khuyến mãi"
              subtext={selectedVoucher.code}
              value={
                draftOrder?.order?.discount > 0
                  ? -(draftOrder.order.discount - draftOrder.order.discountPoint)
                  : 0
              }
              textPrimary
            />
          )}
        <div className="border-t-2 border-gray-300 border-dashed">
          <AmountRow
            label="Tổng"
            labelClassName="font-semibold text-accent text-xl"
            className="font-semibold leading-6 text-primary text-lg"
            value={draftOrder?.order?.amount || totalAmount}
            textPrimary
          />
        </div>
      </div>
    </div>
  );
}

function AmountRow({
  label,
  subtext,
  value,
  className = "",
  labelClassName = "",
  textPrimary = false,
  textGray = false,
  isCurrency = true,
}: {
  label: string;
  subtext?: string;
  value: number;
  labelClassName?: string;
  textPrimary?: boolean;
  textGray?: boolean;
  isCurrency?: boolean;
} & ReactProps) {
  return (
    <div className="flex flex-row justify-between gap-1 my-3">
      <div className="flex flex-row justify-between gap-1 text-gray-400">
        <div className={`${labelClassName}`}>{label}:</div>{" "}
        {subtext && <div className="ml-2 font-medium text-accent">{subtext}</div>}
      </div>
      <div
        className={`${
          textPrimary ? "text-primary" : textGray ? "text-gray-400" : "text-accent"
        } ${className} font-medium`}
      >
        {isCurrency ? parseNumber(value, true) : parseNumber(value)}
      </div>
    </div>
  );
}
