import { ServiceReservationsTable } from "../../shared/service-reservations/service-reservations-table";

interface ShopServiceReservationsPageProps extends ReactProps {}

export function ShopServiceReservationsPage({ ...props }: ShopServiceReservationsPageProps) {
  return <ServiceReservationsTable isShop isAdmin={false} />;
}
