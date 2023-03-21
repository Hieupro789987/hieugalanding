import { NextSeo } from "next-seo";
import { StoresPage } from "../../components/index/stores/stores-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Cửa hàng" />
      <StoresPage />
    </>
  );
}

Page.Layout = DefaultLayout;
