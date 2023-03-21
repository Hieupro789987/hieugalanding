import { RiDownload2Line } from "react-icons/ri";
import { saveFile } from "../../../../../lib/helpers/file";
import { useToast } from "../../../../../lib/providers/toast-provider";
import {
  QRCodeScanLog,
  QRCodeScanLogService,
} from "../../../../../lib/repo/qr-code/qr-code-scan-log.repo";
import { QRCodeService } from "../../../../../lib/repo/qr-code/qr-code.repo";
import { Button } from "../../../../shared/utilities/form";
import { DataTable } from "../../../../shared/utilities/table/data-table";
import { useQRCodeDetailsContext } from "../../providers/qr-code-details-provider";

interface QRCodeDetailsScanHistoryListProps extends ReactProps {}

export function QRCodeDetailsScanHistoryList({ ...props }: QRCodeDetailsScanHistoryListProps) {
  const toast = useToast();
  const { QRCodeDetails } = useQRCodeDetailsContext();

  const exportQRCodeScanLogDetail = async () => {
    try {
      await saveFile(
        () => QRCodeService.exportQRCodeScanLogDetail(QRCodeDetails.id),
        "excel",
        `DANH_SACH_LICH_SU_QUET_CUA_QR_CODE_MA_${QRCodeDetails?.code || ""}`,
        {
          onError: (message) => toast.error("Xuất thất bại", message),
        }
      );
    } catch (err) {}
  };

  return (
    <DataTable<QRCodeScanLog>
      crudService={QRCodeScanLogService}
      order={{ createdAt: -1 }}
      itemName="lịch sử quét"
      filter={{ qrCodeId: QRCodeDetails?.id }}
    >
      <DataTable.Header>
        <DataTable.Search className="h-12 min-w-xs" />
        <DataTable.Buttons>
          <DataTable.Button
            textPrimary
            outline
            isRefreshButton
            refreshAfterTask
            className="w-12 h-12 bg-primary-light"
          />
          <Button
            primary
            outline
            icon={<RiDownload2Line />}
            text="Xuất file Excel"
            className="h-12"
            onClick={exportQRCodeScanLogDetail}
          />
        </DataTable.Buttons>
      </DataTable.Header>

      <DataTable.Table className="mt-4" disableDbClick>
        <DataTable.Column
          label={"Người dùng"}
          render={(item: QRCodeScanLog) => (
            <DataTable.CellText value={item.userName} subText={item.phone} />
          )}
        />
        <DataTable.Column
          label={"Thời gian quét"}
          center
          render={(item: QRCodeScanLog) => (
            <DataTable.CellDate value={item.createdAt} format="dd-MM-yyyy HH:mm" />
          )}
        />
        <DataTable.Column
          label={"Thiết bị"}
          center
          render={(item: QRCodeScanLog) => <DataTable.CellText value={item.os} />}
        />
      </DataTable.Table>
      <DataTable.Pagination />
    </DataTable>
  );
}
