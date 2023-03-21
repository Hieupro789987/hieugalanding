import { addDays } from "date-fns";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { ServiceReservationService } from "../../../../../lib/repo/services/service-reservation.repo";
import { ShopServiceSpecialistService } from "../../../../../lib/repo/services/shop-service-specialist.repo";
import { ShopBranchService } from "../../../../../lib/repo/shop-branch.repo";
import { CloseButtonHeaderDialog } from "../../../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../../../shared/dialog/title-dialog";
import {
  Button,
  DatePicker,
  Field,
  Form,
  FormProps,
  Select,
  Textarea,
} from "../../../../shared/utilities/form";
import { useDataTable } from "../../../../shared/utilities/table/data-table";
import { useServiceReservationDetailsContext } from "../../providers/service-reservation-details-provider";

interface ServiceReservationDetailsUpdateInfoDialogProps extends FormProps {}

export function ServiceReservationDetailsUpdateInfoDialog({
  ...props
}: ServiceReservationDetailsUpdateInfoDialogProps) {
  const toast = useToast();
  const { loadAll } = useDataTable();
  const { reservation, setReservation } = useServiceReservationDetailsContext();

  const handleSubmit = async (data) => {
    try {
      const res = await ServiceReservationService.updateServiceReservationByMember(
        reservation.id,
        data
      );
      setReservation(res);
      props.onClose();
      loadAll(true);
      toast.success("Cập nhật thông tin thành công.");
    } catch (error) {
      console.debug(error);
      toast.error("Cập nhật thông tin thất bại.", `${error.message}`);
    }
  };

  return (
    <Form dialog grid width={400} defaultValues={reservation} onSubmit={handleSubmit} {...props}>
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Chỉnh sửa thông tin đặt lịch" className="col-span-12" />
      <Field cols={12} name="reservationDate" label="Ngày hẹn" required>
        <DatePicker
          minDate={addDays(new Date(), reservation.service?.minAdvanceReservationInDay)}
        />
      </Field>
      <Field cols={12} name="shopServiceSpecialistId" label="Chuyên viên" required>
        <Select
          hasImage
          isAvatarImage
          clearable
          autocompletePromise={(props) =>
            ShopServiceSpecialistService.getAllAutocompletePromise(props, {
              fragment: "id name avatar",
              parseOption: (data) => ({
                value: data.id,
                label: data.name,
                image: data.avatar,
              }),
              query: {
                filter: reservation.service?.shopServiceSpecialistIds?.length > 0 && {
                  _id: { $in: reservation.service?.shopServiceSpecialistIds },
                },
              },
            })
          }
        />
      </Field>
      <Field
        cols={12}
        name="reservationShopBranchId"
        label="Chi nhánh"
        required={reservation?.addressType === "AT_SHOP"}
        className={`${reservation?.addressType !== "AT_SHOP" && "hidden"}`}
      >
        <Select clearable optionsPromise={() => ShopBranchService.getAllOptionsPromise()} />
      </Field>
      <Field cols={12} name="note" label="Ghi chú">
        <Textarea />
      </Field>
      <div className="flex col-span-12 mt-1.5 mb-4 gap-x-4">
        <Button
          outline
          large
          primary
          text="Hủy"
          className="w-full"
          onClick={() => props.onClose()}
        />
        <Button primary large text="Cập nhật" submit className="w-full" />
      </div>
    </Form>
  );
}
