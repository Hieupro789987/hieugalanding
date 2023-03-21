import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiSearchLine } from "react-icons/ri";
import { CrudProps, useCrud } from "../../../../../lib/hooks/useCrud";
import { useOnScreen } from "../../../../../lib/hooks/useOnScreen";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Product, ProductService } from "../../../../../lib/repo/product.repo";
import { TitleDialog } from "../../../dialog/title-dialog";
import { Dialog, DialogProps } from "../../../utilities/dialog";
import { Button, Input } from "../../../utilities/form";
import { Img, NotFound, Scrollbar, Spinner } from "../../../utilities/misc";

interface QuestionSuggestProductsDialog extends DialogProps {
  suggestedProductIdList: string[];
  suggestedProductList: Product[];
  onSubmit: (selectedProductList: Product[]) => void;
}

export function QuestionSuggestProductsDialog({
  suggestedProductIdList,
  suggestedProductList,
  onSubmit,
  ...props
}: QuestionSuggestProductsDialog) {
  const toast = useToast();
  const [selectedProductIdList, setSelectedProductIdList] = useState<string[]>([]);
  const [selectedProductList, setSelectedProductList] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const productsCrud = useCrud(
    ProductService,
    {
      limit: 12,
      order: {
        createdAt: -1,
      },
      search,
    },
    {
      fetchingCondition: props.isOpen,
    }
  );

  const handleAddProduct = (selectedProduct: Product) => {
    if (!selectedProduct) return;

    if (selectedProductList.length >= 10) {
      toast.info(
        `Thêm sản phẩm [${selectedProduct.name}] thất bại!`,
        "Bạn chỉ có thể chọn tối đa 10 sản phẩm."
      );
      return;
    }

    const index = selectedProductList.findIndex((product) => product.id === selectedProduct.id);
    if (index >= 0) {
      toast.info(`Thêm sản phẩm [${selectedProduct.name}] thất bại!`, "Sản phẩm đã được thêm rồi.");
      return;
    }

    const newSelectedProductIdList = [...selectedProductIdList];
    newSelectedProductIdList.push(selectedProduct.id);
    const newSelectedProductList = [...selectedProductList];
    newSelectedProductList.push(selectedProduct);
    setSelectedProductIdList(newSelectedProductIdList);
    setSelectedProductList(newSelectedProductList);
  };

  const handleChangeSelectedProductList = async (changedProduct: Product) => {
    if (!changedProduct || selectedProductList.length === 0) return;

    let newSelectedProductIdList = [...selectedProductIdList];
    newSelectedProductIdList = newSelectedProductIdList.filter((id) => id !== changedProduct.id);
    setSelectedProductIdList(newSelectedProductIdList);
    let newSelectedProductList = [...selectedProductList];
    newSelectedProductList = newSelectedProductList.filter(
      (product) => product.id !== changedProduct.id
    );
    setSelectedProductList(newSelectedProductList);
    toast.success(`Xóa sản phẩm [${changedProduct.name}] khỏi danh sách chọn thành công!`);
  };

  useEffect(() => {
    setSelectedProductIdList(suggestedProductIdList);
    setSelectedProductList(suggestedProductList);
  }, [suggestedProductIdList, suggestedProductList, props.isOpen]);

  return (
    <Dialog width={660} className="text-accent" {...props}>
      <Dialog.Body>
        <TitleDialog onClose={props.onClose} title="Sản phẩm gợi ý" />
        <Input
          placeholder="Tìm kiếm sản phẩm"
          className="w-96 my-4 py-0.5 mx-2.5 lg:mx-0 text-accent"
          debounce
          clearable
          prefix={
            <i className="text-lg font-semibold text-primary">
              <RiSearchLine />
            </i>
          }
          value={search}
          onChange={(val) => setSearch(val)}
        />
        <div className="w-full mb-2 text-accent">
          <ProductList
            productsCrud={productsCrud}
            onAddProduct={handleAddProduct}
            selectedProductIdList={selectedProductIdList}
          />
        </div>
        <SelectedProductList
          selectedProductList={selectedProductList}
          onChange={handleChangeSelectedProductList}
        />
        <div className="mt-4 text-right">
          <Button large text="Hủy" hoverDanger onClick={props.onClose} />
          <Button
            large
            primary
            text="Xác nhận"
            className="w-32 ml-4"
            onClick={() => {
              onSubmit?.(selectedProductList);
              setSelectedProductList([]);
              props.onClose();
            }}
          />
        </div>
      </Dialog.Body>
    </Dialog>
  );
}

