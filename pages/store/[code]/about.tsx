import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { StoreDetailPage } from "../../../components/index/store-detail/store-detail-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { RequestGraphql } from "../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../lib/helpers/redirect";
import { useSEO } from "../../../lib/hooks/useSEO";
import { Member, MemberService } from "../../../lib/repo/member.repo";
import { SettingService } from "../../../lib/repo/setting.repo";

export default function Page(props) {
  return (
    <>
      <NextSeo {...props.seo} />
      <StoreDetailPage mode="about" />
    </>
  );
}

Page.Layout = DefaultLayout;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { code } = context.params;
//   const descSetting = await getDataServer(
//     SettingService,
//     "getAllSetting",
//     { filter: { key: "SEO_DESCRIPTION" } },
//     "value"
//   );
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
//   const seo = await useSEO(`${shops["0"].shopName} | Cửa hàng`, {
//     image: shops["0"].shopCover || shops["0"].shopLogo,
//     description: descSetting["0"]?.value || "Dịch vụ đặt sản phẩm trực tuyến và giao hàng tận nơi",
//   });
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         seo,
//       })
//     ),
//   };
// }
