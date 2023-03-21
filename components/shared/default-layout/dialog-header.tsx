import { IoClose } from "react-icons/io5";
import { Dialog } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form";

export function DialogHeader({ title, onClose }: { title: string; onClose: () => any }) {
  return (
    <Dialog.Header>
      <div
        className={`py-2.5 px-4 cursor-pointer border-b-2 rounded-t border-gray-100 bg-white flex-center group`}
        onClick={onClose}
      >
        <div className="flex-1 text-lg font-bold text-accent group-hover:text-accent-dark">
          {title}
        </div>
        <Button
          className="px-0 text-2xl text-gray-400 group-hover:text-gray-500"
          hoverWhite
          icon={<IoClose />}
        />
      </div>
    </Dialog.Header>
  );
}
DialogHeader.displayName = "Header";
