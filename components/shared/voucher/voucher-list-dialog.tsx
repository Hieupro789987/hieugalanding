import { useScreen } from "../../../lib/hooks/useScreen";
import { ShopVoucher } from "../../../lib/repo/shop-voucher.repo";
import { DialogHeader } from "../default-layout/dialog-header";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form";
import { VoucherList } from "./voucher-list";

interface Props extends DialogProps {
  onApply?: (voucher: ShopVoucher) => any;
  isListMode?: boolean;
}
export function VoucherListDialog({ onApply, isListMode, ...props }: Props) {
  const screenLg = useScreen("lg");
  return (
    <Dialog
      width={540}
      mobileSizeMode={!screenLg}
      // slideFromBottom="all"
      onClose={props.onClose}
      isOpen={props.isOpen}
      bodyClass="relative bg-gray-100 rounded"
      headerClass=" "
    >
      <DialogHeader title="Danh sách khuyến mãi" onClose={props.onClose} />
      <Dialog.Body>
        <div
          className="v-scrollbar"
          style={{
            height: `${screenLg ? "auto" : " calc(100vh - 144px)"} `,
          }}
        >
          <VoucherList
            isListMode={isListMode}
            onApply={(val) => {
              onApply(val);
              props.onClose();
            }}
          />
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
