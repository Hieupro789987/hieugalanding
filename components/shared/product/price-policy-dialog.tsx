import { useEffect, useState } from "react";
import { parseNumber } from "../../../lib/helpers/parser";
import { PricePolicy } from "../../../lib/repo/price-policy.repo";
import { QuantityMatrix } from "../../shop/price-policy/components/quantity-matrix";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Button, Checkbox } from "../utilities/form";

interface Props extends DialogProps {
  isSelection?: boolean;
  value?: PricePolicy;
  onChange?: (policy: PricePolicy) => any;
  pricePolicies: PricePolicy[];
}
export function PricePolicyDialog({
  isSelection = false,
  pricePolicies,
  value,
  onChange,
  ...props
}: Props) {
  const [selectedPolicy, setSelectedPolicy] = useState<PricePolicy>();
  useEffect(() => {
    if (value && pricePolicies.find((x) => x.id == value.id)) {
      setSelectedPolicy(value);
    } else {
      setSelectedPolicy(null);
    }
  }, [value]);

  return (
    <Dialog minWidth={450} title="Thông tin bảng giá" {...props}>
      <Dialog.Body>
        {pricePolicies && (
          <div className={`flex flex-col ${isSelection ? "gap-0.5" : "gap-3"}`}>
            {isSelection && (
              <div
                className={`flex cursor-pointer group hover:bg-gray-100 rounded py-2 px-1`}
                onClick={() => setSelectedPolicy(null)}
              >
                <div className="pr-2 transform -translate-y-1.5">
                  <Checkbox className="h-7" value={!selectedPolicy} />
                </div>
                <div className="font-medium">Không chọn</div>
              </div>
            )}
            {pricePolicies.map((pricePolicy) => {
              return (
                <div
                  key={pricePolicy.id}
                  className={`flex ${
                    isSelection ? "cursor-pointer group hover:bg-gray-100 rounded py-2 px-1" : ""
                  }`}
                  onClick={() => setSelectedPolicy(pricePolicy)}
                >
                  {isSelection && (
                    <div className="pr-2 transform -translate-y-1.5">
                      <Checkbox value={selectedPolicy?.id == pricePolicy.id} />
                    </div>
                  )}
                  <div>
                    <div
                      className={`font-semibold pb-0.5 ${
                        isSelection ? "group-hover:text-gray-800" : ""
                      }`}
                    >
                      {pricePolicy.name}
                    </div>
                    <PricePolicyDisplay pricePolicy={pricePolicy} />
                  </div>
                </div>
              );
            })}
            {isSelection && (
              <Button
                primary
                className="h-12 mt-2 shadow"
                text={"Chọn bảng giá"}
                onClick={() => {
                  onChange(selectedPolicy);
                  props.onClose();
                }}
              />
            )}
          </div>
        )}
      </Dialog.Body>
    </Dialog>
  );
}

export function PricePolicyDisplay({ pricePolicy }: { pricePolicy: PricePolicy }) {
  return (
    <>
      {/* {pricePolicy.type == "ADJUST_PRICE" && (
        <div
          className={`font-bold ${
            pricePolicy.adjustType == "INC" ? "text-danger" : "text-success"
          }`}
        >
          {pricePolicy.adjustType == "INC" ? "Tăng" : "Giảm"} {parseNumber(pricePolicy.adjustValue)}
          {pricePolicy.adjustUnit == "PERCENT" ? "%" : "đ"}
        </div>
      )}
      {pricePolicy.type == "QTY_MATRIX" && (
        <div className="mt-2 flex-center">
          <QuantityMatrix unit={} qtyMatrixes={pricePolicy.qtyMatrix} />
        </div>
      )} */}
    </>
  );
}
