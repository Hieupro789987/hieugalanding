import { BaseModel, CrudRepository } from "../crud.repo";
import { Place, PlaceService } from "../place.repo";

export interface ExpertGroup extends BaseModel {
  name: string;
  representative: string;
  phone: string;
  internationalPhone: string;
  address: Place;
  businessLicense: string[];
}

export class ExpertGroupRepository extends CrudRepository<ExpertGroup> {
  apiName: string = "ExpertGroup";
  displayName: string = "đơn vị chuyên gia";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    representative: String!
    phone: String!
    internationalPhone: String!
    address{
      ${PlaceService.fullFragment}
    }: Place
    businessLicense: [String]!
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    representative: String!
    phone: String!
    internationalPhone: String!
    address{
      ${PlaceService.fullFragment}
    }: Place
    businessLicense: [String]!
  `);
}

export const ExpertGroupService = new ExpertGroupRepository();
