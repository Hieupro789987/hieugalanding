import { NextSeo } from "next-seo";
import { StoreDetailServices } from "../../../../components/index/store-detail/components/store-detail-services/store-detail-services";
import { StoreDetailServiceProvider } from "../../../../components/index/store-detail/components/store-detail-services/provider/store-detail-service-provider";
import { StoreDetailPage } from "../../../../components/index/store-detail/store-detail-page";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Dịch vụ" />
      <StoreDetailPage mode="services" />
    </>
  );
}
Page.Layout = DefaultLayout;
