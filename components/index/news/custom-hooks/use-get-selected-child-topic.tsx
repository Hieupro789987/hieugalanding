import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";

export function useGetSelectedChildTopic() {
  const topicSlug = useQuery("topicSlug");
  const [selectedChildTopic, setSelectedChildTopic] = useState<Topic>();

  const getSelectedChildTopicData = async () => {
    if (!topicSlug) return;

    if (!topicSlug) {
      setSelectedChildTopic(null);

      return;
    }

    try {
      const res = await TopicService.getAll({
        query: { filter: { slug: topicSlug } },
      });
      setSelectedChildTopic(res.data[0]);
    } catch (error) {
      console.debug(error);
    }
  };

  useEffect(() => {
    getSelectedChildTopicData();
  }, [topicSlug]);

  return selectedChildTopic;
}
