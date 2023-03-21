import { GetServerSidePropsContext } from "next";
import { OrderDetailPage } from "../../../../components/index/order-detail/order-detail-page";
import { OrderDetailProvider } from "../../../../components/index/order-detail/providers/order-detail-provider";
import { DefaultLayout } from "../../../../layouts/default-layout/default-layout";
// import { getDataServer } from "../../../../lib/graphql/fetch-graphql";
import { Redirect } from "../../../../lib/helpers/redirect";
import { useSEO } from "../../../../lib/hooks/useSEO";
import { Member, MemberService } from "../../../../lib/repo/member.repo";
import { OrderService } from "../../../../lib/repo/order.repo";

export default function Page(props) {
  return (
    <OrderDetailProvider id={props.id}>
      <OrderDetailPage />
    </OrderDetailProvider>
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

//   if (!shops || shops.length <= 0 ||  shops["0"]?.deletedAt) {
//     Redirect(context.res, `/not-found-shop`);
//   }
//   if (!orderDetail || orderDetail.length <=0 ) Redirect(context.res, "/404");
//   const { id } = orderDetail["0"];
//   const seo = await useSEO("Chi tiết đơn hàng", {
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
