import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { BiPurchaseTag } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline, IoLocationOutline } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ShopRegistrationService } from "../../../../lib/repo/shop-registration.repo";
import { DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button, Checkbox, Form } from "../../../shared/utilities/form";
import { Img, NotFound } from "../../../shared/utilities/misc";
import { VoucherListDialog } from "../../../shared/voucher/voucher-list-dialog";
import { ShopDetailsBranchesDialog } from "../../shop-details/components/shop-details-branches-dialog";

export default function StoreDetailInfo() {
  const { shop, selectedBranch, customer } = useShopContext();
  const [openShopBranches, setOpenShopBranches] = useState(false);
  const [openVoucherList, setOpenVoucherList] = useState(false);

  const scrollToCommentList = () => {
    const commentsEle = document.getElementById("comments");
    if (commentsEle) commentsEle.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-white">
      <div className="flex flex-row items-center justify-between py-7 main-container">
        <div className="flex flex-row items-center">
          <Img
            src={`${shop?.shopCover ? shop?.shopCover : "/assets/default/default.png"}`}
            className="object-cover w-16 rounded shadow"
          />
          <div className="ml-4 cursor-pointer" onClick={() => setOpenShopBranches(true)}>
            <div className="text-xl font-bold text-accent">{shop?.shopName}</div>
            {selectedBranch !== undefined ? (
              <div className="flex flex-row items-center mt-1">
                <span>
                  <IoLocationOutline className="mr-2 font-semibold text-gray-500" />
                </span>
                <span className="mr-1 text-xs text-gray-400">
                  {selectedBranch ? selectedBranch.name : "Chọn cửa hàng"}
                </span>
                <span className="text-xs text-accent">
                  {" "}
                  (cách tôi {selectedBranch?.distance >= 0 && selectedBranch?.distance}
                  km)
                </span>
                <i className="text-xl text-gray-600">
                  <RiArrowRightSLine />
                </i>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          {!!customer && (
            <>
              {!customer.isAgency && shop.config?.agencyConfig?.active && (
                <Button
                  text="Đăng ký Đại lý"
                  className="text-sm text-white"
                  large
                  warning
                  hoverDarken
                />
              )}
              {!customer.isDistributor && shop.config?.distributorConfig?.active && (
                <Button
                  text="Đăng ký Nhà phân phối"
                  className="text-sm text-white"
                  primary
                  large
                  hoverDarken
                />
              )}
            </>
          )}
        </div>
        <VoucherListDialog
          isOpen={openVoucherList}
          onClose={() => setOpenVoucherList(false)}
          isListMode
        />
      </div>
      <hr />
      <div className="py-3.5 flex-between-center main-container">
        <div className="flex flex-row items-center">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => setOpenVoucherList(true)}
          >
            <span>
              <BiPurchaseTag className="text-xl text-primary" />
            </span>
            <span className="mx-4 font-semibold text-accent">Khuyến Mãi</span>
            <span>
              <AiOutlineRight className="text-gray-500" />
            </span>
          </div>
          <div
            className="flex flex-row items-center ml-8 cursor-pointer"
            onClick={scrollToCommentList}
          >
            <span>
              <IoChatbubbleEllipsesOutline className="text-xl text-primary" />
            </span>
            <span className="mx-4 font-semibold text-accent">Đánh giá</span>
            <span>
              <AiOutlineRight className="text-gray-500" />
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center">
          {shop?.config?.tags ? (
            <div className="flex flex-row items-center">
              {shop?.config?.tags.map((item, index) => (
                <Button
                  key={index}
                  text={`${item?.name}`}
                  icon={<>{item?.icon}</>}
                  iconPosition="start"
                  iconClassName="text-primary text-2xl not-italic"
                  className="ml-3 border border-blue-100 rounded-full"
                  outline
                  textAccent
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <ShopDetailsBranchesDialog
        isOpen={openShopBranches}
        onClose={() => setOpenShopBranches(false)}
      />
    </section>
  );
}
