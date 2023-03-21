import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiEdit2Line, RiInformationLine, RiMore2Fill, RiStore2Line } from "react-icons/ri";
import { formatDate, parseNumber } from "../../../lib/helpers/parser";
import { useScreen } from "../../../lib/hooks/useScreen";
import {
  ServiceReservation,
  SERVICE_RESERVATION_STATUS_LIST,
} from "../../../lib/repo/services/service-reservation.repo";
import { ShopServiceService } from "../../../lib/repo/services/service.repo";
import { useServiceReservationDetailsContext } from "../../shop/shop-service-reservations/providers/service-reservation-details-provider";
import { Button } from "../utilities/form";
import { Img, Spinner, StatusLabel } from "../utilities/misc";
import { Dropdown } from "../utilities/popover/dropdown";
import { useDataTable } from "../utilities/table/data-table";

export interface AdditionalServiceProps {
  hasButtonAgain?: boolean;
  onUpdatePrice?: (val: boolean) => void;
  readOnly?: boolean;
  isWeb: boolean;
  isAdmin: boolean;
  isShop: boolean;
}

const info_button_again = [
  "Không thể đặt lại, dịch vụ đã bị xóa khỏi cửa hàng",
  "Không thể đặt lại, một trong các dịch vụ bổ sung đã bị xóa khỏi cửa hàng",
];

