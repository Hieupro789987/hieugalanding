import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { HomePage } from "../components/index/home/home-page";
import { Spinner } from "../components/shared/utilities/misc";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { GetMemberToken } from "../lib/graphql/auth.link";
import Cookies from "universal-cookie";

export default function Page(props) {
  const router = useRouter();
  const { code, ...rest } = router.query;

  useEffect(() => {
    if (code) {
      router.replace({ pathname: `/store/${code}`, query: { ...rest } });
    }
  }, [code]);

  if (code) return <Spinner />;
  return (
    <>
      <NextSeo title="Trang chủ" />
      <HomePage />
    </>
  );
}

Page.Layout = DefaultLayout;
