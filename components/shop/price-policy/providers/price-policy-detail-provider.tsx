import { createContext, useContext } from "react";
import { useGetOneById } from "../../../../lib/hooks/useGetOneById";
import { PricePolicy, PricePolicyService } from "../../../../lib/repo/price-policy.repo";
export const PricePolicyDetailContext = createContext<
  Partial<{
    pricePolicy: PricePolicy;
    setPricePolicy: (pricePolicy: Partial<PricePolicy>) => void;
  }>
>({});

type PricePolicyProviderProps = ReactProps & {
  id: string;
};

export function PricePolicyDetailProvider(props: PricePolicyProviderProps) {
  const { id } = props;
  const [pricePolicy, setPricePolicy] = useGetOneById(id, PricePolicyService);

  return (
    <PricePolicyDetailContext.Provider
      value={{
        pricePolicy,
        setPricePolicy,
      }}
    >
      {props.children}
    </PricePolicyDetailContext.Provider>
  );
}

export const usePricePolicyDetailContext = () => useContext(PricePolicyDetailContext);
