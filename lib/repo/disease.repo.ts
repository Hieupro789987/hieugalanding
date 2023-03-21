import { BaseModel, CrudRepository } from "./crud.repo";
import { Plant } from "./plant.repo";

export interface Disease extends BaseModel {
  name: string;
  plantIds: string[];
  plants: Plant[];
  image: string;
}
export class DiseaseRepository extends CrudRepository<Disease> {
  apiName: string = "Disease";
  displayName: string = "loại bệnh";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    plantIds: [String]
    plants {
      id name
    }: [Plant]
    image: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    plantIds: [String]
    plants {
      id name
    }: [Plant]
    image: String
  `);
}
export const DiseaseService = new DiseaseRepository();
