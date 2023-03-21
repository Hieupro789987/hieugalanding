import { RiCloseLine } from "react-icons/ri";
import { Button } from "../utilities/form";
import { DialogProps } from "../utilities/dialog/dialog";

export function CloseButtonHeaderDialog({ ...props }: DialogProps) {
  return (
    <div className="flex justify-end col-span-12">
      <Button
        tooltip="Đóng"
        icon={<RiCloseLine />}
        iconClassName="text-2xl text-gray-400 hover:text-danger"
        className="-mt-2 -mr-4"
        onClick={props.onClose}
      />
    </div>
  );
}
