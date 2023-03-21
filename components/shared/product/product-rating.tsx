import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { formatDate } from "../../../lib/helpers/parser";

interface Props extends ReactProps {
  rating?: number | string;
  numRated?: number | string;
  ratingTime?: string;
  soldQty?: number;
  distance?: number;
  soldQtyIconClassName?: string;
}
export function ProductRating({ className = "", distance, soldQtyIconClassName, ...props }: Props) {
  return (
    <div className={`flex items-center gap-4 text-gray-600  ${className}`}>
      {distance >= 0 && (
        <div className="flex items-center">
          <i className={`text-slate mb-0.5`}>
            <FaMapMarkerAlt />
          </i>
          <span className="ml-1">{distance} km</span>
        </div>
      )}
      {props.rating > 0 && (
        <div className="flex items-center">
          <i className={`text-yellow-300 mb-0.5 text-sm md:text-base`}>
            <FaStar />
          </i>
          <span className="ml-1 text-sm text-accent">{props.rating}</span>
          {props.numRated && <span className="text-sm text-gray-400"> ({props.numRated}+)</span>}
          {props.ratingTime && (
            <span className="text-sm font-light text-gray-400">
              | {formatDate(props.ratingTime, "dd-MM-yyyy HH:mm")}
            </span>
          )}
        </div>
      )}
      {!!props.soldQty && (
        <div className="flex items-center">
          <i className={`text-slate mb-0.5 ${soldQtyIconClassName}`}>
            <RiShoppingBag3Line />
          </i>
          <span className="ml-1 text-xs text-accent">
            {`${props.soldQty} đã bán`}
            {/* {(props.soldQty >= 1000 && "999+ đã bán") ||
              (props.soldQty >= 100 && "99+ đã bán") ||
              (props.soldQty >= 10 && "9+ đã bán") ||
              props.soldQty} */}
          </span>
        </div>
      )}
    </div>
  );
}
