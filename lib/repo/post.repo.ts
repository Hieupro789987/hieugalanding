import { convertIcon } from "../../components/shared/common/convert-icon";
import { Area, AreaService } from "./area.repo";
import { BaseModel, CrudRepository } from "./crud.repo";
import { Topic, TopicService } from "./topic.repo";
import { Owner } from "./types/mixed.type";
import { WriterGroup, WriterGroupService } from "./writer/writer-group.repo";

export type APPROVAL_STATUS = "DRAFT" | "APPROVED" | "PENDING" | "REJECTED";

export interface Post extends BaseModel {
  title: string;
  excerpt: string;
  slug: string;
  status: string;
  publishedAt: string;
  featureImage: string;
  metaDescription: string;
  metaTitle: string;
  content: string;
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterTitle: string;
  priority: number;
  view: number;
  topicId: string;
  topic: Topic;
  seen: boolean;
  approveStatus: APPROVAL_STATUS;
  approveUpdatedAt: string;
  writerGroupId: string;
  writerGroup: WriterGroup;
  owner: Owner;
  active: boolean;
  postedAt: string;
  source: string;
  areaId: string;
  area: Area;
}
export class PostRepository extends CrudRepository<Post> {
  apiName: string = "Post";
  displayName: string = "bài viết";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    title: String
    excerpt: String
    slug: String
    status: String
    publishedAt: DateTime
    featureImage: String
    metaDescription: String
    metaTitle: String
    content: String
    tagIds: [ID]
    priority: Int
    view: Int
    topicId: ID
    topic{
      id name slug group
    }
    tags{
      id
      name
    }
    approveStatus: String
    writerGroupId: String
    writerGroup{
      id name
    }: WriterGroup
    owner{id name}: Owner
    active: Boolean
    postedAt: DateTime
    source: String
    areaId: string;
    area{
      ${AreaService.shortFragment}
    }: Area;
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    title: String
    excerpt: String
    slug: String
    status: String
    publishedAt: DateTime
    featureImage: String
    metaDescription: String
    metaTitle: String
    content: String
    tagIds: [ID]
    tags{
      id
      slug
      description
      name
    }
    priority: Int
    view: Int
    topicId: ID
    topic{
      ${TopicService.shortFragment}
    }
    approveStatus: String
    approveUpdatedAt: DateTime
    writerGroupId: String
    writerGroup{
      ${WriterGroupService.fullFragment}
    }: WriterGroup
    owner{id name email phone }: Owner
    active: Boolean;
    postedAt: DateTime
    source: String
    areaId: string;
    area{
      ${AreaService.fullFragment}
    }: Area;
  `);

  async updatePostApproveStatus(postId: string, status: string, reason?: string): Promise<any> {
    return this.mutate({
      mutation: `updatePostApproveStatus(postId: $postId, status: $status, reason: $reason)`,
      variablesParams: `($postId: ID!,
        $status: String,
        $reason: String,
        )`,
      options: {
        variables: {
          postId,
          status,
          reason,
        },
      },
    }).then((res) => res.data.g0);
  }

  async updatePostStatus(postId: string, status: string, active: boolean): Promise<any> {
    return this.mutate({
      mutation: `updatePostStatus(postId: $postId, status: $status, active: $active) { ${this.fullFragment} }`,
      variablesParams: `($postId: ID!,
        $status: String,
        $active: Boolean!,
        )`,
      options: {
        variables: {
          postId,
          status,
          active,
        },
      },
    }).then((res) => res.data.g0);
  }
}

export const PostService = new PostRepository();

export const POST_STATUSES: Option[] = [
  { value: "DRAFT", label: "Bản nháp", color: "accent" },
  { value: "PUBLIC", label: "Công khai", color: "success" },
];

export const POST_APPROVE_STATUS_OPTIONS: Option[] = [
  { value: "DRAFT", label: "Bản nháp", color: "slate" },
  { value: "APPROVED", label: "Đã duyệt", color: "info" },
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
];

export const POST_APPROVE_STATUS_NO_DRAFT_OPTIONS: Option[] = POST_APPROVE_STATUS_OPTIONS.filter(
  (x) => x.value != "DRAFT"
);

export const POST_APPROVE_STATUS_NO_REJECTED_OPTIONS: Option[] = POST_APPROVE_STATUS_OPTIONS.filter(
  (x) => x.value != "REJECTED"
);

export const POST_APPROVE_STATUS_NO_REJECTED_AND_DRAFT_OPTIONS: Option[] = POST_APPROVE_STATUS_OPTIONS.filter(
  (x) => !["REJECTED", "DRAFT"].includes(x.value)
);

export const POST_APPROVE_STATUS_NOTIFICATION_OPTIONS: Option[] = [
  { value: "REJECTED", label: "Chưa duyệt", color: "slate" },
  { value: "APPROVED", label: "Đã duyệt", color: "info" },
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
];

export const TOPIC_ICON_LIST: Option[] = [
  { value: "season", label: "Icon thông tin mùa vụ" },
  { value: "bug", label: "Icon thông tin dịch hại" },
  { value: "material", label: "Icon giá vật tư nông nghiệp" },
  { value: "domesticPrice", label: "Icon giá nông sản trong nước" },
  { value: "exportPrice", label: "Icon giá nông sản xuất khẩu" },
];
