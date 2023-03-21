import { NextSeo } from "next-seo";
import { ProductsPage } from "../../components/index/products/products-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Sản phẩm" />
      <ProductsPage />
    </>
  );
}

Page.Layout = DefaultLayout;
