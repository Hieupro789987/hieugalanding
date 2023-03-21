import { useEffect, useState } from "react";
import { query } from "winston";
import { useShopLayoutContext } from "../../../layouts/shop-layout/providers/shop-layout-provider";
import { useCrud } from "../../../lib/hooks/useCrud";
import { GraphService } from "../../../lib/repo/graph.repo";
import { SettingGroupService } from "../../../lib/repo/setting-group.repo";
import { SettingService } from "../../../lib/repo/setting.repo";
import { Img, Spinner } from "../../shared/utilities/misc";

export function QrInactivePage() {
  const [settingQr, setSettingQr] = useState<{ image: string; title: string }>();
  const getQrSetting = async () => {
    try {
      const res = await Promise.all([
        SettingService.getSettingByKey("INACTIVE_QR_IMAGE"),
        SettingService.getSettingByKey("INACTIVE_QR_TITLE"),
      ]);
      setSettingQr({
        image: res[0].value,
        title: res[1].value,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getQrSetting();
  }, []);

  if(!setSettingQr) return <Spinner />
  
  return (
    <div className="py-24 m-auto main-container">
      <Img
        className="object-cover mx-auto shadow-sm w-80"
        src={settingQr?.image}
        
      />
      <div className="mt-3 font-semibold text-center lg:text-2xl">{settingQr?.title}</div>
    </div>
  );
}
