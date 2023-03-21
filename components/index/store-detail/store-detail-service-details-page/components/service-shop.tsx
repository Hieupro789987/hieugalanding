import { useState } from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { RiStore2Line, RiWechatLine } from "react-icons/ri";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
import { Service } from "../../../../../lib/repo/services/service.repo";
import { Button } from "../../../../shared/utilities/form";
import { Img } from "../../../../shared/utilities/misc";

export function ServiceShop({ service }: { service: Service }) {
  const { shopCode, customer } = useShopContext();
  const [openRequestLoginDialog, setOpenRequestLoginDialog] = useState(false);

  const isLg = useScreen("lg");

  return (
    <div className="flex flex-col p-6 mt-4 bg-white lg:mt-8 lg:justify-between lg:items-center lg:flex-row">
      <div className="flex flex-row items-center">
        <Img
          default={service?.member?.shopCover}
          src={service?.member?.shopCover}
          rounded
          className="w-16 lg:flex-1"
        />
        <div className="ml-4">
          <div className="text-xl font-extrabold text-primaryBlack">
            {service?.member?.shopName}
          </div>
          <div className="flex flex-row items-center">
            {!!service?.member?.address && <MdOutlineLocationOn />}{" "}
            <span className="ml-1 text-primaryBlack">{service?.member?.address}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-3 my-auto mt-4 lg:mx-0">
        <Button
          outline
          textPrimary
          icon={<RiWechatLine />}
          iconClassName="text-xl"
          className="w-full"
          text="Chat"
          {...(isLg
            ? {
                onClick: () => {
                  if (customer) {
                    const el: HTMLElement = document.querySelector("#chat-widget");
                    if (el) {
                      el.click();
                      setTimeout(() => {
                        const typeEl: HTMLElement = document.querySelector(
                          "#chat-widget-type-input"
                        );
                        if (typeEl) {
                          typeEl.focus();
                        }
                      }, 100);
                    }
                  } else {
                    setOpenRequestLoginDialog(true);
                  }
                },
              }
            : {
                href: `/store/${shopCode}/chat`,
              })}
        />
        <Button
          primary
          icon={<RiStore2Line />}
          iconClassName="text-xl"
          className="w-full min-w-fit lg:p-none px-[10px]"
          text="Đến cửa hàng"
          href={`/store/${shopCode}`}
        />
      </div>
    </div>
  );
}
