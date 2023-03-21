import { useRouter } from "next/router";
import { useState } from "react";
import { parseNumber } from "../../../../../lib/helpers/parser";
import { AdditionalServiceOption } from "../../../../../lib/repo/services/additional-service-option.repo";
import { AdditionalService } from "../../../../../lib/repo/services/additional-service.repo";
import { Service } from "../../../../../lib/repo/services/service.repo";
import { OptionCustom } from "../provider/store-detail-service-details-provider";

export function ServiceAdditionalServiceItem({
  additionalService,
  selectedOptions,
  onClickOption,
}: {
  additionalService: AdditionalService;
  selectedOptions: OptionCustom[];
  onClickOption: (additionalService: AdditionalService, option: AdditionalServiceOption) => void;
}) {
  const {
    name,
    options,
    required,
    minRequiredQty,
    isMaxQtyUnlimited,
    isMultiEnable,
    maxQty,
  } = additionalService;

  return (
    <>
      <div className="flex flex-col mt-2 lg:mt-5 lg:flex-row">
        <div className="w-[155px] shrink-0 grow-0  mr-5">
          <span className="font-extrabold text-primaryBlack">{name} </span>
          {required ? (
            isMultiEnable ? (
              isMaxQtyUnlimited ? (
                <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg:lowercase lg:min-w-none">
                  (chọn tối thiểu {minRequiredQty})
                </span>
              ) : (
                <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg:lowercase lg:min-w-none">
                  {minRequiredQty === maxQty
                    ? ""
                    : `chọn ít nhất ${minRequiredQty} và tối đa là ${maxQty})`}
                </span>
              )
            ) : (
              <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg:lowercase lg:min-w-none">
                (chỉ được chọn 1)
              </span>
            )
          ) : isMultiEnable ? (
            isMaxQtyUnlimited ? (
              <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg:lowercase lg:min-w-none">
                (chọn không giới hạn)
              </span>
            ) : (
              <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg lg:lowercase lg:min-w-none">
                (chọn tối đa {maxQty})
              </span>
            )
          ) : (
            <span className="block my-2 text-sm first-letter:uppercase lg:my-0 lg:lowercase lg:min-w-none min-w-max">
              (chọn tối đa 1)
            </span>
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-3">
          {options.map((option, index) => (
            <div
              className={`px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm cursor-pointer  ${
                !!selectedOptions &&
                selectedOptions?.find(
                  (x) => !!x.options && x.options?.find((x) => x.id === option.id)
                ) &&
                "border-primary bg-primary-light text-primary"
              }`}
              onClick={() => {
                onClickOption(additionalService, option);
              }}
              key={option?.id}
            >
              <div className="font-semibold">{option?.name}</div>
              <div className="font-normal">+{parseNumber(option?.price)}đ</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
