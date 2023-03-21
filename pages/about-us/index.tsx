import { NextSeo } from "next-seo";
import { AboutUsPage } from "../../components/index/about-us/about-us-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang giới thiệu" />
      <AboutUsPage />
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Giới thiệu" };
