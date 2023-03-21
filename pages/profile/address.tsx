import { NextSeo } from "next-seo";
import { ProfileAddress } from "../../components/index/profile/components/profile-address";
import { ProfilePage } from "../../components/index/profile/profile-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { useScreen } from "../../lib/hooks/useScreen";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Danh sách địa chỉ" />
      {screenLg ? <ProfilePage /> : <ProfileAddress />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Địa chỉ" };
