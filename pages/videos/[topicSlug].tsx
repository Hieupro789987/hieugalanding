import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { NewsPage } from "../../components/index/news/news-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../lib/graphql/fetch-graphql";

import { Redirect } from "../../lib/helpers/redirect";
import {
  YoutubeVideoGroup,
  YoutubeVideoGroupService,
} from "../../lib/repo/youtube-video-group.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo title={props.title} />
      <NewsPage newsSlug="thong-tin-mua-vu" isVideosPage />
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { topicSlug = "" } = context.params;

  const videoGroup = await new RequestGraphql<YoutubeVideoGroup>(
    YoutubeVideoGroupService,
    "getAllYoutubeVideoGroup",
    "id name slug",
    {
      filter: { slug: topicSlug },
    }
  ).findOne();

  if (!videoGroup) Redirect(context.res, "/404");
  return {
    props: JSON.parse(
      JSON.stringify({
        id: videoGroup.id,
        title: videoGroup.name,
      })
    ),
  };
}
