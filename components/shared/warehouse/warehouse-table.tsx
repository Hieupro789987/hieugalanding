import { useCrud } from "../../../lib/hooks/useCrud";
import { useAuth } from "../../../lib/providers/auth-provider";
import { CategoryService } from "../../../lib/repo/category.repo";

import { ProductService } from "../../../lib/repo/product.repo";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import {
  WarehouseProduct,
  WarehouseProductService,
} from "../../../lib/repo/warehouse/product-warehouse.repo";
import { ShopPageTitle } from "../shop-layout/shop-page-title";
import { Field, Select } from "../utilities/form";
import { DataTable } from "../utilities/table/data-table";

export interface WarehouseProps {
  type: "staff" | "shop";
}

export function WarehouseTable({ type, ...props }: WarehouseProps) {
  const { staff } = useAuth();
  const { items } = useCrud(ShopBranchService, { limit: 0 });

  return (
    <DataTable<WarehouseProduct>
      crudService={WarehouseProductService}
      {...(type == "staff" ? { filter: staff ? { branchId: staff.branchId } : {} } : {})}
    >
      <DataTable.Header>
        <DataTable.Title />
      </DataTable.Header>
      <DataTable.Divider />
      <DataTable.Filter className="mb-4" defaultValues={{}}>
        <div className="flex flex-row justify-end gap-4">
          {type == "shop" && !!items && (
            <Field noError className="flex-1  max-w-[300px]" name="branchId">
              <Select
                placeholder="Chi nhánh"
                clearable
                optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
              />
            </Field>
          )}
          <Field noError name="categoryId" className="flex-1  max-w-[250px]">
            <Select
              placeholder="Danh mục"
              clearable
              optionsPromise={() => CategoryService.getAllOptionsPromise()}
            />
          </Field>
          <Field noError name="productId" className="flex-1  max-w-[250px]">
            <Select
              placeholder="Sản phẩm"
              clearable
              autocompletePromise={({ id, search }) =>
                ProductService.getAllAutocompletePromise(
                  { id, search },
                  {
                    fragment: "id name",

                    parseOption: (data) => ({
                      value: data.id,
                      label: data.name,
                    }),
                  }
                )
              }
            />
          </Field>
        </div>
      </DataTable.Filter>

      <DataTable.Table disableDbClick>
        <DataTable.Column
          label={"Tên sản phẩm"}
          render={(item: WarehouseProduct) => <DataTable.CellText value={item.product?.name} />}
        />
        <DataTable.Column
          label={"Chi nhánh"}
          render={(item: WarehouseProduct) => <DataTable.CellText value={item.branch?.name} />}
        />
        <DataTable.Column
          right
          label={"Tồn kho"}
          render={(item: WarehouseProduct) => <DataTable.CellText value={item.inStockCount} />}
        />
        <DataTable.Column
          right
          label={"Chờ xử lý"}
          render={(item: WarehouseProduct) => <DataTable.CellText value={item.inProcessCount} />}
        />
        <DataTable.Column
          right
          label={"Tổng tồn kho"}
          className={type == "shop" ? "" : "hidden"}
          render={(item: WarehouseProduct) => (
            <DataTable.CellText value={item.product?.totalInStockCount} />
          )}
        />
        <DataTable.Column
          right
          label={"Tổng chờ xử lý"}
          className={type == "shop" ? "" : "hidden"}
          render={(item: WarehouseProduct) => (
            <DataTable.CellText value={item.product?.totalInProcessCount} />
          )}
        />
      </DataTable.Table>
      <DataTable.Pagination itemName="Sản phẩm" />
    </DataTable>
  );
}
