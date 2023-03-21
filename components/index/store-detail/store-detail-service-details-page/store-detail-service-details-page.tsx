import { useScreen } from "../../../../lib/hooks/useScreen";
import { BreadCrumbs, Img, Spinner } from "../../../shared/utilities/misc";
import { ServiceAdditionalServices } from "./components/service-additional-services";
import { ServiceDescribe } from "./components/service-describe";
import { ServiceImages } from "./components/service-images";
import { ServiceInformation } from "./components/service-information";
import { ServiceShop } from "./components/service-shop";
import { useStoreDetailServiceDetailsContext } from "./provider/store-detail-service-details-provider";

export function StoreDetailServiceDetailsPage() {
  const isLg = useScreen("lg");
  const { service } = useStoreDetailServiceDetailsContext();

  if (!service) return <Spinner />;

  return (
    <div className={isLg ? "main-container" : ""}>
      <div className={!isLg ? "bg-white" : ""}>
        <div className={!isLg ? "main-container" : ""}>
          <BreadCrumbs
            className="relative z-10 py-6"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                href: `/store/${service?.member?.code}/services`,
                label: `${service?.member?.shopName}`,
              },
              {
                href: `/store/${service?.member?.code}/services`,
                label: `${service?.shopServiceCategory?.name}`,
              },
              {
                label: `${service?.name}`,
              },
            ]}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col bg-white lg:p-8 selection: lg:flex-row">
          <ServiceImages images={service?.images || []} />
          <div>
            <ServiceInformation service={service} />
            <ServiceAdditionalServices service={service} />
          </div>
        </div>

        <ServiceShop service={service} />
        <ServiceDescribe description={service?.description} />
      </div>
    </div>
  );
}
