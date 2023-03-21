// import { GetServerSidePropsContext } from "next";

import { StoreDetailPage } from "../../../components/index/store-detail/store-detail-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
// import { GetMemberToken } from "../../../lib/graphql/auth.link";
// import { RequestGraphql } from "../../../lib/graphql/fetch-graphql";
// import { Redirect } from "../../../lib/helpers/redirect";
// import { useSEO } from "../../../lib/hooks/useSEO";
// import { Member, MemberService } from "../../../lib/repo/member.repo";
// import { ProductService } from "../../../lib/repo/product.repo";
// import { Setting, SettingService } from "../../../lib/repo/setting.repo";
// import { ShopConfigService } from "../../../lib/repo/shop-config.repo";
// import cookie from 'cookie';

export default function Page(props) {
  // useEffect(() => {
  //   if (props.analyticConfig) {
  //     sessionStorage.setItem("analyticConfig", JSON.stringify(props.analyticConfig));
  //   } else {
  //     sessionStorage.removeItem("analyticConfig");
  //   }
  // }, [props.analyticConfig]);

  return (
    <>
      <StoreDetailPage mode="" />
      {/* <ShopDetailsPage /> */}
    </>
  );
}
Page.Layout = DefaultLayout;
// Page.Layout = DefaultLayout;

// export async function getServerSideProps({req, query, params}: GetServerSidePropsContext) {
//   const cookies = cookie.parse(req.headers.cookie || '');
//   console.log("cookies: ", cookies);
//   const token = cookies["member-token"];
//   console.log("token: ", token);
//   const { product: productCode } = query;
//   const { code } = params;

//   const descSetting = await new RequestGraphql<Setting>(SettingService, "getAllSetting", "value", {
//     filter: { key: "SEO_DESCRIPTION" },
//   }).findOne();



//   const shop = await new RequestGraphql<Member>(
//     MemberService,
//     "getAllMember",
//     "id shopName shopLogo shopCover deletedAt",
//     {
//       filter: { code: code.toString().toLowerCase() },
//     },
//     {
//       "x-token": token
//     }
    
//   ).findOne();

//   console.log("shop: ", shop)

//   if (!shop || shop.deletedAt) {
//     Redirect(context.res, `/not-found-shop`);
//   }

//   const shopConfig = await new RequestGraphql(
//     ShopConfigService,
//     "getShopConfig",
//     "analyticConfig {googleAnalytic facebookPixel}",
//     {
//       filter: { memberId: shop.id },
//     }
//   ).findOne();

//   let product;
//   if (productCode) {
//     product = await getDataServer(
//       ProductService,
//       "getAllProduct",
//       { filter: { code: productCode, memberId: shop.id } },
//       "cover image subtitle"
//     );

//     product =  await new RequestGraphql(
//       ProductService,
//       "getShopConfig",
//       "analyticConfig {googleAnalytic facebookPixel}",
//       {
//         filter: { memberId: shop.id },
//       }
//     ).findOne();
//   }
//   const seo = await useSEO(`${shop.shopName} | Cửa hàng`, {
//     image: product?.cover || product?.image || shop.shopCover || shop.shopLogo,
//     description:
//       product?.name ||
//       descSetting?.value ||
//       "Dịch vụ đặt sản phẩm trực tuyến và giao hàng tận nơi",
//   });
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         code :" ",
//         shop : "",
//         // seo,
//         // analyticConfig: shopConfig?.analyticConfig,
//       })
//     ),
//   };
// }