export function AdditionalService({
  reservation,
  hasButtonAgain = false,
  onUpdatePrice,
  readOnly = false,
  isWeb = false,
  isAdmin = false,
  isShop = false,
  ...props
}: AdditionalServiceProps & { reservation: ServiceReservation }) {
  const screenLg = useScreen("lg");
  const router = useRouter();
  const changeStatusRef = useRef(null);
  const {
    onConfirmClick,
    onCompleteClick,
    onCancelClick,
    loadReservation,
  } = useServiceReservationDetailsContext();
  const { loadAll } = useDataTable();
  const [isAgain, setIsAgain] = useState<"REMOVE_SERVICE" | "REMOVE_OPTION" | "ALLOW">();

  const checkAllowAgain = async () => {
    const service = await ShopServiceService.getOne({ id: reservation?.serviceId, cache: false });
    if (service == null) {
      setIsAgain("REMOVE_SERVICE");
      return;
    } else {
      const newList = [];
      if (reservation?.additionalServices?.length <= 0) {
        setIsAgain("ALLOW");
        return;
      }
      const res = reservation?.additionalServices?.map((option) => [
        option?.additionalServiceId,
        ...option?.options.map((item) => item.additionalServiceOptionId),
      ]);
      res?.forEach((optionInOrder, index) => {
        reservation?.service?.additionalServices.forEach((subService) => {
          if (optionInOrder[0] == subService.id) {
            newList.push([optionInOrder[0]]);
            optionInOrder.slice(1, optionInOrder.length).forEach((opt) => {
              subService.options.forEach((optS) => {
                if (opt == optS.id && newList[index] != undefined) {
                  newList[index] = [...newList[index], opt];
                }
              });
            });
          }
        });
      });

      if (newList.filter((x) => x.length > 1).length < res?.length) {
        setIsAgain("REMOVE_OPTION");
        return;
      } else {
        res.forEach((currIds, index) => {
          if (newList[index].length < currIds.length) {
            setIsAgain("REMOVE_OPTION");
            return;
          }
        });
      }
    }
    setIsAgain("ALLOW");
  };

  const handleClickReservAgain = () => {
    const shopCode = reservation?.member?.code;
    const newList = [];
    const res = reservation?.additionalServices?.map((option) => [
      option?.additionalServiceId,
      ...option?.options.map((item) => item.additionalServiceOptionId),
    ]);

    res.forEach((optionInOrder, index) => {
      reservation?.service?.additionalServices.forEach((subService) => {
        if (optionInOrder[0] == subService.id) {
          newList.push([optionInOrder[0]]);
          optionInOrder.slice(1, optionInOrder.length).forEach((opt) => {
            subService.options.forEach((optS) => {
              if (opt == optS.id) {
                newList[index] = [...newList[index], opt];
              }
            });
          });
        }
      });
    });

    if (reservation?.servicePriceType === "CONTACT") {
      router.push(
        `/store/${shopCode}/services/${reservation?.service?.slug}/book?ids=${
          newList.filter((x) => x.length > 1).length > 0
            ? `${newList.filter((x) => x.length > 1).join("-")}&contact=true`
            : "[]&contact=true"
        }`
      );
    } else {
      router.push(
        `/store/${shopCode}/services/${reservation?.service?.slug}/book?ids=${
          newList.filter((x) => x.length > 1).length > 0
            ? newList.filter((x) => x.length > 1).join("-")
            : "[]"
        }`
      );
    }
  };

  useEffect(() => {
    if (!reservation) return;
    checkAllowAgain();
  }, [reservation, router?.query?.id]);

  if (reservation == null || reservation == undefined) return <Spinner />;

  return (
    <div className={`${!screenLg ? "bg-white" : ""}`}>
      <div
        className={`${
          !screenLg ? "main-container" : ""
        } flex flex-row items-center justify-between mb-4`}
      >
        <div>
          <span className="text-base font-bold lg:text-xl text-primaryBlack">
            Lịch hẹn #{reservation?.code}{" "}
            <span className="text-sm font-medium">
              tạo ngày {formatDate(reservation?.createdAt, "dd/MM/yyyy")}
            </span>
          </span>
          <div className="mt-2 text-sm font-bold text-primaryBlack lg:text-base">
            Ngày hẹn: {formatDate(reservation?.reservationDate, "dd/MM/yyyy")}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusLabel
            type="light"
            value={reservation?.status}
            options={SERVICE_RESERVATION_STATUS_LIST}
            maxContent
            className="px-2 py-2 text-xs rounded lg:py-2 lg:px-3 lg:text-sm"
          />
          <i
            className={`text-2xl text-gray-500 cursor-pointer ${!isShop && "hidden"}`}
            ref={changeStatusRef}
          >
            <RiMore2Fill />
          </i>
          <Dropdown reference={changeStatusRef} trigger="click" placement="bottom-end">
            <Dropdown.Item
              className={`justify-start ${reservation?.status !== "PENDING" && "line-through"}`}
              text="Xác nhận"
              disabled={reservation?.status !== "PENDING"}
              onClick={async () => {
                await onConfirmClick(reservation?.id);
                await loadReservation(reservation?.id);
                await loadAll();
              }}
            />
            <Dropdown.Item
              className={`justify-start ${reservation?.status !== "CONFIRMED" && "line-through"}`}
              text="Hoàn thành"
              disabled={reservation?.status !== "CONFIRMED"}
              onClick={async () => {
                await onCompleteClick(reservation?.id);
                await loadReservation(reservation?.id);
                await loadAll();
              }}
            />
            <Dropdown.Item
              className={`justify-start ${
                (reservation?.status === "CANCELED" || reservation?.status == "COMPLETED") &&
                "line-through"
              }`}
              text="Hủy"
              hoverDanger
              disabled={reservation?.status === "CANCELED" || reservation?.status == "COMPLETED"}
              onClick={async () => {
                await onCancelClick(reservation?.id);
                await loadReservation(reservation?.id);
                await loadAll();
              }}
            />
          </Dropdown>
        </div>
      </div>

      <div className="p-5 rounded-md lg:border lg:border-gray-200 shink-0 grow-0">
        <div className="flex flex-row w-full">
          <Img className="lg:w-[50px] w-[70px]" rounded src={reservation?.images[0]} />

          <div className="w-full">
            <div className="flex items-start justify-between w-full">
              <div className="">
                <div className="flex flex-col justify-between max-w-lg ml-3 lg:mb-5 ">
                  <p
                    className={`lg:mb-2 mb-1 font-extrabold group-hover:underline text-primaryBlack group-hover:text-primary lg:text-base text-sm ${
                      screenLg ? "text-ellipsis-1" : "text-ellipsis-2"
                    }`}
                  >
                    {reservation?.name}
                  </p>

                  <p className="flex flex-row items-center font-extrabold text-primary">
                    <RiStore2Line />
                    <span className="w-40 ml-1 text-xs lg:text-sm text-ellipsis-1">
                      {reservation?.member?.shopName}
                    </span>
                  </p>
                </div>
              </div>

              <div className="font-extrabold text-primaryBlack">
                {reservation.servicePriceType === "FIXED"
                  ? parseNumber(reservation?.service?.price, true)
                  : "Liên hệ"}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:ml-3 lg:pl-[50px] lg:mt-0 mt-4">
          {reservation?.additionalServices?.length > 0 &&
            reservation?.additionalServices?.map((option, index) => (
              <div
                className="flex flex-row items-center justify-between w-full mb-2 lg:pr-3"
                key={index}
              >
                <div className="flex flex-row justify-between">
                  <span>{option?.name}: </span>

                  <span className="ml-1 font-extrabold text-primaryBlack">
                    {option?.options
                      .map(function (item) {
                        return item["name"];
                      })

                      ?.join(", ")}
                  </span>
                </div>

                <div className="font-medium text-primaryBlack">
                  {reservation.servicePriceType === "FIXED"
                    ? parseNumber(
                        option?.options?.reduce((arr, curr) => {
                          arr += curr?.price;
                          return arr;
                        }, 0),
                        true
                      )
                    : ""}
                </div>
              </div>
            ))}
        </div>

        {isWeb && (
          <div>
            <div
              className={`flex flex-row  pt-4 mt-4 border-t border-gray-200 ${
                hasButtonAgain ? "justify-between items-center" : ""
              }`}
            >
              {hasButtonAgain &&
                (reservation?.status === "CANCELED" || reservation?.status === "COMPLETED") && (
                  <ButtonAgain
                    isAgain={isAgain}
                    status={reservation?.status}
                    onClickAgain={handleClickReservAgain}
                  />
                )}
              {reservation?.servicePriceType === "FIXED" ? (
                <div className="flex justify-end ml-auto font-extrabold lg:text-xl text-primary">
                  Tổng: {parseNumber(reservation?.totalPrice, true)}
                </div>
              ) : (
                <div className="flex justify-end ml-auto text-xl font-extrabold text-primary">
                  Giá liên hệ
                </div>
              )}
            </div>

            {hasButtonAgain &&
              (reservation?.status === "CANCELED" || reservation?.status === "COMPLETED") &&
              !!isAgain &&
              isAgain != "ALLOW" && (
                <div className="flex flex-row items-center p-2 mt-3 rounded-sm text-info bg-cyan-50 max-w-fit">
                  <RiInformationLine size={32} className="shrink-0 grow-0" />
                  <div className="ml-3 font-bold">
                    {isAgain === "REMOVE_OPTION" ? info_button_again[1] : info_button_again[0]}
                  </div>
                </div>
              )}
          </div>
        )}

        {(isShop || isAdmin) && reservation?.servicePriceType === "FIXED" && (
          <div className="flex justify-end pt-4 mt-4 text-xl font-extrabold border-t border-gray-200 text-primary">
            Tổng: {parseNumber(reservation?.totalPrice, true)}
          </div>
        )}

        {isShop && reservation?.servicePriceType === "CONTACT" && (
          <>
            {reservation?.status !== "PENDING" && (
              <div className="flex justify-end pt-4 mt-4 text-xl font-extrabold border-t border-gray-200 text-primary">
                Tổng: {parseNumber(reservation?.totalPrice, true)}
              </div>
            )}
            {reservation?.status === "PENDING" && reservation?.totalPrice === 0 && (
              <div className="flex justify-end pt-4 mt-4 text-xl font-extrabold border-t border-gray-200 text-primary">
                <Button primary text="Cập nhật giá" onClick={() => onUpdatePrice?.(true)} />
              </div>
            )}
            {reservation?.status === "PENDING" && reservation?.totalPrice > 0 && (
              <div className="flex items-center justify-end pt-4 mt-4 text-xl font-extrabold border-t border-gray-200 text-primary">
                <div className="text-xl font-extrabold text-primary">
                  Tổng: {parseNumber(reservation?.totalPrice, true)}
                </div>
                <Button
                  tooltip="Chỉnh sửa"
                  icon={<RiEdit2Line />}
                  iconClassName="text-2xl text-gray-400 hover:text-primary"
                  className="pr-0 pl-2.5"
                  onClick={() => onUpdatePrice?.(true)}
                />
              </div>
            )}
          </>
        )}

        {isAdmin && reservation?.servicePriceType === "CONTACT" && (
          <>
            <div className="flex justify-end pt-4 mt-4 text-xl font-extrabold border-t border-gray-200 text-primary">
              Giá liên hệ
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ButtonAgain({
  isAgain,
  status,
  ...props
}: {
  isAgain: "REMOVE_SERVICE" | "REMOVE_OPTION" | "ALLOW";
  onClickAgain: () => void;
  status: string;
}) {
  if (isAgain == undefined || isAgain == null) return <></>;
  return (
    <Button
      primary
      text={"Đặt lại"}
      className={`h-12 px-12 ${
        !!isAgain && isAgain != "ALLOW"
          ? "!pointer-events-none !border-gray-400 !text-neutralGrey border bg-transparent"
          : ""
      }`}
      onClick={() => props.onClickAgain()}
    />
  );
}
