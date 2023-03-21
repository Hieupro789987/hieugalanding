import { BaseModel, CrudRepository } from "../crud.repo";
import { Topic, TopicService } from "../topic.repo";

export interface WriterGroup extends BaseModel {
  name: string;
  slug: string;
  image: string;
  priority: number;
  topicIds: string[];
  topics: Topic[];
}

export class WriterGroupRepository extends CrudRepository<WriterGroup> {
  apiName: string = "WriterGroup";
  displayName: string = "Đơn vị đăng tin";
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    slug: String
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
    topicIds: [String]
    topics{
      ${TopicService.shortFragment}
    }: [Topic]
  `);
}

export const WriterGroupService = new WriterGroupRepository();
