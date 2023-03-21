import { GraphRepository } from "../graph.repo";

export interface QuestionCommentLike {
  id: string;
  createdAt: string;
  updatedAt: string;
  commentId: string;
  globalCustomerId: string;
  expertId: string;
  ownerId: string;
}

export class QuestionCommentLikeRepository extends GraphRepository {
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    commentId: String
    globalCustomerId: String
    expertId: String
    ownerId: String
  `);
}

export const QuestionCommentLikeService = new QuestionCommentLikeRepository();
