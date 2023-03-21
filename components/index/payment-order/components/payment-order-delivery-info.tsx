import { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaCheck, FaClock } from "react-icons/fa";
import { useLocation } from "../../../../lib/providers/location-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { PICKUP_METHODS } from "../../../../lib/repo/order.repo";
import { ShopBranch, ShopBranchService } from "../../../../lib/repo/shop-branch.repo";
import { parseAddressTypePlace } from "../../../shared/question/commons/commons";
import { Button, Radio, Select } from "../../../shared/utilities/form";
import { PaymentTimeSelector } from "../../payment/components/payment-time-selector";
import { usePaymentContext } from "../../payment/providers/payment-provider";
import { NoteDialog } from "./note-dialog-form";

export function PaymentOrderDeliveryInfo({ ...props }) {
  const { orderInput, setOrderInput, selectedBranch } = usePaymentContext();
  const { shop } = useShopContext();
  const { openLocation, userLocation } = useLocation();
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [placeBranch, setPlaceBranch] = useState<string>();
  const [shopBranch, setShopBranch] = useState<ShopBranch[]>();

  useEffect(() => {
    if (!selectedBranch) return;
    setPlaceBranch(parseAddressTypePlace(selectedBranch));
  }, [selectedBranch]);

  const getAllBranchWidthDistance = async () => {
    try {
      const res = await ShopBranchService.getAllBranchDistance(userLocation.lat, userLocation.lng);
      const newList = [...res.data];
      newList.sort(function (a, b) {
        return a.distance - b.distance;
      });
      setShopBranch(newList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userLocation) {
      setOrderInput({
        ...orderInput,
        buyerFullAddress: userLocation.fullAddress,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });

      getAllBranchWidthDistance();
    }
  }, [userLocation,]);

  return (
    <>
      <Radio
        options={PICKUP_METHODS}
        value={orderInput.pickupMethod}
        onChange={(val) => setOrderInput({ ...orderInput, pickupMethod: val })}
      />
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="text-xl font-semibold text-accent">
          Thông tin {orderInput.pickupMethod === "DELIVERY" ? "nhận" : "lấy"} hàng
        </div>
        {!isShowEdit && (
          <Button
            onClick={() => setIsShowEdit(!isShowEdit)}
            icon={<BiPencil />}
            iconClassName="text-2xl"
            className="px-1 text-primary"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-5 bg-white rounded-md">
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
              title="Địa chỉ"
              isTextarea
              content={orderInput.buyerFullAddress}
              readOnly
              isEdit={isShowEdit}
              onClick={() => openLocation()}
            />
          </>
        )}
        {orderInput.pickupMethod === "DELIVERY" && (
          <>
            <InfoRow
              title="Ghi chú tài xế"
              isTextarea
              content={orderInput.buyerAddressNote}
              isEdit={isShowEdit}
              onChange={(val) => setOrderInput({ ...orderInput, buyerAddressNote: val })}
            />
            <div className="mt-1">
              <Select
                placeholder="Vui lòng chọn chi nhánh"
                value={orderInput?.shopBranchId}
                options={shopBranch?.map((item) => ({
                  value: item.id,
                  label: `${item.name} - ${item.distance} km`,
                  data: {
                    street: item.address,
                    province: item.province,
                    district: item.district,
                    ward: item.ward,
                  },
                }))}
                onChange={(id, option) => {
                  setOrderInput({ ...orderInput, shopBranchId: id });
                  setPlaceBranch(parseAddressTypePlace(option.data));
                }}
              />
              {!!placeBranch && (
                <div className="mt-1 text-sm font-extrabold text-primary">{placeBranch}</div>
              )}
            </div>
          </>
          // <div className="flex flex-row items-center cursor-pointer">
          //   <div className="w-24 mr-4 text-gray-400">Ghi chú tài xế</div>
          //   {!orderInput.buyerAddressNote ? (
          //     <div
          //       className="flex-1 font-semibold text-primary"
          //       onClick={() => setShowNoteDialog(true)}
          //     >
          //       Thêm ghi chú
          //     </div>
          //   ) : (
          //     <div className="flex items-center justify-end flex-1 gap-1 overflow-hidden text-left">
          //       <div className="w-full font-normal text-ellipsis-1" >
          //         {orderInput.buyerAddressNote}
          //       </div>
          //       <i className="font-semibold text-primary" onClick={() => setShowNoteDialog(true)}>
          //         <FaEdit />
          //       </i>
          //     </div>
          //   )}
          // </div>
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
        {orderInput.pickupMethod === "STORE" && (
          <>
            <div className="flex pt-1">
              <div className="flex items-center text-lg font-semibold">
                <i className="pr-2 mb-0.5 text-primary">
                  <FaClock />
                </i>
                Thời gian lấy hàng
              </div>
            </div>
            <PaymentTimeSelector />
            <div className="mt-1">
              <Select
                placeholder="Vui lòng chọn chi nhánh"
                value={orderInput?.shopBranchId}
                options={shopBranch?.map((item) => ({
                  value: item.id,
                  label: `${item.name} - ${item.distance} km`,
                  data: {
                    street: item.address,
                    province: item.province,
                    district: item.district,
                    ward: item.ward,
                  },
                }))}
                onChange={(id, option) => {
                  setOrderInput({ ...orderInput, shopBranchId: id });
                  setPlaceBranch(parseAddressTypePlace(option.data));
                }}
              />
              {!!placeBranch && (
                <div className="mt-1 text-sm font-extrabold text-primary">{placeBranch}</div>
              )}
            </div>
          </>
        )}
      </div>
      <NoteDialog
        value={orderInput.buyerAddressNote}
        onChange={(val) => setOrderInput({ ...orderInput, buyerAddressNote: val })}
        openDialog={showNoteDialog}
        setOpenDialog={setShowNoteDialog}
      />
    </>
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
    <li className="flex">
      <div className={` w-28 pr-3 text-left text-gray-400 ${isEdit ? "pt-2" : ""}`}>{title}</div>
      <div className="flex-1 text-left">
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
                  placeholder={`Nhập ${title.toLowerCase()}`}
                  className={`animate-emerge bg-white w-full border-gray-300 ${
                    isEdit ? "border p-2 rounded-sm" : "px-2 text-gray-800 whitespace-normal"
                  }`}
                  value={content}
                  onChange={(val) => props.onChange(val.target.value)}
                  disabled={props.readOnly ? props.readOnly : !isEdit}
                />
              ) : (
                <textarea
                  placeholder={`Nhập ${title.toLowerCase()}`}
                  className={`animate-emerge bg-white w-full border-gray-300 v-scrollbar focus:outline-none h-auto ${
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
            <div className="font-normal animate-emerge">{content}</div>
          ) : (
            <div className="font-semibold text-gray-500 animate-emerge">Không có</div>
          )}
        </div>
      </div>
    </li>
  );
}
