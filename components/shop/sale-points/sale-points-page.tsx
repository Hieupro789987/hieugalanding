import { useEffect, useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { SHOP_TYPE_LIST } from "../../../lib/repo/member.repo";
import { Shop, ShopService } from "../../../lib/repo/shop.repo";
import { Card, Spinner } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { Table } from "../../shared/utilities/table/table";

export function SalePointsPage() {
  const toast = useToast();
  const [salePointList, setSalePointList] = useState<Shop[]>();

  useEffect(() => {
    (async () => {
      try {
        const res = await ShopService.getShopData();
        setSalePointList(res.salePoints);
      } catch (error) {
        console.log(error);
        toast.error("Lấy thông tin điểm bán thất bại. " + error.message);
      }
    })();
  }, []);

  if (!salePointList) return <Spinner />;

  return (
    <Card>
      <div className="text-lg font-semibold text-gray-800 mb-4">Danh sách điểm bán</div>
      <Table items={salePointList} disableDbClick>
        <Table.Column
          label="Cửa hàng"
          render={(item: Shop) => (
            <DataTable.CellText
              image={item.shopLogo}
              value={item.shopName}
              subText={
                <div className="flex flex-col items-start">
                  <div className="font-semibold text-primary hover:underline">{item.code}</div>
                  {item.category && (
                    <div className="inline-block p-1 mt-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded">
                      {item.category.name}
                    </div>
                  )}
                </div>
              }
            />
          )}
        />
        <Table.Column
          label="Người đại diện"
          render={(item: Shop) => (
            <DataTable.CellText value={item.name} subText={item.phone} className="font-semibold" />
          )}
        />
        <Table.Column
          label="Email đăng nhập"
          render={(item: Shop) => <DataTable.CellText value={item.username} />}
        />
        <Table.Column
          center
          label="Trạng thái"
          render={(item: Shop) => (
            <DataTable.CellStatus
              options={[
                { value: true, label: "Hoạt động", color: "success" },
                { value: false, label: "Đóng cửa", color: "slate" },
              ]}
              value={item.activated}
            />
          )}
        />
      </Table>
    </Card>
  );
}
