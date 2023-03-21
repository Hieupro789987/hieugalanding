import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { NewsPage } from "../../../components/index/news/news-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../lib/helpers/redirect";
import { Topic, TopicService } from "../../../lib/repo/topic.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo title={props.title} />
      <NewsPage newsSlug="thong-tin-mua-vu" />
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Tin tức" };

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const topic = await new RequestGraphql<Topic>(TopicService, "getAllTopic", "id name", {
    filter: { slug: "thong-tin-mua-vu" },
  }).findOne();

  if (!topic) Redirect(context.res, "/404");

  return {
    props: JSON.parse(
      JSON.stringify({
        id: topic.id,
        title: topic.name,
      })
    ),
  };
}
