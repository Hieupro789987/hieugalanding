import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine } from "react-icons/ri";

import { AdditionalServiceOption } from "../../../../../lib/repo/services/additional-service-option.repo";
import { Button, Field, Input, Label } from "../../../../shared/utilities/form";

interface ShopServicesAdditionalServiceOptionListProps extends ReactProps {
  parentName: string;
}

export function ShopServicesAdditionalServiceOptionList({
  parentName,
  ...props
}: ShopServicesAdditionalServiceOptionListProps) {
  const name = `${parentName}.options`;
  const { fields, append, remove } = useFieldArray({ name, keyName: "key" });
  const optionList = fields as ({ key: string } & AdditionalServiceOption)[];

  const emptyOptionListError = useMemo(() => !optionList?.length, [optionList]);

  useEffect(() => {
    if (optionList?.length === 0) append({ name: "", price: 0 });
  }, [optionList]);

  return (
    <div className="col-span-12">
      <Label
        text="Lựa chọn"
        required
        className="text-accent"
        error={emptyOptionListError ? "error" : ""}
      />
      {optionList.map((option, index) => (
        <ShopServicesAdditionalServiceOptionItem
          key={option.key}
          index={index}
          option={option}
          name={name}
          remove={remove}
          length={optionList.length}
        />
      ))}
      <Button
        unfocusable
        text="Thêm lựa chọn"
        icon={<RiAddLine />}
        iconClassName="text-xl"
        className={`border-none pl-0 w-fit underline ${!optionList?.length ? "-mt-1" : "-mt-2"}`}
        onClick={() => {
          append({ name: "", price: undefined });
        }}
      />
      {emptyOptionListError && (
        <div className="text-danger text-sm font-semibold ml-0.5">
          Bắt buộc phải có ít nhất 1 lựa chọn
        </div>
      )}
    </div>
  );
}

interface ShopServicesAdditionalServiceOptionItemProps extends ReactProps {
  option: AdditionalServiceOption;
  index: number;
  name: string;
  remove: (index: number) => void;
  length: number;
}

function ShopServicesAdditionalServiceOptionItem({
  option,
  index,
  name,
  remove,
  length,
  ...props
}: ShopServicesAdditionalServiceOptionItemProps) {
  const { watch, register } = useFormContext();
  const servicePriceType = watch("servicePriceType");
  const options = watch(name);

  register(`${name}.${index}._id`, { value: option.id });

  const hasPriceInput = useMemo(() => servicePriceType === "FIXED", [servicePriceType]);

  const checkDuplicates = (value: string) => {
    const duplicates = options.filter((opt) => opt.name === value);
    return duplicates?.length > 1 ? "Lựa chọn không được trùng tên" : "";
  };

  return (
    <div className="flex items-center gap-2">
      <Field
        label=""
        name={`${name}.${index}.name`}
        required
        validation={{
          duplicateOptionNames: (value) => checkDuplicates(value),
        }}
      >
        <Input placeholder="Nhập tên lựa chọn..." className="w-72" />
      </Field>
      <div className={`w-3 h-0.5 mb-6 bg-gray-400 ${!hasPriceInput && "hidden"}`} />
      <Field
        label=""
        name={`${name}.${index}.price`}
        className={`${!hasPriceInput && "hidden"}`}
        readOnly={!hasPriceInput}
      >
        <Input number suffix={"VND"} className="w-60" />
      </Field>
      {length !== 1 && (
        <Button text="Xóa" unfocusable hoverDanger className="mb-6" onClick={() => remove(index)} />
      )}
    </div>
  );
}
