import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useToast } from "../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../lib/repo/category.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { CategoryList } from "./components/category-list";
import { TabTableDialog } from "./components/product-tab-table-dialog";
import { ProductsContext, ProductsProvider } from "./providers/products-provider";

interface ProductsMenuProps {
  isShop?: boolean;
  isStaff?: boolean;
}

export function ProductsMenu({ isShop = false, isStaff = false, ...props }: ProductsMenuProps) {
  const toast = useToast();
  const [openCategory, setOpenCategory] = useState<Category>(undefined);
  // const [openLabelTableDialog, setOpenLabelTableDialog] = useState(false);
  const [openTabTableDialog, setOpenTabTableDialog] = useState(false);

  return (
    <>
      <ProductsProvider isShop={isShop} isStaff={isStaff}>
        <ProductsContext.Consumer>
          {({ loadCategories, filter, onFilterChange }) => (
            <>
              <div className="sticky z-10 flex items-center justify-between py-3 transition-all bg-gray-100 border-b border-gray-300 top-16">
                <ShopPageTitle
                  title="Danh mục sản phẩm"
                  subtitle="Quản lý danh mục và các sản phẩm thuộc danh mục"
                />
                <div className="flex gap-x-2">
                  <Select
                    className="inline-grid h-12 w-44"
                    clearable
                    placeholder="Tất cả trạng thái"
                    value={filter.allowSale}
                    onChange={(val) => {
                      if (val === true || val === false) {
                        onFilterChange({ allowSale: val });
                      } else {
                        onFilterChange({ allowSale: undefined });
                      }
                    }}
                    options={[
                      {
                        value: true,
                        label: "Đang mở bán",
                      },
                      {
                        value: false,
                        label: "Không mở bán",
                      },
                    ]}
                  />
                  {/* <Button
                    outline
                    className="h-12 bg-white"
                    text="Quản lý nhãn"
                    onClick={() => setOpenLabelTableDialog(true)}
                  /> */}
                  <Button
                    outline
                    className="h-12 bg-white"
                    text="Tab thông tin sản phẩm"
                    onClick={() => setOpenTabTableDialog(true)}
                  />
                  <Button
                    outline
                    className="w-12 h-12 px-0 bg-white"
                    icon={<HiOutlineRefresh />}
                    iconClassName="text-xl"
                    onClick={() => loadCategories(true)}
                  />
                  {isShop && (
                    <Button
                      primary
                      className="h-12"
                      text="Thêm danh mục"
                      onClick={() => setOpenCategory(null)}
                    />
                  )}
                </div>
              </div>
              <CategoryList
                onEditClick={(category) => setOpenCategory(category)}
                reload={loadCategories}
              />
              <Form
                grid
                dialog
                extraDialogClass="bg-transparent rounded-t-xl rounded-b-xl"
                extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
                extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
                defaultValues={openCategory}
                title={`${openCategory ? "Chỉnh sửa" : "Thêm"} danh mục`}
                isOpen={openCategory !== undefined}
                onClose={() => setOpenCategory(undefined)}
                onSubmit={async (data) => {
                  try {
                    await CategoryService.createOrUpdate({ id: openCategory?.id, data, toast });
                    setOpenCategory(undefined);
                    loadCategories();
                  } catch (err) {}
                }}
              >
                <Field name="name" label="Tên danh mục" cols={8} required>
                  <Input />
                </Field>
                <Field name="priority" label="Độ ưu tiên" cols={4}>
                  <Input number defaultValue={1} />
                </Field>
                <Form.Footer
                  className="justify-center"
                  cancelText=""
                  submitProps={{ className: "h-14 w-64" }}
                />
              </Form>
              <TabTableDialog
                width="793px"
                isOpen={openTabTableDialog}
                onClose={() => setOpenTabTableDialog(false)}
              />
            </>
          )}
        </ProductsContext.Consumer>
      </ProductsProvider>
      {/* <ProductLabelTableDialog
        width="650px"
        isOpen={openLabelTableDialog}
        onClose={() => setOpenLabelTableDialog(false)}
      /> */}
    </>
  );
}
