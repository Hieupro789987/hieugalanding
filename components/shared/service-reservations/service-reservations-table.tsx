import { useState } from "react";
import { RiEditBoxLine, RiFileList2Line, RiMapPinFill, RiStoreFill } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import {
  ServiceReservation,
  ServiceReservationService,
  SERVICE_RESERVATION_ADDRESS_TYPE_LIST,
  SERVICE_RESERVATION_STATUS_LIST,
} from "../../../lib/repo/services/service-reservation.repo";
import { ShopServiceCategoryService } from "../../../lib/repo/services/shop-service-category.repo";
import { ExportReservationsDialog } from "../../shop/shop-service-reservations/components/export-reservations-dialog";
import { ServiceReservationDetailsDialog } from "../../shop/shop-service-reservations/components/service-reservation-details/service-reservation-details-dialog";
import { DatePicker, Field, Select } from "../utilities/form";
import { Card } from "../utilities/misc";
import { DataTable } from "../utilities/table/data-table";

interface ServiceReservationsTableProps extends ReactProps {
  isAdmin: boolean;
  isShop: boolean;
}

export function ServiceReservationsTable({
  isAdmin,
  isShop,
  ...props
}: ServiceReservationsTableProps) {
  const toast = useToast();
  const alert = useAlert();
  const [reservationDate, setReservationDate] = useState<any>();
  const [shopServiceCategoryId, setShopServiceCategoryId] = useState<string>();
  const [status, setStatus] = useState();
  const [addressType, setAddressType] = useState();
  const [openExportReservations, setOpenExportReservations] = useState(false);
  const [reservationId, setReservationId] = useState<string>();
  const [openUpdatePriceDialog, setOpenUpdatePriceDialog] = useState(false);

  const handleFilterDate = (val) => {
    const obj = { reservationDate: val?.startDate && val?.endDate ? {} : undefined };
    if (val?.startDate) {
      obj["reservationDate"]["$gte"] = val?.startDate;
    }
    if (val?.endDate) {
      obj["reservationDate"]["$lte"] = val?.endDate;
    }
    setReservationDate(obj);
    console.log("obj: ", obj);
  };

  const confirmServiceReservation = async (serviceReservationId: string) => {
    try {
      const res = await alert.question("Xác nhận lịch hẹn?", "Bạn muốn xác nhận lịch hẹn?");
      if (!res) return;

      await ServiceReservationService.confirmServiceReservationByMember(serviceReservationId);
      alert.success("Đã xác nhận lịch hẹn");
    } catch (error) {
      alert.error("Duyệt lịch hẹn thất bại " + error);
    }
  };

  const completeServiceReservation = async (serviceReservationId: string) => {
    try {
      const res = await alert.question(
        "Xác nhận hoàn thành lịch hẹn?",
        "Bạn muốn hoàn thành lịch hẹn?"
      );
      if (!res) return;

      await ServiceReservationService.completeServiceReservationByMember(serviceReservationId);
      alert.success("Đã hoàn tất lịch hẹn");
    } catch (error) {
      alert.error("Hoàn tất lịch hẹn thất bại");
    }
  };

  const cancelServiceReservation = async (serviceReservationId: string) => {
    try {
      const res = await alert.danger("Xác nhận hủy lịch hẹn?", "Bạn muốn hủy lịch hẹn?");
      if (!res) return;

      await ServiceReservationService.cancelServiceReservationByMember(serviceReservationId);
      alert.success("Đã hủy lịch hẹn");
    } catch (error) {
      alert.error("Hủy lịch hẹn thất bại " + error);
    }
  };

  return (
    <Card>
      <DataTable<ServiceReservation>
        crudService={ServiceReservationService}
        order={{ createdAt: -1 }}
        autoRefresh={30000}
        filter={{
          shopServiceCategoryId: !!shopServiceCategoryId ? shopServiceCategoryId : undefined,
          status: !!status ? status : undefined,
          addressType: !!addressType ? addressType : undefined,
          ...reservationDate,
        }}
      >
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => <DataTable.Title subtitle={`Tổng ${total} lịch hẹn`} />}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button
              primary
              outline
              text="Xuất danh sách lịch hẹn"
              onClick={() =>
                // setOpenExportReservations(true)
                toast.info("Tính năng đang cập nhật.")
              }
            />
          </DataTable.Buttons>
        </DataTable.Header>

        <div className="mt-4">
          <DataTable.Toolbar>
            <DataTable.Search className="h-12" />
            <DataTable.Filter>
              <div className="flex flex-wrap justify-end gap-2">
                <Field noError className="min-w-2xs">
                  <DatePicker
                    className="h-12"
                    selectsRange
                    startOfDay
                    endOfDay
                    monthsShown={2}
                    placeholder="Ngày hẹn"
                    onChange={(val) => handleFilterDate(val)}
                  />
                </Field>
                <Field name="shopServiceCategoryId" noError>
                  <Select
                    className="inline-grid h-12 w-52"
                    clearable
                    placeholder="Danh mục"
                    optionsPromise={() => ShopServiceCategoryService.getAllOptionsPromise()}
                    onChange={(val) => setShopServiceCategoryId(val)}
                  />
                </Field>
                <Field name="status" noError>
                  <Select
                    className="inline-grid h-12 w-52"
                    clearable
                    placeholder="Trạng thái"
                    options={SERVICE_RESERVATION_STATUS_LIST}
                    onChange={(val) => setStatus(val)}
                  />
                </Field>
                <Field name="addressType" noError>
                  <Select
                    className="inline-grid h-12 w-52"
                    clearable
                    placeholder="Địa điểm"
                    options={SERVICE_RESERVATION_ADDRESS_TYPE_LIST}
                    onChange={(val) => setAddressType(val)}
                  />
                </Field>
              </div>
            </DataTable.Filter>
          </DataTable.Toolbar>
        </div>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Lịch hẹn"
            render={(item: ServiceReservation) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="font-bold">{`#${item.code}`}</div>
                    <div className="text-sm text-gray-600">{item.name}</div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Ngày hẹn"
            render={(item: ServiceReservation) => (
              <DataTable.CellDate value={item.reservationDate} />
            )}
          />
          <DataTable.Column
            center
            label="Cửa hàng"
            className={`${isShop && "hidden"}`}
            render={(item: ServiceReservation) => (
              <DataTable.CellText value={isShop ? <></> : item.member?.shopName} />
            )}
          />
          <DataTable.Column
            label="Người đặt"
            render={(item: ServiceReservation) => (
              <DataTable.CellText
                className="font-bold"
                subTextClassName="font-normal"
                value={item.reserverFullname}
                subText={item.reserverInternationalPhone}
              />
            )}
          />
          <DataTable.Column
            center
            label="Địa điểm thực hiện"
            render={(item: ServiceReservation) => (
              <DataTable.CellText
                value={
                  item.addressType === "AT_SHOP" ? (
                    <div className="flex justify-center gap-2">
                      <i className="text-lg text-gray-500">
                        <RiStoreFill />
                      </i>
                      <div className="">Tại chi nhánh cửa hàng</div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <i className="text-lg text-gray-500">
                        <RiMapPinFill />
                      </i>
                      <div className="">Tại địa chỉ khách hàng</div>
                    </div>
                  )
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: ServiceReservation) => (
              <DataTable.CellStatus
                value={item.status}
                options={SERVICE_RESERVATION_STATUS_LIST}
                type="light"
              />
            )}
          />
          <DataTable.Column
            label="Tổng tiền"
            render={(item: ServiceReservation) => (
              <DataTable.CellText
                value={
                  item.servicePriceType === "CONTACT"
                    ? "Liên hệ"
                    : parseNumber(item.totalPrice, true)
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: ServiceReservation) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiEditBoxLine />}
                  className={isAdmin && "hidden"}
                  moreItems={[
                    ...(item.status === "PENDING" && item.servicePriceType === "CONTACT"
                      ? [
                          {
                            text: "Cập nhật giá",
                            onClick: () => {
                              setReservationId(item.id);
                              setOpenUpdatePriceDialog(true);
                            },
                          },
                        ]
                      : []),
                    {
                      text: "Xác nhận",
                      disabled: item.status !== "PENDING",
                      onClick: async () => {
                        await confirmServiceReservation(item.id);
                      },
                      refreshAfterTask: true,
                    },
                    {
                      text: "Hoàn thành",
                      disabled: item.status !== "CONFIRMED",
                      onClick: async () => {
                        await completeServiceReservation(item.id);
                      },
                      refreshAfterTask: true,
                    },
                    {
                      text: "Hủy",
                      disabled: item.status === "CANCELED" || item.status == "COMPLETED",
                      onClick: async () => {
                        await cancelServiceReservation(item.id);
                      },
                    },
                  ]}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiFileList2Line />}
                  tooltip="Xem chi tiết"
                  onClick={() => setReservationId(item.id)}
                />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ filter, loadAll }) => (
            <>
              <ServiceReservationDetailsDialog
                id={reservationId}
                isOpen={!!reservationId}
                showUpdatePriceDialog={openUpdatePriceDialog}
                onClose={() => {
                  setReservationId("");
                  setOpenUpdatePriceDialog(false);
                }}
                isShop={isShop}
                isAdmin={isAdmin}
                onConfirmClick={confirmServiceReservation}
                onCompleteClick={completeServiceReservation}
                onCancelClick={cancelServiceReservation}
              />
              <ExportReservationsDialog
                isOpen={openExportReservations}
                onClose={() => {
                  setOpenExportReservations(false);
                }}
                // shopBranchId={filter.shopBranchId}
                // pickupMethod={filter.pickupMethod}
                // paymentMethod={filter.paymentMethod}
                // status={filter.status}
              />
              {/* <Form
                grid
                dialog
                width={400}
                isOpen={cancelOrderId ? true : false}
                onClose={() => setCancelOrderId(null)}
                onSubmit={async (data) => {
                  await cancelOrder(cancelOrderId.id, data.note);
                  loadAll(true);
                }}
                title="Hủy đơn hàng"
              >
                <Field label="Mã đơn hàng" cols={12}>
                  <Input value={cancelOrderId?.code} readOnly></Input>
                </Field>
                <Field label="Lý do hủy đơn" name="note" cols={12}>
                  <Textarea></Textarea>
                </Field>
                <Form.Footer />
              </Form>
              <DeliveryDialog
                isOpen={!!openDelivery}
                onClose={() => {
                  setOpenDelivery("");
                }}
                orderId={openDelivery}
                onConfirm={() => {
                  loadAll(true);
                }}
              /> */}
            </>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
