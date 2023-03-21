import Link from "next/link";
import { PublicShop } from "../../../../lib/repo/shop.repo";
import { Img } from "../../../shared/utilities/misc";

export function StoresItem({ shop, ...props }: { shop: PublicShop }) {
  return (
    <Link href={`/store/${shop?.shopCode}`}>
      <a>
        <div className="flex flex-col h-full px-2 pt-2 pb-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer lg:pt-5 lg:px-5 hover:border-primary">
          <Img src={shop?.coverImage} contain />
          <div className="h-auto mt-5 mb-1 text-sm font-bold text-center lg:text-base">
            {shop?.name}
          </div>
          {shop?.categoryNames?.length > 0 && (
            <div className="h-auto mt-auto text-xs text-center lg:text-sm text-ellipsis-2">
              {shop?.categoryNames?.join(", ")}
            </div>
          )}
        </div>
      </a>
    </Link>
  );
}
