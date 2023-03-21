import Link from "next/link";
import { RiStore2Line } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { Product } from "../../../lib/repo/product.repo";
import { Img, StatusLabel } from "../utilities/misc";

type Props = {
  product: Product;
};

export function ProductItem({
  hasShop = true,
  className,
  ...props
}: Props & { hasShop?: boolean; className?: string }) {
  const { product } = props;

  return (
    <Link href={`/store/${product?.member?.code}/product/${product?.code}`}>
      <a className="flex flex-col justify-between shrink-0 grow-0 flex-1 p-2 lg:p-3.5 xl:p-5 bg-white border border-blue-100 rounded-md hover:border-primary">
        <div className={`flex flex-col justify-between h-full ${className}`}>
          <div className="">
            <Img
              src={product?.image}
              className="object-cover w-full mx-auto border border-gray-100 rounded-md shadow-sm"
            />
            <div className="mt-2 text-sm font-semibold leading-6 whitespace-normal min-h-12 text-accent text-ellipsis-2 md:text-base">
              {product?.name}
            </div>
          </div>

          <div className="">
            {/* <div className="flex flex-row items-center">
              {<ShowRating rating={product?.rating} />}
            </div> */}
            {!!product.labels.length && (
              <div className="flex flex-wrap gap-1 mt-1">
                {product.labels.map((label, index) => (
                  <StatusLabel
                    value={label.id}
                    label={label.name}
                    style={{
                      backgroundColor: label.color,
                    }}
                    key={index}
                  />
                ))}
              </div>
            )}
            {hasShop && (
              <div className="flex flex-row items-center mt-1 mb-2 text-xs font-semibold text-primary">
                <RiStore2Line />
                <span className="ml-1">{product?.member?.shopName}</span>
              </div>
            )}
            <div className="flex flex-row flex-wrap mt-1 md:items-center sm:flex-col md:flex-row">
              <div className="mr-3 text-sm font-semibold text-primary text-ellipsis-1 md:text-base">
                {parseNumber(product?.basePrice)}đ
              </div>
              {product.downPrice > 0 && product.downPrice > product?.basePrice && (
                <div className="text-sm text-gray-400 line-through text-ellipsis-1 md:text-base">
                  {parseNumber(product?.downPrice)}đ{" "}
                </div>
              )}
            </div>
            {/* <div className="flex flex-row items-center text-xs">
              <span>
                <FiShoppingBag />
              </span>
              <div className="ml-1 text-accent">
                Đã bán {product?.soldQty > 0 ? `${parseNumber(product?.soldQty)}+` : 0}
              </div>
            </div> */}
          </div>
        </div>
      </a>
    </Link>
  );
}
