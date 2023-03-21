import { NextSeo } from "next-seo";
import { ProfileOrderHistory } from "../../../components/index/profile/components/profile-order-history";
import { ProfilePage } from "../../../components/index/profile/profile-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { useScreen } from "../../../lib/hooks/useScreen";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Lịch sử đơn hàng" />
      {screenLg ? <ProfilePage /> : <ProfileOrderHistory />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Đơn hàng" };
