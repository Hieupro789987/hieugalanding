import { NextSeo } from "next-seo";
import { QrPage } from "../../components/index/qr/qr-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="qr code" />
      <QrPage />
    </>
  );
}

Page.Layout = DefaultLayout;
