import React, { useEffect, useState } from "react";
import { FaCheck, FaChevronRight, FaClock, FaPencilAlt, FaStore } from "react-icons/fa";
import { useLocation } from "../../../../lib/providers/location-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { PICKUP_METHODS } from "../../../../lib/repo/order.repo";
import { TabMaterial } from "../../../shared/common/tab-material";
import { Button } from "../../../shared/utilities/form/button";
import { ShopDetailsBranchesDialog } from "../../shop-details/components/shop-details-branches-dialog";
import { usePaymentContext } from "../providers/payment-provider";
import { PaymentTimeSelector } from "./payment-time-selector";

export const PaymentDeliveryInfo = () => {
  const { orderInput, setOrderInput } = usePaymentContext();
  const { selectedBranch } = useShopContext();
  const [openShopBranches, setOpenShopBranches] = useState(false);
  return (
    <div className="">
      <TabMaterial
        options={PICKUP_METHODS}
        value={orderInput.pickupMethod}
        className="px-3 bg-white border-b"
        onChange={(val) => setOrderInput({ ...orderInput, pickupMethod: val })}
      />

      <div
        className="flex items-center p-3 bg-white cursor-pointer whitespace-nowrap"
        onClick={() => setOpenShopBranches(true)}
      >
        <i className="pr-3 text-lg text-gray-400">
          <FaStore />
        </i>
        <span className="font-bold text-ellipsis-1 text-primary">
          {(!selectedBranch && "Chọn cửa hàng") || selectedBranch.name}
        </span>
        <i className="pl-2 ml-auto mr-0 text-base text-gray-400">
          <FaChevronRight />
        </i>
      </div>
      <ShopDetailsBranchesDialog
        isOpen={openShopBranches}
        onClose={() => setOpenShopBranches(false)}
      />

      <DeliveryInfo />
    </div>
  );
};
function DeliveryInfo() {
  const { orderInput, setOrderInput } = usePaymentContext();
  const { openLocation, userLocation } = useLocation();
  const [isShowEdit, setIsShowEdit] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setOrderInput({
        ...orderInput,
        buyerFullAddress: userLocation.fullAddress,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });
    }
  }, [userLocation]);

  return (
    <div className="px-3 py-4">
      <div className="flex items-center mb-1">
        <div className="text-base font-bold md:text-lg">
          Thông tin {orderInput.pickupMethod === "DELIVERY" ? "nhận" : "lấy"} hàng
        </div>
        {!isShowEdit && (
          <Button
            textPrimary
            onClick={() => setIsShowEdit(!isShowEdit)}
            icon={<FaPencilAlt />}
            iconClassName="text-base md:text-lg"
            className="h-8 pr-0 ml-auto mr-0 text-sm underline"
          />
        )}
      </div>
      <div
        className={`sm:text-base bg-white rounded-md p-4 border border-gray-100 shadow-sm font-light text-sm flex-1 space-y-2`}
      >
        <InfoRow
          title="Người nhận"
          content={orderInput.buyerName}
          isEdit={isShowEdit}
          onChange={(val) => setOrderInput({ ...orderInput, buyerName: val })}
        />
        <InfoRow
          title={"Số điện thoại"}
          content={orderInput.buyerPhone}
          isEdit={isShowEdit}
          onChange={(val) => setOrderInput({ ...orderInput, buyerPhone: val })}
        />
        {orderInput.pickupMethod === "DELIVERY" && (
          <>
            <InfoRow
              title="Địa chỉ nhận hàng"
              isTextarea
              content={orderInput.buyerFullAddress}
              readOnly
              isEdit={isShowEdit}
              onClick={() => openLocation()}
            />
            <InfoRow
              title="Ghi chú tài xế"
              isTextarea
              content={orderInput.buyerAddressNote}
              isEdit={isShowEdit}
              onChange={(val) => setOrderInput({ ...orderInput, buyerAddressNote: val })}
            />
          </>
        )}
        {isShowEdit && (
          <div className="flex-center">
            <Button
              outline
              primary
              icon={<FaCheck />}
              text="Xác nhận"
              small
              iconClassName="text-sm"
              onClick={() => setIsShowEdit(false)}
            />
          </div>
        )}
      </div>
      {orderInput.pickupMethod === "STORE" && (
        <>
          <div className="mt-6 mb-2 text-base font-bold lg:text-lg">Thời gian nhận hàng</div>
          <PaymentTimeSelector />
        </>
      )}
    </div>
  );
}
function InfoRow({
  title = "",
  content = "",
  isEdit = false,
  isTextarea = false,
  ...props
}: {
  onClick?: Function;
  title: string;
  content: string;
  isEdit?: boolean;
  isTextarea?: boolean;
} & FormControlProps) {
  return (
    <li className="flex font-medium">
      <div className={`text-gray-500 w-28 pr-3 ${isEdit ? "pt-2" : ""}`}>{title}</div>
      <div className="flex-1">
        <div
          className={`w-full`}
          onClick={() => {
            if (props.onClick && isEdit) {
              props.onClick();
            }
          }}
        >
          {isEdit ? (
            <>
              {!isTextarea ? (
                <input
                  type="text"
                  placeholder={`Nhập ${title.toLowerCase()} của bạn`}
                  className={`animate-emerge text-right bg-white w-full border-gray-300 ${
                    isEdit ? "border p-2 rounded-sm" : "px-2 text-gray-800 whitespace-normal"
                  }`}
                  value={content}
                  onChange={(val) => props.onChange(val.target.value)}
                  disabled={props.readOnly ? props.readOnly : !isEdit}
                />
              ) : (
                <textarea
                  placeholder={`Nhập ${title.toLowerCase()} của bạn`}
                  className={`animate-emerge text-right bg-white w-full border-gray-300 v-scrollbar focus:outline-none h-auto ${
                    isEdit ? "border p-2 rounded-sm" : "px-2 text-gray-800"
                  }`}
                  rows={3}
                  value={content}
                  onChange={(val) => props.onChange(val.target.value)}
                  disabled={props.readOnly ? props.readOnly : !isEdit}
                  style={{ resize: "none" }}
                />
              )}
            </>
          ) : content ? (
            <div className="font-medium text-right animate-emerge">{content}</div>
          ) : (
            <div className="italic text-right text-gray-500 animate-emerge">Không có</div>
          )}
        </div>
      </div>
    </li>
  );
}
