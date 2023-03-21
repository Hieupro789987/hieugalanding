import { BaseModel, CrudRepository } from "./crud.repo";

export interface YoutubeVideoGroup extends BaseModel {
  name: string;
  slug: string;
  image: string;
  group: string;
  priority: number;
}
export class YoutubeVideoGroupRepository extends CrudRepository<YoutubeVideoGroup> {
  apiName: string = "YoutubeVideoGroup";
  displayName: string = "chủ đề";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    image: String
    priority: Int
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    image: String
    priority: Int
  `);
}
export const YoutubeVideoGroupService = new YoutubeVideoGroupRepository();
