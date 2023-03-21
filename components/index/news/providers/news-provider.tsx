import { createContext, useContext, useMemo } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";
import { YoutubeVideoGroup } from "../../../../lib/repo/youtube-video-group.repo";
import { YoutubeVideo, YoutubeVideoService } from "../../../../lib/repo/youtube-video.repo";
import { TopicMenu } from "../../../shared/common/side-menu";
import { BreadCrumb } from "../../../shared/utilities/misc";
import { useGetNewsBreadCrumbs } from "../custom-hooks/use-get-news-breadcrumbs";
import { useGetParentTopic } from "../custom-hooks/use-get-parent-topic";
import { useGetPostData } from "../custom-hooks/use-get-post-data";
import { useGetSelectedNewsArea } from "../custom-hooks/use-get-selected-area";
import { useGetSelectedChildTopic } from "../custom-hooks/use-get-selected-child-topic";
import { useGetSelectedNewsVideoGroup } from "../custom-hooks/use-get-selected-news-video-group";
import { useGetTopicMenu } from "../custom-hooks/use-get-topic-menu";
import { useGetVideoMenu } from "../custom-hooks/use-get-video-menu";

export const NewsContext = createContext<
  Partial<{
    parentTopic: Topic;
    topicMenu: TopicMenu[];
    videoMenu: TopicMenu[];
    breadCrumbs: BreadCrumb[];
    videoTopicList: YoutubeVideoGroup[];
    newsPostListCrud: CrudProps<Post>;
    post: Post;
    selectedChildTopic: Topic;
    newsVideoListCrud: CrudProps<YoutubeVideo>;
    isVideosPage: boolean;
  }>
>({});

interface NewsProviderProps extends ReactProps {
  newsSlug: string;
  isVideosPage: boolean;
}

export function NewsProvider({ newsSlug, isVideosPage = false, ...props }: NewsProviderProps) {
  const topicSlug = useQuery("topicSlug");
  const search = useQuery("search");

  const { items: childNewsTopicList } = useCrud(TopicService, {
    filter: { group: newsSlug },
  });

  const topicMenu = useGetTopicMenu({ newsSlug, childNewsTopicList });
  const videoMenu = useGetVideoMenu({ newsSlug });
  const parentTopic = useGetParentTopic({ newsSlug });
  const selectedChildTopic = useGetSelectedChildTopic();
  const post = useGetPostData();
  const selectedVideoGroup = useGetSelectedNewsVideoGroup({ isVideosPage });
  const selectedArea = useGetSelectedNewsArea();
  const breadCrumbs = useGetNewsBreadCrumbs({
    isVideosPage,
    parentTopic,
    selectedChildTopic,
    post,
  });

  const childTopicIdList = useMemo(() => {
    if (!childNewsTopicList) return [];

    return childNewsTopicList.map((topic) => topic.id);
  }, [topicSlug, childNewsTopicList]);

  const newsPostListCrud = useCrud(PostService, {
    limit: 12,
    search,
    order: { createdAt: -1 },
    filter: {
      approveStatus: "APPROVED",
      active: true,
      ...(selectedChildTopic
        ? {
            topicId: {
              $in: selectedChildTopic?.id,
            },
          }
        : {
            topicId: {
              $in: childTopicIdList,
            },
          }),
      ...(selectedArea && { areaId: selectedArea?.id }),
    },
  });

  const newsVideoListCrud = useCrud(YoutubeVideoService, {
    limit: 12,
    search,
    order: { published: -1 },
    filter: {
      groupId: selectedVideoGroup ? selectedVideoGroup.id : { $ne: null },
    },
  });

  return (
    <NewsContext.Provider
      value={{
        parentTopic,
        topicMenu,
        breadCrumbs,
        videoMenu,
        newsPostListCrud,
        post,
        selectedChildTopic,
        newsVideoListCrud,
        isVideosPage,
      }}
    >
      {props.children}
    </NewsContext.Provider>
  );
}

export const useNewsContext = () => useContext(NewsContext);
