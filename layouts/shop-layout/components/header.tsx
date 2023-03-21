import { useRouter } from "next/router";
import { useRef } from "react";
import { FaHeadphonesAlt, FaRegComments } from "react-icons/fa";
import { RiNotification3Line, RiStore2Line, RiWallet3Line } from "react-icons/ri";
import { useChatContext } from "../../../components/shared/chat/chat-provider";
import { Button } from "../../../components/shared/utilities/form";
import { Img } from "../../../components/shared/utilities/misc";
import { Popover } from "../../../components/shared/utilities/popover/popover";
import { parseNumber } from "../../../lib/helpers/parser";
import { useAuth } from "../../../lib/providers/auth-provider";
import { Notify } from "./notify";

interface PropsType extends ReactProps {}
export function Header({ ...props }: PropsType) {
  const notificationRef = useRef();
  const { member, logoutMember } = useAuth();
  const { unseenThreadCount } = useChatContext();
  const router = useRouter();
  const isChatPage = router.pathname.startsWith("/shop/chat");
  const isTicketPage = router.pathname.startsWith("/shop/ticket");

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center w-full p-2 bg-white shadow h-18">
        <Img className="w-12 border border-gray-200 rounded-full" src={member.shopLogo} />
        <div className="pl-2">
          <div className="mt-1 font-semibold text-gray-700">{member.shopName}</div>
          <Button
            className="h-auto px-0 text-sm font-medium underline hover:underline"
            textPrimary
            targetBlank
            icon={<RiStore2Line />}
            iconClassName="pb-0.5"
            text="Xem cửa hàng của tôi"
            href={location.origin + "/store/" + member.code}
          />
        </div>
        <div className="flex items-center gap-0.5 ml-auto">
          <Button
            icon={<FaRegComments />}
            iconClassName="text-xl"
            tooltip="Live Chat"
            href="/shop/chat"
            className={`h-14 ${isChatPage ? "" : "hover:bg-gray-100"}`}
            primary={isChatPage}
          >
            {unseenThreadCount > 0 && (
              <div className="absolute w-auto h-4 px-1 font-bold text-white rounded-full animate-emerge left-8 bottom-2 bg-accent min-w-4 flex-center text-[10px]">
                {unseenThreadCount}
              </div>
            )}
          </Button>
          <Button
            icon={<FaHeadphonesAlt />}
            iconClassName="text-xl"
            tooltip="Hỗ trợ"
            href="/shop/ticket"
            className={`h-14 ${isTicketPage ? "" : "hover:bg-gray-100"}`}
            primary={isTicketPage}
          />
          <Button
            icon={<RiNotification3Line />}
            iconClassName="text-xl"
            tooltip="Thông báo"
            className={`h-14 hover:bg-gray-100`}
            innerRef={notificationRef}
          />
          <a
            href="/shop/wallet"
            className="px-3 py-2 transition-all border border-transparent rounded cursor-pointer bg-gray-50 hover:border-yellow-500 whitespace-nowrap min-w-28"
          >
            <div className="text-xs font-medium">Ví tiền</div>
            <div className="flex items-center text-yellow-500">
              <i className="mr-1">
                <RiWallet3Line />
              </i>
              <div className="text-sm font-semibold">{parseNumber(member.wallet.balance)}đ</div>
            </div>
          </a>
        </div>
        <Popover
          reference={notificationRef}
          trigger="click"
          placement="bottom-end"
          hideOnClickOutside={true}
        >
          <Notify />
        </Popover>
        {member && (
          <Button
            className="h-12 px-6 ml-3 border-l border-gray-200 rounded-none"
            text="Đăng xuất"
            hoverDanger
            onClick={logoutMember}
          />
        )}
      </div>
    </>
  );
}
