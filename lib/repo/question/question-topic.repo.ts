import { BaseModel, CrudRepository } from "../crud.repo";
import { GraphRepository } from "../graph.repo";

export interface QuestionTopic extends BaseModel {
  name: string;
  slug: string;
  image: string;
}

export class QuestionTopicRepository extends CrudRepository<QuestionTopic> {
  apiName: string = "QuestionTopic";
  displayName: string = "chủ đề câu hỏi";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    image: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    image: String
  `);
}

export const QuestionTopicService = new QuestionTopicRepository();
