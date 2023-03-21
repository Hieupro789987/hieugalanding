import { NextSeo } from "next-seo";
import { StoreDetailServiceDetailsProvider } from "../../../../../components/index/store-detail/store-detail-service-details-page/provider/store-detail-service-details-provider";
import { StoreDetailServiceDetailsPage } from "../../../../../components/index/store-detail/store-detail-service-details-page/store-detail-service-details-page";
import { DefaultLayout } from "../../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang chi tiết dịch vụ" />
      <StoreDetailServiceDetailsProvider>
        <StoreDetailServiceDetailsPage />
      </StoreDetailServiceDetailsProvider>
    </>
  );
}

Page.Layout = DefaultLayout;
