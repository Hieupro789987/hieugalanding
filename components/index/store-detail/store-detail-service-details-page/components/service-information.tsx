import { parseNumber } from "../../../../../lib/helpers/parser";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { Service } from "../../../../../lib/repo/services/service.repo";

export function ServiceInformation({ service }: { service: Service }) {
  const isLg = useScreen("lg");
  return (
    <div className={`lg:w-full ${!isLg ? "main-container mt-3" : ""}`}>
      <div className="mb-2 text-xl font-semibold lg:text-3xl text-primaryBlack">
        {service?.name}
      </div>
      <span className="inline-block px-4 py-1 mb-4 text-sm font-light rounded-sm lg:mb-8 bg-primary-light lg:text-base text-success">
        {service?.shopServiceCategory?.name}
      </span>
      <div className="p-4 mb-8 text-xl font-bold lg:text-3xl bg-neutral-50 text-primary">
        {/* {service?.servicePriceType === "FIXED" ? (
            <span>{parseNumber(service?.price, true)}</span>
          ) : (
            "Giá liên hệ"
          )} */}
        <span>{parseNumber(service?.price)}đ</span>
      </div>
    </div>
  );
}
