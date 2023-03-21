import { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { formatDate } from "../../../../../lib/helpers/parser";
import { ServiceReservation } from "../../../../../lib/repo/services/service-reservation.repo";
import { parseAddressTypePlace } from "../../../../shared/question/commons/commons";
import { Button } from "../../../../shared/utilities/form";
import { ServiceReservationDetailsUpdateInfoDialog } from "./service-reservation-details-update-info-dialog";

interface ServiceReservationDetailsInfoProps extends ReactProps {
  reservation: ServiceReservation;
  hasEdit?: boolean;
}

export function ServiceReservationDetailsInfo({
  reservation,
  hasEdit = false,
  ...props
}: ServiceReservationDetailsInfoProps) {
  const {
    reservationDate,
    shopServiceSpecialist,
    addressType,
    note,
    reserverFullname,
    reserverInternationalPhone,
    reservationAddress,
    reservationShopBranch,
    ...rest
  } = reservation;
  const [openUpdateInfoDialog, setOpenUpdateInfoDialog] = useState(false);

  return (
    <div className="flex flex-row mt-4 gap-x-5 text-primaryBlack">
      <div className="w-1/2 grow-0 shrink-0">
        <div className="flex items-center mb-2.5">
          <div className="text-xl font-extrabold text-primaryBlack">Thông tin đặt lịch</div>
          {hasEdit && (
            <Button
              tooltip="Chỉnh sửa"
              icon={<RiEdit2Line />}
              iconClassName="text-2xl text-gray-400 hover:text-primary"
              className="px-1.5"
              onClick={() => setOpenUpdateInfoDialog(true)}
            />
          )}
        </div>
        <div className="gap-2.5 flex-cols">
          <Row label="Ngày hẹn" value={formatDate(reservationDate, "dd/MM/yyyy")} />
          <Row label="Chuyên viên" value={shopServiceSpecialist?.name} />
          <Row
            label="Địa điểm"
            value={addressType === "AT_SHOP" ? "Tại chi nhánh cửa hàng" : "Tại địa chỉ khách hàng"}
          />
          {addressType === "AT_SHOP" && (
            <>
              <Row label="Chi nhánh" value={reservationShopBranch?.name} />
              <Row label="Địa chỉ" value={parseAddressTypePlace(reservationShopBranch)} />
            </>
          )}
          <Row label="Ghi chú" value={note} />
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xl font-extrabold text-primaryBlack mt-1.5 mb-4">
          Thông tin người đặt
        </div>
        <div className="gap-2.5 flex-cols">
          <Row label="Họ và tên" value={reserverFullname} />
          <Row label="Số điện thoại" value={reserverInternationalPhone} />
          {addressType === "AT_RESERVER" && (
            <Row label="Địa chỉ" value={parseAddressTypePlace(reservationAddress)} />
          )}
        </div>
      </div>
      <ServiceReservationDetailsUpdateInfoDialog
        isOpen={openUpdateInfoDialog}
        onClose={() => setOpenUpdateInfoDialog(false)}
      />
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
}

function Row({ label, value, ...props }: RowProps) {
  return (
    <div className="flex flex-row gap-x-2">
      <div className="w-1/3 shrink-0 grow-0">{label}</div>
      <div className="flex-1 font-semibold whitespace-pre-line">{value}</div>
    </div>
  );
}
