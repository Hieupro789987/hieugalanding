import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import {
  YoutubeVideoGroup,
  YoutubeVideoGroupService,
} from "../../../../lib/repo/youtube-video-group.repo";

interface useGetSelectedNewsVideoGroupProps {
  isVideosPage: boolean;
}

export function useGetSelectedNewsVideoGroup({
  isVideosPage,
  ...props
}: useGetSelectedNewsVideoGroupProps) {
  const topicSlug = useQuery("topicSlug");
  const [selectedVideoGroup, setSelectedVideoGroup] = useState<YoutubeVideoGroup>();

  const getSelectedVideoGroupData = async () => {
    if (!isVideosPage) return;

    if (!topicSlug) {
      setSelectedVideoGroup(null);

      return;
    }

    try {
      const res = await YoutubeVideoGroupService.getAll({
        query: { filter: { slug: topicSlug } },
        cache: false,
      });
      setSelectedVideoGroup(res.data[0]);
    } catch (error) {
      console.debug(error);
    }
  };

  useEffect(() => {
    getSelectedVideoGroupData();
  }, [isVideosPage, topicSlug]);

  return selectedVideoGroup;
}
