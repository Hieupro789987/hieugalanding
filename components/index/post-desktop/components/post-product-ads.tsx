import { ProductItem } from "../../../shared/common/product-item";
import { useShopsContext } from "../../shops/providers/shops-provider";

export function PostProductAds({ ...props }) {
  const { products } = useShopsContext();

  return (
    <div className="gap-6 flex-cols w-60 shrink-0 grow-0">
      {products.slice(0, 3).map((item, index) => {
        return <ProductItem product={item} key={index} />;
      })}
    </div>
  );
}
