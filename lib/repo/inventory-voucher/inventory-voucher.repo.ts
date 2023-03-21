import { BaseModel, CrudRepository } from "../crud.repo";
import { Member, MemberService } from "../member.repo";
import { ShopBranch, ShopBranchService } from "../shop-branch.repo";
import {
  InventoryVoucherProduct,
  InventoryVoucherProductService,
} from "./inventory-voucher-product.repo";

export interface InventoryVoucher extends BaseModel {
  code: string;
  type: string;
  memberId: string;
  branchId: string;
  branch: ShopBranch;
  accountingDate: string;
  voucherDate: string;
  staffName: string;
  staffCode: string;
  staffId: string;
  voucherCode: string;
  reason: string;
  explain: string;
  total: number;
  images: string[];
  inventoryVoucherProductList: InventoryVoucherProduct[];
}

export class InventoryVoucherRepository extends CrudRepository<InventoryVoucher> {
  apiName: string = "InventoryVoucher";
  displayName: string = "Phiếu kho";
  shortFragment: string = this.parseFragment(`
   id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    type: String
    memberId: String
    branchId: String
    branch{
      name
    }: ShopBranch
    accountingDate: DateTime
    voucherDate: DateTime
    staffName: String
    staffCode: String
    staffId: String
    voucherCode: String
    reason: String
    explain: Mixed
    total: Float
    images: [String]
    inventoryVoucherProductList{
      ${InventoryVoucherProductService.fullFragment}
    }: [InventoryVoucherProduct]
  `);
  fullFragment: string = this.parseFragment(`
   id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    type: String
    memberId: String
    branchId: String
    branch{
      name
    }: ShopBranch
    accountingDate: DateTime
    voucherDate: DateTime
    staffName: String
    staffCode: String
    staffId: String
    voucherCode: String
    reason: String
    explain: Mixed
    total: Float
    images: [String]
    inventoryVoucherProductList{
      ${InventoryVoucherProductService.fullFragment}
    }:[InventoryVoucherProduct]
  `);

  async createInventoryVoucher(data: any) {
    return await this.mutate({
      mutation: `createInventoryVoucher(data: $data) {
        ${this.fullFragment}
      }`,
      variablesParams: `($data: CreateInventoryVoucherInput!)`,
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data["g0"]);
  }
  async updateInventoryVoucher(id: string, data: any) {
    return await this.mutate({
      mutation: `updateInventoryVoucher(id: $id, data: $data) {
        ${this.fullFragment}
      }`,
      variablesParams: `($id: ID!
         $data: UpdateInventoryVoucherInput!)`,
      options: {
        variables: {
          id,
          data,
        },
      },
    }).then((res) => res.data["g0"]);
  }
}

export const InventoryVoucherService = new InventoryVoucherRepository();
