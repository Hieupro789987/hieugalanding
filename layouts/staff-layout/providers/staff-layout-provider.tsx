import { createContext, useContext } from "react";

export const StaffLayoutContext = createContext<
  Partial<{
    // pendingRegistrations: number;
    // checkPendingRegistrations: () => any;
    // pendingGlobalColReg: number;
    // checkPendingColRegs: () => any;
  }>
>({});
export function StaffLayoutProvider(props) {
  // const [pendingRegistrations, setPendingRegistrations] = useState(0);
  // const [pendingGlobalColReg, setPendingGlobalColReg] = useState(0);

  // useEffect(() => {
  //   checkPendingRegistrations();
  //   checkPendingColRegs();
  // }, []);

  // const checkPendingRegistrations = () => {
  //   ShopRegistrationService.getAll({
  //     query: { limit: 0, filter: { status: "PENDING" } },
  //     fragment: "id",
  //     cache: false,
  //   }).then((res) => {
  //     setPendingRegistrations(res.total);
  //   });
  // };

  // const checkPendingColRegs = async () => {
  //   try {
  //     const res = await GlobalCollaboratorRegistrationService.getAll({
  //       query: { limit: 0, filter: { status: "PENDING" } },
  //       fragment: "id",
  //       cache: false,
  //     });
  //     setPendingGlobalColReg(res.total);
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  // };

  return (
    <StaffLayoutContext.Provider
      value={
        {
          // pendingRegistrations,
          // checkPendingRegistrations,
          // pendingGlobalColReg,
          // checkPendingColRegs,
        }
      }
    >
      {props.children}
    </StaffLayoutContext.Provider>
  );
}

export const useStaffLayoutContext = () => useContext(StaffLayoutContext);
