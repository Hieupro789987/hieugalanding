import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  ServiceReservation,
  ServiceReservationService,
} from "../../../../lib/repo/services/service-reservation.repo";

export const ServiceReservationDetailsContext = createContext<
  Partial<{
    reservation: ServiceReservation;
    setReservation: (reservation: ServiceReservation) => void;
    openUpdatePriceDialog: boolean;
    onUpdatePrice: (val: boolean) => void;
    onConfirmClick: (id: string) => void;
    onCompleteClick: (id: string) => void;
    onCancelClick: (id: string) => void;
    loadReservation: (id: string) => void;
  }>
>({});

interface ServiceReservationDetailsProviderProps extends ReactProps {
  id: string;
  showUpdatePriceDialog: boolean;
  onConfirmClick: (id: string) => void;
  onCompleteClick: (id: string) => void;
  onCancelClick: (id: string) => void;
}

export function ServiceReservationDetailsProvider({
  id,
  showUpdatePriceDialog,
  onConfirmClick,
  onCompleteClick,
  onCancelClick,
  ...props
}: ServiceReservationDetailsProviderProps) {
  const toast = useToast();
  const [reservation, setReservation] = useState<ServiceReservation>();
  const [openUpdatePriceDialog, setOpenUpdatePriceDialog] = useState(false);

  useEffect(() => {
    if (showUpdatePriceDialog) setOpenUpdatePriceDialog(showUpdatePriceDialog);
  }, [showUpdatePriceDialog]);

  const handleUpdatePrice = (val: boolean) => setOpenUpdatePriceDialog(val);

  const getServiceReservationDetails = async (id: string) => {
    if (!id) return;

    try {
      const res = await ServiceReservationService.getOne({ id });
      setReservation(res);
    } catch (error) {
      console.debug(error);
      toast.error("Lấy dữ liệu chi tiết lịch hẹn thất bại", `${error.message}`);
    }
  };

  useEffect(() => {
    getServiceReservationDetails(id);
  }, [id]);

  return (
    <ServiceReservationDetailsContext.Provider
      value={{
        reservation,
        setReservation,
        openUpdatePriceDialog,
        onUpdatePrice: handleUpdatePrice,
        onConfirmClick,
        onCompleteClick,
        onCancelClick,
        loadReservation: getServiceReservationDetails,
      }}
    >
      {props.children}
    </ServiceReservationDetailsContext.Provider>
  );
}

export const useServiceReservationDetailsContext = () =>
  useContext(ServiceReservationDetailsContext);
