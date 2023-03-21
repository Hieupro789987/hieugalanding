import { useScreen } from "../../../lib/hooks/useScreen";
import { ProfilePage } from "../../../components/index/profile/profile-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { NextSeo } from "next-seo";
import { ProfileReservations } from "../../../components/index/profile/components/profile-reservations";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Lịch sử đặt lịch" />
      {screenLg ? <ProfilePage /> : <ProfileReservations />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Lịch sử đặt lịch" };
