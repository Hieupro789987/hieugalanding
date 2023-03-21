import { Question, QuestionService } from "./question.repo";
import { BaseModel, CrudRepository } from "../crud.repo";

export interface QuestionHistory extends BaseModel {
  id: string;
  ownerId: string;
  questionId: string;
  question: Question;
  time: string;
  action: string;
}

export class QuestionHistoryRepository extends CrudRepository<QuestionHistory> {
  apiName: string = "QuestionHistory";
  displayName: string = "Lịch sử câu hỏi";
  shortFragment: string = this.parseFragment(`
    id: String
    ownerId: String
    questionId: String
    question{
      ${QuestionService.fullFragment}
    }: Question
    time: DateTime
    action: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    ownerId: String
    questionId: String
    question{
      ${QuestionService.fullFragment}
    }: Question
    time: DateTime
    action: String
  `);
}

export const QuestionHistoryService = new QuestionHistoryRepository();
