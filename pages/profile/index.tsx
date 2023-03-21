import { NextSeo } from "next-seo";
import { ProfilePage } from "../../components/index/profile/profile-page";
import { ProfilePageWebapp } from "../../components/index/profile/profile-page-webapp";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { useScreen } from "../../lib/hooks/useScreen";

export default function Page(props) {
  const screenLg = useScreen("lg");

  return (
    <>
      <NextSeo title="Thông tin tài khoản" />
      {screenLg ? <ProfilePage /> : <ProfilePageWebapp />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Tài khoản" };
