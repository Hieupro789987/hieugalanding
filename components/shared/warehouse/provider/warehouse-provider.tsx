import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../../../lib/providers/auth-provider";
import {
  WarehouseProduct,
  WarehouseProductService,
} from "../../../../lib/repo/warehouse/product-warehouse.repo";
export const WarehouseContext = createContext<
  Partial<{
    warehouseProduct: WarehouseProduct[];
    setBranchId: Function;
    branchId: string;
    reLoadOriginWarehouse: Function;
  }>
>({});

export function WarehouseProvider({ ...props }) {
  const [warehouseProduct, setWarehouseProduct] = useState<WarehouseProduct[]>();
  const [branchId, setBranchId] = useState<string>();
  const { staff } = useAuth();

  const loadAllWarehouseProduct = async () => {
    try {
      const { data } = await WarehouseProductService.getAll({
        query: {
          limit: 0,
          filter: { branchId: !!staff?.id ? staff.branchId : branchId || undefined },
        },
      });
      setWarehouseProduct(data);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (!!branchId || !!staff?.id) {
      loadAllWarehouseProduct();
      if (!!staff?.id) {
        setBranchId(staff?.branchId);
      }
    }
  }, [branchId, staff]);

  return (
    <WarehouseContext.Provider
      value={{
        warehouseProduct,
        setBranchId,
        branchId,
      }}
    >
      {props.children}
    </WarehouseContext.Provider>
  );
}

export const useWarehouseContext = () => useContext(WarehouseContext);
