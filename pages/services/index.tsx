import { NextSeo } from "next-seo";
import { ServiceProvider } from "../../components/index/services/provider/services-provider";
import { ServicesPage } from "../../components/index/services/services-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Dịch vụ" />
      <ServiceProvider>
        <ServicesPage />
      </ServiceProvider>
    </>
  );
}

Page.Layout = DefaultLayout;
