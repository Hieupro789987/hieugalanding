import { NextSeo } from "next-seo";
import { ProfileOrderDetailsPage } from "../../../../components/index/profile/components/profile-order-details";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Chi tiết đơn hàng" />
      <ProfileOrderDetailsPage />
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Chi tiết đơn hàng" };
