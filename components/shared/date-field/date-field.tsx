import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker, Field } from "../utilities/form";

export function DateField() {
  const { watch, setValue } = useFormContext();
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  useEffect(() => {
    if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
      setValue("toDate", fromDate);
    }
  }, [fromDate]);

  return (
    <>
      <Field name="fromDate" label="Từ ngày" required cols={6}>
        <DatePicker startOfDay clearable={false} maxDate={new Date()} />
      </Field>
      <Field name="toDate" label="Đến ngày" required cols={6}>
        <DatePicker endOfDay clearable={false} minDate={fromDate} maxDate={new Date()} />
      </Field>
    </>
  );
}
