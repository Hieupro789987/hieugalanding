import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { Redirect } from "../../lib/helpers/redirect";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Cửa hàng" />
    </>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  Redirect(context.res, `/stores`);
  return {};
}
