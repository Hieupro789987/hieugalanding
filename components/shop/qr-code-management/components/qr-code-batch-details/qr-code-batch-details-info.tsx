import { RiInformationLine } from "react-icons/ri";
import { formatDate } from "../../../../../lib/helpers/parser";
import { InfoRow } from "../../../../shared/common/info-row";
import { useQRCodeBatchDetailsContext } from "../../providers/qr-code-batch-details-provider";

interface QRCodeBatchDetailsInfoProps extends ReactProps {}

export function QRCodeBatchDetailsInfo({ ...props }: QRCodeBatchDetailsInfoProps) {
  const {
    QRCodeBatchDetails: { name, updatedAt, description, qrCodeCount, productName, isActive },
  } = useQRCodeBatchDetailsContext();

  return (
    <div className="gap-2 mt-2 flex-cols">
      <InfoRow label="Tên đợt QR Code:" value={name} />
      <InfoRow label="Ngày cập  nhật:" value={formatDate(updatedAt, "dd-MM-yyyy")} />
      <InfoRow label="Mô tả:" value={description} />
      <InfoRow label="Sản phẩm:" value={productName} />
      <InfoRow label="Số lượng QR Code:" value={qrCodeCount} />
      <div
        className={`p-2.5 mt-1 rounded flex items-center gap-2 font-medium ${
          isActive ? "bg-blue-50 text-info" : "bg-gray-50 text-gray-500"
        }`}
      >
        <i
          className={`text-2xl grow-0 shrink-0 ${
            isActive ? "text-blue-500" : "text-gray-500 font-medium"
          }`}
        >
          <RiInformationLine />
        </i>
        <div className="text-sm font-semibold">
          <div className="">
            {isActive ? "Đợt QR Code được kích hoạt." : "Đợt QR Code đã ngừng kích hoạt."}
          </div>
          <div className="">
            {isActive
              ? "Bạn có thể tắt kích hoạt riêng các QR Code ở danh sách bên dưới."
              : "Các QR Code của đợt ở danh sách dưới đều bị ngừng kích hoạt."}
          </div>
        </div>
      </div>
    </div>
  );
}
