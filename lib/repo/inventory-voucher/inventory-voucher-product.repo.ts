import { BaseModel } from "../crud.repo";
import { GraphRepository } from "../graph.repo";
import { Member } from "../member.repo";
import { ShopBranch, ShopBranchService } from "../shop-branch.repo";

export interface InventoryVoucherProduct extends BaseModel {
  inventoryVoucherId: string;
  productId: string;
  productCode: string;
  productName: string;
  provider: string;
  price: number;
  amount: number;
  discount: number;
  total: number;
}

export class InventoryVoucherProductRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    inventoryVoucherId: String
    productId: String
    productCode: String
    productName: String
    provider: String
    price: Float
    amount: Int
    discount: Float
    total: Float
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    inventoryVoucherId: String
    productId: String
    productCode: String
    productName: String
    provider: String
    price: Float
    amount: Int
    discount: Float
    total: Float
  `);
}

export const InventoryVoucherProductService = new InventoryVoucherProductRepository();
