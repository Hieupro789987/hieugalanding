import Link from "next/link";
import { useRef } from "react";
import { RiLogoutBoxRLine, RiUser3Fill } from "react-icons/ri";
import { Img } from "../../../components/shared/utilities/misc";
import { Dropdown } from "../../../components/shared/utilities/popover/dropdown";
import { useAuth } from "../../../lib/providers/auth-provider";

interface PropsType extends ReactProps {}
export function Header({ ...props }: PropsType) {
  const writerRef = useRef();
  // const { user,  logout } = useAuth();
  const { writer, logoutWriter } = useAuth();

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center w-full bg-white shadow h-14">
        <Link href="/writer/news">
          <a className="flex items-center h-full px-6 py-3 text-xl font-bold text-primary">
            <img className="object-contain w-auto h-full" src="/assets/img/logo-icon.png" />
            <div className="h-5 -ml-2 text-lg">| Người đăng tin</div>
          </a>
        </Link>
        {/* <div className="flex items-center ml-auto mr-4">
          <Button
            icon={<FaRegComments />}
            iconClassName="text-xl text-primary"
            tooltip="Live Chat"
            // href="/writer/chat"
            onClick={() => toast.info("Tính năng này đang phát triển.")}
            className={`h-14 rounded-none`}
          >
            {unseenThreadCount > 0 && (
              <div className="absolute w-auto h-4 px-1 font-bold text-white rounded-full animate-emerge left-8 bottom-2 bg-accent min-w-4 flex-center text-10">
                {unseenThreadCount}
              </div>
            )}
          </Button>
          <Button
            icon={<FaHeadphonesAlt />}
            iconClassName="text-xl text-primary"
            tooltip="Hỗ trợ"
            // href="/writer/ticket"
            onClick={() => toast.info("Tính năng này đang phát triển.")}
            className={`h-14 rounded-none`}
          />
          <Button
            icon={<RiNotification3Line />}
            iconClassName="text-xl text-primary"
            tooltip="Thông báo"
            className="rounded-none h-14 hover:bg-gray-100"
            innerRef={notificationRef}
          />
        </div> */}
        {/* <Popover placement="bottom" reference={notificationRef}>
          <div className="flex flex-wrap p-8 items">Thông báo</div>
        </Popover> */}
        <div className={"flex items-center pl-4 pr-8 ml-auto cursor-pointer group"} ref={writerRef}>
          <Img
            className="w-10 border border-gray-100 rounded-full"
            default={writer?.avatar}
            src={writer?.avatar}
            avatar
            alt="avatar"
          />
          <div className="pl-2 whitespace-nowrap">
            <div className="mb-1 font-semibold leading-4 text-gray-700 group-hover:text-primary">
              {writer?.name}
            </div>
            <div className="text-sm leading-3 text-gray-600 group-hover:text-primary">
              {writer?.email}
            </div>
          </div>
        </div>

        <Dropdown reference={writerRef}>
          <Dropdown.Item
            icon={<RiUser3Fill />}
            text="Hồ sơ"
            href={{ pathname: "/writer/profile" }}
          />
          <Dropdown.Divider />
          <Dropdown.Item
            hoverDanger
            icon={<RiLogoutBoxRLine />}
            text="Đăng xuất"
            onClick={logoutWriter}
          />
        </Dropdown>
      </div>
    </>
  );
}
