import { useToast } from "../../../../../lib/providers/toast-provider";
import { ServiceReservationService } from "../../../../../lib/repo/services/service-reservation.repo";
import { CloseButtonHeaderDialog } from "../../../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../../../shared/dialog/title-dialog";
import { Button, Field, Form, FormProps, Input } from "../../../../shared/utilities/form";
import { useDataTable } from "../../../../shared/utilities/table/data-table";
import { useServiceReservationDetailsContext } from "../../providers/service-reservation-details-provider";

interface ServiceReservationDetailsUpdatePriceDialogProps extends FormProps {}

export function ServiceReservationDetailsUpdatePriceDialog({
  ...props
}: ServiceReservationDetailsUpdatePriceDialogProps) {
  const toast = useToast();
  const { loadAll } = useDataTable();
  const { reservation, setReservation } = useServiceReservationDetailsContext();

  const handleSubmit = async ({ totalPrice }) => {
    try {
      const res = await ServiceReservationService.updateServiceReservationByMember(reservation.id, {
        totalPrice,
      });
      setReservation(res);
      props.onClose();
      loadAll(true);
      toast.success("Cập nhật giá dịch vụ thành công.");
    } catch (error) {
      console.debug(error);
      toast.error("Cập nhật giá dịch vụ thất bại.", `${error.message}`);
    }
  };

  return (
    <Form dialog grid width={400} onSubmit={handleSubmit} {...props}>
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Cập nhật giá" className="col-span-12" />
      <Field cols={12} name="totalPrice" label="Giá dịch vụ" required>
        <Input
          number
          placeholder="Nhập giá..."
          suffix={"VND"}
          defaultValue={reservation?.totalPrice}
        />
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
