import { YoutubeVideoGroup, YoutubeVideoGroupService } from "./youtube-video-group.repo";
import { BaseModel, CrudRepository } from "./crud.repo";

export interface YoutubeVideo extends BaseModel {
  active: Boolean;
  videoId: string;
  title: string;
  description: string;
  thumb: string;
  published: string;
  groupId: string;
  group: YoutubeVideoGroup;
}
export class VideoRepository extends CrudRepository<YoutubeVideo> {
  apiName: string = "YoutubeVideo";
  displayName: string = "video";
  shortFragment: string = this.parseFragment(`
    active: Boolean;
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    videoId: String
    title: String
    description: String
    thumb: String
    published: DateTime
    groupId: ID
    group {
      id name
    }
  `);
  fullFragment: string = this.parseFragment(`
    active: Boolean;
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    videoId: String
    title: String
    description: String
    thumb: String
    published: DateTime
    groupId: ID
    group {
      id name
    }
  `);

  async syncYoutubeVideo(): Promise<string> {
    return await this.mutate({
      mutation: `syncYoutubeVideo`,
    }).then((res) => res.data["g0"]);
  }

  async assignYoutubeVideoGroup(videoId: string, groupId: string) {
    return await this.mutate({
      mutation: `assignYoutubeVideoGroup(videoId:$videoId
        groupId: $groupId)`,
      variablesParams: `($videoId: ID!
        $groupId: ID!)`,
      options: {
        variables: {
          videoId,
          groupId,
        },
      },
    }).then((res) => res.data["g0"]);
  }
}

export const YoutubeVideoService = new VideoRepository();
