import { BaseModel, CrudRepository } from "./crud.repo";

export interface ProductTag extends BaseModel {
  name: string;
  image: string;
  productCount: number;
}

export class ProductTagRepository extends CrudRepository<ProductTag> {
  apiName: string = "ProductTag";
  displayName: string = "tag sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    name: String
    image: String
    productCount: Int
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    image: String
    productCount: Int
  `);
}

export const ProductTagService = new ProductTagRepository();
