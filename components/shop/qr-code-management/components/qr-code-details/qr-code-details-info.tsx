import QRCode from "qrcode.react";
import { RiDownload2Line } from "react-icons/ri";
import { Button } from "../../../../shared/utilities/form";
import { useQRCodeDetailsContext } from "../../providers/qr-code-details-provider";

interface QRCodeDetailsInfoProps extends ReactProps {}

export function QRCodeDetailsInfo({ ...props }: QRCodeDetailsInfoProps) {
  const {
    QRCodeDetails: { code, qrCode, qrCodeStage },
  } = useQRCodeDetailsContext();

  const download = () => {
    let canvas: any = document.getElementById(qrCodeStage?.productName + "QR");
    if (canvas) {
      let a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = qrCodeStage?.productName + "-QR.png";
      a.click();
    }
  };

  return (
    <div className="flex gap-6 mb-8 mt-3">
      <QRCode size={160} id={qrCodeStage?.productName + "QR"} className="" value={qrCode} />

      <div className="flex-cols">
        <div className="font-semibold">
          <div className="uppercase text-xl">{qrCodeStage?.productName}</div>
          <div className="text-lg mt-1">{code}</div>
        </div>
        <div className="mt-auto">
          <Button
            outline
            primary
            className="h-12"
            text="Tải xuống"
            icon={<RiDownload2Line />}
            iconClassName="text-2xl"
            onClick={() => download()}
          />
        </div>
      </div>
    </div>
  );
}
