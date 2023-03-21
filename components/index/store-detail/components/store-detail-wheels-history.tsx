import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { formatDate } from "../../../../lib/helpers/parser";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { LuckyWheelResult } from "../../../../lib/repo/lucky-wheel-result.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button } from "../../../shared/utilities/form";
import { Img, Spinner } from "../../../shared/utilities/misc";
import { DialogGiftResult } from "../../wheel/dialog-gift-result";
import { useWheelContext, WheelProvider } from "../../wheel/providers/wheel-provider";
import { useWheelsContext, WheelsProvider } from "../../wheels/providers/wheels-provider";
import {
  useWheelsResultStoreDetailContext,
  WheelsResultStoreDetailProvider,
} from "../provider/store-detail-provider";

export function StoreDetailWheelsHistory() {
  const wheel = useQuery("wheel");

  return (
    // <WheelsResultStoreDetailProvider>
    //   <WheelProvider code={code}>

    //   </WheelProvider>
    // </WheelsResultStoreDetailProvider>

    <WheelsProvider>
      <WheelsResultStoreDetailProvider>
        <WheelProvider code={wheel}>
          <StoreDetailWheelsHistoryBody />
        </WheelProvider>
      </WheelsResultStoreDetailProvider>
    </WheelsProvider>
  );
}

function StoreDetailWheelsHistoryBody() {
  const { shopCode } = useShopContext();
  return (
    <div className="min-h-screen py-8 main-container">
      <Button
        icon={<FaChevronLeft />}
        iconClassName="text-primary mr-3"
        className="pl-0"
        textPrimary
        tooltip={""}
        text="Quay lại danh sách vòng quay"
        href={`/store/${shopCode}/wheel`}
      />

      <div className="flex flex-row justify-between mt-10 ">
        <div className="w-2/5 p-5 mr-8 bg-white rounded-md h-3/4">
          <LuckyWheel />
        </div>
        <div className="flex-1">
          <SectionTitle>Kết quả vòng quay</SectionTitle>
          <ListWheel />
        </div>
      </div>
    </div>
  );
}

