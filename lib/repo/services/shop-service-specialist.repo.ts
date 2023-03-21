import { BaseModel, CrudRepository } from "../crud.repo";
import { Place, PlaceService } from "../place.repo";
import { ShopServiceCategory, ShopServiceCategoryService } from "./shop-service-category.repo";

export interface ShopServiceSpecialist extends BaseModel {
  memberId: string;
  name: string;
  avatar: string;
  internationalPhone: string;
  email: string;
  shopServiceCategoryIds: string[];
  shopServiceCategories: ShopServiceCategory[];
  address: Place;
  serviceCompletedCount: number;
}

export class ShopServiceSpecialistRepository extends CrudRepository<ShopServiceSpecialist> {
  apiName: string = "ShopServiceSpecialist";
  displayName: string = "Chuyên viên";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    name: String!
    avatar: String
    internationalPhone: String!
    email: String
    shopServiceCategoryIds: [String]!
    shopServiceCategories{
      id name
    }: [ShopServiceCategory]
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: String!
    name: String!
    avatar: String
    internationalPhone: String!
    email: String
    shopServiceCategoryIds: [String]!
    shopServiceCategories{
      ${ShopServiceCategoryService.fullFragment}
    }: [ShopServiceCategory]
    address{
      ${PlaceService.fullFragment}
    }: Place
    serviceCompletedCount: Int
  `);
}

export const ShopServiceSpecialistService = new ShopServiceSpecialistRepository();
