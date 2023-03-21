import { FaCheck } from "react-icons/fa";
import { useDevice } from "../../../../lib/hooks/useDevice";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { ShopBranch } from "../../../../lib/repo/shop-branch.repo";
import { DialogHeader } from "../../../shared/default-layout/dialog-header";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Spinner } from "../../../shared/utilities/misc";
interface Propstype extends DialogProps {
  onSelect?: (string) => void;
}
export function ShopDetailsBranchesDialog({ ...props }: Propstype) {
  const { shopBranches, selectedBranch, setSelectedBranch } = useShopContext();
  const { isMobile, isDesktop } = useDevice();
  return (
    <Dialog
      width={600}
      isOpen={props.isOpen}
      onClose={props.onClose}
      mobileSizeMode={isMobile}
      bodyClass="relative bg-white rounded"
      headerClass=" "
    >
      <DialogHeader title={`Chọn cửa hàng (${shopBranches.length})`} onClose={props.onClose} />
      <Dialog.Body>
        {shopBranches ? (
          <div
            className={`flex flex-col text-sm sm:text-base v-scrollbar px-4 ${
              isMobile ? "pb-12" : ""
            }`}
            style={{
              minHeight: `${isDesktop ? "600px" : ""} `,
              height: `${isDesktop ? "auto" : " calc(100vh - 144px)"} `,
            }}
            // style={{ maxHeight: `calc(96vh - 150px)`, minHeight: `calc(96vh - 350px)` }}
          >
            {shopBranches.map((item: ShopBranch, index) => (
              <div
                className="flex items-center pb-2 mt-2 border-b cursor-pointer"
                key={index}
                onClick={() => {
                  if (item.isOpen) {
                    setSelectedBranch({ ...item });
                    props.onClose();
                  }
                }}
              >
                <div className="flex-1 text-gray-700">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-ellipsis-2">{item.address}</div>
                  <div>
                    <span
                      className={`font-medium text-sm ${
                        item.isOpen ? "text-success" : "text-danger"
                      }`}
                    >
                      {item.isOpen ? "Đang mở" : "Đóng cửa"}
                    </span>
                    <span className="text-sm text-gray-500"> - cách {item.distance}km</span>
                  </div>
                </div>
                {selectedBranch?.id == item.id && (
                  <i className="text-xl text-success">
                    <FaCheck />
                  </i>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </Dialog.Body>
    </Dialog>
  );
}
