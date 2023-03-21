import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { QuestionDetailsPage } from "../../components/index/question-details/question-details-page";
import { DEFAULT_LOGO_IMAGE } from "../../components/shared/question/commons/commons";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../lib/graphql/fetch-graphql";
import { formatDate } from "../../lib/helpers/parser";
import { Redirect } from "../../lib/helpers/redirect";
import { useSEO } from "../../lib/hooks/useSEO";
import { Question, QuestionService } from "../../lib/repo/question/question.repo";

export default function Page({ ...props }) {
  return (
    <>
      <NextSeo {...props.seo} />
      <QuestionDetailsPage />
    </>
  );
}
Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Câu hỏi" };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug = "" } = context.params;

  const question = await new RequestGraphql(
    QuestionService,
    "getAllQuestion",
    "id title createdAt isDeleted",
    {
      filter: { slug: slug },
    }
  ).findOne();

  if (!question || question?.isDeleted)
    Redirect(context.res, "/questions/question-not-found");

  const seo = await useSEO(question?.title, {
    image: DEFAULT_LOGO_IMAGE,
    description: `Hỏi vào ngày ${formatDate(question.createdAt, "HH:mm dd-MM-yyyy")}`,
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        seo,
      })
    ),
  };
}
