import { Tab, TabService } from "../../../../lib/repo/tab.repo";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog";
import { Field, Input } from "../../../shared/utilities/form";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends DialogProps {}
export function TabTableDialog({ ...props }: PropsType) {
  const { isShop } = useProductsContext();

  return (
    <Dialog {...props}>
      <Dialog.Body>
        <DataTable<Tab>
          crudService={TabService}
          order={{ priority: -1 }}
          title="Danh sách tab thông tin sản phẩm"
          limit={9999999}
        >
          <div className="flex flex-row items-center justify-between">
            <DataTable.Consumer>
              {({ pagination: { total } }) => (
                <DataTable.Title subtitle={`Tổng ${total} tab thông tin sản phẩm`} />
              )}
            </DataTable.Consumer>

            <DataTable.Buttons>
              <DataTable.Button
                isRefreshButton
                refreshAfterTask
                light
                textPrimary
                className="w-12 h-12 bg-white"
              />
              {isShop && (
                <DataTable.Button
                  primary
                  isCreateButton
                  className="h-12"
                  text="Thêm tab thông tin"
                />
              )}
            </DataTable.Buttons>
          </div>

          <DataTable.Table className="mt-4 bg-white">
            <DataTable.Column
              label="Tab thông tin sản phẩm"
              render={(item: Tab) => <DataTable.CellText value={item.name} />}
            />
            <DataTable.Column
              center
              label="Độ ưu tiên"
              orderBy="priority"
              render={(item: Tab) => (
                <DataTable.CellText className="text-center" value={item.priority} />
              )}
            />
            <DataTable.Column
              className={`${!isShop && "hidden"}`}
              right
              render={(item: Tab) => (
                <>
                  <DataTable.CellButton value={item} isUpdateButton />
                  <DataTable.CellButton hoverDanger value={item} isDeleteButton />
                </>
              )}
            />
          </DataTable.Table>
          <DataTable.Form width="400px">
            <Field label="Tên tab thông tin sản phẩm" name="name" required>
              <Input />
            </Field>
            <Field label="Độ ưu tiên" name="priority">
              <Input type="number" />
            </Field>
          </DataTable.Form>
          {/* <DataTable.Pagination /> */}
        </DataTable>
      </Dialog.Body>
    </Dialog>
  );
}
