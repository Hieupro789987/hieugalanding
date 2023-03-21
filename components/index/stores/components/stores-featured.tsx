import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Member } from "../../../../lib/repo/member.repo";
import { PublicShop } from "../../../../lib/repo/shop.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { Img } from "../../../shared/utilities/misc";
import { StoresItem } from "./stores-item";

export function Storesfeatured({ shops, ...props }: { shops: PublicShop[] }) {
  const [shopFeats, setShopFeats] = useState<PublicShop[]>(shops);

  useEffect(() => {
    setShopFeats(shopFeats.reverse().slice(0, 5));
  }, []);

  return (
    <div className="main-container">
      <SectionTitle>Cửa hàng nổi bật</SectionTitle>
      <div className="grid grid-cols-2 gap-2 mt-4 lg:gap-5 lg:grid-cols-5">
        {shopFeats.map((shop) => (
          <StoresItem shop={shop} key={shop.id} />
        ))}
      </div>
    </div>
  );
}
