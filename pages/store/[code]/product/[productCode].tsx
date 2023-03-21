import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { ProductDetailPage } from "../../../../components/index/product-detail/product-detail-page";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";
// import { getDataServer } from "../../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../../lib/helpers/redirect";
import { useSEO } from "../../../../lib/hooks/useSEO";
import { Member, MemberService } from "../../../../lib/repo/member.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo title="Trang chi tiết sản phẩm" />
      <ProductDetailPage />
    </>
  );
}

Page.Layout = DefaultLayout;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { code } = context.params;
//   const shops = await getDataServer<Member>(
//     MemberService,
//     "getAllMember",
//     {
//       filter: { code: code.toString().toLowerCase() },
//     },
//     "id shopName shopLogo shopCover deletedAt"
//   );

//   if (!shops || shops.length <= 0 || shops["0"].deletedAt) {
//     Redirect(context.res, `/not-found-shop`);
//   }
//   const seo = await useSEO("Chi tiết sản phẩm", {
//     image: shops["0"].shopCover || shops["0"].shopLogo,
//     description: shops["0"].shopName,
//     template: shops["0"].shopName,
//   });
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         seo,
//       })
//     ),
//   };
// }
