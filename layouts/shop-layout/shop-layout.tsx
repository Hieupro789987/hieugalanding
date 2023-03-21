import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChatProvider } from "../../components/shared/chat/chat-provider";
import { ChatWidget } from "../../components/shared/shop-layout/chat-widget";
import { ErrorCatcher, Spinner } from "../../components/shared/utilities/misc";
import { InstructionPage } from "../../components/shop/instructions/instructions-page";
import { useDevice } from "../../lib/hooks/useDevice";
import { useAuth } from "../../lib/providers/auth-provider";
import { useToast } from "../../lib/providers/toast-provider";
import { GraphService } from "../../lib/repo/graph.repo";
import { DefaultHead } from "../default-head";
import { firebase } from "./../../lib/helpers/firebase";
import { Header } from "./components/header";
import { MobileScreen } from "./components/mobile-screen";
import Sidebar from "./components/sidebar";
import { ShopLayoutContext, ShopLayoutProvider } from "./providers/shop-layout-provider";

interface PropsType extends ReactProps {}
export function ShopLayout({ ...props }: PropsType) {
  const { member, redirectToLogin } = useAuth();
  const { isSSR, isMobile } = useDevice();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (member === null) {
      redirectToLogin();
    } else if (member) {
      if (!isSSR) {
        const messaging = firebase.messaging();

        messaging.onMessage((payload) => {
          toast.info(payload.notification.title, payload.notification.body, {
            onClick: async () => {
              await GraphService.clearStore();
              router.push("/shop/orders");
            },
            position: "top-right",
            delay: 5000,
          });
        });
      }
    }
  }, [member]);

  return (
    <ShopLayoutProvider>
      <ShopLayoutContext.Consumer>
        {({ shopConfig, subscriptionStatus, hasInstructionCompleted }) => (
          <>
            {!(member && shopConfig) ? (
              <div className="min-h-screen w-h-screen">
                <Spinner />
              </div>
            ) : (
              <>
                <DefaultHead />
                {/* <Header /> */}
                <div className="relative flex w-full min-h-screen">
                  {isMobile ? (
                    <MobileScreen />
                  ) : (
                    // hasInstructionCompleted ?
                    <ChatProvider
                      senderRole="MEMBER"
                      threadId={member.thread?.id}
                      senderId={member.id}
                    >
                      <Sidebar />
                      <div className="flex flex-col flex-1 pl-60 min-w-6xl">
                        <Header />
                        <div
                          className={`p-6 pb-24 ${
                            subscriptionStatus && subscriptionStatus.value !== "ACTIVE"
                              ? "mt-4"
                              : ""
                          }`}
                        >
                          <ErrorCatcher>{props.children}</ErrorCatcher>
                        </div>
                      </div>
                      <ChatWidget
                        threadId={member.thread?.id || member.thread.id}
                        senderId={member.id}
                        senderRole="MEMBER"
                        receiverRole="ADMIN"
                      />
                    </ChatProvider>
                    // )
                    // : (
                    //   <InstructionPage />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </ShopLayoutContext.Consumer>
    </ShopLayoutProvider>
  );
}
