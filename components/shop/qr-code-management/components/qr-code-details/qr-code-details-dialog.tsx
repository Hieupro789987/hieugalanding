import { TitleDialog } from "../../../../shared/dialog/title-dialog";
import { Dialog, DialogProps } from "../../../../shared/utilities/dialog";
import {
  QRCodeDetailsContext,
  QRCodeDetailsProvider,
} from "../../providers/qr-code-details-provider";
import { QRCodeDetailsInfo } from "./qr-code-details-info";
import { QRCodeDetailsScanHistoryList } from "./qr-code-details-scan-history-list";

interface QRCodeDetailsDialogProps extends DialogProps {
  id: string;
}

export function QRCodeDetailsDialog({ id, ...props }: QRCodeDetailsDialogProps) {
  return (
    <Dialog width={840} {...props}>
      <Dialog.Body>
        <QRCodeDetailsProvider id={id}>
          <QRCodeDetailsContext.Consumer>
            {({ QRCodeDetails }) => (
              <TitleDialog
                title={`Lịch sử quét QR Code ${QRCodeDetails.code}`}
                onClose={props.onClose}
                hasBorder={false}
                className="!text-gray-700"
                isShowTooltipCloseButton={false}
              />
            )}
          </QRCodeDetailsContext.Consumer>
          <QRCodeDetailsInfo />
          <QRCodeDetailsScanHistoryList />
        </QRCodeDetailsProvider>
      </Dialog.Body>
    </Dialog>
  );
}
