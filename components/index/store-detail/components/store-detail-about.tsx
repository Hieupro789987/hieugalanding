import { useShopContext } from "../../../../lib/providers/shop-provider";

type Props = {};

export function StoreDetailAbout({}: Props) {
  const { shop } = useShopContext();

  return (
    <div className="my-8 p-6 bg-white rounded shadow-sm">
      <div className="text-2xl font-semibold">Giới thiệu về {shop.shopName}</div>

      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: shop?.config?.intro,
        }}
      ></div>
    </div>
  );
}
