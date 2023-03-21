import { useEffect, useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopVoucher, ShopVoucherService } from "../../../lib/repo/shop-voucher.repo";
import { VoucherDetails } from "./voucher-details";
import { DialogHeader } from "../default-layout/dialog-header";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Spinner } from "../utilities/misc";
import { useDevice } from "../../../lib/hooks/useDevice";
interface Props extends DialogProps {
  voucher?: ShopVoucher;
  voucherId?: string;
}

export function VoucherDetailsDialog(props: Props) {
  const [voucher, setVoucher] = useState<ShopVoucher>();
  const { isMobile, isDesktop } = useDevice();
  const toast = useToast();

  useEffect(() => {
    if (props.isOpen) {
      if (props.voucher) {
        setVoucher(props.voucher);
      } else if (props.voucherId) {
        ShopVoucherService.getOne({ id: props.voucherId, toast })
          .then((res) => {
            setVoucher(res);
          })
          .catch(() => {
            props.onClose();
          });
      }
    } else {
      setVoucher(null);
    }
  }, [props.voucher, props.voucherId, props.isOpen]);

  return (
    <Dialog
      width={600}
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode={isMobile}
      extraBodyClass="px-0 pt-0"
      headerClass=" "
    >
      <DialogHeader title="Thông tin khuyến mãi" onClose={props.onClose} />
      <Dialog.Body>
        <div
          style={{
            minHeight: `${isDesktop ? "600px" : ""} `,
            height: `${isDesktop ? "auto" : " calc(100vh - 144px)"} `,
          }}
        >
          {voucher ? <VoucherDetails voucher={voucher} /> : <Spinner />}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
