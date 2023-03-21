import Link from "next/link";
import { RiStore2Line } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { Service } from "../../../lib/repo/services/service.repo";
import { Img } from "../utilities/misc";

export function ServiceItem({
  service,
  hasShop = true,
  ...props
}: {
  service: Service;
  hasShop?: boolean;
}) {
  return (
    <Link href={`/store/${service?.member?.code}/services/${service?.slug}`}>
      <a>
        <div className="h-full p-2 bg-white border rounded-md shadow-sm cursor-pointer rou hover:border-primary">
          <div className="flex flex-col justify-between flex-1 h-full shink-0 grow-0">
            <Img src={service?.images[0]} />
            <div className="mt-2 text-sm font-semibold text-neutralDark text-ellipsis-2 lg:text-base">
              {service?.name}
            </div>
            <div className="h-auto mt-auto ">
              {hasShop && (
                <div className="flex flex-row items-center mt-1 mb-2 text-xs font-semibold text-primary">
                  <RiStore2Line />
                  <span className="ml-1">{service?.member?.shopName}</span>
                </div>
              )}
              <div className="text-base font-bold lg:text-xl text-primary text-ellipsis-1">
                {service?.servicePriceType === "FIXED"
                  ? `${parseNumber(service?.price)}đ`
                  : "Liên hệ"}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
