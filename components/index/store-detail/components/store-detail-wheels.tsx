import Link from "next/link";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { LuckyWheel } from "../../../../lib/repo/lucky-wheel.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { Img, NotFound, Spinner } from "../../../shared/utilities/misc";
import { useWheelsContext, WheelsProvider } from "../../wheels/providers/wheels-provider";

type Props = {};

export function StoreDetailWheels({ ...props }) {
  const { customer } = useShopContext();

  if (!customer) return <Spinner />;
  return (
    <WheelsProvider>
      <div className="min-h-screen py-8 main-container text-accent">
        <div className="flex flex-row items-center justify-between py-1">
          <SectionTitle>Danh sách vòng quay</SectionTitle>

          {/* <div className="">
            <Button
              icon={<GiCartwheel />}
              text="Lịch sử vòng quay"
              href={`/store/${shopCode}/wheel/history`}
              className="h-12"
              textPrimary
              outline
            />
          </div> */}
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
    <div className="grid grid-cols-2 gap-5 my-8">
      {items.map((wheel: LuckyWheel, index) => (
        <div
          className={`flex px-4 py-5 justify-start bg-white rounded-md bg-no-repeat bg-right-bottom ${
            index < items.length - 1 ? "border-b" : ""
          }`}
          key={index}
          style={{
            backgroundImage: `url("/assets/img/img-bg-wheel.png")`,
            backgroundSize: "150px",
          }}
        >
          <Img
            src={wheel.wheelImage || "https://i.imgur.com/8RlEqh6.png"}
            className="rounded-full w-28 sm:w-32"
          />
          <div className="flex flex-col px-2 my-auto ml-3 text-gray-400 ">
            <span className="mb-2 font-semibold text-accent">{wheel.title}</span>
            <span className="text-sm whitespace-nowrap">
              Tổng {screenSm ? "lượt đã quay" : ""}:{" "}
              <span className="font-semibold text-accent">{wheel.turn} lượt</span>
            </span>
            <span className="text-sm whitespace-nowrap">
              {screenSm ? "Hôm nay đã quay" : "Hôm nay"}:{" "}
              <span className="font-semibold text-accent">{wheel.turnOfDay} lượt</span>
            </span>
            <Link
              href={{
                pathname: `${location.pathname}/detail-wheel`,
                // query: { wheelId: wheel.id },
                query: { wheel: wheel.code },
              }}
              shallow
            >
              <a className="py-5 my-2 rounded-md btn-primary"> Tham gia</a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
