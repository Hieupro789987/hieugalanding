import { NextSeo } from "next-seo";
import { NewsPage } from "../../components/index/news/news-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Video" />
      <NewsPage newsSlug="thong-tin-mua-vu" isVideosPage />
    </>
  );
}

Page.Layout = DefaultLayout;
