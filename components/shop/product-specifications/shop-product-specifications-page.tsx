import { SpecsTemplate, SpecsTemplateService } from "../../../lib/repo/specs-template.repo";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { ShopProductSpecificationDetailsDialog } from "./components/shop-product-specification-details-dialog";

interface ShopSpecsTemplatePageProps extends ReactProps {}

export function ShopSpecsTemplatePage({ ...props }: ShopSpecsTemplatePageProps) {
  return (
    <Card>
      <DataTable<SpecsTemplate> crudService={SpecsTemplateService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => (
              <DataTable.Title subtitle={`Tổng ${total} mẫu thông số sản phẩm`} />
            )}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button textPrimary outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <div className="mt-4">
          <DataTable.Toolbar>
            <DataTable.Search className="min-w-sm" />
          </DataTable.Toolbar>
        </div>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Tên mẫu thông số sản phẩm"}
            render={(item: SpecsTemplate) => <DataTable.CellText value={item.name} />}
          />
          <DataTable.Column
            right
            render={(item: SpecsTemplate) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <ShopProductSpecificationDetailsDialog />
      </DataTable>
    </Card>
  );
}
