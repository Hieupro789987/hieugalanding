import { FaMapMarkerAlt } from "react-icons/fa";
import { RiMapPin2Line } from "react-icons/ri";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useLocation } from "../../../lib/providers/location-provider";

export function LocationToolbar({ className = "", ...props }: ReactProps) {
  const { userLocation, openLocation } = useLocation();

  if (userLocation === undefined) return <div className="flex-1"></div>;
  return (
    <div
      className={`flex-1 py-3 cursor-pointer overflow-hidden text-gray-50 ${className}`}
      onClick={() => openLocation()}
    >
      <div className="flex flex-row items-center text-sm md:text-base">
        <i className={`mr-1 text-lg`}>{<RiMapPin2Line />}</i>
        <span className="flex-1 text-left text-ellipsis-1">
          {userLocation ? (
            <>
              <span className="font-normal">Giao đến: </span>
              <span className="font-semibold text-white">{userLocation.fullAddress}</span>
            </>
          ) : (
            <span className="font-medium ">Vui lòng nhập địa chỉ của bạn</span>
          )}
        </span>
      </div>
    </div>
  );
}
