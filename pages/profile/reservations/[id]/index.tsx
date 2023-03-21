import { NextSeo } from "next-seo";
import { ProfileReservationsDetail } from "../../../../components/index/profile/components/profile-reservations-detail";
import { ProfilePage } from "../../../../components/index/profile/profile-page";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";
import { useScreen } from "../../../../lib/hooks/useScreen";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Lịch sử đặt lịch" />
      {screenLg ? <ProfilePage /> : <ProfileReservationsDetail />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Lịch sử đặt lịch" };
