import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { NextSeo } from "next-seo";
import { ProfileUpdateInfoPage } from "../../components/index/profile/profile-update-info-page";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/providers/auth-provider";



export default function Page() {
  const router = useRouter();
  const { endUser } = useAuth();
 

  if(endUser?.name) router.push("/");
  return (
    <>
      <NextSeo title="Thông tin tài khoản" />
      <ProfileUpdateInfoPage />
    </>
  )
}


Page.Layout = DefaultLayout;
Page.LayoutProps = { name: "Thông tin tài khoản" };
