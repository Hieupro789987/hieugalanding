import { useState } from "react";
import { DatePicker, Field, Form, FormProps } from "../../../shared/utilities/form";

interface ExportReservationsDialogProps extends FormProps {}

export function ExportReservationsDialog({ ...props }: ExportReservationsDialogProps) {
  const [reservationDate, setReservationDate] = useState<any>();

  const handleSubmit = () => {};

  const handleFilterDate = (val) => {
    const obj = { reservationDate: val?.startDate && val?.endDate ? {} : undefined };
    if (val?.startDate) {
      obj["reservationDate"]["$gte"] = val?.startDate;
    }
    if (val?.endDate) {
      obj["reservationDate"]["$lte"] = val?.endDate;
    }
    setReservationDate(obj);
  };

  return (
    <Form
      grid
      dialog
      width={600}
      title="Xuất danh sách lịch hẹn"
      defaultValues={{
        ...props,
      }}
      onSubmit={handleSubmit}
      {...props}
    >
      <Field label="Thời gian" cols={12}>
        <DatePicker
          className="h-12"
          selectsRange
          startOfDay
          endOfDay
          placeholder="Ngày hẹn"
          onChange={(val) => handleFilterDate(val)}
        />
      </Field>
    </Form>
  );
}
