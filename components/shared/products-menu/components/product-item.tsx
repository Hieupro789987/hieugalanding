import { RiDeleteBin6Line, RiQrCodeLine } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { Product } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Switch } from "../../../shared/utilities/form/switch";
import { Img } from "../../../shared/utilities/misc";
import { useProductsContext } from "../providers/products-provider";

interface PropsType extends ReactProps {
  product: Product;
  onClick: () => any;
  onDeleteClick: () => Promise<any>;
  onToggleClick: () => any;
  onShowQRCode: () => any;
}
export function ProductItem({ product, ...props }: PropsType) {
  const { isShop } = useProductsContext();

  return (
    <div
      className="flex items-center p-2 mb-3 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-primary group"
      onClick={props.onClick}
    >
      <Img src={product.image} compress={100} className="w-16 rounded-md" showImageOnClick />
      <div className="flex-1 pl-3">
        <div className="flex flex-wrap items-center text-lg font-semibold text-gray-800 group-hover:text-primary">
          {product.name}
          {product.labels?.map((label, index) => (
            <div
              className="inline-flex items-center px-2 py-1 ml-2 text-xs font-semibold text-white rounded-full cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: label.color }}
              key={label.id}
            >
              <span>{label.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center text-gray-600">{product.productCode}</div>
        {isShop && <div className="text-sm text-gray-600">{product.subtitle}</div>}
      </div>
      <div className="px-4 font-semibold text-right text-gray-700">
        <div>{parseNumber(product.basePrice, true)}</div>
        {product.downPrice > 0 && (
          <div className="flex items-center font-medium text-gray-400">
            {!!product.saleRate && (
              <span className="inline-block bg-danger text-white text-sm font-bold py-0.5 px-2 rounded mr-2">
                -{product.saleRate}%
              </span>
            )}
            <span className="line-through">{parseNumber(product.downPrice, true)}</span>
          </div>
        )}
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        data-tooltip="Mở bán sản phẩm"
        data-placement="top-center"
      >
        <Switch
          className="px-4"
          value={product.allowSale || false}
          onChange={props.onToggleClick}
          {...(!isShop && { readOnly: true })}
        />
      </div>
      <Button
        icon={<RiQrCodeLine />}
        hoverInfo
        className="px-3"
        iconClassName="text-lg"
        onClick={async (e) => {
          e.stopPropagation();
          props.onShowQRCode();
        }}
      />
      {isShop && (
        <Button
          icon={<RiDeleteBin6Line />}
          hoverDanger
          className="px-3"
          iconClassName="text-lg"
          onClick={async (e) => {
            e.stopPropagation();
            await props.onDeleteClick();
          }}
        />
      )}
    </div>
  );
}
