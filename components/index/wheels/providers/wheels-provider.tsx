import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useDevice } from "../../../../lib/hooks/useDevice";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { LuckyWheel, LuckyWheelService } from "../../../../lib/repo/lucky-wheel.repo";
import { LuckyWheelDialog } from "../../wheel/lucky-wheel-dialog";

export const WheelsContext = createContext<
  CrudProps<LuckyWheel> & Partial<{ luckyWheel: LuckyWheel }>
>({});

export function WheelsProvider(props) {
  const { isMobile } = useDevice();
  const context = useCrud(
    LuckyWheelService,
    {
      order: { createdAt: -1 },
    },
    {
      cache: false,
    }
  );
  const [luckyWheel, setLuckyWheel] = useState<LuckyWheel>();
  const router = useRouter();
  const wheelCode = useQuery("wheel");

  useEffect(() => {
    if (!wheelCode) return;
    LuckyWheelService.getAll({
      query: { filter: { code: wheelCode } },
      fragment: LuckyWheelService.fullFragment,
      cache: false,
    })
      .then((res) => setLuckyWheel(res.data[0]))
      .catch((err) => setLuckyWheel(null));
  }, [wheelCode]);
  return (
    <WheelsContext.Provider value={{ ...context, luckyWheel }}>
      {props.children}
      {luckyWheel && isMobile && (
        <LuckyWheelDialog
          code={wheelCode as string}
          isOpen={!!wheelCode}
          mobileSizeMode
          slideFromBottom="all"
          onClose={() => {
            const url = new URL(location.href);
            url.searchParams.delete("wheel");
            router.push(url.toString(), null, { shallow: true });
          }}
        />
      )}
    </WheelsContext.Provider>
  );
}

export const useWheelsContext = () => useContext(WheelsContext);
