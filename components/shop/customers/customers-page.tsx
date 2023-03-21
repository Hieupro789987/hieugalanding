import { useMemo, useState } from "react";
import {
  RiBillLine,
  RiCheckLine,
  RiFileChartLine,
  RiHome3Line,
  RiPhoneLine,
  RiTicketLine,
  RiUserLine,
} from "react-icons/ri";
import { saveFile } from "../../../lib/helpers/file";
import { parseNumber } from "../../../lib/helpers/parser";
import { useToast } from "../../../lib/providers/toast-provider";
import { CustomerGroup } from "../../../lib/repo/customer-group.repo";
import { Customer, CustomerService } from "../../../lib/repo/customer.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Checkbox, Field } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { CustomerGroups } from "./components/customer-groups";
import { RewardPointLogDialog } from "./components/reward-point-log-dialog";
import { VouchersDialog } from "./components/vouchers-dialog";
import { ConditionProvider } from "./providers/condition-provider";

export function CustomersPage(props: ReactProps) {
  const toast = useToast();
  const [openCustomerOrder, setOpenCustomerOrder] = useState<string>("");
  const [openCustomerVouchers, setOpenCustomerVouchers] = useState<string>("");
  const [selectedCustomerGroup, setSelectedCustomerGroup] = useState<CustomerGroup>();
  const [rewardLog, setRewardLog] = useState<string>("");
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [isAgency, setIsAgency] = useState(false);
  const [isDistributor, setIsDistributor] = useState(false);

  const filter = useMemo(() => {
    let tempFilter = {};
    {
      /*Dữ liệu trả về đang bị lỗi do ko lọc được theo IsCollaborator nên lọc theo cách này*/
    }
    if (isCollaborator) tempFilter["collaboratorId"] = { $exists: true };
    if (isAgency) tempFilter["isAgency"] = isAgency;
    if (isDistributor) tempFilter["isDistributor"] = isDistributor;

    return tempFilter;
  }, [isCollaborator, isAgency, isDistributor]);

  const exportCustomerDialog = async () => {
    try {
      await saveFile(() => CustomerService.exportExcel(), "excel", `DANH_SACH_KHACH_HANG.xlsx`, {
        onError: (message) => toast.error("Xuất thất bại", message),
      });
    } catch (err) {}
  };

  const showCustomerTypeList = (customer: Customer) => {
    let typeArray = [];
    if (customer.isCollaborator) typeArray.push("CTV");
    if (customer.isAgency) typeArray.push("Đại lý");
    if (customer.isDistributor) typeArray.push("Nhà phân phối");

    return typeArray.join(", ");
  };

  return (
    <>
      <DataTable<Customer>
        crudService={CustomerService}
        order={{ createdAt: -1 }}
        extraParams={selectedCustomerGroup ? { groupId: selectedCustomerGroup.id } : null}
        apiName={selectedCustomerGroup ? "fetchCustomerGroup" : ""}
        filter={filter}
      >
        <DataTable.Header>
          <ShopPageTitle title="Khách hàng" subtitle="Khách hàng hệ thống" />
          <DataTable.Buttons>
            <DataTable.Button
              primary
              className="h-12"
              text="Xuất danh sách khách hàng"
              onClick={exportCustomerDialog}
            />
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="w-12 h-12 bg-white"
            />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <div className="flex items-start mt-4 gap-x-3">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <Card className="w-72">
                <ConditionProvider>
                  <CustomerGroups
                    customerGroup={selectedCustomerGroup}
                    onCustomerGroupSelected={setSelectedCustomerGroup}
                    onCustomerGroupChange={() => {
                      setTimeout(() => {
                        loadAll(true);
                      }, 300);
                    }}
                  />
                </ConditionProvider>
              </Card>
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Toolbar>
              <DataTable.Search className="h-12" />
              <DataTable.Filter>
                <Field name="" className="mt-auto" noError>
                  <Checkbox
                    placeholder="CTV"
                    value={isCollaborator}
                    onChange={(val) => setIsCollaborator(val)}
                  />
                </Field>
                <Field name="" className="mt-auto" noError>
                  <Checkbox
                    placeholder="Đại lý"
                    value={isAgency}
                    onChange={(val) => setIsAgency(val)}
                  />
                </Field>
                <Field name="" className="mt-auto" noError>
                  <Checkbox
                    placeholder="Nhà phân phối"
                    value={isDistributor}
                    onChange={(val) => setIsDistributor(val)}
                  />
                </Field>
              </DataTable.Filter>
            </DataTable.Toolbar>
            <DataTable.Table className="mt-4 bg-white">
              <DataTable.Column
                label="Khách hàng"
                render={(item: Customer) => (
                  <DataTable.CellText
                    value={
                      <div className="flex font-semibold">
                        <i className="mr-1 text-lg">
                          <RiPhoneLine />
                        </i>
                        {item.phone}
                      </div>
                    }
                    subTextClassName="flex flex-col text-sm mt-1"
                    subText={
                      <>
                        <div className="flex">
                          <i className="mt-0.5 mr-2">
                            <RiUserLine />
                          </i>
                          {item.name || "Khách vãng lai"}
                        </div>
                        {item.followerId && (
                          <span className="flex rounded-sm text-info">
                            <i className="mt-0.5 mr-2">
                              <RiCheckLine />
                            </i>{" "}
                            Zalo
                          </span>
                        )}
                      </>
                    }
                  />
                )}
              />
              <DataTable.Column
                label="Đơn hàng"
                render={(item: Customer) => (
                  <DataTable.CellText
                    value={
                      <>
                        <div className="flex whitespace-nowrap">
                          <span className="w-28">Thành công:</span>
                          <span className="font-semibold text-success">
                            {parseNumber(item.orderStats?.completed)} đơn
                          </span>
                        </div>
                        <div className="flex whitespace-nowrap">
                          <span className="w-28">Đã huỷ:</span>
                          <span className="font-semibold text-danger">
                            {parseNumber(item.orderStats?.canceled)} đơn
                          </span>
                        </div>
                        <div className="flex whitespace-nowrap">
                          <span className="w-28">Tổng cộng:</span>
                          <span className="font-bold">
                            {parseNumber(item.orderStats?.total)} đơn
                          </span>
                        </div>
                      </>
                    }
                  />
                )}
              />
              <DataTable.Column
                label="Giảm giá"
                render={(item: Customer) => (
                  <DataTable.CellText
                    value={
                      <>
                        <div className="flex">
                          <i className="mr-1 text-base">
                            <RiTicketLine />
                          </i>
                          Số voucher dùng: {item.orderStats?.voucher}
                        </div>
                        <div className="flex">
                          <i className="mr-1 text-base">
                            <RiHome3Line />
                          </i>
                          Tổng giảm giá: {parseNumber(item.orderStats?.discount, true)}
                        </div>
                      </>
                    }
                  />
                )}
              />
              <DataTable.Column
                label="Vai trò"
                center
                render={(item: Customer) => (
                  <DataTable.CellText
                    value={<div className="text-sm">{showCustomerTypeList(item)}</div>}
                  />
                )}
              />
              <DataTable.Column
                right
                label="Điểm thưởng"
                render={(item: Customer) => (
                  <DataTable.CellNumber
                    currency
                    className="font-semibold text-primary-dark"
                    value={item.rewardPointStats.total}
                  />
                )}
              />
              <DataTable.Column
                right
                label="Tổng doanh số"
                render={(item: Customer) => (
                  <DataTable.CellNumber
                    currency
                    className="font-semibold text-primary-dark"
                    value={item.orderStats?.revenue}
                  />
                )}
              />
              <DataTable.Column
                right
                render={(item: Customer) => (
                  <>
                    <DataTable.CellButton
                      value={item}
                      moreItems={[
                        {
                          icon: <RiTicketLine />,
                          text: "Danh sách mã khuyến mãi",
                          onClick: () => {
                            setOpenCustomerVouchers(item.id);
                          },
                        },
                        {
                          icon: <RiBillLine />,
                          text: "Lịch sử đơn hàng",
                          onClick: () => {
                            setOpenCustomerOrder(item.id);
                          },
                        },
                        {
                          icon: <RiFileChartLine />,
                          text: "Lịch sử điểm thưởng",
                          onClick: () => {
                            setRewardLog(item.id);
                          },
                        },
                      ]}
                    />
                  </>
                )}
              />
            </DataTable.Table>
            <DataTable.Pagination />
          </div>
        </div>
      </DataTable>
      <OrdersDialog
        isOpen={!!openCustomerOrder}
        onClose={() => setOpenCustomerOrder("")}
        filter={openCustomerOrder ? { buyerId: openCustomerOrder } : null}
      />
      <VouchersDialog
        isOpen={!!openCustomerVouchers}
        onClose={() => setOpenCustomerVouchers("")}
        filter={openCustomerVouchers ? { customerId: openCustomerVouchers } : null}
      />
      <RewardPointLogDialog
        isOpen={!!rewardLog}
        onClose={() => setRewardLog("")}
        filter={rewardLog ? { customerId: rewardLog } : null}
      />
    </>
  );
}
