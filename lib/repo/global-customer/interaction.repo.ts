import { QuestionCommentService } from "./../question/question-comment.repo";
import { QuestionService } from "./../question/question.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { QuestionComment } from "../question/question-comment.repo";
import { Question } from "../question/question.repo";
import { GlobalCustomer } from "./global-customer.repo";

export interface Interaction extends BaseModel {
  id: string;
  action: string;
  targetType: string;
  targetQuestionId: string;
  question: Question;
  targetCommentId: string;
  comment: QuestionComment;
  time: string;
  ownerId: string;
  globalCustomerId: string;
  expertId: string;
}
export class InteractionRepository extends CrudRepository<Interaction> {
  apiName: string = "Interaction";
  displayName: string = "tương tác";
  shortFragment: string = this.parseFragment(`
    id: String!
    action: String!
    targetType: String!
    targetQuestionId: String
    question{
      ${QuestionService.fullFragment}
    }: Question
    targetCommentId: String
    comment{
      ${QuestionCommentService.fullFragment}
    }: QuestionComment
    time: DateTime
    ownerId: String
    globalCustomerId: String
    expertId: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String!
    action: String!
    targetType: String!
    targetQuestionId: String
    question{
      ${QuestionService.fullFragment}
    }: Question
    targetCommentId: String
    comment{
      ${QuestionCommentService.fullFragment}
    }: QuestionComment
    time: DateTime
    ownerId: String
    globalCustomerId: String
    expertId: String
  `);
}

export const InteractionService = new InteractionRepository();
