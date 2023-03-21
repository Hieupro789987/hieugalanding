import { createContext, useContext } from "react";
import { useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import {
  LuckyWheelResultService,
  LuckyWheelResult,
} from "../../../../lib/repo/lucky-wheel-result.repo";

export const WheelsResultContext = createContext<
  CrudProps<LuckyWheelResult> & Partial<{ setLimit: Function; limit: number }>
>({});

export function WheelsResultProvider(props) {
  const [limit, setLimit] = useState(10);
  const context = useCrud(
    LuckyWheelResultService,
    {
      order: { createdAt: -1 },
      limit: limit,
    },
    {
      cache: false,
    }
  );
  return (
    <WheelsResultContext.Provider value={{ ...context, limit, setLimit }}>
      {props.children}
    </WheelsResultContext.Provider>
  );
}

export const useWheelsResultContext = () => useContext(WheelsResultContext);
