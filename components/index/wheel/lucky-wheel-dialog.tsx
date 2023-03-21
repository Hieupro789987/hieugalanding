import React, { useEffect, useState } from "react";
import { DialogGiftResult } from "./dialog-gift-result";
import { WheelProvider, useWheelContext, WheelContext } from "./providers/wheel-provider";
import { useRouter } from "next/router";
import { useRef } from "react";
import { HiOutlineX } from "react-icons/hi";
import { useWheelsContext } from "../wheels/providers/wheels-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Button } from "../../shared/utilities/form/button";
import { DialogProps, Dialog } from "../../shared/utilities/dialog/dialog";
import { Spinner } from "../../shared/utilities/misc";

export const LuckyWheel = (props) => {
  const { luckyWheel } = useWheelsContext();
  const { setShowGift, showGift, playLuckyWheel, gift, loading } = useWheelContext();
  const { shopCode } = useShopContext();
  const router = useRouter();

  return (
    //background
    <div
      className=" v-scrollbar"
      style={{
        maxHeight: "calc(100vh - 110px)",
      }}
    >
      <div
        className={`relative flex flex-col items-center bg-gray-light`}
        style={{
          backgroundImage: `url("${luckyWheel.backgroundImage ? luckyWheel.backgroundImage : ""}")`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: `"${luckyWheel.backgroundColor || ""}"`,
        }}
      >
        {/* banner */}
        <div className={`w-full ${!luckyWheel.bannerImage ? "min-h-4xs" : ""}`}>
          <img
            src={luckyWheel.bannerImage}
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
            src={luckyWheel.pinImage}
            alt=""
            className="absolute top-0 left-0 self-center object-contain w-full h-full"
          />
        </div>

        <div
          className={`relative w-full min-h-4xs pb-10`}
          // style={}
        >
          <Button
            text={luckyWheel.btnTitle || "Bắt đầu quay"}
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
              router.replace(`/store/${shopCode}/wheel/history`);
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
interface PropsType extends DialogProps {
  code: string;
}
export function LuckyWheelDialog({ code, ...props }: PropsType) {
  const { luckyWheel } = useWheelsContext();
  if (!luckyWheel)
    return (
      <Spinner
        style={{
          height: "calc(100vh - 110px)",
        }}
      />
    );
  return (
    <Dialog {...props} title={luckyWheel.title}>
      <WheelProvider code={code}>
        <Dialog.Body>
          <LuckyWheel />
        </Dialog.Body>
      </WheelProvider>
    </Dialog>
  );
}
