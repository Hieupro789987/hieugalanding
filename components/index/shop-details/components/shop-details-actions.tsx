import Link from "next/link";
import { useState } from "react";
import { BiPurchaseTag, BiStar } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { ShopDetailsCommentsDialog } from "./shop-details-comments-dialog";

export function ShopDetailsActions() {
  const { shop, shopCode } = useShopContext();
  const [openComments, setOpenComments] = useState(false);

  return (
    <>
      <div className="flex justify-between px-3 bg-white border-b text-accent sm:px-6">
        <Link href={`/store/${shopCode}/promotion`}>
          <a className="flex items-center py-3 transition-all focus:outline-none group">
            <i className="text-xl mt-0.5 text-primary">
              <BiPurchaseTag />
            </i>
            <span className="pt-1 pl-2 pr-1 text-sm font-semibold text-accent sm:text-base group-hover:text-primary whitespace-nowrap">
              Khuyến mãi
            </span>
            <i className="pt-0.5 text-sm text-gray-500 group-hover:text-primary">
              <FaChevronRight />
            </i>
          </a>
        </Link>
        <button
          className="flex items-center py-3 transition-all group no-focus"
          onClick={() => setOpenComments(true)}
        >
          <i className="text-xl mt-0.5 text-primary">
            <BiStar />
          </i>
          <span className="pt-1 pl-2 pr-1 text-sm font-semibold text-accent sm:text-base group-hover:text-primary whitespace-nowrap">
            Bình luận
          </span>
          <i className="pt-0.5 text-sm text-gray-500 group-hover:text-primary">
            <FaChevronRight />
          </i>
        </button>
        {/* <button
          className="flex items-center p-2 transition-all duration-200 focus:outline-none group"
          onClick={() => copyClipboard()}
        >
          <img src="/assets/img/share.png" alt="" className="object-contain w-4 sm:w-6" />
          <span className="px-1 text-sm font-semibold sm:text-base">Chia sẻ</span>
          <i className="text-sm text-gray-400 group-hover:text-primary sm:text-base">
            <FaChevronRight />
          </i>
        </button> */}
        <ShopDetailsCommentsDialog isOpen={openComments} onClose={() => setOpenComments(false)} />
      </div>
    </>
  );
}
