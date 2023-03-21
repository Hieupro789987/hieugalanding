import { NextSeo } from "next-seo";
import { StoreDetailOrderServicesPage } from "../../../../../../components/index/store-detail/store-detail-order-services-page";
import { DefaultLayout } from "../../../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang đặt dịch vụ" />
      <StoreDetailOrderServicesPage />
    </>
  );
}

Page.Layout = DefaultLayout;
