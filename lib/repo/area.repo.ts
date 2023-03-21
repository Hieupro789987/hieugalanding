import { BaseModel, CrudRepository } from "./crud.repo";

export interface Area extends BaseModel {
  name: string;
  slug: string;
  priority: number;
  image: string;
}
export class AreaRepository extends CrudRepository<Area> {
  apiName: string = "Area";
  displayName: string = "Khu vực";
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    slug: String
    priority: Int
    image: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    priority: Int
    image: String
  `);
}

export const AreaService = new AreaRepository();
