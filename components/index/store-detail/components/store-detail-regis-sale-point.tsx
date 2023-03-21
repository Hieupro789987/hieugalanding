import { useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button, Checkbox } from "../../../shared/utilities/form";

type Props = {};

export function StoreDetailRegisSalePoint({}: Props) {
  const { shop } = useShopContext();
  const [confirm, setConfirm] = useState(true);

  return (
    <div className="flex-1 bg-white text-accent">
      <div className="my-6 main-container">
        <SectionTitle>Điều khoản đăng ký điểm bán</SectionTitle>
        <div
          className="mt-6 ck-content"
          dangerouslySetInnerHTML={{
            __html: shop?.config?.salePointConfig?.termsAndConditions,
          }}
        ></div>
        <Checkbox
          className="text-sm sm:text-base -ml-1.5"
          placeholder="Tôi đồng ý với điều khoản"
          defaultValue={confirm}
          onChange={(val) => setConfirm(val)}
        />
        <Button
          text="Đăng ký điểm bán"
          primary
          className="mt-8 rounded-md w-52 h-14"
          disabled={!confirm}
          onClick={() => {
            setConfirm(false);
          }}
        />
      </div>
    </div>
  );
}
