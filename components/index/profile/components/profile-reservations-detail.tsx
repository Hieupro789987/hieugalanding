import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiArrowLeftSLine, RiInformationLine } from "react-icons/ri";
import { formatDate } from "../../../../lib/helpers/parser";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  ServiceReservation,
  ServiceReservationService,
} from "../../../../lib/repo/services/service-reservation.repo";
import { Service, ShopServiceService } from "../../../../lib/repo/services/service.repo";

import { Button } from "../../../shared/utilities/form";
import { BreadCrumbs, Spinner, StatusLabel } from "../../../shared/utilities/misc";

export function ProfileReservationsDetail({ ...props }) {
  const router = useRouter();
  const [reservation, setReservation] = useState<ServiceReservation>();
  const screenLg = useScreen("lg");
  const [cancel, setCancel] = useState<string>();
  const [change, setChange] = useState<boolean>(false);
  const toast = useToast();
  const [isDeleted, setIdDeleted] = useState<"REMOVE_SERVICE" | "ALLOW">();


  const getReservationDetail = async () => {
    if (!router?.query?.id) return;
    try {
      const res = await ServiceReservationService.getOne({ id: router?.query?.id as string });
      setReservation(res);
      const service = await ShopServiceService.getOne({id: res.serviceId, cache: false});
      if (service == null) {
        setIdDeleted("REMOVE_SERVICE")
      }else {
        setIdDeleted("ALLOW")
      }

    } catch (error) {
      toast.error("Lấy chi tiết dịch vụ đã đặt thất bại", error.message);
    }
  };
  const isExceedTheTimeAllowed = (minType: number) => {
    const reserDate = new Date(reservation?.reservationDate);
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    const ms1 = reserDate.getTime();
    const ms2 = currentDay.getTime();

    const result = Math.floor((ms1 - ms2) / (24 * 60 * 60 * 1000));
    return result < minType;
  };

  const checkBeingAllow = (isCan: boolean, minType: number) => {
    let flag = false;
    if (isCan) {
      if (!isExceedTheTimeAllowed(minType)) {
        if (reservation?.status === "PENDING") {
          flag = true;
        }
      }
    }

    return flag;
  };

  const handleClickCancel = () => {
    if (!reservation?.id) return;
    setCancel(reservation?.id);
  };

  const handleClickChange = () => {
    const shopCode = reservation?.service?.member.code;
    const res = reservation?.additionalServices?.map((option) => [
      option?.additionalServiceId,
      ...option?.options.map((item) => item?.additionalServiceOptionId),
    ]);

    if (reservation?.servicePriceType === "CONTACT") {
      router.push(
        `/store/${shopCode}/services/${reservation?.serviceId}/edit?reserId=${reservation?.id}&contact=true`
      );
    } else {
      router.push(
        `/store/${shopCode}/services/${reservation?.service?.slug}/edit?reserId=${reservation?.id}`
      );
    }
  };

  useEffect(() => {
    if (!router?.query?.id) return;
    getReservationDetail();
  }, [router?.query?.id]);

  useEffect(() => {
    return () => {
      setCancel(null);
      setChange(false);
    };
  }, []);
  if (reservation == null || reservation == undefined) return <Spinner />;

  return (
    <>
      {!screenLg && (
        <div className="px-3 bg-white border-b boder-b-neutralGrey">
          <BreadCrumbs
            className="relative z-10 my-3"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                href: "/profile",
                label: "Tài khoản",
              },
              {
                href: "/profile/reservations",
                label: "Lịch sử đặt lịch",
              },
              {
                label: `Lịch hẹn #${reservation?.code}`,
              },
            ]}
          />
        </div>
      )}

      <div className="lg:p-3 lg:bg-none">
        {screenLg ? (
          <Link href="/profile/reservations">
            <a className="cursor-pointer ">
              <div className="flex flex-row items-center mb-5 font-semibold text-primary">
                <RiArrowLeftSLine size={24} />
                <span className="ml-1">Quay lại</span>
              </div>
            </a>
          </Link>
        ) : (
          <div className="py-4 font-extrabold bg-white">
            <div className="pt-2 main-container">Thông tin dịch vụ</div>
          </div>
        )}

        <AdditionalService
          reservation={reservation}
          hasButtonAgain
          isWeb
          isAdmin={false}
          isShop={false}
        />
        <InformationService reservation={reservation} />
        {reservation?.status == "PENDING" && (
          <div className="pt-6 pb-8 bg-white lg:pt-0 lg:mt-12 lg:bg-none lg:pb-0">
            <div className={`${!screenLg ? "main-container" : ""} `}>
              <div className="flex flex-row items-center gap-3">
                <Button
                  outline
                  text="Thay đổi lịch hẹn"
                  className={`lg:mr-6 h-14 font-semibold  ${!screenLg ? "w-full min-w-fit" : ""}${
                    isDeleted == "ALLOW" && checkBeingAllow(
                      reservation?.service?.canChangeReservation,
                      reservation?.service?.minAdvanceReservationChangeInDay
                    )
                      ? ""
                      : "!pointer-events-none !border-gray-400 !text-neutralGrey"
                  }`}
                  onClick={handleClickChange}
                />
                <Button
                  outline
                  text="Hủy lịch hẹn"
                  className={`h-14 font-semibold  ${!screenLg ? "w-full" : " "} ${
                    isDeleted == "ALLOW" && checkBeingAllow(
                      reservation?.service?.canCancelReservation,
                      reservation?.service?.minAdvanceReservationCancelInDay
                    )
                      ? ""
                      : "!pointer-events-none !border-gray-400 !text-neutralGrey"
                  }`}
                  onClick={handleClickCancel}
                />
              </div>

              {isDeleted == "REMOVE_SERVICE" ? (
                 <Info
                 title={notification_info[5].title}
                 subtitle={notification_info[5].subtite}
                 hotline={reservation?.service?.member?.phone}
               />
              ) : !checkBeingAllow(
                reservation?.service?.canChangeReservation,
                reservation?.service?.minAdvanceReservationChangeInDay
              ) &&
              !checkBeingAllow(
                reservation?.service?.canCancelReservation,
                reservation?.service?.minAdvanceReservationCancelInDay
              ) ? (
                <Info
                  title={notification_info[4].title}
                  subtitle={notification_info[4].subtite}
                  hotline={reservation?.service?.member?.phone}
                />
              ) : (
                <>
                  {!reservation?.service?.canCancelReservation ? (
                    <Info
                      title={notification_info[1].title}
                      subtitle={notification_info[1].subtite}
                      hotline={reservation?.service?.member?.phone}
                    />
                  ) : (
                    isExceedTheTimeAllowed(
                      reservation?.service?.minAdvanceReservationCancelInDay
                    ) && (
                      <Info
                        title={notification_info[3].title}
                        subtitle={notification_info[3].subtite}
                        hotline={reservation?.service?.member?.phone}
                      />
                    )
                  )}

                  {!reservation?.service?.canChangeReservation ? (
                    <Info
                      title={notification_info[0].title}
                      subtitle={notification_info[0].subtite}
                      hotline={reservation?.service?.member?.phone}
                    />
                  ) : (
                    isExceedTheTimeAllowed(
                      reservation?.service?.minAdvanceReservationChangeInDay
                    ) && (
                      <Info
                        title={notification_info[2].title}
                        subtitle={notification_info[2].subtite}
                        hotline={reservation?.service?.member?.phone}
                      />
                    )
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <ConfirmDialog
          isOpen={!!cancel}
          onClose={() => setCancel(null)}
          reserId={cancel}
          type="cancel"
          title="Bạn muốn hủy lịch đặt?"
          load={async () => await getReservationDetail()}
        />
      </div>
    </>
  );
}

export function InformationService({ reservation, ...props }: { reservation: ServiceReservation }) {
  const screenLg = useScreen("lg");
  return (
    <div className={`flex flex-col lg:gap-40 lg:mt-8 mt-3 bg-white lg:flex-row lg:bg-none  `}>
      <div className={`${!screenLg ? "main-container" : ""} shrink-0 grow-0`}>
        <div className="pt-3 mb-5 text-xl font-extrabold lg:pt-0 text-primaryBlack">
          Thông tin đặt lịch
        </div>
        <div>
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Ngày hẹn</div>
            <div className="font-extrabold">
              {" "}
              {formatDate(reservation?.reservationDate, "dd/MM/yyyy")}
            </div>
          </div>
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Chuyên viên</div>
            <div className="font-extrabold">{reservation?.shopServiceSpecialist?.name}</div>
          </div>
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Địa điểm</div>
            <div className="font-extrabold">
              {reservation?.addressType == "AT_SHOP"
                ? "Tại chi nhánh cửa hàng"
                : "Tại địa chỉ người đặt"}
            </div>
          </div>
          {reservation?.addressType == "AT_SHOP" && (
            <>
              <div className="flex flex-row mb-2 text-primaryBlack">
                <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Chi nhánh</div>
                <div className="w-48 font-extrabold">
                  {reservation?.reservationShopBranch?.name}
                </div>
              </div>
              <div className="flex flex-row mb-2 text-primaryBlack">
                <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Địa chỉ</div>
                <div className="w-48 font-extrabold">
                  {parseAddressTypePlace(reservation?.reservationShopBranch)}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Ghi chú</div>
            <div className="font-extrabold">{reservation?.note || "Không có"}</div>
          </div>
        </div>
      </div>
      <div className={`${!screenLg ? "main-container mt-6" : ""}`}>
        <div className="mb-5 text-xl font-extrabold text-primaryBlack">Thông tin người đặt</div>
        <div>
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Họ và tên</div>
            <div className="font-extrabold">{reservation?.reserverFullname}</div>
          </div>
          <div className="flex flex-row mb-2 text-primaryBlack">
            <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Số điện thoại</div>
            <div className="font-extrabold">{reservation?.reserverInternationalPhone}</div>
          </div>

          <div className="flex flex-row mb-2 text-primaryBlack">
            {reservation?.addressType == "AT_RESERVER" && (
              <>
                <div className="w-40 font-normal lg:w-32 shrink-0 grow-0">Địa chỉ</div>
                <div className="w-48 font-extrabold">
                  {parseAddressTypePlace(reservation?.reservationAddress)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export function Info({
  title,
  subtitle,
  hotline,
  ...props
}: {
  title: string;
  subtitle: string;
  hotline: string;
}) {
  return (
    <div className="flex flex-row items-center p-2 mt-5 rounded-sm text-info bg-cyan-50 max-w-fit">
      <RiInformationLine size={32} className="shrink-0 grow-0" />
      <div className="ml-3 font-bold">
        <div>{title}</div>
        <div>
          Vui lòng liên hệ {hotline} {subtitle}
        </div>
      </div>
    </div>
  );
}

// RiInformationLine
const notification_info = [
  {
    title: "Dịch vụ này không cho phép thay đổi lịch hẹn.",
    subtite: "của cửa hàng để thay đổi",
  },
  {
    title: "Dịch vụ này không cho phép hủy lịch hẹn.",
    subtite: "của cửa hàng để hủy",
  },
  {
    title: "Đã quá thời gian thay đổi lịch hẹn.",
    subtite: "của cửa hàng để thay đổi",
  },
  {
    title: "Đã quá thời gian hủy lịch hẹn.",
    subtite: "của cửa hàng để hủy",
  },
  {
    title: "Dịch vụ này không cho phép thay đổi / hủy lịch hẹn. ",
    subtite: "của cửa hàng để thay đổi hoặc hủy",
  },
  {
    title: "Dịch vụ này đã bị xóa khỏi cửa hàng.",
    subtite: "của cửa hàng để thay đổi hoặc hủy",
  },
];

import { IoAlertCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog";
import { CloseButtonHeaderDialog } from "../../../shared/dialog/close-button-header-dialog";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { AdditionalService } from "../../../shared/reservation/additional-service";
import { parseAddressTypePlace } from "../../../shared/question/commons/commons";

interface RequestDialogProps extends DialogProps {
  title?: string;
  reserId?: string;
  load?: (val: boolean) => any;
  type?: "change" | "cancel";
}

export function ConfirmDialog({ title, ...props }: RequestDialogProps) {
  const router = useRouter();
  const toast = useToast();

  return (
    <Dialog width={450} className="text-accent" {...props}>
      <Dialog.Body>
        <CloseButtonHeaderDialog onClose={props.onClose} />
        <div className="flex-center">
          {props.type == "cancel" && (
            <i className="text-yellow text-[120px] shadow-5xl shadow-yellow">
              <IoAlertCircle width={12} />
            </i>
          )}
          {props.type == "change" && (
            <i className="text-primaryGreen text-[120px] shadow-5xl shadow-green-300">
              <MdOutlineCheckCircleOutline width={12} />
            </i>
          )}
        </div>
        <div className="mt-3 mb-6 font-bold text-center">{title}</div>

        {props.type == "cancel" && (
          <div className="flex flex-row gap-3">
            <Button
              primary
              text="Đóng"
              outline
              className="w-full h-14"
              onClick={async () => {
                await props.onClose();
              }}
            />
            <Button
              primary
              text="Xác nhận"
              className="w-full h-14"
              onClick={async () => {
                await props.onClose();
                try {
                  const res = await ServiceReservationService.cancelServiceReservation(
                    props.reserId
                  );
                  props.load(true);
                  toast.success("Hủy lịch đặt thành công");
                } catch (error) {
                  toast.error("Hủy lịch đặt thất bại", error.message);
                }
              }}
            />
          </div>
        )}
        {props.type == "change" && (
          <Button
            primary
            text="Đóng"
            className="w-full h-14"
            onClick={async () => {
              await props.onClose();
            }}
          />
        )}
      </Dialog.Body>
    </Dialog>
  );
}
