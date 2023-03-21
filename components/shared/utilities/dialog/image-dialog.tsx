import { HiX } from "react-icons/hi";
import { Button } from "../form";
import { Dialog } from "./dialog";

interface PropsType extends ReactProps {
  isOpen: boolean;
  image: string;
  onClose: () => any;
  onClick?: () => void;
}

export function ImageDialog({ className = "", style = {}, ...props }: PropsType) {
  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose} slideFromBottom="none">
      <Button
        className="absolute right-0 w-9 h-9 px-0 rounded-full -top-10 bg-gray-50"
        outline
        hoverDarken
        iconClassName="text-lg"
        icon={<HiX />}
        onClick={props.onClose}
      />
      {props.image && (
        <img
          className={`w-full max-w-4xl ${props.onClick ? "cursor-pointer" : ""} ${className}`}
          style={{ ...style }}
          src={props.image}
          onClick={props.onClick}
        />
      )}
    </Dialog>
  );
}
