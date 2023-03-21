import { NextSeo } from "next-seo";
import { useScreen } from "../../lib/hooks/useScreen";
import { ProfilePage } from "../../components/index/profile/profile-page";
import { ProfileInteractionHistory } from "../../components/index/profile/components/profile-interaction-history";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Lịch sử tương tác" />
      {screenLg ? <ProfilePage /> : <ProfileInteractionHistory />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Lịch sử tương tác" };
