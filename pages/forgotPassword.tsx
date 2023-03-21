import { NextSeo } from "next-seo";
import { ForgotPasswordPage } from "../components/index/auth/forgotPassword/forgot-password-page";
import { ForgotPasswordProvider } from "../components/index/auth/forgotPassword/provider/forgotPassword-provider";
import { NoneLayout } from "../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Quên mật khẩu" />

      <ForgotPasswordProvider>
        <ForgotPasswordPage />
      </ForgotPasswordProvider>
    </>
  );
}
Page.Layout = NoneLayout;
