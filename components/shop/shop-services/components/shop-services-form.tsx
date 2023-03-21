import { Service } from "../../../../lib/repo/services/service.repo";
import { FormProps } from "../../../shared/utilities/form";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { ShopServiceInfo } from "./shop-service-info";
import { ShopServiceReservation } from "./shop-service-reservation";
import { ShopServiceAdditionalServiceList } from "./shop-services-additional-service/shop-services-additional-service-list";

export function ShopServicesForm({ formItem, ...props }: FormProps & { formItem: Service }) {
  const handleTransformDefaultValues = (data) => {
    const newData = {
      ...data,
      isSelectAssignedSpecialist: data.shopServiceSpecialistIds?.length > 0,
      specialistIds: data.shopServiceSpecialistIds,
      minAdvanceReservationChangeInDay: data.canChangeReservation
        ? data.minAdvanceReservationChangeInDay
        : 1,
      minAdvanceReservationCancelInDay: data.canChangeReservation
        ? data.minAdvanceReservationCancelInDay
        : 1,
    };

    return newData;
  };

  const handleBeforeSubmit = (data) => {
    const { isSelectAssignedSpecialist, specialistIds, ...rest } = data;
    if (rest.canReserverSetSpecialist) {
      rest.shopServiceSpecialistIds = !isSelectAssignedSpecialist ? [] : specialistIds;
    }

    if (!rest.canReserverSetSpecialist) {
      rest.shopServiceSpecialistIds = [];
    }

    if (!rest.additionalServices?.length) {
      rest.additionalServices = [];
    }

    return { ...rest };
  };

  return (
    <DataTable.Form
      grid
      width={800}
      className="text-accent"
      transformDefaultValues={handleTransformDefaultValues}
      beforeSubmit={handleBeforeSubmit}
    >
      <ShopServiceInfo />
      <hr className="col-span-12"></hr>
      <ShopServiceReservation />
      <hr className="col-span-12"></hr>
      <ShopServiceAdditionalServiceList />
    </DataTable.Form>
  );
}

export const PartLabel = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`col-span-12 mt-4 mb-2 font-bold uppercase text-accent ${className || "mt-4"}`}>
      {text}
    </div>
  );
};
