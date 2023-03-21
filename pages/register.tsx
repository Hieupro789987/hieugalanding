import { NextSeo } from "next-seo";
import { RegisterProvider } from "../components/index/auth/register/provider/register-provider";
import { RegisterPage } from "../components/index/auth/register/register-page";
import { NoneLayout } from "../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng ký" />

      <RegisterProvider>
        <RegisterPage />
      </RegisterProvider>
    </>
  );
}

Page.Layout = NoneLayout;
