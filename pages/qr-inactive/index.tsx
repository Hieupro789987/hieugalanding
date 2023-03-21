import { NextSeo } from "next-seo";
import { QrInactivePage } from "../../components/index/qr-inactive/qr-inactive-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="qr inactive code" />
        <QrInactivePage />
    </>
  );
}

Page.Layout = DefaultLayout;
