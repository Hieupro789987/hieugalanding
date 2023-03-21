import { RiCloseLine } from "react-icons/ri";
import { Dialog, DialogProps } from "../../../../shared/utilities/dialog";
import { Button } from "../../../../shared/utilities/form";
import { Spinner } from "../../../../shared/utilities/misc";
import {
  ServiceReservationDetailsContext,
  ServiceReservationDetailsProvider,
} from "../../providers/service-reservation-details-provider";
import { ServiceReservationDetailsHistory } from "./service-reservation-details-history";
import { ServiceReservationDetailsInfo } from "./service-reservation-details-info";
import { ServiceReservationDetailsPriceList } from "./service-reservation-details-price-list";

interface ServiceReservationDetailsDialogProps extends DialogProps {
  id: string;
  showUpdatePriceDialog: boolean;
  isAdmin: boolean;
  isShop: boolean;
  onConfirmClick: (id: string) => void;
  onCompleteClick: (id: string) => void;
  onCancelClick: (id: string) => void;
}

export function ServiceReservationDetailsDialog({
  id,
  showUpdatePriceDialog,
  isAdmin,
  isShop,
  onConfirmClick,
  onCompleteClick,
  onCancelClick,
  ...props
}: ServiceReservationDetailsDialogProps) {
  return (
    <Dialog width={800} {...props}>
      <Dialog.Body>
        <ServiceReservationDetailsProvider
          id={id}
          showUpdatePriceDialog={showUpdatePriceDialog}
          onConfirmClick={onConfirmClick}
          onCompleteClick={onCompleteClick}
          onCancelClick={onCancelClick}
        >
          <ServiceReservationDetailsContext.Consumer>
            {({ reservation }) => (
              <>
                {!reservation?.id ? (
                  <Spinner />
                ) : (
                  <div className="p-3">
                    <div className="flex justify-end">
                      <Button
                        tooltip="Đóng"
                        icon={<RiCloseLine />}
                        iconClassName="text-2xl text-gray-400 hover:text-danger"
                        className="px-2 -mt-2 -mr-2"
                        onClick={props.onClose}
                      />
                    </div>
                    <ServiceReservationDetailsPriceList isAdmin={isAdmin} isShop={isShop} />
                    <ServiceReservationDetailsInfo
                      reservation={reservation}
                      hasEdit={isShop && reservation.status === "PENDING"}
                    />
                    <ServiceReservationDetailsHistory />
                  </div>
                )}
              </>
            )}
          </ServiceReservationDetailsContext.Consumer>
        </ServiceReservationDetailsProvider>
      </Dialog.Body>
    </Dialog>
  );
}
