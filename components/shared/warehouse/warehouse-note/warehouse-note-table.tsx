import { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useAuth } from "../../../../lib/providers/auth-provider";
import {
  InventoryVoucher,
  InventoryVoucherService,
} from "../../../../lib/repo/inventory-voucher/inventory-voucher.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { ShopBranchService } from "../../../../lib/repo/shop-branch.repo";
import { ShopPageTitle } from "../../shop-layout/shop-page-title";
import { Button, DatePicker, Field, Select } from "../../utilities/form";
import { DataTable } from "../../utilities/table/data-table";
import { WarehouseProvider } from "../provider/warehouse-provider";
import { WarehouseForm } from "../warehouse-form/warehouse-form";

export interface WarehouseNotePageProps {
  type: "staff" | "shop";
}

export function WarehouseNoteTable({ type, ...props }: WarehouseNotePageProps) {
  const [openWarehouseForm, setOpenWarehouseForm] = useState({
    show: false,
    type: "",
    voucher: null,
  });
  const [filterDate, setFilterDate] = useState<any>();
  const [typeVoucher, setTypeVoucher] = useState<any>();
  const [branchId, setBranchId] = useState<any>();
  const { staff } = useAuth();

  const handleFilterDate = (val, type: "accountingDate" | "voucherDate") => {
    const obj =
      type == "accountingDate"
        ? {
            accountingDate: val?.startDate && val?.endDate ? {} : undefined,
          }
        : { voucherDate: val?.startDate && val?.endDate ? {} : undefined };
    if (val?.startDate) {
      if (type == "accountingDate") {
        obj["accountingDate"]["$gte"] = val?.startDate;
      } else {
        obj["voucherDate"]["$gte"] = val?.startDate;
      }
    }
    if (val?.endDate) {
      if (type == "accountingDate") {
        obj["accountingDate"]["$lte"] = val?.endDate;
      } else {
        obj["voucherDate"]["$lte"] = val?.endDate;
      }
    }
    setFilterDate({ ...filterDate, ...obj });
  };

  const handleFilterTypeVoucher = (val) => {
    const obj = { type: val ? {} : undefined };
    if (val == "IMPORT") {
      obj["type"] = val;
    }
    if (val == "IMPORT-IMPORT") {
      obj["type"] = "IMPORT";
      obj["reason"] = "IMPORT";
    }
    if (val == "RETURN") {
      obj["type"] = "IMPORT";
      obj["reason"] = val;
    }
    if (val == "IMPORT-OTHER") {
      obj["type"] = "IMPORT";
      obj["reason"] = "OTHER";
    }

    if (val == "EXPORT") {
      obj["type"] = val;
    }
    if (val == "EXPORT-EXPORT") {
      obj["type"] = "EXPORT";
      obj["reason"] = "EXPORT";
    }
    if (val == "SELL") {
      obj["type"] = "EXPORT";
      obj["reason"] = val;
    }
    if (val == "EXPORT-OTHER") {
      obj["type"] = "EXPORT";
      obj["reason"] = "OTHER";
    }

    setTypeVoucher(obj);
  };

  return (
    <DataTable<InventoryVoucher>
      crudService={InventoryVoucherService}
      order={{ createdAt: -1 }}
      filter={{
        branchId: branchId || undefined,
        ...typeVoucher,
        ...filterDate,
      }}
    >
      <DataTable.Header>
        <div className="flex items-center justify-between w-full pb-8">
          {/* <ShopPageTitle title="DANH SÁCH PHIẾU KHO" /> */}
          <DataTable.Title />
          <div className="flex flex-row gap-x-2">
            {type == "shop" && (
              <Select
                className="inline-grid w-60"
                placeholder="Chi nhánh"
                optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
                onChange={(val) => setBranchId(val)}
                clearable
              />
            )}

            <DataTable.Buttons>
              <Button
                primary
                className=""
                text={"Tạo phiếu nhập kho"}
                onClick={() =>
                  setOpenWarehouseForm({
                    show: true,
                    type: "IMPORT",
                    voucher: null,
                  })
                }
              />
              <Button
                primary
                text="Tạo phiếu xuất kho"
                onClick={() =>
                  setOpenWarehouseForm({
                    show: true,
                    type: "EXPORT",
                    voucher: null,
                  })
                }
              />
            </DataTable.Buttons>
          </div>
        </div>
      </DataTable.Header>
      <div className="mb-4">
        <DataTable.Toolbar>
          <DataTable.Search className="flex-1 max-w-[250px]" placeholder="Tìm kiếm" />
          <DataTable.Filter defaultValues={{}}>
            <div className="flex flex-row justify-end flex-1 gap-2">
              <Field noError className="flex-1  max-w-[230px]">
                <Select
                  placeholder="Loại phiếu"
                  options={[
                    { label: "Tất cả", value: "" },
                    { label: "Nhập kho", value: "IMPORT" },
                    { label: "Nhập kho - Nhập hàng", value: "IMPORT-IMPORT" },
                    { label: "Nhập kho - Hoàn hàng", value: "RETURN" },
                    { label: "Nhập kho - Khác", value: "IMPORT-OTHER" },
                    { label: "Xuất kho", value: "EXPORT" },
                    { label: "Xuất kho - Xuất kho", value: "EXPORT-EXPORT" },
                    { label: "Xuất kho - Bán hàng", value: "SELL" },
                    { label: "Xuất kho - Khác", value: "EXPORT-OTHER" },
                  ]}
                  onChange={(value) => handleFilterTypeVoucher(value)}
                />
              </Field>

              <Field noError className="flex-1 max-w-[250px]">
                <DatePicker
                  selectsRange
                  startOfDay
                  endOfDay
                  monthsShown={2}
                  placeholder="Ngày hạch toán"
                  onChange={(val) => handleFilterDate(val, "accountingDate")}
                />
              </Field>
              <Field noError className="flex-1 max-w-[250px]">
                <DatePicker
                  selectsRange
                  startOfDay
                  endOfDay
                  monthsShown={2}
                  placeholder="Ngày chứng từ"
                  onChange={(val) => handleFilterDate(val, "voucherDate")}
                />
              </Field>
            </div>
          </DataTable.Filter>
        </DataTable.Toolbar>
      </div>

      <DataTable.Table disableDbClick>
        <DataTable.Column
          label={"Mã phiếu"}
          render={(item: InventoryVoucher) => <DataTable.CellText className="" value={item.code} />}
        />
        <DataTable.Column
          label={"Loại phiếu"}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText value={item.type == "IMPORT" ? "Nhập kho" : "Xuất kho"} />
          )}
        />
        <DataTable.Column
          label={"Chi nhánh"}
          className={`${type == "staff" ? "hidden" : ""}`}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText className="" value={item?.branch?.name} />
          )}
        />
        <DataTable.Column
          label={"ngày hạch toán"}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText
              className=""
              value={formatDate(item.accountingDate, "dd/MM/yyyy")}
            />
          )}
        />
        <DataTable.Column
          label={"ngày chứng từ"}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText className="" value={formatDate(item.voucherDate, "dd/MM/yyyy")} />
          )}
        />
        <DataTable.Column
          label={"Người tạo phiếu"}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText
              className=""
              value={item.staffName}
              subText={item?.staffCode || "Chủ shop"}
              subTextClassName="text-xs font-semibold"
            />
          )}
        />
        <DataTable.Column
          right
          label={"Tổng tiền"}
          render={(item: InventoryVoucher) => (
            <DataTable.CellText className="" value={`${parseNumber(item.total)}đ`} />
          )}
        />
        <DataTable.Column
          right
          render={(item: InventoryVoucher) => (
            <Button
              icon={<RiEdit2Line />}
              className="px-[0.375rem]"
              tooltip="Chỉnh sửa phiếu kho"
              onClick={() =>
                setOpenWarehouseForm({
                  show: true,
                  type: item.type,
                  voucher: item,
                })
              }
            />
          )}
        />
      </DataTable.Table>
      <DataTable.Pagination />
      <WarehouseProvider>
        <WarehouseForm
          type={openWarehouseForm.type}
          isOpen={openWarehouseForm.show}
          voucher={openWarehouseForm.voucher}
          typeAt={type}
          onClose={() =>
            setOpenWarehouseForm({
              show: false,
              type: "",
              voucher: null,
            })
          }
        />
      </WarehouseProvider>
    </DataTable>
  );
}
