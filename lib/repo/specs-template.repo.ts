import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";

export interface Spec {
  name: string;
}

export interface SpecsTemplate extends BaseModel {
  name: String;
  specs: Spec[];
  member: Member;
}
export class SpecsTemplateRepository extends CrudRepository<SpecsTemplate> {
  apiName: string = "SpecsTemplate";
  displayName: string = "Mẫu thông số sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    specs{
      name: String
    }: [Spec]
    member{
      id
    }: Member
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    specs{
      name: String
    }: [Spec]
    member{
      id
    }: Member
  `);
}

export const SpecsTemplateService = new SpecsTemplateRepository();
