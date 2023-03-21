import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { NewsPage } from "../../../../components/index/news/news-page";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../../lib/helpers/redirect";
import { Post, PostService } from "../../../../lib/repo/post.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo title={props.title} />
      <NewsPage newsSlug="thong-tin-thi-truong" />
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Tin tức" };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { postSlug = "" } = context.params;

  const post = await new RequestGraphql<Post>(
    PostService,
    "getAllPost",
    "id title excerpt featureImage",
    {
      filter: { slug: postSlug },
    }
  ).findOne();

  if (!post) Redirect(context.res, "/404");

  return {
    props: JSON.parse(
      JSON.stringify({
        id: post.id,
        title: post.title,
      })
    ),
  };
}
