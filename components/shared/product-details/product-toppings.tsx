import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
} from "react-icons/md";
import { parseNumber } from "../../../lib/helpers/parser";
import { ProductTopping, ToppingOption } from "../../../lib/repo/product-topping.repo";
import { Checkbox } from "../utilities/form";
import { useProductDetailsContext } from "./product-details-provider";

export function ProductToppings({
  className = "",
  ...props
}: ReactProps & { optionsClassName?: string }) {
  const { product } = useProductDetailsContext();
  return (
    <div className={`${className}`}>
      {Array.isArray(product.toppings) &&
        product?.toppings?.map(
          (topping) =>
            topping.options.length > 0 && <ProductToppingItem topping={topping} key={topping.id} />
        )}
    </div>
  );
}

interface Props extends ReactProps {
  topping: ProductTopping;
}
function ProductToppingItem({ topping }: Props) {
  const { onToppingOptionClick } = useProductDetailsContext();
  return (
    <>
      <div className="pt-3">
        <div className="mb-1 text-base font-extrabold text-accent">{`Chọn ${topping.name}`}</div>
        {topping.max == 0 && <div className="text-xs text-accent">Có thể chọn nhiều lựa chọn</div>}
        {topping.max > 1 && (
          <div className="text-xs text-accent">Có thể chọn tối đa {topping.max} lựa chọn</div>
        )}
      </div>
      {topping.options.map((option, index) => {
        return (
          <ProductToppingOption
            option={option}
            multiple={topping.max == 0 || topping.max > 1}
            className={`${index < topping.options.length - 1 ? "xl:border-b" : ""}`}
            key={index}
            onClick={() => {
              onToppingOptionClick(option, topping);
            }}
          />
        );
      })}
    </>
  );
}

interface ToppingOptionProps {
  option: ToppingOption;
  multiple: boolean;
  onClick?: () => void;
}
function ProductToppingOption({
  className = "",
  multiple,
  option,
  onClick,
}: ToppingOptionProps & ReactProps) {
  return (
    <div
      key={option.name}
      className={`pr-2 flex items-center justify-between border-gray-100 cursor-pointer hover:bg-gray-100 rounded ${className}`}
      onClick={onClick}
    >
      <Checkbox
        value={option.selected}
        className={`pointer-events-none transform translate-y-0.5`}
        checkedIcon={multiple ? <MdCheckBox /> : <MdRadioButtonChecked />}
        uncheckedIcon={multiple ? <MdCheckBoxOutlineBlank /> : <MdRadioButtonUnchecked />}
        placeholder={option.name}
      />
      <div className="text-sm font-medium text-gray-700 min-w-max text-accent">
        {parseNumber(option.price)}đ
      </div>
    </div>
  );
}
