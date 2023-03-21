import { token } from "morgan";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiRefreshLine, RiStore2Line } from "react-icons/ri";
import { GetGlobalCustomerToken } from "../../../../lib/graphql/auth.link";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../lib/providers/auth-provider";
import {
  ServiceReservation,
  ServiceReservationService,
  SERVICE_RESERVATION_STATUS_LIST,
} from "../../../../lib/repo/services/service-reservation.repo";
import { Button } from "../../../shared/utilities/form";
import { BreadCrumbs, Img, NotFound, Spinner, StatusLabel } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function ProfileReservations({ ...props }) {
  const { globalCustomer } = useAuth();
  const screenLg = useScreen("lg");
  const { items, page, setPage, total, loadAll } = useCrud(
    ServiceReservationService,
    {
      limit: 6,
      order: { createdAt: -1 },
    },
    { fetchingCondition: !!globalCustomer }
  );

  if (items == undefined || items == null) return <Spinner />;

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
                label: "Lịch sử đặt lịch",
              },
            ]}
          />
        </div>
      )}
      <div className="flex-1 p-3 bg-white lg:p-0">
        <div className="flex items-center justify-between mb-5 lg:mb-0 ">
          <div className="text-lg font-bold text-accent">LỊCH SỬ ĐẶT LỊCH</div>
          <Button
            textPrimary
            light
            icon={<RiRefreshLine />}
            iconClassName="text-xl"
            className="px-2.5 py-1"
            tooltip="Tải lại"
            onClick={async () => await loadAll(true)}
          />
        </div>
        {items?.length > 0 ? (
          items.map((item: ServiceReservation) => (
            <ReservationItem reservation={item} key={item.id} />
          ))
        ) : (
          <NotFound text="Lịch sử đặt lịch trống" />
        )}
        {items.length < total && (
          <div className="flex justify-end mt-8">
            <PaginationRound
              limit={6}
              page={page}
              total={total}
              onPageChange={(page: number) => setPage(page)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export function ReservationItem({ reservation, ...props }: { reservation: ServiceReservation }) {
  const screenLg = useScreen("lg");
  const router = useRouter();
  return (
    <Link href={`${router.asPath}/${reservation?.id}`}>
      <a className="cursor-pointer group">
        <div className="p-3 mt-2 transition border border-gray-300 rounded-md shadow-sm lg:mt-3 lg:p-4 group-hover:boder-primary">
          <div className="flex flex-row items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold lg:text-base">
                <p>
                  {screenLg ? (
                    `Lịch hẹn #${reservation?.code} tạo ngày
                          ${formatDate(reservation?.createdAt, "dd/MM/yyyy")}`
                  ) : (
                    <>
                      Lịch hẹn #{reservation?.code}
                      <span className="font-normal text-gray-500">
                        {" "}
                        tạo{" "}
                        {formatDistanceToNow(new Date(reservation?.createdAt), {
                          locale: vi,
                          addSuffix: true,
                        })}
                      </span>
                    </>
                  )}
                </p>
              </span>
              <div className="mt-1 text-xs font-bold text-primary lg:text-base">
                Ngày hẹn: {formatDate(reservation?.reservationDate, "dd/MM/yyyy")}
              </div>
            </div>
            <StatusLabel
              type="light"
              value={reservation?.status}
              options={SERVICE_RESERVATION_STATUS_LIST}
              maxContent
              className="px-2 py-2 text-xs rounded lg:py-2 lg:px-3 lg:text-sm"
            />
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row lg:items-center ">
              <Img
                default={reservation?.images[0]}
                src={reservation?.images[0]}
                className="lg:w-[50px] w-12 shrink-0 grow-0"
                rounded
              />
              <div className="flex flex-col justify-around max-w-lg ml-2 lg:ml-3">
                <p
                  className={`lg:mb-2 mb-1 font-extrabold group-hover:underline group-hover:text-primary lg:text-base text-sm ${
                    screenLg ? "text-ellipsis-1" : "text-ellipsis-2"
                  }`}
                >
                  {reservation?.name}
                </p>
                <p className="flex flex-row items-center font-extrabold text-primary">
                  <RiStore2Line />
                  <span className="w-40 ml-1 text-xs lg:min-w-fit lg:text-sm text-ellipsis-1">
                    {reservation?.member?.shopName}
                  </span>
                </p>
              </div>
            </div>
            <div className="ml-auto text-sm font-extrabold lg:text-xl text-primary lg:ml-0 lg:mt-0">
              {reservation?.servicePriceType === "FIXED"  ?  parseNumber(reservation?.totalPrice, true) : "Giá liên hệ"}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
