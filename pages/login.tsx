import { NextSeo } from "next-seo";
import { LoginPage } from "../components/index/auth/login/login-page";
import { NoneLayout } from "../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập" />
      <LoginPage />
    </>
  );
}
Page.Layout = NoneLayout;

