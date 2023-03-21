import { useMemo } from "react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { YoutubeVideoGroupService } from "../../../../lib/repo/youtube-video-group.repo";

interface useGetVideoMenuProps {
  newsSlug: string;
}

export function useGetVideoMenu({ newsSlug, ...props }: useGetVideoMenuProps) {
  const topicSlug = useQuery("topicSlug");

  const { items: videoGroupList } = useCrud(YoutubeVideoGroupService, {
    limit: 5,
    order: { createdAt: -1 },
  });

  const getVideoMenu = () => {
    if (!videoGroupList || !newsSlug) return [];

    const newTopicMenu = videoGroupList.map((item) => ({
      title: item.name,
      slug: item.slug,
      href: `/videos/${item.slug}`,
      image: item.image,
      isVideo: true,
    }));

    return newTopicMenu;
  };

  const videoMenu = useMemo(() => {
    return getVideoMenu();
  }, [topicSlug, videoGroupList]);

  return videoMenu;
}
