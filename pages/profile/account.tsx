import { NextSeo } from "next-seo";
import { ProfileAccount } from "../../components/index/profile/components/profile-account";
import { ProfilePage } from "../../components/index/profile/profile-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { useScreen } from "../../lib/hooks/useScreen";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Thông tin tài khoản" />
      {screenLg ? <ProfilePage /> : <ProfileAccount />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Tài khoản" };
