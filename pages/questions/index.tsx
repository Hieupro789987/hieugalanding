import { NextSeo } from "next-seo";
import { QuestionsPage } from "../../components/index/questions/questions-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Hỏi đáp" />
      <QuestionsPage />
    </>
  );
}

Page.Layout = DefaultLayout;
