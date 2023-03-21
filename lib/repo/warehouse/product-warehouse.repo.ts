import { ProductService } from "./../product.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { Member, MemberService } from "../member.repo";
import { Product } from "../product.repo";
import { ShopBranch, ShopBranchService } from "../shop-branch.repo";

export interface WarehouseProduct extends BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  branchId: string;
  inStockCount: number;
  inProcessCount: number;
  member: Member;
  branch: ShopBranch;
  product: Product;
  productCode: string;
  name: string;
}

export class WarehouseProductRepository extends CrudRepository<WarehouseProduct> {
  apiName: string = "WarehouseProduct";
  displayName: string = "Kho hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    warehouseId: String
    branchId: String
    productId: String
    productCode: String
    name: String
    categoryId: String
    inStockCount: Int
    inProcessCount: Int
    importCount: Int
    member{
      id name 
    }: Member
    branch{
      ${ShopBranchService.fullFragment}
    }: ShopBranch
    product{
      ${ProductService.fullFragment}
    }: Product
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    warehouseId: String
    branchId: String
    productId: String
    productCode: String
    name: String
    categoryId: String
    inStockCount: Int
    inProcessCount: Int
    importCount: Int
    member{
      id name 
    }: Member
    branch{
      ${ShopBranchService.fullFragment}
    }: ShopBranch
    product{
      ${ProductService.fullFragment}
    }: Product
  `);
}

export const WarehouseProductService = new WarehouseProductRepository();
