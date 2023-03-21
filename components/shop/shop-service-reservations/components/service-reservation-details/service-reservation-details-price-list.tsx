import { AdditionalService } from "../../../../shared/reservation/additional-service";
import { useServiceReservationDetailsContext } from "../../providers/service-reservation-details-provider";
import { ServiceReservationDetailsUpdatePriceDialog } from "./service-reservation-details-update-price-dialog";

interface ServiceReservationDetailsPriceListProps extends ReactProps {
  isShop: boolean;
  isAdmin: boolean;
}

export function ServiceReservationDetailsPriceList({
  isShop,
  isAdmin,
  ...props
}: ServiceReservationDetailsPriceListProps) {
  const {
    reservation,
    onUpdatePrice,
    openUpdatePriceDialog,
  } = useServiceReservationDetailsContext();

  return (
    <>
      <AdditionalService
        reservation={reservation}
        onUpdatePrice={onUpdatePrice}
        isAdmin={isAdmin}
        isShop={isShop}
        isWeb={false}
      />
      <ServiceReservationDetailsUpdatePriceDialog
        isOpen={openUpdatePriceDialog}
        onClose={() => onUpdatePrice?.(false)}
      />
    </>
  );
}
