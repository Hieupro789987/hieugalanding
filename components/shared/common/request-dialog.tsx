import { useRouter } from "next/router";
import { IoAlertCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { CloseButtonHeaderDialog } from "../dialog/close-button-header-dialog";
import { Dialog, DialogProps } from "../utilities/dialog";
import { Button } from "../utilities/form";

interface RequestDialogProps extends DialogProps {
  title?: string;
  hasRequestLogin?: boolean;
}

export function RequestDialog({
  title = "Vui lòng đăng nhập.",
  hasRequestLogin = false,
  ...props
}: RequestDialogProps) {
  const router = useRouter();

  return (
    <Dialog width={400} className="text-accent" {...props}>
      <Dialog.Body>
        <CloseButtonHeaderDialog onClose={props.onClose} />
        <div className="flex-center">
          <i className="text-yellow text-[120px] shadow-5xl shadow-yellow">
            <IoAlertCircle width={12} />
          </i>
        </div>
        <div className="mt-3 mb-6 font-bold text-center">{title}</div>
        {hasRequestLogin && (
          <Button
            primary
            text="Đăng nhập"
            className="w-full h-14"
            onClick={async () => {
              await props.onClose();
              router.push("/login");
            }}
          />
        )}
      </Dialog.Body>
    </Dialog>
  );
}
