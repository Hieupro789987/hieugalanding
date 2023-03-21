import { AiOutlineClose } from "react-icons/ai";
import { useScreen } from "../../../lib/hooks/useScreen";
import { Dialog } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form";
import { Img } from "../utilities/misc";

export function AuthDialogHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => any;
}) {
  const screenLg = useScreen("lg");
  return (
    <Dialog.Header>
      <div className="relative text-center">
        {screenLg && (
          <Button
            hoverDanger
            className="absolute -top-4 -right-4"
            icon={<AiOutlineClose />}
            unfocusable
            iconClassName="text-xl"
            onClick={onClose}
          />
        )}
        <img
          src="/assets/img/logo.png"
          className="object-contain w-40"
          style={{ margin: "0 auto" }}
        />
        <div className="my-2 text-2xl font-semibold leading-6 text-accent">{title}</div>
        <div className="mb-4 font-semibold text-gray-600">{subtitle}</div>
      </div>
    </Dialog.Header>
  );
}
AuthDialogHeader.displayName = "Header";
