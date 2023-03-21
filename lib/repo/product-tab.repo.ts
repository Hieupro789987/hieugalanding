import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";
import { Product } from "./product.repo";
import { Tab, TabService } from "./tab.repo";

export interface CreateAndUpdateProductTabInput  {
  tabId: string;
  productId: string;
  content: string;
  isActive: boolean;
}

export interface ProductTab extends BaseModel {
  tabId: string;
  productId: string;
  content: string;
  memberId: string;
  isActive: boolean;
  tab: Tab;
  product: Product;
  member: Member;
}

export class ProductTabRepository extends CrudRepository<ProductTab> {
  apiName: string = "ProductTab";
  displayName: string = "tab thông tin sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    tabId: ID
    productId: ID
    content: Mixed
    memberId: ID
    isActive: Boolean
    tab {
      ${TabService.fullFragment}
    }: Tab
    product{
      id
    }: Product
    member{
      id
    }: Member
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    tabId: ID
    productId: ID
    content: Mixed
    memberId: ID
    isActive: Boolean
    tab {
      ${TabService.fullFragment}
    }: Tab
    product{
      id
    }: Product
    member{
      id
    }
  `);
}

export const ProductTabService = new ProductTabRepository();
