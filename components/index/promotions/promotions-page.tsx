import { useShopContext } from "../../../lib/providers/shop-provider";
import { NotFound, Spinner } from "../../shared/utilities/misc";
import { VoucherList } from "../../shared/voucher/voucher-list";

export function PromotionsPage() {
  const { customer } = useShopContext();

  if (customer === undefined) return <Spinner />;
  if (customer === null) return <NotFound text="Vui lòng đăng nhập trước" />;
  return (
    <div className="relative min-h-screen bg-gray-100">
      <VoucherList isListMode />
    </div>
  );
}
