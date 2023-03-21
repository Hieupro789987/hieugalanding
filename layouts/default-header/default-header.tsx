import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiMenu3Line,
  RiNotification4Line,
  RiPhoneLine,
  RiShoppingCart2Line,
  RiUserLine,
} from "react-icons/ri";
import { displayToppings } from "../../components/index/cart/cart-page";
import { Button } from "../../components/shared/utilities/form";
import { Img, Spinner } from "../../components/shared/utilities/misc";
import { Dropdown } from "../../components/shared/utilities/popover/dropdown";
import { Popover } from "../../components/shared/utilities/popover/popover";
import { GetGlobalCustomerToken } from "../../lib/graphql/auth.link";
import { parseNumber } from "../../lib/helpers/parser";
import { useCrud } from "../../lib/hooks/useCrud";
import { useScreen } from "../../lib/hooks/useScreen";
import { useAuth } from "../../lib/providers/auth-provider";
import { useCart } from "../../lib/providers/cart-provider";
import { useShopContext } from "../../lib/providers/shop-provider";
import { useToast } from "../../lib/providers/toast-provider";
import { Notification, NotificationService } from "../../lib/repo/notification.repo";
import { PostService } from "../../lib/repo/post.repo";
import { TopicService } from "../../lib/repo/topic.repo";
import { NotificationList } from "../default-layout/components/notification-list";
import { DefaultMenu } from "../default-menu";
import {
  DefaultHeaderProvider,
  MenuOption,
  SubMenu,
  useDefaultHeaderContext,
} from "./default-header-provider";

export interface HeaderProps extends ReactProps {
  shopCode?: string;
  name?: string;
}

export function DefaultHeader({ shopCode, name, ...props }: HeaderProps) {
  return (
    <DefaultHeaderProvider>
      <SubHeader shopCode={shopCode} />
      <MainHeader />
    </DefaultHeaderProvider>
  );
}

