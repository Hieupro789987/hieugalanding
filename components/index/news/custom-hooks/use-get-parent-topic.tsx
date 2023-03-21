import { useEffect, useState } from "react";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";

interface useGetParentTopicProps {
  newsSlug: string;
}

export function useGetParentTopic({ newsSlug, ...props }: useGetParentTopicProps) {
  const [parentTopic, setParentTopic] = useState<Topic>();

  const getParentTopicData = async () => {
    if (!newsSlug) return;

    try {
      const res = await TopicService.getAll({ query: { filter: { slug: newsSlug } } });
      setParentTopic(res.data[0]);
    } catch (error) {
      console.debug(error);
    }
  };

  useEffect(() => {
    getParentTopicData();
  }, [newsSlug]);

  return parentTopic;
}
