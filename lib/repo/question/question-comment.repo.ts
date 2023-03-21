import { BaseModel, CrudRepository } from "../crud.repo";
import { EndUser, EndUserService } from "../end-user.repo";
import { Expert, ExpertService } from "../expert/expert.repo";
import { GlobalCustomer } from "../global-customer/global-customer.repo";
import { Prescription, PrescriptionService } from "../prescription.repo";
import { Product, ProductService } from "../product.repo";
import { QuestionCommentLike, QuestionCommentLikeService } from "./question-comment-like.repo";

export interface QuestionComment extends BaseModel {
  isDeleted: boolean;
  deletedAt: string;
  questionId: string;
  content: string;
  expertId: string;
  image: string;
  expert: Expert;
  prescriptions: Prescription[];
  suggestedProductIds: string[];
  suggestedProducts: Product[];
  globalCustomerId: String;
  globalCustomer: GlobalCustomer;
  feedbackType: string;
  isHidden: boolean;
}

export interface CreateQuestionCommentExpertInput {
  questionId: string;
  content?: string;
  image?: string;
  images?: string[];
  prescriptions?: Prescription[];
  suggestedProductIds?: string[];
}

export interface UpdateQuestionCommentExpertInput {
  content?: string;
  image?: string;
}

export class QuestionCommentRepository extends CrudRepository<QuestionComment> {
  apiName: string = "QuestionComment";
  displayName: string = "Bình luận của câu hỏi";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    isDeleted: Boolean
    questionId: String
    content: String
    expertId: String
    expert{
      id name avatar
    }: Expert
    image: String
    prescriptions{
      ${PrescriptionService.fullFragment}
    }: [Prescription]
    suggestedProductIds: [ID]
    suggestedProducts{
      id name image code
      member{
        code
      }
    }: [Product]
    globalCustomerId: String
    globalCustomer{
      id avatar name
    }: GlobalCustomer 
    feedbackType: String
    isHidden: Boolean
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isDeleted: Boolean
    deletedAt: DateTime
    questionId: String
    content: String
    image: String
    expertId: String
    expert{
      ${ExpertService.fullFragment}
    }: Expert
    prescriptions{
      ${PrescriptionService.fullFragment}
    }: [Prescription]
    suggestedProductIds: [ID]
    suggestedProducts{
      ${ProductService.shortFragment}
    }: [Product]
    globalCustomerId: String
    globalCustomer{
      id avatar name
    }: GlobalCustomer 
    feedbackType: String
    isHidden: Boolean
  `);

  async createQuestionCommentExpert(
    data: CreateQuestionCommentExpertInput,
    roleId: string
  ): Promise<QuestionComment> {
    return this.mutate({
      mutation: `createQuestionCommentExpert(data: $data) {
        ${QuestionCommentService.fullFragment}
      }`,
      variablesParams: `($data: CreateQuestionCommentExpertInput!)`,
      options: {
        variables: {
          data,
        },
      },
      roleId,
    }).then((res) => res.data.g0);
  }

  async updateQuestionCommentExpert(
    id: string,
    data: UpdateQuestionCommentExpertInput,
    roleId: string
  ): Promise<QuestionComment> {
    return this.mutate({
      mutation: `updateQuestionCommentExpert(id: $id, data: $data) {
        ${QuestionCommentService.fullFragment}
      }`,
      variablesParams: `($id: ID!, $data: UpdateQuestionCommentExpertInput!)`,
      options: {
        variables: {
          id,
          data,
        },
      },
      roleId,
    }).then((res) => res.data.g0);
  }

  async commentLike(commentId: string) {
    return this.mutate({
      mutation: `
        questionCommentLike(commentId: "${commentId}") {
          ${QuestionCommentLikeService.fullFragment}
        }
      `,
    }).then((res) => res.data.g0 as QuestionCommentLike);
  }

  async questionCommentMarkHidden(id: string, isHidden: Boolean) {
    return this.mutate({
      mutation: `
      questionCommentMarkHidden(id: "${id}",isHidden: ${isHidden} ) `,
    }).then((res) => res.data.g0);
  }
}
export const QuestionCommentService = new QuestionCommentRepository();
