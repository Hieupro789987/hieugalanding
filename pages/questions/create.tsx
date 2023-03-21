import { NextSeo } from "next-seo";
import { QuestionsCreatePage } from "../../components/index/questions/questions-create-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Tạo câu hỏi" />
      <QuestionsCreatePage />
    </>
  );
}

Page.Layout = DefaultLayout;
