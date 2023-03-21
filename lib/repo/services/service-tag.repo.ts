import { BaseModel, CrudRepository } from "../crud.repo";

export interface ServiceTag extends BaseModel {
  name: string;
  image: string;
  serviceCount: number;
}

export class ServiceTagRepository extends CrudRepository<ServiceTag> {
  apiName: string = "ServiceTag";
  displayName: string = "Loại dịch vụ";
  shortFragment: string = this.parseFragment(`
    id: String
    name: String!
    image: String
    serviceCount: Int
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String!
    image: String
    serviceCount: Int
  `);
}

export const ServiceTagService = new ServiceTagRepository();
