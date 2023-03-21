// import { useShopContext } from "../../../../lib/providers/shop-provider";
// import { SectionTitle } from "../../../shared/common/section-title";

// type Props = {};

// export function DA({}: Props) {
//   const { shop } = useShopContext();

//   return (
//     <div className="flex-1 py-10 bg-white ">
//       <div className="main-container">
//         <SectionTitle>Giới thiệu về {shop.shopName}</SectionTitle>

//         <div
//           className="ck-content"
//           dangerouslySetInnerHTML={{
//             __html: shop?.config?.intro,
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  RiArrowDownSLine,
  RiFileListLine,
  RiGift2Line,
  RiStarSLine,
  RiStore2Line,
  RiTimeLine,
  RiWechatLine,
} from "react-icons/ri";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ShopBranch, ShopBranchService } from "../../../../lib/repo/shop-branch.repo";
import { RequestDialog } from "../../../shared/common/request-dialog";
import { Button, Select } from "../../../shared/utilities/form";

import { Img } from "../../../shared/utilities/misc";
import { VoucherListDialog } from "../../../shared/voucher/voucher-list-dialog";
import { ShopDetailsBranchesDialog } from "../../shop-details/components/shop-details-branches-dialog";
import { useShopDetailsContext } from "../../shop-details/providers/shop-details-provider";
import { StoreDetailTab } from "./store-detail-tab";

export function StoreDetailInformation({ ...props }) {
  const { shop, selectedBranch, shopCode, customer } = useShopContext();
  const [openVoucherList, setOpenVoucherList] = useState(false);
  const [openShopBranches, setOpenShopBranches] = useState(false);
  const [openRequestLoginDialog, setOpenRequestLoginDialog] = useState(false);

  const isLg = useScreen("lg");
  const toast = useToast();

  return (
    <>
      <div className="px-3 pt-4 pb-0 bg-white shadow-sm lg:px-5 lg:rounded-t ">
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-b-gray-200">
          <div className="flex-1">
            <div className="flex flex-row items-start">
              <Img
                src={`${shop?.shopCover ? shop?.shopCover : "/assets/default/default.png"}`}
                className="object-cover overflow-hidden border border-gray-300 rounded-full w-14"
              />
              <div
                className="flex flex-col self-stretch justify-between ml-4 cursor-pointer"
                onClick={() => setOpenShopBranches(true)}
              >
                <div className="text-xl font-bold lg:text-2xl">{shop?.shopName}</div>
                {/* <Select
                  options={shopBranches?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  native
                  className="border-transparent w-fit focus-within:border-transparent focus:border-transparent hover:border-transparent"
                /> */}
                <div className="flex flex-row items-center mt-auto text-sm">
                  <span className="mr-1">
                    {selectedBranch ? selectedBranch.name : "Chọn cửa hàng"}
                  </span>
                  <i className="text-xl text-gray-600">
                    <RiArrowDownSLine />
                  </i>
                </div>
              </div>
            </div>
            {!isLg && <StoreInfo />}
            <div className="flex w-full gap-3 mt-3 justify-items-start">
              <RequestDialog
                hasRequestLogin
                isOpen={openRequestLoginDialog}
                onClose={() => {
                  setOpenRequestLoginDialog(false);
                }}
              />
              <Button
                outline
                medium
                textPrimary
                icon={<RiWechatLine />}
                iconClassName="text-xl"
                className="flex-1 lg:flex-none"
                text="Chat"
                {...(isLg
                  ? {
                      onClick: () => {
                        if (customer) {
                          const el: HTMLElement = document.querySelector("#chat-widget");
                          if (el) {
                            el.click();
                            setTimeout(() => {
                              const typeEl: HTMLElement = document.querySelector(
                                "#chat-widget-type-input"
                              );
                              if (typeEl) {
                                typeEl.focus();
                              }
                            }, 100);
                          }
                        } else {
                          setOpenRequestLoginDialog(true);
                        }
                      },
                    }
                  : {
                      href: `/store/${shopCode}/chat`,
                    })}
              />
              <Button
                outline
                medium
                textPrimary
                icon={<RiGift2Line />}
                iconClassName="text-xl"
                // onClick={() => setOpenVoucherList(true)}
                className="flex-1 lg:flex-none"
                text="Khuyến mãi"
                onClick={() => {
                  toast.info("Chức năng này đang được phát triển");
                }}
              />
            </div>
          </div>
          {isLg && <StoreInfo />}
        </div>
        {/* tab*/}
      </div>

      <VoucherListDialog
        isOpen={openVoucherList}
        onClose={() => setOpenVoucherList(false)}
        isListMode
      />
      <ShopDetailsBranchesDialog
        isOpen={openShopBranches}
        onClose={() => setOpenShopBranches(false)}
      />
    </>
  );
}

function StoreInfo() {
  const { categories } = useShopDetailsContext();
  const { shop, selectedBranch, shopBranches } = useShopContext();
  return (
    <>
      <div className="grid grid-cols-2 gap-3 pt-4 pb-2 text-sm lg:gap-y-5 lg:gap-x-3 justify-items-stretch">
        <div className="flex mw-full">
          <RiFileListLine className="mr-2 text-xl" />
          <span>
            Sản phẩm:{" "}
            <strong>
              {categories?.reduce((acc, curr) => {
                return (acc += curr.products.length);
              }, 0)}
            </strong>
          </span>
        </div>
        <div className="flex w-full">
          <RiStore2Line className="mr-2 text-xl" />
          <span>
            Chi nhánh: <strong>{shopBranches?.length}</strong>
          </span>
        </div>
        <div className="flex w-full">
          <RiStarSLine className="mr-2 text-xl" />
          <span>
            Đánh giá: <strong>{shop.config.rating}</strong>
          </span>
        </div>
        <div className="flex w-full">
          <RiTimeLine className="mr-2 text-xl" />
          <span>
            Mở cửa:{" "}
            <strong>
              {/* {selectedBranch?.operatingTimes[0].timeFrames.join("-").replace(",", " - ") ||
                "Đang mở"} */}
              {openTime(selectedBranch)}
            </strong>
          </span>
        </div>
      </div>
    </>
  );
}

const openTime = (selectedBranch: ShopBranch) => {
  const date = new Date();
  const currentDay = selectedBranch?.operatingTimes.find((x) => x.day === date.getDay());
  switch (currentDay?.status) {
    case "OPEN": {
      return "Đang mở";
    }
    case "CLOSED": {
      return "Đóng cửa";
    }
    case "TIME_FRAME": {
      return currentDay?.timeFrames.join("-").replace(",", " - ");
    }
  }
};
