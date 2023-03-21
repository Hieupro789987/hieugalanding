import { createContext, useContext, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { Order, OrderService } from "../../../../lib/repo/order.repo";

export const OrderContext = createContext<
  CrudProps<Order> & Partial<{ limit: number; setLimit: Function }>
>({});

export function OrderProvider(props) {
  const [limit, setLimit] = useState(10);

  const context = useCrud(
    OrderService,
    {
      order: { createdAt: -1 },
      limit,
    },
    {
      cache: false,
    }
  );
  return (
    <OrderContext.Provider value={{ ...context, limit, setLimit }}>
      {props.children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);
