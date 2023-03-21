import { Prescription } from "../../../../../lib/repo/prescription.repo";
import { TitleDialog } from "../../../dialog/title-dialog";
import { Field, Form, FormProps, Input } from "../../../utilities/form";

interface QuestionPrescriptionDialogProps extends FormProps {
  onSubmit: (data: Prescription) => void;
  index: number;
  editPrescription?: Prescription;
}

export function QuestionPrescriptionDialog({
  onSubmit,
  index,
  editPrescription,
  ...props
}: QuestionPrescriptionDialogProps) {
  return (
    <Form
      dialog
      width={580}
      grid
      className=""
      defaultValues={editPrescription || {}}
      onSubmit={(data) => onSubmit?.(data)}
      {...props}
    >
      <TitleDialog
        title={`${editPrescription ? "Chỉnh sửa" : "Thêm"} thuốc #${++index}`}
        onClose={props.onClose}
        className="col-span-12 mb-4"
      />
      <Field name="name" label="Tên thuốc" required cols={8}>
        <Input placeholder="Nhập tên thuốc..." autoFocus />
      </Field>
      <Field name="dose" label="Liều lượng" required cols={4}>
        <Input placeholder="Nhập liều lượng..." />
      </Field>
      <Field name="note" label="Ghi chú" cols={12}>
        <Input placeholder="Nhập ghi chú..." />
      </Field>
      <Form.Footer
        submitText={`${editPrescription ? "Cập nhật" : "Thêm thuốc"}`}
        submitProps={{ large: true }}
        cancelText="Hủy"
      />
    </Form>
  );
}
