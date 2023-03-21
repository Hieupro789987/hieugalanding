import Link from "next/link";
import React from "react";
import { PublicShop } from "../../../../lib/repo/shop.repo";
import { ProductRating } from "../../../shared/product/product-rating";
import { Img } from "../../../shared/utilities/misc";
interface Props extends ReactProps {
  shop: PublicShop;
}
export function ShopCard({ shop, className = "", ...props }: Props) {
  return (
    <Link href={`/store/${shop.shopCode}`}>
      <a className={`flex py-3 group ${className}`}>
        <Img
          src={shop?.coverImage}
          className="w-20 border border-gray-100 rounded-sm shadow-sm sm:w-24"
        />
        <div className="flex flex-col flex-1 pt-0.5 pl-3">
          <div className="font-semibold text-ellipsis-2 group-hover:text-primary">{shop.name}</div>
          <ProductRating rating={shop.rating} distance={shop.distance} />
        </div>
      </a>
    </Link>
  );
}