interface ProductListProps extends ReactProps {
  productsCrud: CrudProps<Product>;
  onAddProduct: (product: Product) => void;
  selectedProductIdList: string[];
}

function ProductList({
  productsCrud,
  onAddProduct,
  selectedProductIdList,
  ...props
}: ProductListProps) {
  const { items, loading, hasMore, loadMore } = productsCrud;

  const ProductListContent = () => {
    const ref = useRef();
    const onScreen = useOnScreen(ref);

    useEffect(() => {
      if (onScreen && hasMore) {
        loadMore();
      }
    }, [onScreen]);

    if (!items) return <Spinner />;
    if (items.length === 0) return <NotFound text="Chưa có sản phẩm nào." />;

    return (
      <>
        <div className="grid w-full grid-cols-4 gap-4 pr-3 min-h-96 auto-rows-fr">
          {productsCrud.items.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onAddProduct={onAddProduct}
              selectedProductIdList={selectedProductIdList}
            />
          ))}
        </div>
        {loading ? (
          <div className="pt-3 font-semibold text-center loading-ellipsis text-primary">
            Tải thêm
          </div>
        ) : (
          <div className="h-2" ref={ref}></div>
        )}
      </>
    );
  };

  return (
    <Scrollbar hideTracksWhenNotNeeded height={"65vh"}>
      <ProductListContent />
    </Scrollbar>
  );
}

interface ProductItemProps extends ReactProps {
  product: Product;
  onAddProduct: (product: Product) => void;
  selectedProductIdList: string[];
}

function ProductItem({ product, onAddProduct, selectedProductIdList, ...props }: ProductItemProps) {
  const isSelected = selectedProductIdList?.some((id) => id === product?.id);

  return (
    <div
      className={`p-4 overflow-hidden border-2 rounded shadow-sm cursor-pointer lg:hover:bg-gray-200 ${
        isSelected ? "border-primary" : "border-gray-200"
      }`}
      onClick={() => onAddProduct?.(product)}
    >
      <Img
        lazyload={false}
        alt={`${product.name}-image`}
        src={product.image}
        className="border border-gray-100 rounded"
      />
      <div className="mt-2 font-semibold text-ellipsis-2">{product.name}</div>
    </div>
  );
}

interface SelectedProductListProps extends ReactProps {
  selectedProductList: Product[];
  onChange: (selectedProduct: Product) => void;
}

function SelectedProductList({
  selectedProductList,
  onChange,
  ...props
}: SelectedProductListProps) {
  return (
    <div className="py-4 border-gray-200 border-y text-accent">
      <div className="font-semibold">
        Sản phẩm đã chọn <span className="ml-1 font-normal">Tối đa 10 sản phẩm</span>
      </div>
      {selectedProductList.length === 0 ? (
        <NotFound text="Chưa chọn sản phẩm nào." />
      ) : (
        <div className="flex flex-wrap items-stretch gap-2.5 mt-4">
          {selectedProductList.map((product) => (
            <SelectedProductItem key={product.id} product={product} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectedProductItemProps extends ReactProps {
  product: Product;
  onChange: (selectedProduct: Product) => void;
}

function SelectedProductItem({ product, onChange, ...props }: SelectedProductItemProps) {
  return (
    <div className="relative w-24 group lg:w-28 flex-cols">
      <Img
        lazyload={false}
        src={product.image}
        className="w-24 border border-gray-200 rounded-md lg:w-28"
        alt={`${product.name}-image`}
      />
      <i
        onClick={() => onChange?.(product)}
        data-tooltip="Xóa"
        data-placement="top"
        className="absolute cursor-pointer p-0.5 rounded-full top-0.5 right-0.5 bg-white lg:hover:bg-danger-dark lg:hover:text-white text-lg text-border-500 border border-slate-300 shadow-xl opacity-100"
      >
        <RiCloseLine />
      </i>
      <div className="flex-1 mt-1 text-ellipsis-1">{product.name}</div>
    </div>
  );
}
