import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  PricePolicy,
  PricePolicyService,
  PRICE_POLICY_ADJUST_UNITS,
} from "../../../lib/repo/price-policy.repo";
import { Field, Input, Switch } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { PricePolicySlideout } from "./components/price-policy-slideout";

export function PricePolicyPage() {
  const router = useRouter();
  const [pricePolicyId, setPricePolicyId] = useState(null);

  useEffect(() => {
    if (router.query["id"]) {
      setPricePolicyId(router.query["id"]);
    } else {
      setPricePolicyId(null);
    }
  }, [router.query]);

  return (
    <Card>
      <DataTable<PricePolicy>
        crudService={PricePolicyService}
        updateItem={(item) => {
          router.replace({ pathname: location.pathname, query: { id: item.id } });
        }}
        order={{ createdAt: -1 }}
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
        </DataTable.Toolbar>

        <DataTable.Consumer>
          {({ changeRowData, formItem }) => (
            <>
              <DataTable.Table className="mt-4">
                <DataTable.Column
                  label="Bảng giá"
                  width={300}
                  render={(item: PricePolicy) => (
                    <DataTable.CellText value={item?.name} className="font-semibold" />
                  )}
                />
                <DataTable.Column
                  label="Đơn vị điều chỉnh"
                  width={150}
                  center
                  render={(item: PricePolicy) => (
                    <DataTable.CellStatus
                      options={PRICE_POLICY_ADJUST_UNITS}
                      value={item?.adjustUnit}
                      type="text"
                    />
                  )}
                />
                <DataTable.Column
                  center
                  label="Kích hoạt"
                  width={30}
                  render={(item: PricePolicy) => (
                    <DataTable.CellText
                      className="flex justify-center"
                      value={
                        <Switch
                          dependent
                          value={item.active}
                          onChange={async () => {
                            try {
                              const res = await PricePolicyService.update({
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
                  right
                  width={50}
                  render={(item: PricePolicy) => (
                    <>
                      <DataTable.CellButton value={item} isUpdateButton />
                      <DataTable.CellButton value={item} isDeleteButton />
                    </>
                  )}
                />
              </DataTable.Table>
            </>
          )}
        </DataTable.Consumer>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ loadAll }) => (
            <PricePolicySlideout pricePolicyId={pricePolicyId} onSubmit={() => loadAll(true)} />
          )}
        </DataTable.Consumer>
        <DataTable.Form
          grid
          afterSubmit={async (data, _, res) => {
            router.replace({ pathname: location.pathname, query: { id: res.id } });
          }}
        >
          <Field name="name" label="Tên bảng giá" required cols={12}>
            <Input autoFocus placeholder="Nhập tên bảng giá" />
          </Field>
        </DataTable.Form>
      </DataTable>
    </Card>
  );
}
