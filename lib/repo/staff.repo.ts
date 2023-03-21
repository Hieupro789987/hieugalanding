import { BaseModel, CrudRepository } from "./crud.repo";
import { MemberService } from "./member.repo";
import { Place, PlaceService } from "./place.repo";
import { ShopBranch } from "./shop-branch.repo";

export interface Staff extends BaseModel {
  memberId: string;
  username: string;
  name: string;
  phone: string;
  avatar: string;
  address: string;
  fullAddress: Place;
  branchId: string;
  branch: ShopBranch;
  scopes: STAFF_SCOPE[];
  code: string;
}

export class StaffRepository extends CrudRepository<Staff> {
  apiName: string = "Staff";
  displayName: string = "nhân viên";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    member {
      shopLogo: String
    }: Member
    username: String
    name: String
    phone: String
    avatar: String
    address: String
    fullAddress{
      ${PlaceService.fullFragment}
    }:Place
    branchId: ID
    branch {
      id: String
      name: String
      code: String
    }: ShopBranch
    scopes: [String]
    code: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    member {
      ${MemberService.fullFragment}
    }:Member
    username: String
    name: String
    phone: String
    avatar: String
    fullAddress{
      ${PlaceService.fullFragment}
    }:Place
    address: String
    branchId: ID
    branch {
      id: String
      name: String
      code: String
      province: String
      district: String
      ward: String
      address: String
      coverImage: String
    }: ShopBranch
    scopes: [String]
    code: String
  `);

  updateStaffPassword(staffId: string, password: string) {
    return this.mutate({
      mutation: `
        updateStaffPassword(staffId: "${staffId}", password: "${password}") {
          id
        }
      `,
    });
  }
}

export const StaffService = new StaffRepository();

export type STAFF_SCOPE = "REPORT" | "MANAGER" | "WAREHOUSE" | "ORDER";

export const STAFF_SCOPES: Option<STAFF_SCOPE>[] = [
  { value: "REPORT", label: "App - Xem thống kê" },
  { value: "MANAGER", label: "App - Quản lý tổng" },
  { value: "WAREHOUSE", label: "Thủ kho" },
  { value: "ORDER", label: "Xử lý đơn hàng" },
];
