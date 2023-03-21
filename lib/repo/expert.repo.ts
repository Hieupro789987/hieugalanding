import { Place } from "./../../../src/graphql/modules/mixin/place.graphql";
import { BaseModel, CrudRepository } from "./crud.repo";
import { Disease } from "./disease.repo";
import { ExpertGroup } from "./expert/expert-group.repo";

import { Plant } from "./plant.repo";

export interface Expert extends BaseModel {
  name: string;
  email: string;
  avatar: string;
  address: Place;
  specializes: string;
  specializesInPlantIds: string[];
  specializesInPlants: Plant[];
  specializesInDiseaseIds: string[];
  specializesInDiseases: Disease[];
  expertGroupId: string;
  expertGroup: ExpertGroup;
}
export interface UpdateExpertSelfInput {
  name: string;
  email: string;
  avatar: string;
  address: Place;
  specializes: string;
  specializesInPlantIds: string[];
  specializesInDieaseIds: string[];
}

export class ExpertRepository extends CrudRepository<Expert> {
  apiName: string = "Expert";
  displayName: string = "Chuyên gia";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    email: String
    avatar: String
    address: Place
    specializes: String
    specializesInPlantIds: [String]
    specializesInPlants: [Plant]
    specializesInDiseaseIds: [String]
    specializesInDiseases: [Disease]
    expertGroupId: String
    expertGroup: ExpertGroup
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    email: String
    avatar: String
    address {
      provinceId districtId wardId fullAddress
    }: Place
    specializes: String
    specializesInPlantIds: [String]
    specializesInPlants{
      id name
    }: [Plant]
    specializesInDiseaseIds: [String]
    specializesInDiseases {
      id name
    }: [Disease]
    expertGroupId: String
    expertGroup {
      id name
    }: ExpertGroup
  `);

}
export const ExpertService = new ExpertRepository();
