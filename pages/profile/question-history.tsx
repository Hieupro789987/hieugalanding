import { NextSeo } from "next-seo";
import { ProfileQuestionHistory } from "../../components/index/profile/components/profile-question-history";
import { useScreen } from "../../lib/hooks/useScreen";
import { ProfilePage } from "../../components/index/profile/profile-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  const screenLg = useScreen("lg");
  return (
    <>
      <NextSeo title="Lịch sử câu hỏi" />
      {screenLg? <ProfilePage /> : <ProfileQuestionHistory />}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Lịch sử câu hỏi" };
