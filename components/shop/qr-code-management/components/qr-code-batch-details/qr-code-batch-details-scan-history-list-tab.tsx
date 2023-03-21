import { useState } from "react";
import { RiDownload2Line } from "react-icons/ri";
import { saveFile } from "../../../../../lib/helpers/file";
import { useToast } from "../../../../../lib/providers/toast-provider";
import {
  QRCodeScanLog,
  QRCodeScanLogService,
} from "../../../../../lib/repo/qr-code/qr-code-scan-log.repo";
import { Button } from "../../../../shared/utilities/form";
import { DataTable } from "../../../../shared/utilities/table/data-table";
import { useQRCodeBatchDetailsContext } from "../../providers/qr-code-batch-details-provider";
import { QRCodeDetailsDialog } from "../qr-code-details/qr-code-details-dialog";

interface QRCodeBatchDetailsScanHistoryListTabProps extends ReactProps {}

export function QRCodeBatchDetailsScanHistoryListTab({
  ...props
}: QRCodeBatchDetailsScanHistoryListTabProps) {
  const toast = useToast();
  const { QRCodeBatchDetails } = useQRCodeBatchDetailsContext();
  const [openQRCodeDetailsDialog, setOpenQRCodeDetailsDialog] = useState<string>();

  const exportQRCodeScanHistory = async () => {
    try {
      await saveFile(
        () => QRCodeScanLogService.exportQRCodeScanHistory(QRCodeBatchDetails.id),
        "excel",
        `DANH_SACH_LICH_SU_QUET_DOT_QR_CODE_${QRCodeBatchDetails?.name || ""}`,
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
      itemName="lịch sử lượt quét"
      filter={{ qrCodeStageId: QRCodeBatchDetails?.id }}
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
            onClick={exportQRCodeScanHistory}
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
        <DataTable.Column
          label={"Mã QR Code"}
          center
          render={(item: QRCodeScanLog) => (
            <DataTable.CellText
              value={
                <div
                  className="underline cursor-pointer hover:text-primary"
                  onClick={() => setOpenQRCodeDetailsDialog(item.qrCodeId)}
                >
                  {item.qrCode?.code}
                </div>
              }
            />
          )}
        />
      </DataTable.Table>
      <DataTable.Pagination />
      <QRCodeDetailsDialog
        id={openQRCodeDetailsDialog}
        isOpen={!!openQRCodeDetailsDialog}
        onClose={() => setOpenQRCodeDetailsDialog(null)}
      />
    </DataTable>
  );
}
