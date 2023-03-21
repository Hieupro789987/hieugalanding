import { GraphRepository } from "../graph.repo";

export interface QuestionLike {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  globalCustomerId: string;
  expertId: string;
  ownerId: string;
}

export class QuestionLikeRepository extends GraphRepository {
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    questionId: String
    globalCustomerId: String
    expertId: String
    ownerId: String
  `);
}

export const QuestionLikeService = new QuestionLikeRepository();
