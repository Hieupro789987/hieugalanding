import { useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { Service, ShopServiceService } from "../../../lib/repo/services/service.repo";
import {
  ShopServiceCategory,
  ShopServiceCategoryService,
} from "../../../lib/repo/services/shop-service-category.repo";
import { Field, Input, Switch } from "../../shared/utilities/form";
import { List } from "../../shared/utilities/list";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { ShopServicesForm } from "./components/shop-services-form";

export function ShopServicesPage() {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ShopServiceCategory>();

  return (
    <Card>
      <DataTable<Service>
        crudService={ShopServiceService}
        order={{ createdAt: -1 }}
        filter={{ shopServiceCategoryId: selectedCategory?.id }}
      >
        <div className="flex items-start mt-1 gap-x-6">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <div className="w-64 shrink-0 grow-0">
                <List<ShopServiceCategory>
                  className=""
                  crudService={ShopServiceCategoryService}
                  order={{ createdAt: 1 }}
                  selectedItem={selectedCategory}
                  onSelect={(item) => setSelectedCategory(item)}
                  onChange={() => {
                    loadAll(true);
                  }}
                  customDefaultValues={{ phone: selectedCategory?.internationalPhone }}
                  renderItem={(item, selected) => (
                    <>
                      <div
                        className={`font-semibold text-sm ${
                          selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                        }`}
                      >
                        {item.name || "Tất cả"}
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <Field name="name" label="Tên danh mục dịch vụ" required>
                      <Input
                        autoFocus
                        placeholder="Nhập tên danh mục dịch vụ..."
                        className="min-w-lg"
                      />
                    </Field>
                  </List.Form>
                </List>
              </div>
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Header>
              <DataTable.Consumer>
                {({ pagination: { total } }) => (
                  <DataTable.Title subtitle={`Tổng ${total} dịch vụ`} />
                )}
              </DataTable.Consumer>
              <DataTable.Buttons>
                <DataTable.Button outline isRefreshButton refreshAfterTask />
                <DataTable.Button primary isCreateButton />
              </DataTable.Buttons>
            </DataTable.Header>

            <DataTable.Divider />
            <DataTable.Toolbar>
              <DataTable.Search style={{ maxWidth: "300px" }} />
            </DataTable.Toolbar>

            <DataTable.Consumer>
              {({ formItem, changeRowData }) => (
                <>
                  <DataTable.Table className="mt-4 bg-white">
                    <DataTable.Column
                      label={"Dịch vụ"}
                      render={(item: Service) => (
                        <DataTable.CellText
                          value={item.name}
                          className="max-w-md"
                          image={item.images[0]}
                        />
                      )}
                    />
                    <DataTable.Column
                      label={"Tên danh mục"}
                      center
                      render={(item: Service) => (
                        <DataTable.CellText value={item.shopServiceCategory?.name} />
                      )}
                    />
                    <DataTable.Column
                      label={"Loại dịch vụ"}
                      center
                      render={(item: Service) => (
                        <DataTable.CellText
                          value={item.serviceTags?.map((tag) => tag.name).join(", ")}
                        />
                      )}
                    />
                    <DataTable.Column
                      center
                      label={"Hiển thị"}
                      render={(item: Service) => (
                        <DataTable.CellText
                          className="flex justify-center"
                          value={
                            <div
                              onClick={(e) => e.stopPropagation()}
                              data-tooltip="Hiển/ẩn dịch vụ"
                              data-placement="top-center"
                            >
                              <Switch
                                dependent
                                value={!item.isHidden}
                                onChange={async (value) => {
                                  try {
                                    const res = await ShopServiceService.serviceMarkHidden(
                                      item.id,
                                      !item.isHidden
                                    );
                                    changeRowData(item, "isHidden", res.isHidden);
                                  } catch (err) {
                                    changeRowData(item, "isHidden", item.isHidden);
                                    toast.error(`${value ? "Hiện" : "Ẩn"} bài viết thất bại.`);
                                  }
                                }}
                              />
                            </div>
                          }
                        />
                      )}
                    />

                    <DataTable.Column
                      right
                      render={(item) => (
                        <>
                          <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                          <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
                        </>
                      )}
                    />
                  </DataTable.Table>
                  <ShopServicesForm formItem={formItem} />
                </>
              )}
            </DataTable.Consumer>

            <DataTable.Pagination />
          </div>
        </div>
      </DataTable>
    </Card>
  );
}
