import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";
import { Shop } from "./shop.repo";

export interface ShopSaleFeed extends BaseModel {
  memberId: string;
  name: string;
  snippet: string;
  tips: string;
  contents: SaleFeedContent[];
  productId: string;
  active: boolean;
  priority: number;
  isPublic: boolean;
  view: number;
  product: Product;
  images: string[];
  shareLink: string;
  shop: Shop;
  comment: number;
}
export interface SaleFeedContent {
  content: string;
  images: string[];
}
export class ShopSaleFeedRepository extends CrudRepository<ShopSaleFeed> {
  apiName: string = "ShopSaleFeed";
  displayName: string = "bài đăng bán";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    memberId: ID
    name: String
    comment:Int
    contents{
      content: String
      images: [String]
    }: [SaleFeedContent]
    productId: ID
    active: Boolean
    isPublic: Boolean
    view: Int
    product{
      id code image name
    }: Product
    images: [String]
    shareLink: String
    shop{
      id name avatar 
    }: Shop
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    snippet: String
    tips: String
    comment:Int
    contents{
      content: String
      images: [String]
    }: [SaleFeedContent]
    productId: ID
    active: Boolean
    priority: Int
    isPublic: Boolean
    view: Int
    product{
      id code
    }: Product
    images: [String]
    shareLink: String
    shop{
      id name avatar shopLogo
    }: Shop
  `);
}

export const ShopSaleFeedService = new ShopSaleFeedRepository();

export const POST_STATUSES: Option[] = [
  { value: "DRAFT", label: "Bản nháp", color: "accent" },
  { value: "PUBLIC", label: "Công khai", color: "success" },
];
