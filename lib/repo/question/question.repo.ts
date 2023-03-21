import { BaseModel, CrudRepository } from "../crud.repo";
import { Disease, DiseaseService } from "../disease.repo";
import { Expert, ExpertService } from "../expert/expert.repo";
import { GlobalCustomer, GlobalCustomerService } from "../global-customer/global-customer.repo";
import { Place, PlaceService } from "../place.repo";
import { Plant, PlantService } from "../plant.repo";
import { QuestionLike, QuestionLikeService } from "./question-like.repo";
import { QuestionTopic, QuestionTopicService } from "./question-topic.repo";

export interface Question extends BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string;
  isHidden: boolean;
  slug: string;
  code: string;
  title: string;
  content: string;
  plantId: string;
  plant: Plant;
  // diseaseId: string;
  // disease: Disease;
  images: string[];
  address: Place;
  viewCount: number;
  cultivatedArea: number;
  expectedOutput: string;
  // endUserId: string;
  // endUser: EndUser;
  expertId: string;
  expert: Expert;
  isExpertCommented: boolean;
  expertCommentedAt: string;
  assignedExpertId: string;
  assignedExpert: Expert;
  globalCustomerId: string;
  globalCustomer: GlobalCustomer;
  likeCount: number;
  feedbackType: string;
  commentCount: number;
  // shareCount: number;
  questionTopicId: String;
  questionTopic: QuestionTopic;
}

export class QuestionRepository extends CrudRepository<Question> {
  apiName: string = "Question";
  displayName: string = "câu hỏi";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isDeleted: Boolean
    deletedAt: DateTime
    isHidden: Boolean
    slug: String
    code: String
    title: String!
    content: String
    plantId: ID
    plant{
      ${PlantService.fullFragment}
    }: Plant
    images: [String]
    address{
      ${PlaceService.fullFragment}
    }: Place
    expertId: ID
    expert{
      ${ExpertService.fullFragment}
    }: Expert
    isExpertCommented: Boolean
    expertCommentedAt: DateTime
    assignedExpertId: ID
    assignedExpert{
      ${ExpertService.fullFragment}
    }: Expert
    globalCustomerId: ID
    globalCustomer{
      ${GlobalCustomerService.fullFragment}
    }: GlobalCustomer
    likeCount: Int
    feedbackType: String
    commentCount: Int
    viewCount: Int
    cultivatedArea: Float
    expectedOutput: String
    questionTopicId: String
    questionTopic{
      ${QuestionTopicService.fullFragment}
    }: QuestionTopic
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isDeleted: Boolean
    deletedAt: DateTime
    isHidden: Boolean
    slug: String
    code: String
    title: String!
    content: String
    plantId: ID
    plant{
      ${PlantService.fullFragment}
    }: Plant
    images: [String]
    address{
      ${PlaceService.fullFragment}
    }: Place
    viewCount: Int
    cultivatedArea: Float
    expectedOutput: String
    expertId: ID
    expert{
      ${ExpertService.fullFragment}
    }: Expert
    isExpertCommented: Boolean
    expertCommentedAt: DateTime
    assignedExpertId: ID
    assignedExpert{
      ${ExpertService.fullFragment}
    }: Expert
    globalCustomerId: ID
    globalCustomer{
      ${GlobalCustomerService.fullFragment}
    }: GlobalCustomer
    likeCount: Int
    feedbackType: String
    commentCount: Int
    viewCount: Int
    questionTopicId: String
    questionTopic{
      ${QuestionTopicService.fullFragment}
    }: QuestionTopic
  `);

  async createQuestion(data: any): Promise<Question> {
    return this.mutate({
      mutation: `createQuestion(data: $data) {
        ${QuestionService.fullFragment}
      }`,
      variablesParams: `($data: CreateQuestionInput!)`,
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async updateQuestion(id: string, data: any): Promise<Question> {
    return this.mutate({
      mutation: `updateQuestion(id: $id,data: $data) {
        ${QuestionService.fullFragment}
      }`,
      variablesParams: `($id: ID!,
        $data: UpdateQuestionInput!)`,
      options: {
        variables: {
          id,
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async transferQuestion(
    questionId: string,
    assignExpertId: string,
    reason: string
  ): Promise<Question> {
    return this.mutate({
      mutation: `transferQuestion(questionId: $questionId,assignExpertId: $assignExpertId,reason: $reason ) {
        ${QuestionService.fullFragment}
      }`,
      variablesParams: `($questionId: ID!,
        $assignExpertId: ID! 
        $reason: String!
        )`,
      options: {
        variables: {
          questionId,
          assignExpertId,
          reason,
        },
      },
    }).then((res) => res.data.g0);
  }

  async questionLike(questionId: string) {
    return this.mutate({
      mutation: `
        questionLike(questionId: "${questionId}") {
          ${QuestionLikeService.fullFragment}
        }
      `,
    }).then((res) => res.data.g0 as QuestionLike);
  }

  async questionMarkHidden(id: string, isHidden: Boolean) {
    return this.mutate({
      mutation: `
      questionMarkHidden(id: "${id}",isHidden: ${isHidden} ) {
          ${this.fullFragment}
        }
      `,
    }).then((res) => res.data.g0);
  }

  async increaseQuestionView(id: string) {
    return this.mutate({
      mutation: `
      increaseQuestionView(id: "${id}" ) {
          ${this.fullFragment}
        }
      `,
    }).then((res) => res.data.g0);
  }
}
export const QuestionService = new QuestionRepository();
