import { useState } from "react";
import { ShopSaleFeed, ShopSaleFeedService } from "../../../lib/repo/shop-sale-feed.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Switch } from "../../shared/utilities/form/switch";
import { DataTable } from "../../shared/utilities/table/data-table";
import { SaleFeedForm } from "./components/sale-feed-form";

export function ShopSaleFeedsPage(props: ReactProps) {
  const [openOrders, setOpenOrders] = useState<string>("");

  return (
    <>
      <DataTable<ShopSaleFeed> crudService={ShopSaleFeedService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Bài đăng bán" subtitle="Quản lý danh sách bài đăng bán" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="w-12 h-12 bg-white"
            />
            <DataTable.Button primary isCreateButton className="h-12" />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12" />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Consumer>
          {({ changeRowData, formItem }) => (
            <>
              <DataTable.Table className="mt-4 bg-white">
                <DataTable.Column
                  label="Ngày đăng"
                  render={(item: ShopSaleFeed) => (
                    <DataTable.CellDate value={item.createdAt} format="HH:mm dd-MM-yyyy" />
                  )}
                />
                <DataTable.Column
                  label="Tên bài bán"
                  render={(item: ShopSaleFeed) => (
                    <DataTable.CellText value={item.name} className="font-semibold" />
                  )}
                />
                <DataTable.Column
                  label="Mô tả ngắn"
                  render={(item: ShopSaleFeed) => (
                    <DataTable.CellText value={item.snippet} className="max-w-xs text-ellipsis-3" />
                  )}
                />
                <DataTable.Column
                  center
                  label="Kích hoạt"
                  render={(item: ShopSaleFeed) => (
                    <DataTable.CellText
                      className="flex justify-center"
                      value={
                        <Switch
                          dependent
                          value={item.active}
                          onChange={async () => {
                            try {
                              const res = await ShopSaleFeedService.update({
                                id: item.id,
                                data: { active: !item.active },
                              });
                              changeRowData(item, "active", res.active);
                            } catch (err) {
                              changeRowData(item, "active", item.active);
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
                <DataTable.Column
                  center
                  label="Công khai"
                  render={(item: ShopSaleFeed) => (
                    <DataTable.CellText
                      className="flex justify-center"
                      value={
                        <Switch
                          dependent
                          value={item.isPublic}
                          onChange={async () => {
                            try {
                              const res = await ShopSaleFeedService.update({
                                id: item.id,
                                data: { isPublic: !item.isPublic },
                              });
                              changeRowData(item, "isPublic", res.isPublic);
                            } catch (err) {
                              changeRowData(item, "isPublic", item.isPublic);
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
                <DataTable.Column
                  right
                  render={(item: ShopSaleFeed) => (
                    <>
                      <DataTable.CellButton value={item} isUpdateButton />
                      <DataTable.CellButton value={item} isDeleteButton />
                    </>
                  )}
                />
              </DataTable.Table>
              <SaleFeedForm saleFeed={formItem} />
            </>
          )}
        </DataTable.Consumer>

        <DataTable.Pagination />
      </DataTable>
      <OrdersDialog
        mode="driver"
        isOpen={!!openOrders}
        onClose={() => setOpenOrders("")}
        filter={openOrders ? { driverId: openOrders } : null}
      />
    </>
  );
}
