import { useCrud } from "../../../lib/hooks/useCrud";
import { ProductService } from "../../../lib/repo/product.repo";
import { Spinner } from "../utilities/misc";
import { ProductItem } from "./product-item";

export function ProductAds() {
  const { items, loading } = useCrud(ProductService, {
    limit: 3,
    order: {
      createdAt: -1,
    },
  });

  return (
    <div className="w-60 grow-0 shrink-0">
      {!items || loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <></>
      ) : (
        <div className="gap-6 flex-cols">
          {items.map((item, index) => {
            return <ProductItem product={item} key={index} />;
          })}
        </div>
      )}
    </div>
  );
}
