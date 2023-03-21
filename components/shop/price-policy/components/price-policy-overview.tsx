import { useFieldArray, useFormContext } from "react-hook-form";
import { omitDeep } from "../../../../lib/helpers/parser";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  PricePolicyAdjustUnit,
  PricePolicyService,
  PricePolicyType,
  PRICE_POLICY_ADJUST_TYPES,
  PRICE_POLICY_ADJUST_UNITS,
} from "../../../../lib/repo/price-policy.repo";
import { Field, Form, Input, Label, Radio, Select, Switch } from "../../../shared/utilities/form";
import { Accordion } from "../../../shared/utilities/misc";
import { usePricePolicyDetailContext } from "../providers/price-policy-detail-provider";
import { QuantityMatrix } from "./quantity-matrix";
import { TimeFrameOfDayPicker } from "./time-frame-of-day-picker";
import { WeekdayPicker } from "./weekday-picker";

interface Props extends ReactProps {
  onSubmit: () => any;
}

export function PricePolicyOverview({ onSubmit }: Props) {
  const { pricePolicy, setPricePolicy } = usePricePolicyDetailContext();
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      const res = await PricePolicyService.update({
        id: pricePolicy.id,
        data: omitDeep(data, ["id"]),
      });
      setPricePolicy(res);
      toast.success("Cập nhật thành công");
      onSubmit();
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Form className="p-6" grid onSubmit={handleSubmit} defaultValues={pricePolicy}>
      <Field name="name" label="Tên bảng giá" cols={6} required>
        <Input autoFocus />
      </Field>
      <Field name="adjustUnit" label="Đơn vị điều chỉnh" cols={4}>
        <Radio
          options={PRICE_POLICY_ADJUST_UNITS}
          defaultValue={PRICE_POLICY_ADJUST_UNITS[0].value}
        />
      </Field>
      <Field name="active" label="Trạng thái" cols={2}>
        <Switch defaultValue={true} placeholder="Hoạt động" />
      </Field>
      {/* <AdjustPriceFields /> */}
      {/* <QtyMatrixFields /> */}
      {/* <Field name="startDate" label="Áp dụng từ ngày" cols={6}>
        <DatePicker />
      </Field>
      <Field name="endDate" label="Đến ngày" cols={6}>
        <DatePicker />
      </Field>
      <Field
        name="categoryIds"
        label="Nhóm danh mục áp dụng"
        tooltip="Để trống nếu áp dụng hết"
        cols={6}
      >
        <Select
          multi
          optionsPromise={() => CategoryService.getAllOptionsPromise()}
          placeholder="Áp dụng tất cả"
          clearable
        />
      </Field>
      <Field
        name="excludeCategoryIds"
        label="Nhóm danh mục loại trừ"
        tooltip="Để trống nếu không loại trừ"
        cols={6}
      >
        <Select
          multi
          optionsPromise={() => CategoryService.getAllOptionsPromise()}
          placeholder="Không loại trừ"
          clearable
        />
      </Field> 
      <Field name="productIds" label="Sản phẩm áp dụng" cols={12}>
        <Select
          multi
          optionsPromise={() =>
            ProductService.getAllOptionsPromise({
              query: {
                filter: {
                  $or: [{ pricePolicyId: pricePolicy.id }, { pricePolicyId: { $exists: false } }],
                },
              },
            })
          }
          placeholder="Áp dụng tất cả"
          clearable
        />
      </Field>
      <Field
        name="excludeProductIds"
        label="Sản phẩm loại trừ"
        tooltip="Để trống nếu không loại trừ"
        cols={6}
      >
        <Select
          multi
          optionsPromise={() => ProductService.getAllOptionsPromise()}
          placeholder="Không loại trừ"
          clearable
        />
      </Field> */}
      {/* <DaysOfWeekEnabledComponent />
      <TimeframeOfDayEnabledComponent /> */}
      <Form.Footer />
    </Form>
  );
}

function AdjustPriceFields() {
  const { watch } = useFormContext();
  const type: PricePolicyType = watch("type");

  return (
    <Accordion className="grid grid-cols-12 gap-x-2 col-span-full" isOpen={type == "ADJUST_PRICE"}>
      <Field name="adjustType" label="Loại điều chỉnh" cols={4}>
        <Select options={PRICE_POLICY_ADJUST_TYPES} placeholder="Chọn" />
      </Field>
      <Field name="adjustValue" label="Giá trị" cols={4}>
        <Input number decimal />
      </Field>
      <Field name="adjustUnit" label="Đơn vị" cols={4}>
        <Select options={PRICE_POLICY_ADJUST_UNITS} placeholder="Chọn" />
      </Field>
    </Accordion>
  );
}

function QtyMatrixFields() {
  const { register, setValue, watch } = useFormContext();
  const { fields, remove } = useFieldArray({ name: "qtyMatrix" });
  register("qtyMatrix");
  const unit: PricePolicyAdjustUnit = watch("adjustUnit");

  return (
    <div className="col-span-full">
      <Label text="Bảng giá áp dụng" className="mb-2" />
      <QuantityMatrix
        qtyMatrixes={fields as any}
        unit={unit}
        onChange={(val) => setValue("qtyMatrix", val)}
        onRemove={(index) => remove(index)}
      />
    </div>
  );
}

const DaysOfWeekEnabledComponent = ({ ...props }: FormControlProps) => {
  const { watch } = useFormContext();
  const daysOfWeekEnabled = watch("daysOfWeekEnabled");

  return (
    <div className="flex flex-col col-span-6">
      <Field
        name="daysOfWeekEnabled"
        label="Áp dụng trong tuần"
        cols={6}
        noError
        tooltip="Kích hoạt nếu chỉ muốn áp dụng một số ngày trong tuần"
      >
        <Switch placeholder="Kích hoạt" className="text-sm" />
      </Field>
      <Field
        name="daysOfWeek"
        label="Ngày trong tuần"
        cols={6}
        required={daysOfWeekEnabled}
        className={`${!daysOfWeekEnabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <WeekdayPicker />
      </Field>
    </div>
  );
};

const TimeframeOfDayEnabledComponent = ({ ...props }: FormControlProps) => {
  const { watch } = useFormContext();
  const timeframeOfDayEnabled = watch("timeframeOfDayEnabled");

  return (
    <div className="flex flex-col col-span-6">
      <Field
        name="timeframeOfDayEnabled"
        label="Áp dụng khung giờ"
        noError
        tooltip="Kích hoạt nếu chỉ muốn áp dụng một số khung giờ trong ngày."
      >
        <Switch placeholder="Kích hoạt" className="text-sm" />
      </Field>
      <Field
        name="timeframeOfDay"
        label="Khung giờ"
        cols={6}
        className={`${!timeframeOfDayEnabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <TimeFrameOfDayPicker hasDefault />
      </Field>
    </div>
  );
};
