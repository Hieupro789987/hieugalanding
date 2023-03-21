import { useRouter } from "next/router";
import { useState } from "react";
import { parseNumber } from "../../../../../lib/helpers/parser";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../../lib/providers/auth-provider";
import { Service } from "../../../../../lib/repo/services/service.repo";
import { RequestDialog } from "../../../../shared/common/request-dialog";
import { Button } from "../../../../shared/utilities/form";
import {
  OptionCustom,
  useStoreDetailServiceDetailsContext,
} from "../provider/store-detail-service-details-provider";
import { ServiceAdditionalServiceItem } from "./service-additional-service-Item";

export function ServiceAdditionalServices({ service }: { service: Service }) {
  const router = useRouter();
  const isLg = useScreen("lg");
  const [isLogin, setIsLogin] = useState(false);
  const { globalCustomer } = useAuth();

  const {
    totalPrice,
    selectedOptions,
    checkedAdditionalService,
  } = useStoreDetailServiceDetailsContext();

  const handleClickBook = (typePrice: "FIXED" | "CONTACT") => {
    if (!globalCustomer) {
      setIsLogin(true);
      return;
    }
    if (typePrice == "FIXED") {
      if (!!selectedOptions && selectedOptions?.length > 0) {
        router.push(
          `${router.asPath}/book?ids=${selectedOptions
            .map(
              (opt) =>
                !!opt?.additionalServiceId && [
                  opt.additionalServiceId,
                  ...opt.options.map((x) => x.id),
                ]
            )
            .join("-")}`
        );
      } else {
        router.push(`${router.asPath}/book?ids=[]`);
      }
    }
  };

  return (
    <>
      <div className={`lg:w-full ${!isLg ? "main-container pb-2" : ""}`}>
        {service?.additionalServices.length > 0 &&
          service?.additionalServices?.map((additionalService) => (
            <ServiceAdditionalServiceItem
              additionalService={additionalService}
              onClickOption={checkedAdditionalService}
              selectedOptions={selectedOptions}
              key={additionalService?.id}
            />
          ))}
      </div>
      <div
        className={`flex flex-row items-center lg:gap-5 gap-x-2 mt-8 ${
          !isLg
            ? "fixed bottom-0 bg-white mt-0 p-3 z-10 justify-between w-full shadow-md shadow-black"
            : ""
        }`}
      >
        {service?.servicePriceType === "FIXED" ? (
          <>
            <Button
              primary
              text={`Đặt lịch  ${parseNumber(totalPrice)}đ`}
              className="order-1 w-full shadow-lg lg:order-none lg:w-60 lg:shrink-0 lg:grow-0 h-14 shadow-green-500/50"
              onClick={() => handleClickBook("FIXED")}
            />

            {/* <Button
              outline
              textPrimary
              text={"Liên hệ"}
              className="w-full lg:w-40 lg:shrink-0 lg:grow-0 h-14"
              onClick={() => handleClickBook("CONTACT")}
            /> */}
          </>
        ) : (
          <Button
            primary
            text="Đặt lịch"
            className={`shadow-lg lg:w-60 shrink-0 grow-0 h-14 shadow-green-500/50 ${
              !isLg ? "w-full mx-auto" : ""
            }`}
            // onClick={() => handleClickBook("CONTACT")}
          />
        )}
      </div>

      <RequestDialog
        isOpen={isLogin}
        onClose={() => setIsLogin(false)}
        title="Vui lòng đăng nhập để tiếp tục"
        hasRequestLogin
      />
    </>
  );
}
