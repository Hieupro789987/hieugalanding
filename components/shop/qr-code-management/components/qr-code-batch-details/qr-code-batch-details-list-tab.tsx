import JSZip from "jszip";
import QRCodeCanvas from "qrcode";
import { useState } from "react";
import { RiDownload2Line, RiFileList2Line } from "react-icons/ri";
import { saveFile } from "../../../../../lib/helpers/file";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { QRCode, QRCodeService } from "../../../../../lib/repo/qr-code/qr-code.repo";
import { Button, Switch } from "../../../../shared/utilities/form";
import { DataTable } from "../../../../shared/utilities/table/data-table";
import { useQRCodeBatchDetailsContext } from "../../providers/qr-code-batch-details-provider";
import { QRCodeDetailsDialog } from "../qr-code-details/qr-code-details-dialog";

interface QRCodeBatchDetailsListTabProps extends ReactProps {}

export function QRCodeBatchDetailsListTab({ ...props }: QRCodeBatchDetailsListTabProps) {
  const toast = useToast();
  const { QRCodeBatchDetails } = useQRCodeBatchDetailsContext();
  const [openQRCodeDetailsDialog, setOpenQRCodeDetailsDialog] = useState<string>();
  const [isPNGExportLoading, setIsPNGExportLoading] = useState(false);

  const downloadZip = async () => {
    try {
      setIsPNGExportLoading(true);
      const qrCodeList = await QRCodeService.getAll({
        query: { limit: 1000, filter: { qrCodeStageId: QRCodeBatchDetails?.id } },
        fragment: "qrCode code",
      });

      const qrCodes = qrCodeList.data.map((item) => ({ qrCode: item.qrCode, code: item.code }));

      //Generate qr code image
      const opts: any = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        width: 200,
        heigth: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      };

      let qrCodeDataURLs;
      const dataURLsPromises = qrCodes.map((qrCode) => {
        return QRCodeCanvas.toDataURL(qrCode.qrCode, opts);
      });
      qrCodeDataURLs = await Promise.all(dataURLsPromises);

      //Nén file
      const zip = new JSZip();
      const qrCodesFolder = zip.folder("qrCodes");

      const qrCodeImages = qrCodeDataURLs.map((qrCodeDataURL, index) => {
        return {
          data: qrCodeDataURL.split(",")[1],
          name: qrCodes[index].code,
        };
      });

      for (const qrCodeImage of qrCodeImages) {
        qrCodesFolder.file(qrCodeImage.name + ".png", qrCodeImage.data, {
          base64: true,
        });
      }
      const qrCodesZip = zip.generateAsync({ type: "blob" });

      //Lưu file
      await saveFile(() => qrCodesZip, "zip", `qrCodes`, {
        onError: (message) => toast.error("Nén thất bại", message),
      });
    } catch (err) {
    } finally {
      setIsPNGExportLoading(false);
    }
  };

  const exportQRCodePNG = async () => {
    try {
      const startTime = new Date();
      await saveFile(() => QRCodeService.exportQRCodePNG(QRCodeBatchDetails.id), "zip", `qrCodes`, {
        onError: (message) => toast.error("Xuất thất bại", message),
      });
      console.log("Export PNG Zip", (new Date().getTime() - startTime.getTime()) / 1000);
    } catch (err) {}
  };

  const exportCSV = async () => {
    try {
      await saveFile(
        () => QRCodeService.exportListQRCode(QRCodeBatchDetails.id),
        "excel",
        `DANH_SACH_QR_CODE_DOT_${QRCodeBatchDetails?.name || ""}`,
        {
          onError: (message) => toast.error("Xuất thất bại", message),
        }
      );
    } catch (err) {}
  };

  return (
    <DataTable<QRCode>
      crudService={QRCodeService}
      order={{ lastScanAt: -1 }}
      filter={{ qrCodeStageId: QRCodeBatchDetails?.id }}
      itemName="QR Code"
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
            onClick={exportCSV}
          />
          <Button
            primary
            icon={<RiDownload2Line />}
            text="Xuất file PNG (ZIP)"
            className="h-12"
            isLoading={isPNGExportLoading}
            onClick={exportQRCodePNG}
          />
        </DataTable.Buttons>
      </DataTable.Header>

      <DataTable.Table className="mt-4" disableDbClick>
        <DataTable.Column
          label={"Mã QR Code"}
          render={(item: QRCode) => <DataTable.CellText value={item.code} />}
        />
        <DataTable.Column
          label={"Lần quét"}
          center
          orderBy="scanCount"
          render={(item: QRCode) => <DataTable.CellNumber value={item.scanCount} />}
        />
        <DataTable.Column
          label={"Thời gian quét gần nhất"}
          center
          render={(item: QRCode) => (
            <DataTable.CellDate value={item.lastScanAt} format="dd-MM-yyyy HH:mm" />
          )}
        />
        <DataTable.Column
          render={(item: QRCode) => (
            <DataTable.Consumer>
              {({ changeRowData }) => (
                <DataTable.CellText
                  className="flex justify-end"
                  value={
                    <>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        data-tooltip="Kích hoạt"
                        data-placement="top-center"
                      >
                        <Switch
                          dependent
                          value={item.isActive}
                          onChange={async () => {
                            try {
                              const res = await QRCodeService.update({
                                id: item.id,
                                data: {
                                  isActive: !item.isActive,
                                },
                              });
                              changeRowData(item, "isActive", res.isActive);
                            } catch (err) {
                              changeRowData(item, "isActive", item.isActive);
                              toast.error(`Kích hoạt QR Code thất bại.`);
                            }
                          }}
                        />
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button
                          iconClassName="text-2xl text-gray-500"
                          icon={<RiFileList2Line />}
                          tooltip="Xem chi tiết"
                          onClick={() => setOpenQRCodeDetailsDialog(item.id)}
                        />
                      </div>
                    </>
                  }
                />
              )}
            </DataTable.Consumer>
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
