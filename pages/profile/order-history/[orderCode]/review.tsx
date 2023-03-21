import { NextSeo } from "next-seo";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Đánh giá đơn hàng" />
      {/* <ReviewPage /> */}
    </>
  );
}

Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Đánh giá" };
