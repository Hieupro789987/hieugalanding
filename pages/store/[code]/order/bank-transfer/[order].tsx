import { GetServerSidePropsContext } from "next";
import { BankTransferPage } from "../../../../../components/index/bank-transfer/bank-transfer-page";
import { BankTransferProvider } from "../../../../../components/index/bank-transfer/providers/bank-transfer-provider";
import { DefaultLayout } from "../../../../../layouts/default-layout/default-layout";
// import { getDataServer } from "../../../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../../../lib/helpers/redirect";
import { useSEO } from "../../../../../lib/hooks/useSEO";
import { Member, MemberService } from "../../../../../lib/repo/member.repo";
import { OrderService } from "../../../../../lib/repo/order.repo";

export default function Page(props) {
  return (
    <BankTransferProvider id={props.id}>
      <BankTransferPage />
    </BankTransferProvider>
  );
}

Page.Layout = DefaultLayout;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { order, code } = context.params;
//   const orderDetail = await getDataServer(
//     OrderService,
//     "getAllOrder",
//     { filter: { order: order } },
//     "id"
//   );

//   const shops = await getDataServer<Member>(
//     MemberService,
//     "getAllMember",
//     {
//       filter: { code: code.toString().toLowerCase() },
//     },
//     "id shopName shopLogo shopCover deletedAt"
//   );

//   if (!shops || shops.length <= 0 || shops["0"]?.deletedAt) {
//     Redirect(context.res, `/not-found-shop`);
//   }
//   if (!orderDetail || orderDetail.length <= 0) Redirect(context.res, "/404");
//   const { id } = orderDetail["0"];
//   const seo = await useSEO("Thanh toán chuyển khoản", {
//     image: shops["0"].shopCover || shops["0"].shopLogo,
//     description: shops["0"].shopName,
//     template: shops["0"].shopName,
//   });
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         id,
//         seo,
//       })
//     ),
//   };
// }
