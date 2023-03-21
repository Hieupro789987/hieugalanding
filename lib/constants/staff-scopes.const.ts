import { STAFF_SCOPE } from "../repo/staff.repo";

export type StaffPermission =
  | "READ_PRODUCTS"
  | "READ_WAREHOUSE"
  | "READ_INVENTORY_VOUCHERS"
  | "EXECUTE_INVENTORY_VOUCHERS"
  | "READ_ORDERS"
  | "EXECUTE_ORDERS";

export const PERMISSIONS: Option<StaffPermission>[] = [
  { value: "READ_PRODUCTS", label: "Xem danh sách sản phẩm" },
  { value: "READ_WAREHOUSE", label: "Xem số lượng sản phẩm tồn kho" },
  { value: "READ_INVENTORY_VOUCHERS", label: "Xem danh sách phiếu kho" },
  { value: "EXECUTE_INVENTORY_VOUCHERS", label: "Tạo phiếu nhập kho /xuất kho" },
  { value: "READ_ORDERS", label: "Xem danh sách đơn hàng" },
  { value: "EXECUTE_ORDERS", label: "Cập nhật trạng thái đơn hàng" },
];
export type ScopePermission = boolean | "partial";

const getScopeStates = (state: ScopePermission): { [P in StaffPermission]: ScopePermission } => {
  const permissions = {};
  for (let permission of PERMISSIONS) {
    permissions[permission?.value] = state;
  }
  return permissions as { [P in StaffPermission]: ScopePermission };
};

export const STAFF_SCOPE_PERMISSIONS: Partial<
  {
    [S in STAFF_SCOPE]: { [P in StaffPermission]: ScopePermission };
  }
> = {
  REPORT: {
    ...getScopeStates(false),
  },
  MANAGER: {
    ...getScopeStates(false),
  },
  WAREHOUSE: {
    ...getScopeStates(true),
    READ_ORDERS: false,
    EXECUTE_ORDERS: false,
  },
  ORDER: {
    ...getScopeStates(true),
    READ_INVENTORY_VOUCHERS: false,
    EXECUTE_INVENTORY_VOUCHERS: false,
  },
};
