import { TitleDialog } from "../../../../shared/dialog/title-dialog";
import { Dialog, DialogProps } from "../../../../shared/utilities/dialog";
import {
  QRCodeBatchDetailsContext,
  QRCodeBatchDetailsProvider,
} from "../../providers/qr-code-batch-details-provider";
import { QRCodeBatchDetailsInfo } from "./qr-code-batch-details-info";
import { QRCodeBatchDetailsTabs } from "./qr-code-batch-details-tabs";

interface QRCodeBatchDetailsDialogProps extends DialogProps {
  id: string;
}

export function QRCodeBatchDetailsDialog({ id, ...props }: QRCodeBatchDetailsDialogProps) {
  return (
    <Dialog width={880} {...props}>
      <Dialog.Body>
        <QRCodeBatchDetailsProvider id={id} onCloseDialog={props.onClose}>
          <QRCodeBatchDetailsContext.Consumer>
            {({ QRCodeBatchDetails }) => (
              <TitleDialog
                title={`Chi tiết đợt QR Code ${QRCodeBatchDetails.name}`}
                onClose={props.onClose}
                hasBorder={false}
                className="!text-gray-700"
                isShowTooltipCloseButton={false}
              />
            )}
          </QRCodeBatchDetailsContext.Consumer>
          <QRCodeBatchDetailsInfo />
          <hr className="mt-5 mb-3" />
          <QRCodeBatchDetailsTabs />
        </QRCodeBatchDetailsProvider>
      </Dialog.Body>
    </Dialog>
  );
}
