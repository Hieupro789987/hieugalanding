import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useShopContext } from "../../../../../lib/providers/shop-provider";
import { AdditionalServiceOption } from "../../../../../lib/repo/services/additional-service-option.repo";
import { AdditionalService } from "../../../../../lib/repo/services/additional-service.repo";
import { Service, ShopServiceService } from "../../../../../lib/repo/services/service.repo";

export interface OptionCustom {
  additionalServiceId: string;
  options: AdditionalServiceOption[];
}

export const StoreDetailServiceDetailsContext = createContext<
  Partial<{
    service: Service;

    totalPrice: number;
    selectedOptions: OptionCustom[];
    checkedAdditionalService: (
      additionalService: AdditionalService,
      option: AdditionalServiceOption
    ) => void;
  }>
>({});

export function StoreDetailServiceDetailsProvider({ children }) {
  const router = useRouter();
  const { shopCode } = useShopContext();
  const [service, setService] = useState<Service>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<OptionCustom[]>([]);

  const getOneService = async () => {
    if (!router?.query?.slug) return;
    try {
      const { data } = await ShopServiceService.getAll({
        query: { filter: { slug: router.query?.slug as string } },
      });
      return data[0];
    } catch (error) {
      console.error(error);
    }
  };
  const selectedOptionDefault = (
    additionalServices?: AdditionalService[],
    originPrice?: number
  ) => {
    if (!!additionalServices && additionalServices.length <= 0) {
      setTotalPrice(originPrice);
    }
    let defaultPriceOptionSelected = 0;
    const defaultOptionsSelected = [];

    if (!!additionalServices && additionalServices?.length > 0) {
      let hasOptionRequired = false;

      additionalServices.forEach((item) => {
        if (item.required) {
          hasOptionRequired = true;
          const opt = item.options.slice(0, item.minRequiredQty);
          defaultPriceOptionSelected += opt.reduce((acc, curr) => {
            return (acc += curr.price);
          }, 0);
          defaultOptionsSelected.push({ additionalServiceId: item.id, options: opt });
        }
      });

      if (!hasOptionRequired) {
        setTotalPrice(originPrice);
      } else {
        setSelectedOptions(defaultOptionsSelected);
        setTotalPrice(defaultPriceOptionSelected + originPrice);
      }
    }
  };

  const selectedPriceTotalOptions = () => {
    let hasOptionRequired = false;
    let defaultPriceOptionSelected = 0;
    if (selectedOptions.length > 0) {
      hasOptionRequired = true;
      selectedOptions?.forEach((item) => {
        defaultPriceOptionSelected += !item.options
          ? 0
          : item.options.reduce((acc, curr) => {
              return (acc += curr.price);
            }, 0);
      });
    }

    if (!hasOptionRequired) {
      setTotalPrice(service?.price);
    } else {
      setTotalPrice(defaultPriceOptionSelected + service?.price);
    }
  };

  const addOptionIntoAdditionalService = (
    additionalService: AdditionalService,
    option: AdditionalServiceOption
  ) => {
    const {
      id,
      isMaxQtyUnlimited,
      maxQty,
      required,
      isMultiEnable,
      minRequiredQty,
    } = additionalService;

    const optionsIsAdded = selectedOptions
      .map((opt) => {
        if (opt.additionalServiceId === id) {
          let newOpts = [];

          if (required && isMultiEnable) {
            if (!!minRequiredQty && !!maxQty) {
              if (minRequiredQty === maxQty) {
                newOpts = [...opt.options.splice(1), option];
                return { ...opt, options: newOpts };
              } else {
                const newList = opt.options.length >= maxQty ? opt.options.splice(1) : opt.options;
                newOpts = [...newList, option];
                return { ...opt, options: newOpts };
              }
            }
          } else if (!required && !isMultiEnable) {
            newOpts = [...opt.options.splice(1), option];
            return { ...opt, options: newOpts };
          } else if (isMultiEnable) {
            if (isMaxQtyUnlimited) {
              newOpts = [...opt.options, option];
              return { ...opt, options: newOpts };
            } else if (!!maxQty) {
              const newList = opt.options.length >= maxQty ? opt.options.splice(1) : opt.options;
              newOpts = [...newList, option];
              return { ...opt, options: newOpts };
            }
          } else if (required && minRequiredQty === 1) {
            newOpts = [...opt.options.splice(1), option];
            return { ...opt, options: newOpts };
          }
        }
        return opt;
      })
      .filter((item) => !!item.additionalServiceId);
    console.log("optionsIsAdded: ", optionsIsAdded);
    setSelectedOptions(optionsIsAdded);
  };

  const removeOptionIntoAdditionalService = (id: string, option: AdditionalServiceOption) => {
    const optionsIsRemoved = selectedOptions.map((opt) => {
      if (opt.additionalServiceId === id) {
        return (
          opt.options.length > 1 && {
            ...opt,
            options: opt.options.filter((x) => x.id !== option.id),
          }
        );
      }
      return opt;
    });

    setSelectedOptions(optionsIsRemoved);
  };

  const isCheckOptionCanAddOrRemove = (
    { required, minRequiredQty, isMultiEnable, isMaxQtyUnlimited, maxQty, id }: AdditionalService,
    type: "ADD" | "REMOVE"
  ) => {
    const options = selectedOptions.find((item) => item.additionalServiceId === id).options;

    if (!required && !isMultiEnable) return true;
    else if (!required && isMultiEnable && !isMaxQtyUnlimited) return true;
    else if (required && isMultiEnable) {
      if (minRequiredQty === maxQty) {
        return type == "ADD" && true;
      } else {
        return type == "ADD" ? true : options.length > minRequiredQty ? true : false;
      }
    } else if (isMultiEnable) {
      if (isMaxQtyUnlimited) {
        return true;
      } else {
        return type == "ADD" ? (options.length < maxQty ? true : false) : true;
      }
    } else if (required) {
      if (minRequiredQty == 1) {
        return type == "ADD" && true;
      } else {
        if (options.length <= minRequiredQty) return type == "ADD" ? true : false;
      }
    }
  };

  const checkedAdditionalService = (
    additionalService: AdditionalService,
    option: AdditionalServiceOption
  ) => {
    const findAdditionalServiceHasInCart = selectedOptions.find(
      (item) => item.additionalServiceId === additionalService.id
    );
    const findOptionHasInAdditionalService =
      !!findAdditionalServiceHasInCart &&
      findAdditionalServiceHasInCart.options.find((item) => item.id === option.id);

    if (!!findAdditionalServiceHasInCart) {
      if (!!findOptionHasInAdditionalService) {
        isCheckOptionCanAddOrRemove(additionalService, "REMOVE") &&
          removeOptionIntoAdditionalService(additionalService.id, option);
      } else {
        isCheckOptionCanAddOrRemove(additionalService, "ADD") &&
          addOptionIntoAdditionalService(additionalService, option);
      }
    } else {
      const optionsIsSelected: OptionCustom = {
        additionalServiceId: additionalService.id,
        options: [option],
      };
      setSelectedOptions([...selectedOptions, optionsIsSelected]);
    }
  };

  useEffect(() => {
    if (!router?.query?.slug) return;
    (async () => {
      const service = await getOneService();
      setService(service);
      selectedOptionDefault(service?.additionalServices, service?.price);
    })();

    return () => setService(undefined);
  }, [router?.query?.slug]);

  useEffect(() => {
    if (!selectedOptions && !service) return;
    selectedPriceTotalOptions();
  }, [selectedOptions]);

  return (
    <StoreDetailServiceDetailsContext.Provider
      value={{ service, totalPrice, selectedOptions, checkedAdditionalService }}
    >
      {children}
    </StoreDetailServiceDetailsContext.Provider>
  );
}

export const useStoreDetailServiceDetailsContext = () =>
  useContext(StoreDetailServiceDetailsContext);
