import { HiOutlineX } from "react-icons/hi";
import { useDevice } from "../../../../lib/hooks/useDevice";
import { Button, Field, Form, Textarea } from "../../../shared/utilities/form";

interface NoteDialogProps extends ReactProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => any;
  openDialog: boolean;
  setOpenDialog: (val: boolean) => void;
}

export const NoteDialog = ({ value, onChange, openDialog, setOpenDialog }: NoteDialogProps) => {
  const { isMobile } = useDevice();
  return (
    <Form
      mobileSizeMode={isMobile}
      dialog
      isOpen={openDialog}
      width="320px"
      defaultValues={{ note: value }}
      allowResetDefaultValues
      onClose={() => setOpenDialog(false)}
      onSubmit={(data) => {
        onChange(data.note);
        setOpenDialog(false);
      }}
      dialogClass="rounded-3xl"
    >
      <div className="flex flex-col items-center w-full text-gray-700">
        <div className="flex items-center justify-between w-full px-1 mb-1">
          <div className="text-lg font-semibold text-center">Ghi chú</div>
          <Button
            className="pr-1"
            iconClassName="text-xl"
            icon={<HiOutlineX />}
            onClick={() => setOpenDialog(false)}
          />
        </div>
        <Field name="note" className="w-full">
          <Textarea rows={3} placeholder="Nhập ghi chú..." className="w-full border-gray-200" />
        </Field>
        <Button text="Xác nhận" primary className="px-12 rounded-full" submit />
      </div>
    </Form>
  );
};
