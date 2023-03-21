import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox, Field, Input, Switch } from "../../../../shared/utilities/form";

interface ShopServicesAdditionalServiceItemSettingListProps extends ReactProps {
  name: string;
}

export function ShopServicesAdditionalServiceItemSettingList({
  name,
  ...props
}: ShopServicesAdditionalServiceItemSettingListProps) {
  const { watch, setValue, getValues } = useFormContext();
  const options = watch(`${name}.options`);
  const checkRequired = watch(`${name}.required`);
  const isMultiEnable = watch(`${name}.isMultiEnable`);
  const minRequiredQty = watch(`${name}.minRequiredQty`);
  const maxQty = watch(`${name}.maxQty`);
  const isMaxQtyUnlimited = watch(`${name}.isMaxQtyUnlimited`);

  //handle maxQty's value and minQty's value when delete option item
  useEffect(() => {
    if (options?.length > 1 && maxQty > options?.length) {
      setValue(`${name}.maxQty`, options?.length);
    }

    if (options?.length > 1 && minRequiredQty > options?.length) {
      setValue(`${name}.minRequiredQty`, options?.length);
    }

    if (options?.length === 1) {
      setValue(`${name}.maxQty`, 1);
      setValue(`${name}.minRequiredQty`, 1);
      return;
    }
  }, [options]);

  return (
    <div className="col-span-12 mt-3">
      <div className="flex justify-between gap-x-4 whitespace-nowrap">
        <div className={"flex items-center w-1/2 grow-0 shrink-0"}>
          <Field
            noError
            label=""
            name={`${name}.required`}
            className={`${!options?.length && "hidden"}`}
          >
            <Switch placeholder="Bắt buộc" />
          </Field>
          {checkRequired && (
            <>
              <div className="w-3 h-0.5 bg-gray-400 mr-0.5"></div>
              <div className="ml-1.5 mr-2">Tối thiểu</div>
            </>
          )}
          <Field
            noError
            label=""
            name={`${name}.minRequiredQty`}
            className={`${!checkRequired && "hidden"}`}
          >
            <Input
              number
              className="w-11"
              inputClassName="text-center"
              defaultValue={1}
              onBlur={() => {
                if (minRequiredQty < 1) {
                  setValue(`${name}.minRequiredQty`, 1);
                  return;
                }

                if (minRequiredQty > options?.length) {
                  if (minRequiredQty > maxQty) {
                    setValue(`${name}.maxQty`, options?.length);
                  }

                  setValue(`${name}.minRequiredQty`, options?.length);
                }
              }}
            />
          </Field>
        </div>
        <div className={`flex items-center flex-1 ${options?.length <= 1 && "hidden"}`}>
          <Field noError label="" name={`${name}.isMultiEnable`}>
            <Switch
              placeholder="Cho phép chọn nhiều"
              onChange={(val) => {
                setValue(`${name}.isMultiEnable`, val);
                const maxQty = getValues(`${name}.maxQty`);
                const options = getValues(`${name}.options`);

                if (val && !maxQty) {
                  setValue(`${name}.maxQty`, options?.length);
                }
              }}
            />
          </Field>
          {isMultiEnable && (
            <>
              <div className="w-3 h-0.5 bg-gray-400 mr-0.5"></div>
              <div className="ml-1.5 mr-2">Tối đa</div>
            </>
          )}
          <Field
            noError
            label=""
            name={`${name}.maxQty`}
            className={`${!isMultiEnable && "hidden"} ${
              isMaxQtyUnlimited && "pointer-events-none bg-slate-100 brightness-90 opacity-75"
            }`}
          >
            <Input
              number
              className="w-11"
              inputClassName="text-center"
              onBlur={() => {
                if (maxQty < 1) {
                  setValue(`${name}.maxQty`, 1);
                  return;
                }

                if (maxQty > options?.length) {
                  setValue(`${name}.maxQty`, options?.length);
                  return;
                }

                if (maxQty < minRequiredQty) {
                  setValue(`${name}.maxQty`, minRequiredQty);
                  return;
                }
              }}
            />
          </Field>
        </div>
      </div>
      <div className={`flex gap-x-2 ${options?.length <= 1 && "hidden"}`}>
        <div className="w-7/12 grow-0 shrink-0"></div>
        <Field
          noError
          label=""
          name={`${name}.isMaxQtyUnlimited`}
          className={`-mr-3 mt-1.5 ${!isMultiEnable && "hidden"}`}
        >
          <Checkbox
            placeholder="Không giới hạn"
            className="pr-0 border border-dashed rounded-sm border-slate-300"
          />
        </Field>
      </div>
    </div>
  );
}
