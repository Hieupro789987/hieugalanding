import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RiFileTextLine, RiNotification2Line, RiUserLine } from "react-icons/ri";
import { ErrorCatcher, Spinner } from "../../components/shared/utilities/misc";
import { useAuth } from "../../lib/providers/auth-provider";
import { DefaultHead } from "../default-head";
import DefaultSidebar, { SidebarMenu } from "../default-sidebar";
import { Header } from "./components/header";
import { WriterLayoutProvider } from "./providers/writer-layout-provider";

interface PropsType extends ReactProps {
  scope?: string;
}
export function WriterLayout({ ...props }: PropsType) {
  //Begin: Old Authentication's Code
  const router = useRouter();
  const { writer, redirectToWriterLogin } = useAuth();

  useEffect(() => {
    if (writer === null) {
      redirectToWriterLogin();
    }

    if (!!writer?.id && router.asPath === "/writer") {
      router.replace(`${SIDEBAR_MENUS[0]["subMenus"][0]["path"]}`);
      return;
    }
  }, [writer]);
  //End: Old Authentication's Code

  //Comment New Authentication's Code
  // const { user, redirectToLogin } = useAuth();

  // useEffect(() => {
  //   if (user === null) {
  //     redirectToLogin();
  //   }
  // }, [user]);

  return (
    <>
      <DefaultHead />
      {/* {!user ? ( */}
      {!writer ? (
        <div className="min-h-screen w-h-screen">
          <Spinner />
        </div>
      ) : (
        <WriterLayoutTemplate children={props.children} />
      )}
    </>
  );
}

export function WriterLayoutTemplate({ scope, children, ...props }: PropsType) {
  return (
    <WriterLayoutProvider>
      <NextSeo title="GreenAgri Writer" />
      <Header />
      <div className="relative flex w-full min-h-screen pt-14">
        <DefaultSidebar
          widthClassName="w-64"
          menus={SIDEBAR_MENUS}
          top={56}
          name="writer"
          closable
        />
        <div className="flex flex-col flex-1 pl-64">
          <div className="p-6">
            <ErrorCatcher>{children}</ErrorCatcher>
            {/*{!scope || (scope && props.writer.scopes.includes(scope)) ? (
              <ErrorCatcher>{props.children}</ErrorCatcher>
            ) : (
              <Card>
                <NotFound icon={<HiOutlineExclamation />} text="Không đủ quyền truy cập" />
              </Card>
            )}*/}
          </div>
        </div>
      </div>
    </WriterLayoutProvider>
  );
}
export const SIDEBAR_MENUS: SidebarMenu[] = [
  {
    title: "Danh mục",
    subMenus: [
      {
        title: "Tin tức",
        path: "/writer/news",
        icon: <RiFileTextLine />,
      },
      {
        title: "Tài khoản",
        path: "/writer/profile",
        icon: <RiUserLine />,
      },
      {
        title: "Thông báo",
        path: "/writer/notifications",
        icon: <RiNotification2Line />,
      },
    ],
  },
];
