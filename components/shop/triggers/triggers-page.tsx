import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiOutlineBell } from "react-icons/hi";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { Mention, MentionsInput } from "react-mentions";
import { useShopLayoutContext } from "../../../layouts/shop-layout/providers/shop-layout-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { SHOP_BANNER_ACTIONS } from "../../../lib/repo/shop-config.repo";
import { TriggerGroup, TriggerGroupService } from "../../../lib/repo/trigger-group.repo";
import {
  TriggerEvent,
  TriggerAction,
  Trigger,
  TriggerService,
  TRIGGER_ACTION_TYPES,
} from "../../../lib/repo/trigger.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Slideout } from "../../shared/utilities/dialog/slideout";
import { Switch } from "../../shared/utilities/form";
import { Button } from "../../shared/utilities/form/button";
import { Checkbox } from "../../shared/utilities/form/checkbox";
import { Field } from "../../shared/utilities/form/field";
import { Form, FormProps } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Label } from "../../shared/utilities/form/label";
import { Select } from "../../shared/utilities/form/select";
import { List } from "../../shared/utilities/list";
import { Card, NotFound, Scrollbar } from "../../shared/utilities/misc";
import { TabGroup } from "../../shared/utilities/tab/tab-group";
import { DataTable } from "../../shared/utilities/table/data-table";
import { MentionTextarea, TriggerForm } from "./components/trigger-form";
import { TriggerSettings } from "./components/trigger-settings";
import { SmaxbotProvider, useSmaxbotContext } from "./providers/smaxbot-provider";
import { TriggersProvider, useTriggersContext } from "./providers/triggers-provider";

export function TriggersPage() {
  return (
    <TriggersProvider>
      <SmaxbotProvider>
        <TabGroup
          tabsClassName="bg-transparent"
          tabClassName="pb-3 px-3"
          bodyClassName="mt-3"
          flex={false}
          autoHeight
          name="trigger"
        >
          <TabGroup.Tab label="Danh sách chiến dịch">
            <Card>
              <TriggerDataTable />
            </Card>
          </TabGroup.Tab>
          <TabGroup.Tab label="Cấu hình">
            <TriggerSettings />
          </TabGroup.Tab>
        </TabGroup>
      </SmaxbotProvider>
    </TriggersProvider>
  );
}
function TriggerDataTable() {
  const { subEvents } = useTriggersContext();
  const [selectedTriggerGroup, setSelectedTriggerGroup] = useState<TriggerGroup>();
  const [triggerGroups, setTriggerGroups] = useState<TriggerGroup[]>();

  return (
    <DataTable<Trigger>
      crudService={TriggerService}
      order={{ updatedAt: -1 }}
      filter={{ triggerGroupId: selectedTriggerGroup?.id }}
      fetchingCondition={!!selectedTriggerGroup}
    >
      <div className="flex gap-3">
        <div className="w-56 shrink-0 grow-0">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <List<TriggerGroup>
                crudService={TriggerGroupService}
                selectedItem={selectedTriggerGroup}
                onSelect={(item) => setSelectedTriggerGroup(item)}
                hasAll={false}
                onChange={() => {
                  loadAll(true);
                }}
                renderItem={(item, selected) => (
                  <>
                    <div
                      className={`font-semibold text-sm ${
                        selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600 break-all">{item.description}</div>
                  </>
                )}
                onLoadItems={(items) => setTriggerGroups(items)}
              >
                <List.Form>
                  <Field name="name" label="Tên nhóm trigger" required cols={12}>
                    <Input autoFocus />
                  </Field>
                  <Field name="description" label="Mô tả" cols={12}>
                    <Input />
                  </Field>
                </List.Form>
              </List>
            )}
          </DataTable.Consumer>
        </div>

        {selectedTriggerGroup ? (
          <div className="flex-1">
            <DataTable.Header>
              <ShopPageTitle title="Trigger" subtitle="Danh sách Trigger" />
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

            <DataTable.Table className="mt-4 bg-white">
              <DataTable.Column
                label="Trigger"
                render={(item: Trigger) => (
                  <DataTable.CellText
                    className="font-semibold"
                    value={item.name}
                    subText={item.code}
                  />
                )}
              />
              <DataTable.Column
                center
                label="Sự kiện"
                render={(item: Trigger) => (
                  <DataTable.CellText value={subEvents?.find((x) => x.id == item.event)?.name} />
                )}
              />
              <DataTable.Column
                center
                label="Các nền tảng"
                render={(item: Trigger) => (
                  <DataTable.CellText
                    value={
                      item.actions
                        ? item.actions
                            .map(
                              (item) =>
                                TRIGGER_ACTION_TYPES.find((x) => x.value == item.type)?.label
                            )
                            .join(", ")
                        : "Không có"
                    }
                  />
                )}
              />
              <DataTable.Column
                right
                render={(item: Trigger) => (
                  <>
                    <DataTable.CellButton value={item} isUpdateButton />
                    <DataTable.CellButton value={item} isDeleteButton />
                  </>
                )}
              />
            </DataTable.Table>
            <DataTable.Pagination />
            <DataTable.Consumer>
              {({ loadAll, formItem, setFormItem }) => (
                <TriggerForm
                  triggerGroupId={selectedTriggerGroup?.id}
                  triggerGroups={triggerGroups}
                  trigger={formItem}
                  isOpen={!!formItem}
                  onClose={() => setFormItem(undefined)}
                  onSubmit={async (data) => {
                    await TriggerService.createOrUpdate({ id: formItem.id, data });
                    loadAll();
                    setFormItem(undefined);
                  }}
                />
              )}
            </DataTable.Consumer>
          </div>
        ) : (
          <NotFound text="Chưa chọn nhóm chiến dịch" />
        )}
      </div>
    </DataTable>
  );
}
