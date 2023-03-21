import { useMemo, useState } from "react";
import { RiBillLine, RiPhoneLine, RiWallet3Line } from "react-icons/ri";

import { parseNumber } from "../../../lib/helpers/parser";
import { useAuth } from "../../../lib/providers/auth-provider";
import { Driver, DRIVER_STATUS, DriverService } from "../../../lib/repo/driver.repo";
import { WalletLog } from "../../../lib/repo/wallet-log.repo";
import {
  WalletTransaction,
  WalletTransactionService,
  WALLET_TRANSACTION_TYPE_OPTIONS,
} from "../../../lib/repo/wallet/wallet-transaction.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { Field } from "../../shared/utilities/form/field";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Switch } from "../../shared/utilities/form/switch";
import { TabButtons } from "../../shared/utilities/tab/tab-buttons";
import { DataTable } from "../../shared/utilities/table/data-table";

export function WalletPage(props: ReactProps) {
  const [openOrders, setOpenOrders] = useState<string>("");
  const [type, setType] = useState("in");
  const { member } = useAuth();
  const filter = useMemo(
    () => ({ walletId: member.wallet.id, amount: { [type == "in" ? "$gt" : "$lt"]: 0 } }),
    [type]
  );

  return (
    <>
      <div className="flex pb-3 mb-3 border-b border-gray-300">
        <div className="flex flex-col justify-center h-16 px-4 bg-white border rounded shadow-sm min-w-3xs">
          <div className="text-sm font-medium">Ví tiền</div>
          <div className="flex items-center text-lg font-semibold text-yellow-500">
            <i className="mr-2 mb-0.5">
              <RiWallet3Line />
            </i>
            {parseNumber(member.wallet.balance)}đ
          </div>
        </div>
      </div>
      <DataTable<WalletLog>
        crudService={WalletTransactionService}
        order={{ createdAt: -1 }}
        filter={filter}
      >
        {/* <DataTable.Header>
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

        <DataTable.Divider /> */}

        <DataTable.Toolbar>
          <TabButtons
            tabClassName="px-3"
            value={type}
            onChange={setType}
            options={[
              { value: "in", label: "Tiền vào" },
              { value: "out", label: "Tiền ra" },
            ]}
          />
          <DataTable.Filter></DataTable.Filter>
          <DataTable.Button outline isRefreshButton refreshAfterTask className=" bg-white" />
        </DataTable.Toolbar>

        <DataTable.Consumer>
          {({ changeRowData, formItem }) => (
            <>
              <DataTable.Table className="mt-4 bg-white">
                <DataTable.Column
                  label="Ngày giao dịch"
                  width={200}
                  render={(item: WalletTransaction) => (
                    <DataTable.CellDate value={item.createdAt} />
                  )}
                />
                <DataTable.Column
                  label="Mã giao dịch"
                  width={200}
                  render={(item: WalletTransaction) => <DataTable.CellText value={item.code} />}
                />
                <DataTable.Column
                  label="Loại giao dịch"
                  width={200}
                  render={(item: WalletTransaction) => (
                    <DataTable.CellStatus
                      value={item.type}
                      options={WALLET_TRANSACTION_TYPE_OPTIONS}
                    />
                  )}
                />
                <DataTable.Column
                  label="Ghi chú"
                  width={200}
                  render={(item: WalletTransaction) => <DataTable.CellText value={item.note} />}
                />
                <DataTable.Column
                  label="Số tiền"
                  right
                  width={200}
                  render={(item: WalletTransaction) => (
                    <DataTable.CellNumber
                      value={item.amount}
                      className={`font-bold ` + (item.amount > 0 ? "text-success" : "text-accent")}
                    />
                  )}
                />
              </DataTable.Table>
            </>
          )}
        </DataTable.Consumer>
        <DataTable.Form
          extraDialogClass="bg-transparent"
          extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
          extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
          footerProps={{
            className: "justify-center",
            submitProps: { className: "h-14 w-64" },
            cancelText: "",
          }}
          grid
        >
          <Field name="name" label="Tên tài xế" cols={12} required>
            <Input />
          </Field>
          <Field name="phone" label="Số điện thoại" cols={6} required>
            <Input />
          </Field>
          <Field name="licensePlates" label="Biển số xe" cols={6}>
            <Input />
          </Field>
          <Field name="avatar" label="Avatar" cols={12}>
            <ImageInput avatar />
          </Field>
        </DataTable.Form>
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
