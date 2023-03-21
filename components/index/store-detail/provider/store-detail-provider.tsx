import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import {
  LuckyWheelResultService,
  LuckyWheelResult,
} from "../../../../lib/repo/lucky-wheel-result.repo";
import { useRouter } from "next/router";
import { useWheelsContext } from "../../wheels/providers/wheels-provider";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";

export const WheelsResultStoreDetailContext = createContext<
  CrudProps<LuckyWheelResult> & Partial<{ setLimit: Function; limit: number }>
>({});

export function WheelsResultStoreDetailProvider(props) {
  const router = useRouter();
  const { luckyWheel } = useWheelsContext();
  const [limit, setLimit] = useState(10);
  const [wheelId, setWheelId] = useState(luckyWheel?.id);

  useEffect(() => {
    if (wheelId == undefined || luckyWheel?.id != undefined) {
      setWheelId(luckyWheel?.id);
    }
  }, [router.query, wheelId, luckyWheel?.id]);

  const context = useCrud(
    LuckyWheelResultService,
    {
      order: { createdAt: -1 },
      limit: limit,
      filter: {
        luckyWheelId: wheelId,
      },
    },
    {
      cache: false,
    }
  );
  // useEffect(() => {
  //   if (wheelId != undefined) {
  //     context.loadAll();
  //   }
  // }, [wheelId]);

  return (
    <WheelsResultStoreDetailContext.Provider value={{ ...context, limit, setLimit }}>
      {props.children}
    </WheelsResultStoreDetailContext.Provider>
  );
}

export const useWheelsResultStoreDetailContext = () => useContext(WheelsResultStoreDetailContext);
