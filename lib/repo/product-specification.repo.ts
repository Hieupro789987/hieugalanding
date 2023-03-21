import { BaseModel, CrudRepository } from "./crud.repo";

export interface Specification extends BaseModel {
  name: string;
  value: string;
}
export class SpecificationRepository extends CrudRepository<Specification> {
  apiName: string = "Specification";
  displayName: string = "thông số";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    value: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    value: String
  `);
}

export const SpecificationService = new SpecificationRepository();
