import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ChatProvider } from "../../components/shared/chat/chat-provider";
import { ChatWidget } from "../../components/shared/shop-layout/chat-widget";
import { Button } from "../../components/shared/utilities/form";
import { ErrorCatcher, NotFound, Spinner } from "../../components/shared/utilities/misc";
import { SetCustomerToken } from "../../lib/graphql/auth.link";
import { pageview } from "../../lib/helpers/ga";
import { useScreen } from "../../lib/hooks/useScreen";
import { useAuth } from "../../lib/providers/auth-provider";
import { CartProvider } from "../../lib/providers/cart-provider";
import { LocationProvider } from "../../lib/providers/location-provider";
import { ShopProvider, useShopContext } from "../../lib/providers/shop-provider";
import { DefaultHead } from "../default-head";
import { DefaultHeader } from "../default-header/default-header";
import { BackToTop } from "./components/back-to-top";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
// import { Footer } from "./components/footer";
import { DefaulLayoutProvider } from "./provider/default-layout-provider";

export function DefaultLayout({ ...props }) {
  const router = useRouter();
  const { globalCustomer, historyRouteGlobalCustomer } = useAuth();

  useEffect(() => {
    if (!!globalCustomer && !globalCustomer?.name) {
      router.replace("/profile/update-info");
    }
    if (!!globalCustomer && globalCustomer?.name && router.pathname.includes("/update-info")) {
      router.replace("/");
    }
    historyRouteGlobalCustomer();
  }, [router.pathname]);

  useEffect(() => {
    if (!!globalCustomer && globalCustomer?.name && router.pathname.includes("/update-info")) {
      router.replace("/");
    }
  });
  const [shopCode, setShopCode] = useState<string>();

  useEffect(() => {
    let code = router.query.code as string;
    if (code) {
      code = code.toLowerCase();
      sessionStorage.setItem("shopCode", code);
      if (router.query["x-token"]) {
        SetCustomerToken(router.query["x-token"] as string, code);
      }
      if (router.query["colCode"]) {
        sessionStorage.setItem(code + "colCode", router.query["colCode"] as string);
      }
      if (router.query["psid"]) {
        sessionStorage.setItem(code + "psid", router.query["psid"] as string);
      }
      if (router.query["followerId"]) {
        sessionStorage.setItem(code + "followerId", router.query["followerId"] as string);
      }
      setShopCode(code);
    }
    return () => setShopCode("");
  }, [router.query.code]);

  // useEffect(() => {
  //   console.log("Pathname changed");
  //   setTimeout(() => {
  //     window.scrollTo({ top: 0 });
  //   }, 500);
  // }, [router.pathname]);

  //google analytics
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <DefaultHead />
      <DefaulLayoutProvider>
        <LocationProvider>
          {/* <GlobalProvider> */}
          {shopCode ? (
            <ShopProvider code={shopCode}>
              <DefaultLayoutContent {...props}>{props.children}</DefaultLayoutContent>
            </ShopProvider>
          ) : (
            <HomeLayoutContent {...props}>{props.children}</HomeLayoutContent>
          )}
          {/* </GlobalProvider> */}
        </LocationProvider>
      </DefaulLayoutProvider>
    </>
  );
}

function DefaultLayoutContent({ ...props }) {
  const { shop, shopCode, customer } = useShopContext();
  const screenLg = useScreen("lg");

  if (!shop) return <Spinner />;

  return (
    <>
      <CartProvider>
        <ChatProvider senderRole="CUSTOMER" threadId={customer?.thread?.id} senderId={customer?.id}>
          <div className="relative flex flex-col bg-gray-200">
            {/* {!screenLg ? (
              <div className="w-full max-w-lg min-h-screen mx-auto bg-gray-100 shadow-lg flex-cols">
                <Header {...props} />
                <ErrorCatcher>{props.children}</ErrorCatcher>
              </div>
            ) : ( */}
            <div className="w-full mx-auto shadow-lg">
              <div className={`w-full bg-gray-100 text-gray-700 min-h-screen flex-cols`}>
                <DefaultHeader shopCode={shopCode} />
                <ErrorCatcher>{props.children}</ErrorCatcher>
              </div>
              <Footer />
              {customer && screenLg && (
                <ChatWidget
                  threadId={customer?.thread?.id}
                  senderId={customer?.id}
                  senderRole="CUSTOMER"
                  receiverRole="MEMBER"
                />
              )}
              <BackToTop />
            </div>
            {/* )} */}
          </div>
        </ChatProvider>
      </CartProvider>
    </>
  );
}

export function HomeLayoutContent({ children, ...props }) {
  const router = useRouter();
  const { globalCustomer } = useAuth();
  const checkLoggedIn = useMemo(() => {
    if (globalCustomer === null && router.asPath.startsWith("/profile"))
      return (
        <NotFound text="Bạn chưa đăng nhập vui lòng để tiếp tục" className="flex-1 bg-white">
          <Button
            text="Đăng nhập"
            primary
            onClick={() => {
              router.push("/login");
            }}
            className="mt-4"
          />
        </NotFound>
      );
    if (globalCustomer === undefined && router.asPath.startsWith("/profile")) return <Spinner />;
    return <>{children}</>;
  }, [router.asPath, globalCustomer]);

  return (
    <>
      <div className="relative flex flex-col bg-gray-100">
        <div className="w-full mx-auto shadow-lg">
          <div
            className={`w-full text-accent flex flex-col`}
            style={{
              minHeight: "calc(100vh - 350px)",
            }}
          >
            <DefaultHeader {...props} shopCode="" />
            {checkLoggedIn}
          </div>
          <Footer />
        </div>
      </div>
      {/* {screenLg && <FloatingAffiliateButton />} */}
      <BackToTop />
    </>
  );
}
