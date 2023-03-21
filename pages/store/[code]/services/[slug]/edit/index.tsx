import { NextSeo } from "next-seo";
import { StoreDetailOrderServicesPage } from "../../../../../../components/index/store-detail/store-detail-order-services-page";
import { DefaultLayout } from "../../../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Thay đổi thông tin đặt lịch" />
      <StoreDetailOrderServicesPage />
    </>
  );
}

Page.Layout = DefaultLayout;
