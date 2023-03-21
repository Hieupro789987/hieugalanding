import { BaseModel, CrudRepository } from "./crud.repo";

export interface Plant extends BaseModel {
  name: string;
  image: string;
}
export class PlantRepository extends CrudRepository<Plant> {
  apiName: string = "Plant";
  displayName: string = "loại cây";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    image: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    image: String
  `);

}
export const PlantService = new PlantRepository();
