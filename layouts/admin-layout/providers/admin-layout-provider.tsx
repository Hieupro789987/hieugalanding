import { createContext, useContext, useEffect, useState } from "react";
import { ShopRegistrationService } from "../../../lib/repo/shop-registration.repo";

export const AdminLayoutContext = createContext<
  Partial<{
    pendingRegistrations: number;
    checkPendingRegistrations: () => any;
    pendingGlobalColReg: number;
    checkPendingColRegs: () => any;
  }>
>({});
export function AdminLayoutProvider(props) {
  const [pendingRegistrations, setPendingRegistrations] = useState(0);

  useEffect(() => {
    // checkPendingRegistrations();
    // checkPendingColRegs();
  }, []);

  const checkPendingRegistrations = () => {
    ShopRegistrationService.getAll({
      query: { limit: 0, filter: { status: "PENDING" } },
      fragment: "id",
      cache: false,
    }).then((res) => {
      setPendingRegistrations(res.total);
    });
  };

  return (
    <AdminLayoutContext.Provider
      value={{
        pendingRegistrations,
        checkPendingRegistrations,
      }}
    >
      {props.children}
    </AdminLayoutContext.Provider>
  );
}

export const useAdminLayoutContext = () => useContext(AdminLayoutContext);
