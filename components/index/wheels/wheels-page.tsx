import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { GiCartwheel } from "react-icons/gi";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { LuckyWheel } from "../../../lib/repo/lucky-wheel.repo";
import { Button } from "../../shared/utilities/form/button";
import { Img, Spinner, NotFound } from "../../shared/utilities/misc";
import { useWheelsContext, WheelsProvider } from "./providers/wheels-provider";

export function WheelsPage() {
  const { shopCode, customer } = useShopContext();
  const router = useRouter();
  useEffect(() => {
    /** Redirect về trang chủ khi chưa đăng nhập */
    if (!customer) {
      router.push("/" + shopCode);
    }
  }, [customer]);

  if (!customer) return <Spinner />;

  return (
    <WheelsProvider>
      <div className="relative w-full min-h-screen bg-white text-accent">
        <div className="flex items-center w-full px-4 py-1">
          <Button
            icon={<FaChevronLeft />}
            iconClassName="text-xl text-gray-400"
            className="w-10 pl-0"
            tooltip={"Trang chủ"}
            href={`/store/${shopCode}`}
          />
          <h2 className="flex-1 text-lg font-semibold text-center">Danh sách vòng quay</h2>
          <div className="w-10"></div>
        </div>
        <div className="flex w-full">
          <Button
            icon={<GiCartwheel />}
            text="Lịch sử vòng quay"
            href={`/store/${shopCode}/wheel/history`}
            className="ml-auto mr-0"
          />
        </div>
        <ListWheel />
      </div>
    </WheelsProvider>
  );
}

function ListWheel() {
  const { items } = useWheelsContext();
  const screenSm = useScreen("sm");
  if (!items) return <Spinner />;
  if (items.length == 0) return <NotFound text="Chưa có vòng xoay may mắn" />;
  return (
    <div className="">
      {items.map((wheel: LuckyWheel, index) => (
        <div
          className={`flex px-4 py-2 justify-between ${index < items.length - 1 ? "border-b" : ""}`}
          key={index}
        >
          <Img
            src={wheel.wheelImage || "https://i.imgur.com/8RlEqh6.png"}
            className="w-24 rounded-full sm:w-28"
          />
          <div className="flex flex-col flex-1 px-2 my-auto text-gray-400">
            <span className="text-gray-700 text-ellipsis-2">{wheel.title}</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">
              Tổng {screenSm ? "lượt đã quay" : ""}:{" "}
              <span className="text-danger">{wheel.turn} lượt</span>
            </span>
            <span className="text-xs sm:text-sm whitespace-nowrap">
              {screenSm ? "Hôm nay đã quay" : "Hôm nay"}:{" "}
              <span className="text-danger">{wheel.turnOfDay} lượt</span>
            </span>
          </div>
          <Link href={{ pathname: location.pathname, query: { wheel: wheel.code } }} shallow>
            <a className="my-auto rounded-full btn-primary btn-sm"> Tham gia</a>
          </Link>
        </div>
      ))}
    </div>
  );
}
