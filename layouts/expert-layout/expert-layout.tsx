import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RiFileTextLine, RiPieChartBoxLine, RiQuestionnaireLine, RiUserLine } from "react-icons/ri";
import { ErrorCatcher, Spinner } from "../../components/shared/utilities/misc";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import DefaultSidebar from "../default-sidebar";
import { Header } from "./components/header";
import { ExpertLayoutProvider } from "./providers/expert-layout-provider";

interface PropsType extends ReactProps {
  scope?: string;
}
export function ExpertLayout({ ...props }: PropsType) {
  //Begin: Old Authentication's Code
  const router = useRouter();
  const { expert, redirectToExpertLogin } = useAuth();

  useEffect(() => {
    if (expert === null) {
      redirectToExpertLogin();
      return;
    }

    if (!!expert?.id && router.asPath === "/expert") {
      router.replace(`${SIDEBAR_MENUS[0]["subMenus"][0]["path"]}`);
      return;
    }
  }, [expert]);
  //End: Old Authentication's Code

  //Comment New Authentication's Code
  // const { expert, redirectToLogin } = useAuth();

  // useEffect(() => {
  //   if (expert === null) {
  //     redirectToLogin();
  //   }
  // }, [expert]);

  return (
    <>
      <DefaultHead />
      {/*Comment New Authentication's Code*/}
      {/* {!user ? ( */}
      {!expert ? (
        <div className="min-h-screen w-h-screen">
          <Spinner />
        </div>
      ) : (
        <ExpertLayoutTemplate children={props.children} />
      )}
    </>
  );
}

export function ExpertLayoutTemplate({ scope, children, ...props }: PropsType) {
  return (
    <ExpertLayoutProvider>
      <NextSeo title="GreenAgri Expert" />
      <Header />
      <div className="relative flex w-full min-h-screen pt-14">
        <DefaultSidebar
          widthClassName="w-64"
          menus={SIDEBAR_MENUS}
          top={56}
          name="expert"
          closable
        />
        <div className="flex flex-col flex-1 pl-64">
          <div className="p-6">
            <ErrorCatcher>{children}</ErrorCatcher>
            {/*{!scope || (scope && props.expert.scopes.includes(scope)) ? (
              <ErrorCatcher>{props.children}</ErrorCatcher>
            ) : (
              <Card>
                <NotFound icon={<HiOutlineExclamation />} text="Không đủ quyền truy cập" />
              </Card>
            )}*/}
          </div>
        </div>
      </div>
    </ExpertLayoutProvider>
  );
}

export const SIDEBAR_MENUS = [
  {
    title: "Danh mục",
    subMenus: [
      {
        title: "Câu hỏi",
        path: "/expert/questions",
        icon: <RiQuestionnaireLine />,
      },
      {
        title: "Thông tin chuyên gia",
        path: "/expert/profile",
        icon: <RiUserLine />,
      },
      {
        title: "Lịch sử tương tác",
        path: "/expert/interaction-history",
        icon: <RiFileTextLine />,
      },
      {
        title: "Thống kê",
        path: "/expert/overview",
        icon: <RiPieChartBoxLine />,
      },
    ],
  },
];
