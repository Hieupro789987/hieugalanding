import { NextSeo } from "next-seo";
import { QuestionsEditPage } from "../../components/index/questions/questions-edit-page";

import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Chỉnh sửa câu hỏi" />
      <QuestionsEditPage />
    </>
  );
}

Page.Layout = DefaultLayout;
