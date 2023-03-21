import { useState } from "react";
import { RiFileList2Line } from "react-icons/ri";
import { useToast } from "../../../lib/providers/toast-provider";
import { ProductService } from "../../../lib/repo/product.repo";
import { QRCodeStage, QRCodeStageService } from "../../../lib/repo/qr-code/qr-code-stage.repo";
import { DatePicker, Field, Input, Select, Switch, Textarea } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { QRCodeBatchDetailsDialog } from "./components/qr-code-batch-details/qr-code-batch-details-dialog";

interface QRCodeManagementPageProps extends ReactProps {}

export function QRCodeManagementPage({ ...props }: QRCodeManagementPageProps) {
  const toast = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState<string>();
  const [updatedAt, setUpdatedAt] = useState<any>();

  const handleFilterDate = (val) => {
    const obj = { updatedAt: val?.startDate && val?.endDate ? {} : undefined };
    if (val?.startDate) {
      obj["updatedAt"]["$gte"] = val?.startDate;
    }
    if (val?.endDate) {
      obj["updatedAt"]["$lte"] = val?.endDate;
    }

    setUpdatedAt(obj);
  };

  return (
    <Card>
      <DataTable<QRCodeStage>
        crudService={QRCodeStageService}
        order={{ createdAt: -1 }}
        filter={{ ...updatedAt }}
        itemName="đợt QR Code"
      >
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => (
              <DataTable.Title subtitle={`Tổng ${total} đợt QR Code`} />
            )}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button textPrimary outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <div className="mt-4">
          <DataTable.Toolbar>
            <DataTable.Search className="h-12 min-w-xs" />
            <DataTable.Filter>
              <Field noError className="min-w-2xs">
                <DatePicker
                  className="h-12"
                  selectsRange
                  startOfDay
                  endOfDay
                  monthsShown={2}
                  placeholder="Ngày cập nhật"
                  onChange={(val) => handleFilterDate(val)}
                />
              </Field>
            </DataTable.Filter>
          </DataTable.Toolbar>
        </div>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Tên đợt QR Code"}
            render={(item: QRCodeStage) => <DataTable.CellText value={item.name} />}
          />
          <DataTable.Column
            label={"Ngày cập nhật"}
            orderBy="updatedAt"
            center
            render={(item: QRCodeStage) => <DataTable.CellDate value={item.updatedAt} />}
          />
          <DataTable.Column
            label={"Sản phẩm"}
            center
            render={(item: QRCodeStage) => <DataTable.CellText value={item.productName} />}
          />
          <DataTable.Column
            label={"Số lượng"}
            center
            render={(item: QRCodeStage) => <DataTable.CellNumber value={item.qrCodeCount} />}
          />
          <DataTable.Column
            label={"Lần quét"}
            orderBy="scanQRCodeCount"
            center
            render={(item: QRCodeStage) => <DataTable.CellNumber value={item.scanQRCodeCount} />}
          />
          <DataTable.Column
            label={"Kích hoạt"}
            center
            render={(item: QRCodeStage) => (
              <DataTable.Consumer>
                {({ changeRowData }) => (
                  <DataTable.CellText
                    className="flex justify-center"
                    value={
                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          dependent
                          value={item.isActive}
                          onChange={async () => {
                            try {
                              const res = await QRCodeStageService.update({
                                id: item.id,
                                data: { isActive: !item.isActive },
                              });
                              changeRowData(item, "isActive", res.isActive);
                            } catch (err) {
                              changeRowData(item, "isActive", item.isActive);
                              toast.error(`Kích hoạt đợt QR Code thất bại.`);
                            }
                          }}
                        />
                      </div>
                    }
                  />
                )}
              </DataTable.Consumer>
            )}
          />
          <DataTable.Column
            right
            render={(item: QRCodeStage) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiFileList2Line />}
                  tooltip="Xem chi tiết"
                  onClick={() => setOpenDetailsDialog(item.id)}
                />
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DataTable.Consumer>
          {({ formItem }) => (
            <>
              <DataTable.Form grid width={400}>
                <Field name="name" label="Tên đợt QR Code" required>
                  <Input autoFocus />
                </Field>
                <Field name="description" label="Mô tả" required>
                  <Textarea />
                </Field>
                <Field name="productId" label="Sản phẩm">
                  <Select
                    hasImage
                    autocompletePromise={({ id, search }) =>
                      ProductService.getAllAutocompletePromise(
                        { id, search },
                        {
                          fragment: "id name image",
                          parseOption: ({ id, name, image }) => ({
                            value: id,
                            label: `${name}`,
                            image: image,
                          }),
                        }
                      )
                    }
                  />
                </Field>
                <Field
                  name="qrCodeCount"
                  label="Số lượng QR Code"
                  required
                  validation={{ min: 1, max: 1000 }}
                  readOnly={!!formItem?.id}
                >
                  <Input number defaultValue={1} />
                </Field>
              </DataTable.Form>
              <QRCodeBatchDetailsDialog
                id={openDetailsDialog}
                isOpen={!!openDetailsDialog}
                onClose={() => setOpenDetailsDialog(null)}
              />
            </>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
