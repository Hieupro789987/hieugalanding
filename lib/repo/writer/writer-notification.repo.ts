import { PostService } from "./../post.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { Post } from "../post.repo";

export interface WriterNotification extends BaseModel {
  postId: string;
  post: Post;
  approveStatus: string;
  reason: string;
  writerId: string;
  seen: Boolean;
  seenAt: string;
}
export class WriterNotificationRepository extends CrudRepository<WriterNotification> {
  apiName: string = "WriterNotification";
  displayName: string = "Thông báo";
  shortFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      postId: String!
      post{
        ${PostService.fullFragment}
      }: Post
      approveStatus: String!
      reason: String
      writerId: String
      seen: Boolean
      seenAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      postId: String!
      post{
        ${PostService.fullFragment}
      }: Post
      approveStatus: String!
      reason: String
      writerId: String
      seen: Boolean
      seenAt: DateTime
  `);

  async markWriterNotificationSeen(id: string): Promise<WriterNotification> {
    return this.mutate({
      mutation: `markWriterNotificationSeen(id: $id) {
        ${this.fullFragment}
      }`,
      variablesParams: `($id: ID!)`,
      options: {
        variables: {
          id,
        },
      },
    }).then((res) => res.data.g0);
  }
}

export const WriterNotificationService = new WriterNotificationRepository();
