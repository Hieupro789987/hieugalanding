import { useRouter } from "next/router";
import { useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Button } from "../../../shared/utilities/form";

export function StoreDetailTab({ ...props }) {
  const { shopCode, shop, customer } = useShopContext();
  const router = useRouter();

  return (
    <div className="sticky z-50 flex items-center w-full overflow-x-auto bg-white shadow-sm lg:rounded-b no-scrollbar top-12">
      {TABS.map((item, index) => (
        <Button
          className={`text-sm font-bold h-12 lg:h-14 px-3 lg:px-5 ${
            item.href === props.mode ? "text-primary" : ""
          } whitespace-nowrap`}
          key={item.href}
          text={item.label}
          href={`/store/${shopCode}/${item.href}`}
        >
          <div
            className={`absolute w-3/5 left-1/2 -translate-x-1/2 bottom-0 rounded border-b-4 transition ${
              item.href === props.mode ? "border-b-primary" : "border-b-white"
            }`}
          >
            {" "}
          </div>
          {index != TABS.length - 1 && (
            <div
              className={`absolute h-3 top-1/2 -translate-y-1/2 right-0 border-r-2 border-gray-400`}
            >
              {" "}
            </div>
          )}
        </Button>
        // <div
        //   key={index}
        //   className="flex items-center cursor-pointer "
        //   onClick={() => {
        //     router.push(`/store/${shopCode}/${item.href}`);
        //   }}
        // >
        //   <span
        //     className={`inline-block py-5 font-extrabold border-b-2 transition ${
        //       item.href === props.mode
        //         ? "border-b-primary text-primary"
        //         : "border-b-white"
        //     }`}
        //   >
        //     {item.label}
        //   </span>
        //   <span className={`mx-4 text-xs ${TABS.length === index + 1 && "hidden"}`}>|</span>
        // </div>
      ))}
      <div></div>
    </div>
  );
}

export const TABS = [
  {
    label: "Giới thiệu",
    href: "about",
  },
  {
    label: "Sản phẩm",
    href: "",
  },
  {
    label: "Dịch vụ",
    href: "services",
  },
  // {
  //   label: "Đánh giá",
  //   href: "feedback",
  // },
  // {
  //   label: "Chính sách CTV",
  //   href: "policy",
  // },
];