function MainHeader() {
  const [openMenu, setOpenMenu] = useState(false);
  const { globalCustomer } = useAuth();
  const isLg = useScreen("lg");

  const Logo = () => {
    return (
      <Link href={"/"}>
        <a className={`flex-center ${isLg ? "py-1" : "pb-2"}`}>
          <img
            src="/assets/img/logo.png"
            className="object-contain h-8 grow-0 shrink-0"
            alt="logo"
          />
        </a>
      </Link>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 items-center bg-white shadow lg:flex-col h-12 lg:h-20 z-100`}
        id="header"
      >
        <div className="justify-between hidden h-11 lg:flex main-container">
          {isLg && (
            <>
              <Logo />
              <div className="flex h-full">
                {globalCustomer?.id && <HeaderNotification />}
                <HeaderAuth />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row items-center h-full border-t border-gray-100 lg:h-9 main-container">
          {isLg ? <DesktopMenu /> : <Logo />}

          <div className="flex flex-row items-center self-stretch gap-1 ml-auto shrink-0 grow-0">
            <HeaderCart />
            {!isLg && (
              <>
                {globalCustomer?.id && <HeaderNotification />}
                <HeaderAuth />
                <Button
                  className="px-2"
                  onClick={() => setOpenMenu(true)}
                  icon={<RiMenu3Line />}
                  iconClassName="text-xl"
                />
                <DefaultMenu isOpen={openMenu} onClose={() => setOpenMenu(false)} />
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function HeaderCart() {
  const [lastEditedShop, setLastEditedShop] = useState<string>();
  const { shopCode } = useShopContext();
  const { cartProducts } = useCart();
  const { globalCustomer } = useAuth();
  const router = useRouter();
  const cartRef = useRef();
  const isLg = useScreen("lg");

  useEffect(() => {
    setLastEditedShop(localStorage.getItem("last-edited-shop"));
  }, [router]);

  return (
    <>
      {shopCode ? (
        <>
          <div
            className={`relative cursor-pointer pb-1`}
            onClick={() => router.push(`/store/${shopCode}/cart`)}
            ref={cartRef}
          >
            <Button
              icon={<RiShoppingCart2Line />}
              className="h-10 px-2 text-sm rounded-full"
              iconClassName="text-xl"
              text={isLg ? "Giỏ hàng" : ""}
            />
            {cartProducts?.length > 0 && (
              <div className="absolute top-0 px-1 flex-center h-5 text-[10px] font-semibold text-white border-2 border-white rounded-full min-w-5 bg-danger left-5">
                {cartProducts?.length}
              </div>
            )}
          </div>
          <Dropdown reference={cartRef} trigger="hover" placement="bottom-end" arrow>
            {cartProducts?.length > 0 ? (
              <>
                <Dropdown.Item>
                  <div className="mx-2 mt-4 mb-3 italic text-gray-500 w-96">Sản phẩm mới thêm</div>
                </Dropdown.Item>
                {cartProducts.slice(0, 5).map((item, index) => (
                  <Dropdown.Item hoverAccent key={`${item.productId}-${index}`}>
                    <div
                      className="flex justify-between gap-2 p-2 mx-2 mb-3 cursor-pointer hover:bg-gray-100 w-96"
                      onClick={() =>
                        router.push(`/store/${shopCode}/product/${item?.product?.code}`)
                      }
                    >
                      <Img src={item?.product?.image} className="w-11" />
                      <div className="flex flex-col flex-1 gap-2 overflow-hidden text-ellipsis-1">
                        <div className="text-ellipsis-1">{item?.product?.name}</div>
                        {displayToppings(item?.product)}
                      </div>
                      <div className="w-24 text-sm max-w-28 text-danger">
                        {parseNumber(item?.amount, true)}
                      </div>
                    </div>
                  </Dropdown.Item>
                ))}
                <Dropdown.Item>
                  <div className="flex justify-between mx-2 mb-2">
                    <div className="flex-1"></div>
                    <Button
                      text="Xem giỏ hàng"
                      primary
                      onClick={() => router.push(`/store/${shopCode}/cart`)}
                    />
                  </div>
                </Dropdown.Item>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 rounded-md w-96 h-72">
                <Img src="https://i.imgur.com/WE1pa0V.jpg" className="w-40" />
                <div className="font-semibold text-gray-600">Chưa có sản phẩm nào.</div>
              </div>
            )}
          </Dropdown>
        </>
      ) : (
        <>
          {lastEditedShop && globalCustomer && (
            <Button
              icon={<RiShoppingCart2Line />}
              className="w-10 h-10 px-2 pb-1 font-semibold rounded-full lg:w-auto"
              iconClassName="text-xl"
              href={`/store/${lastEditedShop}/cart`}
              text={isLg ? "Giỏ hàng" : ""}
            />
          )}
        </>
      )}
    </>
  );
}

function DesktopMenu() {
  const { menu } = useDefaultHeaderContext();

  if (!menu) return <></>;

  return (
    <div className="flex flex-row items-center self-stretch flex-1 -ml-3">
      {menu.map((item, index) => (
        <MenuButton key={index} item={item} />
      ))}
    </div>
  );
}

function MenuButton({ item }: { item: MenuOption }) {
  const subMenuRef = useRef<HTMLAnchorElement>();
  const router = useRouter();

  return (
    <>
      <Button
        text={item.name}
        className="h-full px-3 pb-1 text-sm font-bold rounded-none hover:bg-primary-light whitespace-nowrap text-accent"
        href={item.href}
        {...(item.isHomePage
          ? { hoverPrimary: true }
          : router.asPath.startsWith(`${item.href}`)
          ? { textPrimary: true }
          : { hoverPrimary: true })}
        innerRef={subMenuRef}
      />
      {item.subMenu && (
        <Dropdown reference={subMenuRef} placement="bottom-start" trigger="hover">
          {item.subMenu.map((menu, index) => (
            <Dropdown.Item
              key={index}
              href={menu.href}
              onClick={() => router.push(menu.href)}
              asyncLoading={false}
              text={menu.name}
              className="justify-start text-sm hover:bg-green-100"
              textAccent
            />
          ))}
        </Dropdown>
      )}
    </>
  );
}

function SubHeader({ shopCode }: { shopCode: string }) {
  const isMd = useScreen("md");

  return (
    <nav className="h-8 bg-primary">
      <div className="flex items-center justify-between h-full gap-2 main-container">
        <div className="flex h-full">
          {isMd && <DesktopSubHeaderMenu />}
          <SubHeaderLinks />
        </div>
        <div className="flex h-full">
          <SubHeaderLanguage />
        </div>
      </div>
    </nav>
  );
}

function DesktopSubHeaderMenu() {
  const [aboutUsPostMenu, setAboutUsPostMenu] = useState<SubMenu[]>();
  const toast = useToast();
  const ref = useRef();

  useEffect(() => {
    loadAboutUsPosts();
  }, []);

  const loadAboutUsPosts = async () => {
    const topic = await TopicService.getAll({
      query: { limit: 1, filter: { slug: "gioi-thieu" } },
    }).then((res) => res.data[0]);

    const posts = await PostService.getAll({
      query: { limit: 0, filter: { topicIds: topic.id } },
    }).then((res) => res.data);

    setAboutUsPostMenu(
      posts.map((post) => ({
        name: post.title,
        href: `/about-us/${post.slug}`,
      }))
    );
  };

  if (!aboutUsPostMenu) return <></>;
  return (
    <>
      <Button
        className="h-full px-2 text-sm hover:underline"
        innerRef={ref}
        textWhite
        text="Giới thiệu"
        href={"/about-us"}
      />
      <div className="h-full flex-center">
        <div className="h-3 border-l-2 border-white"></div>
      </div>
      <Button
        className="h-full px-2 text-sm hover:underline"
        text="Trở thành người bán"
        textWhite
        onClick={() => toast.info("Tính năng đang phát triển")}
      />
      <div className="h-full flex-center">
        <div className="h-3 border-l-2 border-white"></div>
      </div>
      <Button
        className="h-full px-2 text-sm hover:underline"
        text="Liên hệ"
        textWhite
        onClick={() => toast.info("Tính năng đang phát triển")}
      />
    </>
  );
}

function SubHeaderLinks() {
  const LINKS = [
    {
      icon: <RiPhoneLine />,
      href: "tel:0989898989",
    },
    {
      icon: <RiFacebookCircleLine />,
      href: "https://facebook.com",
    },
    {
      icon: <RiMailLine />,
      href: "mailto:greenagri@greengroups.vn",
    },
  ];

  return (
    <>
      {LINKS.map((item, index) => (
        <Button
          className="h-full px-2"
          iconClassName="text-xl"
          textWhite
          key={item.href}
          icon={item.icon}
          href={item.href}
        />
      ))}
    </>
  );
}

function HeaderNotification() {
  const [loading, setLoading] = useState();
  const [total, setTotal] = useState<number>();
  const isLg = useScreen("lg");
  const { globalCustomer } = useAuth();
  const notificationRef = useRef();
  const noificationCrud = useCrud(
    NotificationService,
    { limit: 6, order: { createdAt: -1 } },
    { fetchingCondition: !!globalCustomer, token: GetGlobalCustomerToken() }
  );

  const handleSeenNotification = async (data: Notification) => {
    if (!data) return;
    if (!globalCustomer?.id) return;
    try {
      (notificationRef.current as any)?._tippy?.hide();
      await NotificationService.readNotification(data?.id);
      await noificationCrud.loadAll(true);
      getAllNotificationNotSeen();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeenAllNotification = async () => {
    if (!globalCustomer?.id) return;

    try {
      (notificationRef.current as any)?._tippy?.hide();
      await NotificationService.readAllNotification();
      await noificationCrud.loadAll(true);
      setTotal(0);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllNotificationNotSeen = async () => {
    if (!globalCustomer?.id) return;

    const totalNotiNotSeen = await NotificationService.getAll({
      query: { limit: 0, filter: { seen: false } },
      token: GetGlobalCustomerToken(),
    });
    const total = totalNotiNotSeen.data.filter((item) => item.seen == false).length;
    setTotal(total);
  };

  useEffect(() => {
    if (!globalCustomer?.id) return;

    getAllNotificationNotSeen();
  }, [globalCustomer]);

  return (
    <>
      <Button
        className="h-full px-2 text-sm font-medium hover:bg-gray-50"
        iconClassName="text-xl"
        icon={<RiNotification4Line />}
        // text={isLg ? "Thông báo" : ""}
        innerRef={notificationRef}
      >
        {total > 0 && (
          <span className="absolute z-20 inline-block w-2 h-2 rounded-full bg-danger left-4 lg:left-6 top-2.5"></span>
        )}
      </Button>
      <Popover reference={notificationRef} trigger="click" placement="bottom-end">
        <div className="" style={{ margin: "-5px -9px" }}>
          <div className="flex items-center justify-between px-5 py-3">
            <div className="text-base font-semibold">Thông báo</div>
            <Button
              className="h-auto pr-0 text-sm text-primary"
              text={total > 0 ? "Xem tất cả" : "Đã đọc hết"}
              onClick={() => total > 0 && handleSeenAllNotification()}
            />
          </div>
          {loading ? (
            <Spinner
              style={{
                height: 450,
              }}
              className="py-0"
            />
          ) : (
            <NotificationList
              notificationCurd={noificationCrud}
              onClickSeenNotification={handleSeenNotification}
            />
          )}
        </div>
      </Popover>
    </>
  );
}

function SubHeaderLanguage() {
  const toast = useToast();

  return (
    <>
      <Button
        textWhite
        className="h-full px-2 text-sm font-normal hover:bg-primary-dark"
        iconClassName="text-xl"
        icon={<RiGlobalLine />}
        text={"Tiếng Việt"}
        onClick={() => toast.info("Tính năng đang phát triển")}
      />
    </>
  );
}

function HeaderAuth() {
  const { globalCustomer, logoutGlobalCustomer } = useAuth();
  const userRef = useRef();
  const router = useRouter();
  const isLg = useScreen("lg");

  if (globalCustomer === undefined) return <></>;

  return (
    <>
      {globalCustomer ? (
        <>
          <div
            ref={userRef}
            className="flex items-center h-full gap-1.5 p-2 cursor-pointer hover:bg-gray-50"
          >
            <Img
              className="w-8 bg-white border border-gray-300 rounded-full lg:w-6"
              src={globalCustomer.avatar}
            />
            {isLg && (
              <>
                <span className="font-semibold text-gray-700">
                  {globalCustomer.name || globalCustomer.phone}
                </span>
                <i className="text-xl text-gray-500">
                  <RiArrowDownSLine />
                </i>
              </>
            )}
          </div>
          <Dropdown reference={userRef} trigger="click" placement="bottom-start" arrow>
            <Dropdown.Item
              hoverAccent
              text="Thông tin của tôi"
              onClick={() => router.push("/profile")}
            />
            <Dropdown.Item
              hoverAccent
              text="Lịch sử đơn hàng"
              onClick={() => router.push("/profile/order-history")}
            />
            <Dropdown.Item
              hoverAccent
              text="Lịch sử đặt lịch"
              onClick={() => router.push("/profile/reservations")}
            />
            <Dropdown.Item
              hoverAccent
              text="Đăng xuất"
              onClick={async () => await logoutGlobalCustomer()}
            />
          </Dropdown>
        </>
      ) : (
        <>
          {isLg ? (
            <>
              <Button
                className="h-full px-2 text-sm hover:underline"
                text="Đăng nhập"
                href="/login"
              />
              <div className="h-full flex-center">
                <div className="h-3 border-l-2 border-gray-100"></div>
              </div>
              <Button
                className="h-full px-2 text-sm hover:underline"
                text="Đăng ký"
                href="/register"
              />
            </>
          ) : (
            <Button
              className="h-full px-2 lg:hover:bg-primary-dark"
              iconClassName="text-xl"
              icon={<RiUserLine />}
              href="/login"
            />
          )}
        </>
      )}
    </>
  );
}
