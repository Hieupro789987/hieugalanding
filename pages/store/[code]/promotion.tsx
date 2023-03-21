import { GetServerSidePropsContext } from "next";
import { PromotionsPage } from "../../../components/index/promotions/promotions-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { Redirect } from "../../../lib/helpers/redirect";
import { useSEO } from "../../../lib/hooks/useSEO";
import { getDataServer } from "../../../lib/graphql/fetch-graphql";
import { Member, MemberService } from "../../../lib/repo/member.repo";

export default function Promotion(props) {
  return (
    <>
      <PromotionsPage />
    </>
  );
}

Promotion.Layout = DefaultLayout;
Promotion.LayoutProps = { name: "Khuyến mãi" };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code } = context.params;
  const shops = await getDataServer<Member>(
    MemberService,
    "getAllMember",
    {
      filter: { code: code.toString().toLowerCase() },
    },
    "id shopName shopLogo shopCover deletedAt"
  );

  if (!shops || shops.length <= 0 || shops["0"].deletedAt) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await useSEO("Khuyến mãi", {
    image: shops["0"].shopCover || shops["0"].shopLogo,
    description: shops["0"].shopName,
    template: shops["0"].shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        seo,
      })
    ),
  };
}
