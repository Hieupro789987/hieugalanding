import { GraphRepository } from "../graph.repo";

export type FeedBackType = "NONE" | "LIKE" | "LOVE" | "HAHA" | "ANGRY" | "SAD" | "WOW" | "CARE";

export interface FeedBack {
  id: string;
  createdAt: string;
  updatedAt: string;
  feedbackToId: string;
  ownerId: string;
  type: FeedBackType;
  questionId: string;
  questionCommentId: string;
  globalCustomerId: string;
  expertId: string;
}

export class FeedBackRepository extends GraphRepository {
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    feedbackToId: String
    ownerId: String
    type: String
    questionId: String
    questionCommentId: String
    globalCustomerId: String
    expertId: String
  `);

  async feedbackReact(data: {
    questionId?: string;
    questionCommentId?: string;
    type: string;
  }): Promise<FeedBack> {
    return this.mutate({
      mutation: `feedbackReact(data: $data) {
        ${this.fullFragment}
      }`,
      variablesParams: `($data: FeedbackReactInput!)`,
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data.g0);
  }
}

export const FeedBackService = new FeedBackRepository();
