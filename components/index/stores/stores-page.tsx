import { LocationProvider } from "../../../lib/providers/location-provider";
import { BreadCrumbs, Spinner } from "../../shared/utilities/misc";
import { Storesfeatured } from "./components/stores-featured";
import { StoresList } from "./components/stores-list";
import { StoresProvider, useStoresContext } from "./provider/stores-provider";

type Props = {};

export function StoresPage({}: Props) {
  return (
    <LocationProvider>
      <StoresProvider>
        <StoresComponent />
      </StoresProvider>
    </LocationProvider>
  );
}
function StoresComponent() {
  const { data, setPage } = useStoresContext();

  if (!data?.shops) return <Spinner />;

  return (
    <div className="flex-1 pb-10 ">
      <div className="py-3 mb-2 border-b border-b-gray-100 lg:border-b-transparent lg:py-5 lg:mb-0">
        <div className="main-container">
          <BreadCrumbs
            breadcrumbs={[{ label: "Trang chủ", href: `/` }, { label: "Danh sách cửa hàng" }]}
          />
        </div>
      </div>
      <Storesfeatured shops={[...data.shops]} />
      <div className="mt-8 lg:mt-16">
        <StoresList
          shops={[...data.shops]}
          pagination={data.pagination}
          onClickChangePage={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
