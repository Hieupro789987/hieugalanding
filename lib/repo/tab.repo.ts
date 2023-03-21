import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";

export interface Tab extends BaseModel {
  name: string;
  priority: number;
  memberId: string;
  member: Member;
}

export class TabRepository extends CrudRepository<Tab> {
  apiName: string = "Tab";
  displayName: string = "tab thông tin";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    priority: Int
    memberId: String
    member{
      id shopName
    }: Member
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    priority: Int
    memberId: String
    member{
      id shopName
    }: Member
  `);
}

export const TabService = new TabRepository();
