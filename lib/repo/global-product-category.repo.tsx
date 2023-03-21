import { BaseModel, CrudRepository } from "./crud.repo";

export interface GlobalProductCategory extends BaseModel {
  name: string;
  slug: string;
  icon: string;
  image: string;
  priority: number;
  level: number;
  hasChildren: boolean;
  isHidden: boolean;
  parentId: string;
  parentCategory: GlobalProductCategory;
}
export class GlobalProductCategoryRepository extends CrudRepository<GlobalProductCategory> {
  apiName: string = "GlobalProductCategory";
  displayName: string = "Danh mục sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    priority: Int
    level: Int
    hasChildren: Boolean
    slug: String
    image: String
    parentId: String
    parentCategory{
      id name slug
    }: GlobalProductCategory
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    icon: String
    image: String
    priority: Int
    level: Int
    hasChildren: Boolean
    isHidden: Boolean
    parentId: String
    parentCategory{
      id name slug
    }: GlobalProductCategory
  `);
}

export const GlobalProductCategoryService = new GlobalProductCategoryRepository();
