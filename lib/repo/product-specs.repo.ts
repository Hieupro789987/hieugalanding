import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";
import { Specification } from "./product-specification.repo";
import { Product } from "./product.repo";

export interface CreateAndUpdateProductSpecsInput {
  id: string;
  name: string;
  value: string;
}

export interface ProductSpecs extends BaseModel {
  name: string;
  descriptiton: string;
  product: Product;
  member: Member;
  specs: Specification[];
}
export class ProductSpecsRepository extends CrudRepository<ProductSpecs> {
  apiName: string = "ProductSpecs";
  displayName: string = "thông số sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    descriptiton: Mixed
    product{
      id 
    }: Product
    member{
      id
    }: Member
    specs{
      id name value
    }: [Specification]
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    descriptiton: Mixed
    product{
      id 
    }: Product
    member{
      id
    }: Member
    specs{
      id name value
    }: [Specification]
  `);
}

export const ProductSpecsService = new ProductSpecsRepository();
