import { formatDate, parseNumber } from "../../../../../lib/helpers/parser";
import { NotFound } from "../../../../shared/utilities/misc";
import { useServiceReservationDetailsContext } from "../../providers/service-reservation-details-provider";

interface ServiceReservationDetailsHistoryProps extends ReactProps {}

export function ServiceReservationDetailsHistory({
  ...props
}: ServiceReservationDetailsHistoryProps) {
  const { reservation } = useServiceReservationDetailsContext();
  const convertContent = (log) => {
    if (!reservation?.id) return;

    const { type, updatedTotalPrice, name } = log;
    let typeString = "";
    let nameString = "";
    let updatedTotalPriceString = "";
    if (type === "UPDATED" && !name && !updatedTotalPrice) {
      typeString += `đã được cập nhật thông tin`;
      nameString += ` từ người dùng`;
    }

    if (type === "UPDATED" && name && !updatedTotalPrice) {
      typeString += `đã được cập nhật thông tin`;
      nameString += ` bởi ${name}`;
    }

    if (type === "UPDATED" && name && updatedTotalPrice) {
      typeString += `đã được cập nhật giá`;
      updatedTotalPriceString += ` thành ${parseNumber(updatedTotalPrice, true)}`;
      nameString += ` bởi ${name}`;
    }

    if (type === "RESERVED") {
      typeString += `đã đặt lịch thành công`;
    }

    if (type === "CONFIRMED") {
      typeString += `đã xác nhận thành công`;
      nameString += ` bởi ${name}`;
    }

    if (type === "COMPLETED") {
      typeString += `đã hoàn thành`;
    }

    if (type === "CANCELED") {
      typeString += `đã hủy`;
      nameString += ` bởi ${name}`;
    }

    return (
      <>
        Lịch hẹn #{reservation.code} <strong>{typeString}</strong>
        {updatedTotalPriceString}
        {nameString}.
      </>
    );
  };

  return (
    <div className="mt-6 text-primaryBlack">
      <div className="text-xl font-extrabold">Lịch sử lịch hẹn</div>
      <div className="flex p-3 mt-3 text-sm font-bold uppercase bg-gray-200 rounded-t gap-x-4">
        <div className="w-1/4 grow-0 shrink-0">thời điểm</div>
        <div className="flex-1">nội dung</div>
      </div>
      <div className="border-2 border-gray-100 rounded-b">
        {!reservation.logs?.length ? (
          <NotFound text="Chưa có lịch sử lịch hẹn." />
        ) : (
          <div className="px-3">
            {[...reservation.logs]
              ?.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
              ?.map((log, index) => (
                <div
                  key={index}
                  className="flex py-2.5 border-b-2 border-gray-100 gap-x-4 last:border-none last:rounded-b"
                >
                  <div className="w-1/4 grow-0 shrink-0">
                    {formatDate(log?.date, "dd/MM/yyyy HH:mm")}
                  </div>
                  <div className="flex-1">{convertContent(log)}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
