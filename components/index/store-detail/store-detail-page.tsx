import { useScreen } from "../../../lib/hooks/useScreen";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/misc";
import { ShopDetailsProvider } from "../shop-details/providers/shop-details-provider";
import { ShopDetailsPage } from "../shop-details/shop-details-page";
import { StoreDetailBanner } from "./components/store-detail-banner";
import StoreDetailInfo from "./components/store-detail-info";
import { StoreDetailRegisSalePoint } from "./components/store-detail-regis-sale-point";
import { StoreDetailRegisterCollaborator } from "./components/store-detail-register-collaborator";
import { StoreDetailSupport } from "./components/store-detail-support";
import { StoreDetailWheels } from "./components/store-detail-wheels";
import { StoreDetailWheelsHistory } from "./components/store-detail-wheels-history";
import { StoreDetailInformation } from "./components/store-detail-information";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { StoreDetailServices } from "./components/store-detail-services/store-detail-services";
import { StoreDetailTab } from "./components/store-detail-tab";
import { StoreDetailServiceProvider } from "./components/store-detail-services/provider/store-detail-service-provider";
import { StoreDetailAbout } from "./components/store-detail-about";
import { StoreDetailProducts } from "./components/store-detail-products.tsx/store-detail-products";
interface PropsType extends ReactProps {
  mode: string;
  code?: string;
}

export function StoreDetailPage({ mode, code, ...props }: PropsType) {
  const { shop } = useShopContext();

  if (!shop) return <Spinner />;
  return (
    <StoreDetailServiceProvider>
      {/* {screenLg ? (
        <ShopDetailsProvider>
          <StoreDetailComponents mode={mode} />
        </ShopDetailsProvider>
      ) : (
        <ShopDetailsPage />
      )} */}

      <ShopDetailsProvider>
        <StoreDetailComponents mode={mode} />
      </ShopDetailsProvider>
    </StoreDetailServiceProvider>
  );
}

function StoreDetailComponents({ mode }: PropsType) {
  const { shop } = useShopContext();
  const isLg = useScreen("lg");

  const Wrapper = isLg ? "div" : Fragment;
  return (
    <>
      <Wrapper {...(isLg ? { className: "main-container mt-6" } : {})}>
        <StoreDetailInformation />
        <StoreDetailTab mode={mode} />
      </Wrapper>
      <div className={`${isLg ? "" : "bg-white"}`}>
        <div className="main-container">
          {/* <StoreDetailBanner /> */}
          {/* <StoreDetailInfo /> */}
          {/* <StoreDetailNav /> */}
          {
            {
              about: <StoreDetailAbout />,
              services: <StoreDetailServices />,
              "": <StoreDetailProducts productGroups={shop?.config?.productGroups} />,
              // wheel: <StoreDetailWheels />,
              // support: <StoreDetailSupport />,
              // information: <StoreDetailInformation />,
              // collaboratorRegister: <StoreDetailRegisterCollaborator />,
              // detailWheel: <StoreDetailWheelsHistory />,
              // regisSalePoint: <StoreDetailRegisSalePoint />,
            }[mode]
          }
        </div>
      </div>
    </>
  );
}
