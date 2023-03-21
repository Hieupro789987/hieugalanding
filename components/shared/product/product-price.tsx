import { parseNumber } from "../../../lib/helpers/parser";
interface Propstype extends ReactProps {
  price: string | number;
  priceClassName?: string | number;
  downPrice?: string | number;
  saleRate?: string | number;
  isDownLine?: boolean;
}

export function ProductPrice({
  className = "",
  priceClassName = "",
  downPrice,
  saleRate,
  isDownLine = false,
  ...props
}: Propstype) {
  return (
    <div
      className={`flex ${className} ${
        isDownLine ? "flex-col" : "items-center gap-2"
      } text-xs md:text-sm`}
    >
      <div className={`font-semibold text-primary ${priceClassName}`}>
        {parseNumber(props.price, true)}
      </div>
      {(downPrice && (
        <span className={`line-through text-gray-400`}>{parseNumber(downPrice, true)}</span>
      )) ||
        ""}
      {saleRate > 0 && (
        <div className="px-1 py-0.5 text-xs font-bold text-white rounded bg-danger">
          {-saleRate}%
        </div>
      )}
    </div>
  );
}