function ListWheel() {
  const { items, pagination, setLimit, limit, loadMore } = useWheelsResultStoreDetailContext();
  const [loading, setLoading] = useState(false);
  const [curPos, setCurPos] = useState(null);
  function menuScrollEvent() {
    let scrollCheckInterval = null;
    let billeds = document.getElementsByClassName("wheel-result");
    if (billeds && billeds.length > 0) {
      const { y } = billeds[0].getBoundingClientRect();
      if (!curPos || y < curPos) {
        setCurPos(y);
        setLimit(limit + 5);
        clearInterval(scrollCheckInterval);
      }
    }
  }
  useEffect(() => {
    setLimit(limit);
  }, [limit]);
  useEffect(() => {
    if (loading) {
      document.removeEventListener("scroll", menuScrollEvent);
    } else {
      document.addEventListener("scroll", menuScrollEvent, {
        passive: true,
      });
    }
    return () => {
      document.removeEventListener("scroll", menuScrollEvent);
    };
  }, [loading]);
  if (!items) return <Spinner />;
  if (items.length == 0) return <WheelResultEmpty />;
  return (
    <div className="flex flex-col item-center">
      {items.map((wheelrs: LuckyWheelResult, index) => (
        <WheelResult
          wheelrs={wheelrs}
          key={index}
          className={`wheel-result ${index < items.length - 1 ? "border-b" : ""}`}
        />
      ))}
      {loading && items && limit < pagination.total && (
        <Button
          text="Đang tải..."
          large
          asyncLoading={loading}
          className="btnLoading"
          onClick={() => {
            loadMore();
          }}
        />
      )}
    </div>
  );
}
function WheelResult({ wheelrs, ...props }: ReactProps & { wheelrs: LuckyWheelResult }) {
  let startDate = new Date(wheelrs.createdAt);
  let endDate = new Date(
    startDate.getTime() + (wheelrs.gift?.voucherExpiredDay || 0) * 24 * 60 * 60 * 1000
  );
  const router = useRouter();

  return (
    <div
      className={`bg-white rounded-md p-5 my-3 flex ${
        !wheelrs.gift.isLose && !wheelrs.voucher ? "hidden" : ""
      } ${props.className || ""}`}
    >
      <Img src={wheelrs.gift.image || "https://i.imgur.com/8RlEqh6.png"} className="w-20" contain />
      <div className="flex flex-col pl-3 ml-3">
        <span className="text-lg font-semibold text-ellipsis-2 text-accent ">
          {wheelrs.gift.name}
        </span>
        {wheelrs.voucher ? (
          <span className="mt-1 text-sm">
            <span className="font-semibold">Mã khuyến mãi: </span>
            {wheelrs.voucher.code}
          </span>
        ) : (
          ""
        )}
        <div className="mt-1 text-sm">
          {" "}
          <span className="text-gray-400">Ngày nhận:</span>{" "}
          <span className="ml-2 text-accent">{formatDate(startDate, "dd-MM-yyyy HH:mm")}</span>
        </div>{" "}
        {wheelrs.gift?.voucherExpiredDay && (
          <div className="mt-1 text-sm">
            <span className="text-gray-400">Ngày hết hạn:</span>{" "}
            <span className="ml-2 text-accent">{formatDate(endDate, "dd-MM-yyyy HH:mm")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const LuckyWheel = (props) => {
  const { luckyWheel } = useWheelsContext();
  const { setShowGift, showGift, playLuckyWheel, gift, loading } = useWheelContext();
  const { loadAll } = useWheelsResultStoreDetailContext();

  const { shopCode } = useShopContext();
  const router = useRouter();
  if (!luckyWheel) return <Spinner />;
  return (
    //background
    <div>
      <div
        className={`relative flex flex-col items-center bg-gray-light`}
        style={{
          backgroundImage: `url("${
            luckyWheel?.backgroundImage ? luckyWheel?.backgroundImage : ""
          }")`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: `"${luckyWheel?.backgroundColor || ""}"`,
        }}
      >
        {/* banner */}
        <div className={`w-full ${!luckyWheel?.bannerImage ? "min-h-4xs" : ""}`}>
          <img
            src={luckyWheel?.bannerImage}
            alt=""
            className="flex self-center justify-center object-contain w-full h-auto"
          />
        </div>
        <div className="relative w-4/5 h-0 overflow-hidden" style={{ paddingTop: "80%" }}>
          <img
            id="wheel"
            src={luckyWheel?.wheelImage}
            alt=""
            className="absolute top-0 left-0 object-contain w-full h-full"
          />
          <img
            src={luckyWheel?.pinImage ? luckyWheel?.pinImage : "https://i.imgur.com/F5XQRBd.png"}
            alt=""
            className="absolute top-0 left-0 self-center object-contain w-full h-full"
          />
        </div>

        <div
          className={`relative w-full min-h-4xs pb-10`}
          // style={}
        >
          <Button
            text={luckyWheel?.btnTitle || "Bắt đầu quay"}
            isLoading={loading}
            className="absolute text-sm transform -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2 sm:text-base"
            primary
            large
            style={{ backgroundColor: luckyWheel.buttonColor || "" }}
            onClick={() => playLuckyWheel()}
          />
        </div>

        {gift ? (
          <DialogGiftResult
            isOpen={showGift}
            onClose={() => {
              setShowGift(false);
              // router.replace(`/${shopCode}/wheel/detail-wheel?wheel=${router.query.wheel}`);
            }}
            gift={gift}
          />
        ) : (
          ""
        )}
      </div>
      <img
        src={luckyWheel.footerImage}
        alt=""
        className="flex self-center justify-center object-contain w-full h-auto"
      />
    </div>
  );
};

function WheelResultEmpty() {
  const { shopCode } = useShopContext();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img className="object-cover w-64 " src="/assets/img/img-wheel-empty.png" />
      <div className="my-3 text-gray-400">Bạn chưa tham gia vòng quay nào</div>
    </div>
  );
}
