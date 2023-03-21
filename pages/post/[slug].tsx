import React from "react";
import { Redirect } from "../../lib/helpers/redirect";
import { NextSeo } from "next-seo";
import { GetServerSidePropsContext } from "next";
import { PostPage } from "../../components/index/post-desktop/post-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../lib/graphql/fetch-graphql";
import { Post, PostService } from "../../lib/repo/post.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo title={props.title} />
      <PostPage id={props.id} title={props.title} />
    </>
  );
}
Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Tin tức" };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug = "" } = context.params;
  const post = await new RequestGraphql<Post>(
    PostService,
    "getAllPost",
    "id title excerpt featureImage",
    {
      filter: { slug: slug },
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
