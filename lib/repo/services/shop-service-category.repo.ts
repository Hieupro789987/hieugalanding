import { BaseModel, CrudRepository } from "../crud.repo";

export interface ShopServiceCategory extends BaseModel {
  memberId: string;
  name: string;
}

export class ShopServiceCategoryRepository extends CrudRepository<ShopServiceCategory> {
  apiName: string = "ShopServiceCategory";
  displayName: string = "Danh mục dịch vụ";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    name: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: String
    name: String
  `);
}

export const ShopServiceCategoryService = new ShopServiceCategoryRepository();
