import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { SearchingPage } from "../../components/index/searching/searching-page";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";

export default function Page(props) {
  const router = useRouter();
  // const { code, ...rest } = router.query;

  // useEffect(() => {
  //   if (code) {
  //     router.replace({ pathname: `/${code}`, query: { ...rest } });
  //   }
  // }, [code]);
  // if (code) return <Spinner />;
  return (
    <>
      <NextSeo title="Tìm kiếm sản phẩm" />
      <SearchingPage />
    </>
  );
}

Page.Layout = DefaultLayout;
