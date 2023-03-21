import { useState } from "react";
import { FaChevronRight, FaStore } from "react-icons/fa";
import { RiStore2Line, RiStore3Line, RiStoreLine } from "react-icons/ri";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { LocationToolbar } from "../../../shared/location/location-toolbar";
import { ShopDetailsBranchesDialog } from "./shop-details-branches-dialog";

export function ShopDetailsLocation() {
  const { selectedBranch } = useShopContext();
  const [openShopBranchs, setOpenShopBranchs] = useState(false);

  if (selectedBranch === undefined) return <></>;
  return (
    <>
      <div
        className="flex items-center px-3 py-2.5 bg-white border-b cursor-pointer whitespace-nowrap text-sm md:text-base"
        onClick={() => setOpenShopBranchs(true)}
      >
        <i className="pr-1 text-base text-gray-500 md:text-lg">{<RiStore3Line />}</i>
        <span className="mr-1 font-medium text-gray-500 lg:text-white">Chi nhánh: </span>
        <span className="font-semibold text-ellipsis-1">
          {selectedBranch ? selectedBranch.name : "Chọn cửa hàng"}
        </span>
        {selectedBranch?.distance >= 0 && (
          <span className="pl-1 font-semibold"> - {selectedBranch?.distance}km</span>
        )}
        <i className="ml-auto pl-1 text-sm text-gray-400 lg:text-white md:text-base">
          <FaChevronRight />
        </i>
      </div>
      <ShopDetailsBranchesDialog
        isOpen={openShopBranchs}
        onClose={() => setOpenShopBranchs(false)}
      />
      <div className="bg-white">
        <LocationToolbar className="px-3" />
      </div>
    </>
  );
}
