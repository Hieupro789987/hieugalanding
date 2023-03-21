import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiCloseFill } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { Checkbox, Form } from "../../../shared/utilities/form";
import { Card, Img, NotFound, Scrollbar, Spinner } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { usePricePolicyDetailContext } from "../providers/price-policy-detail-provider";
import { QuantityMatrix } from "./quantity-matrix";

export function PricePolicyProductsTab(props) {
  const { pricePolicy } = usePricePolicyDetailContext();
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const toast = useToast();
  const alert = useAlert();

  return (
    <div className="p-6">
      <DataTable<Product>
        crudService={ProductService}
        order={{ createdAt: -1 }}
        limit={0}
        filter={{ pricePolicyId: pricePolicy.id }}
      >
        <DataTable.Header>
          <DataTable.Title>Danh sách sản phẩm thuộc bảng giá</DataTable.Title>
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button
              primary
              isCreateButton
              text={"Thêm sản phẩm áp dụng"}
              onClick={() => setOpenAddProductDialog(true)}
            />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search placeholder="Nhập tên sản phẩm" />
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Sản phẩm"
            render={(item: Product) => (
              <DataTable.CellText
                value={item?.name + " - " + parseNumber(item?.basePrice, true)}
                image={item?.image}
                imageClassName="self-start w-20"
                className="mb-1 text-base font-semibold"
                subText={
                  <QuantityMatrix
                    basePrice={item.basePrice}
                    unit={pricePolicy.adjustUnit}
                    qtyMatrixes={pricePolicy.qtyMatrix}
                  />
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Product) => (
              <>
                <DataTable.CellButton
                  value={item}
                  refreshAfterTask
                  icon={<RiCloseFill />}
                  onClick={async () => {
                    if (
                      !(await alert.warn(
                        "Xoá sản phẩm khỏi bảng giá",
                        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi bảng giá?"
                      ))
                    )
                      return;

                    await ProductService.update({ id: item.id, data: { pricePolicyId: null } });
                  }}
                />
              </>
            )}
          />
        </DataTable.Table>
        <Form
          width={550}
          dialog
          defaultValues={{ productIds: [] as string[] }}
          allowResetDefaultValues
          extraBodyClass="px-0 py-0"
          isOpen={openAddProductDialog}
          onClose={() => {
            setOpenAddProductDialog(false);
          }}
          title="Thêm sản phẩm áp dụng"
          onSubmit={async (data) => {
            if (data.productIds.length) {
              await ProductService.mutate({
                mutation: data.productIds.map((id) =>
                  ProductService.updateQuery({ id, data: { pricePolicyId: pricePolicy.id } })
                ),
              })
                .then((res) => {
                  toast.success("Thêm sản phẩm áp dụng thành công");
                  setOpenAddProductDialog(false);
                })
                .catch((err) => {
                  toast.error("Thêm sản phẩm áp dụng thất bại");
                });
            } else {
              toast.info("Cần chọn ít nhất một sản phẩm");
            }
          }}
        >
          <Scrollbar innerClassName="p-4" height={600}>
            <ApplyingProducts pricePolicyId={pricePolicy.id} />
          </Scrollbar>
          <Form.Footer className="p-4 pt-3 border-t" />
        </Form>

        {/* <DataTable.Pagination /> */}
      </DataTable>
    </div>
  );
}

function ApplyingProducts({ pricePolicyId }: { pricePolicyId: string }) {
  const [selectedProductIds, setSelectedProductIds] = useState({});
  const { register, setValue } = useFormContext();
  const productCrud = useCrud(
    ProductService,
    {
      filter: { pricePolicyId: { $ne: pricePolicyId } },
    },
    {
      fragment: `id name basePrice image pricePolicyId  pricePolicy { id name }`,
    }
  );

  register("productIds");
  useEffect(() => {
    setValue(
      "productIds",
      Object.keys(selectedProductIds).filter((id) => selectedProductIds[id])
    );
  }, [selectedProductIds]);

  return (
    <>
      {productCrud.items ? (
        <>
          {!!productCrud.items.length ? (
            <div className="flex flex-col gap-2 divide-y">
              {productCrud.items.map((product, index) => (
                <div className={`${index > 0 ? "pt-2" : ""}`} key={product.id}>
                  <div
                    className="flex p-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedProductIds({
                        ...selectedProductIds,
                        [product.id]: !selectedProductIds[product.id],
                      });
                    }}
                  >
                    <Img className="w-12 bg-white border" rounded src={product.image} />
                    <div className="flex-1 pl-3">
                      <div className="font-semibold">{product.name}</div>
                      <div className="">{parseNumber(product.basePrice, true)}</div>
                      {product.pricePolicy && (
                        <div className="text-gray-600">
                          Thuộc bảng giá:{" "}
                          <strong className="font-medium text-primary">
                            {product.pricePolicy.name}
                          </strong>
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none">
                      <Checkbox value={selectedProductIds[product.id]} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NotFound text="Không có sản phẩm nào để áp dụng" />
          )}
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
}
