import { useState } from "react";
import {
  ShopServiceCategory,
  ShopServiceCategoryService,
} from "../../../lib/repo/services/shop-service-category.repo";
import {
  ShopServiceSpecialist,
  ShopServiceSpecialistService,
} from "../../../lib/repo/services/shop-service-specialist.repo";
import { Field, ImageInput, Input, Select } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";

export function ShopServiceSpecialistPage() {
  const [shopServiceCategoryIds, setShopServiceCategoryIds] = useState<string[]>();

  return (
    <Card>
      <DataTable<ShopServiceSpecialist>
        crudService={ShopServiceSpecialistService}
        order={{ createdAt: -1 }}
        filter={{
          shopServiceCategoryIds: !!shopServiceCategoryIds
            ? { $in: shopServiceCategoryIds }
            : undefined,
        }}
      >
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => (
              <DataTable.Title subtitle={`Tổng ${total} chuyên viên`} />
            )}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask className="w-12 h-12" />
            <DataTable.Button primary isCreateButton className="h-12" />
          </DataTable.Buttons>
        </DataTable.Header>

        <div className="mt-4">
          <DataTable.Toolbar>
            <DataTable.Search className="h-12" placeholder="Tìm kiếm chuyên viên" />
            <DataTable.Filter>
              <Field noError>
                <Select
                  clearable
                  className="inline-grid h-12 w-72"
                  placeholder="Danh mục dịch vụ phụ trách"
                  optionsPromise={() => ShopServiceCategoryService.getAllOptionsPromise()}
                  value={shopServiceCategoryIds}
                  onChange={setShopServiceCategoryIds}
                />
              </Field>
            </DataTable.Filter>
          </DataTable.Toolbar>
        </div>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Chuyên viên"
            render={(item: ShopServiceSpecialist) => (
              <DataTable.CellText avatar={item.avatar} value={item.name} />
            )}
          />
          <DataTable.Column
            label="Liên hệ"
            render={(item: ShopServiceSpecialist) => (
              <DataTable.CellText
                value={item.email}
                subText={item.internationalPhone}
                className="font-semibold"
              />
            )}
          />
          <DataTable.Column
            center
            label="Danh mục phụ trách"
            render={(item: ShopServiceSpecialist) => (
              <DataTable.CellText
                value={
                  item.shopServiceCategories.length <= 0
                    ? "Tất cả"
                    : item.shopServiceCategories
                        ?.map((cate: ShopServiceCategory) => cate.name)
                        .join(", ")
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: ShopServiceSpecialist) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton tooltip="Xóa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ formItem }) => (
            <DataTable.Form
              grid
              width={800}
              beforeSubmit={(data) => ({ regionCode: "VN", ...data })}
            >
              <Field label="Họ và tên" name="name" required cols={6}>
                <Input autoFocus placeholder="Nhập họ và tên..." />
              </Field>
              <Field label="Số điện thoại" name="phone" required cols={6}>
                <Input
                  type="tel"
                  placeholder="Nhập sdt..."
                  defaultValue={formItem?.id ? formItem?.internationalPhone : ""}
                />
              </Field>
              <Field label="Email" name="email" cols={6}>
                <Input type="email" placeholder="Nhập email..." />
              </Field>
              <Field label="Danh mục phụ trách" name="shopServiceCategoryIds" cols={6}>
                <Select
                  multi
                  placeholder="Chọn danh mục phụ trách"
                  optionsPromise={() => ShopServiceCategoryService.getAllOptionsPromise()}
                />
              </Field>
              <div className="grid grid-cols-12 col-span-12 gap-x-5">
                <Field label="Ảnh đại diện" name="avatar" required cols={6}>
                  <ImageInput placeholder="Tải ảnh lên" />
                </Field>
              </div>
              <AddressGroup
                className="grid grid-cols-12 gap-x-8"
                provinceCols={4}
                provinceLabel=""
                provinceName="address.provinceId"
                districtCols={4}
                districtLabel=""
                districtName="address.districtId"
                wardCols={4}
                wardLabel=""
                wardName="address.wardId"
                addressCols={12}
                addressName="address.street"
                addressLabel=""
                notRequiredWard
              />
            </DataTable.Form>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
