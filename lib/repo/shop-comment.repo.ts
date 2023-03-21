import { BaseModel, CrudRepository } from "./crud.repo";

export interface ShopComment extends BaseModel {
  memberId: string;
  customerId: string;
  orderId: string;
  ownerName: string;
  message: string;
  rating: number;
  status: "PENDING" | "PUBLIC" | "HIDDEN";
  tags: ShopTag[];
  images: string[];
}
export interface ShopTag {
  name: string;
  icon: string;
  qty: number;
}
export class ShopCommentRepository extends CrudRepository<ShopComment> {
  apiName: string = "ShopComment";
  displayName: string = "bình luận";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    customerId: ID
    orderId: ID
    ownerName: String
    message: String
    rating: Int
    status: String
    images: [String]
    tags {
      name: String
      icon: String
      qty: Int
    }: [ShopTag]
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    customerId: ID
    orderId: ID
    ownerName: String
    message: String
    rating: Int
    status: String
    images: [String]
    tags {
      name: String
      icon: String
      qty: Int
    }: [ShopTag]
  `);

  async commentOrder({
    orderId,
    message,
    rating,
    tags,
    images,
  }: {
    orderId: string;
    message: string;
    rating: number;
    tags: any;
    images: string[];
  }) {
    return this.mutate({
      mutation: `
        commentOrder(
          orderId:$orderId
          message:$message
          rating:$rating
          tags:$tags
          images: $images
        )`,
      variablesParams: `( $orderId:ID!
        $message:String!
        $rating:Int!
        $tags:[ShopTagInput]!
        $images: [String])`,
      options: {
        variables: {
          orderId,
          message,
          rating,
          tags,
          images,
        },
      },
    });
  }
}

export const ShopCommentService = new ShopCommentRepository();

export const SHOP_COMMENT_STATUS: Option[] = [
  { value: "PUBLIC", label: "Công khai", color: "success" },
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "HIDDEN", label: "Đang ẩn", color: "slate" },
];
