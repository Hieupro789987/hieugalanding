import { RiCloseLine } from "react-icons/ri";
import { Product } from "../../../../../lib/repo/product.repo";
import { Button, Label } from "../../../utilities/form";
import { Img } from "../../../utilities/misc";
import { QuestionWrapper } from "../question-content-wrapper";

interface QuestionSuggestProductsProps extends ReactProps {
  suggestedProductList: Product[];
  isEdit?: boolean;
  onDelete?: (product: Product) => void;
  onDeleteAll?: () => void;
}

export function QuestionSuggestProducts({
  suggestedProductList,
  isEdit = false,
  onDelete,
  onDeleteAll,
  ...props
}: QuestionSuggestProductsProps) {
  return (
    <>
      <div className="flex gap-2">
        <Label text="Sản phẩm gợi ý" className="w-auto text-base" />
        {isEdit && (
          <Button
            text="Xóa hết"
            hoverDanger
            className="-mt-1 text-sm underline cursor-pointer text-slate-500"
            onClick={() => onDeleteAll?.()}
          />
        )}
      </div>
      <div className="flex flex-wrap items-stretch gap-1.5 lg:gap-x-5 lg:gap-y-4">
        {suggestedProductList.map((product) => (
          <QuestionWrapper
            key={product.id}
            targetBlank
            href={isEdit ? null : `/store/${product?.member?.code}/product/${product?.code}`}
          >
            <div
              className={`relative w-28 p-2 bg-white border rounded cursor-pointer border-slate-300 ${
                !isEdit && "lg:hover:border-primary"
              }`}
            >
              <div className="w-auto group">
                <Img
                  lazyload={false}
                  src={product.image}
                  className="w-20 border border-gray-200 rounded-md lg:w-24"
                  alt={`${product.name}-image`}
                />
                {isEdit && (
                  <i
                    onClick={() => onDelete?.(product)}
                    data-tooltip="Xóa"
                    data-placement="top"
                    className="absolute cursor-pointer p-0.5 rounded-full -top-2 -right-2 bg-white lg:hover:bg-danger-dark lg:hover:text-white text-lg text-border-500 border border-slate-300 shadow-xl opacity-100"
                  >
                    <RiCloseLine />
                  </i>
                )}
              </div>
              <div className="mt-1 text-sm text-ellipsis-2 min-h-10">{product.name}</div>
            </div>
          </QuestionWrapper>
        ))}
      </div>
    </>
  );
}
