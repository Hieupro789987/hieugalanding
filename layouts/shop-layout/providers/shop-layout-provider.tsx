import isBefore from "date-fns/isBefore";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopConfig, ShopConfigService } from "../../../lib/repo/shop-config.repo";

export const ShopLayoutContext = createContext<
  Partial<{
    subscriptionStatus: Option;
    shopConfig: ShopConfig;
    setShopConfig: Dispatch<SetStateAction<ShopConfig>>;
    updateShopConfig: (data) => Promise<ShopConfig>;
    hasInstructionCompleted: boolean;
    handleCompleteInstruction: (skipOnce?: boolean) => any;
    pendingDistributorRegistrations: number;
    checkPendingDistributorRegistrations: () => any;
  }>
>({});
export function ShopLayoutProvider(props) {
  const toast = useToast();
  const { member } = useAuth();
  const [shopConfig, setShopConfig] = useState<ShopConfig>(null);
  const [hasInstructionCompleted, setHasInstructionCompleted] = useState(false);
  const [pendingDistributorRegistrations, setPendingDistributorRegistrations] = useState(0);

  useEffect(() => {
    if (member) {
      setHasInstructionCompleted(!!sessionStorage.getItem(`instruction_completed_${member.code}`));
      ShopConfigService.getShopConfig()
        .then((res) => {
          setShopConfig(res);
        })
        .catch((err) => {
          toast.error("Có lỗi xảy ra. " + err.message);
        });
    } else {
      setShopConfig(null);
    }
  }, [member]);

  const updateShopConfig = async (data) => {
    return ShopConfigService.update({
      id: shopConfig.id,
      data,
      toast,
    }).then((res) => {
      setShopConfig(res);
      return res;
    });
  };

  const subscriptionStatus: Option = useMemo(() => {
    if (member?.subscription && member.subscription.expiredAt) {
      const today = new Date();
      const oneWeekBeforeExpired = new Date(member.subscription.expiredAt);
      oneWeekBeforeExpired.setDate(oneWeekBeforeExpired.getDate() - 7);
      if (isBefore(today, oneWeekBeforeExpired)) {
        return {
          value: "ACTIVE",
          label: "Đang hoạt động",
          color: "success",
        };
      } else if (isBefore(today, new Date(member.subscription.expiredAt))) {
        return {
          value: "WARNING",
          label: "Sắp hết hạn",
          color: "warning",
        };
      } else if (isBefore(today, new Date(member.subscription.lockedAt))) {
        return {
          value: "EXPIRED",
          label: "Đã hết hạn",
          color: "danger",
        };
      } else {
        return {
          value: "LOCKED",
          label: "Đã bị khoá",
          color: "slate",
        };
      }
    }
    return null;
  }, [member]);

  const handleCompleteInstruction = (skipOnce: boolean = false) => {
    setHasInstructionCompleted(true);
    if (!skipOnce) {
      sessionStorage.setItem(`instruction_completed_${member.code}`, "true");
    }
  };

  return (
    <ShopLayoutContext.Provider
      value={{
        shopConfig,
        updateShopConfig,
        setShopConfig,
        subscriptionStatus,
        hasInstructionCompleted,
        handleCompleteInstruction,
        pendingDistributorRegistrations,
      }}
    >
      {/* {subscriptionStatus && subscriptionStatus.value !== "ACTIVE" && (
        <div
          className={`opacity-95 flex-center z-50 text-center py-1 text-sm shadow-sm sticky top-0 text-gray-50 font-semibold bg-${subscriptionStatus?.color}`}
        >
          Gói dịch vụ {subscriptionStatus.label.toLowerCase()}
          <Link href="/shop/settings/payment">
            <a className="inline-block h-6 px-2 ml-2 text-xs text-gray-100 border-2 border-gray-100 rounded-sm flex-center hover:border-white hover:text-white">
              Thanh toán ngay
            </a>
          </Link>
        </div>
      )} */}
      {props.children}
    </ShopLayoutContext.Provider>
  );
}

export const useShopLayoutContext = () => useContext(ShopLayoutContext);
