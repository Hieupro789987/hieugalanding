import { NextSeo } from "next-seo";
import { QuestionNotFoundPage } from "../../components/shared/question/components/question-not-found";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Không tìm thấy câu hỏi" description="Câu hỏi không tồn tại hoặc đã bị xóa" />
      <QuestionNotFoundPage />
    </>
  );
}

Page.Layout = DefaultLayout;
