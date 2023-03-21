import { useMemo } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Topic } from "../../../../lib/repo/topic.repo";

interface useGetTopicMenuProps {
  newsSlug: string;
  childNewsTopicList: Topic[];
}

export function useGetTopicMenu({ newsSlug, childNewsTopicList, ...props }: useGetTopicMenuProps) {
  const topicSlug = useQuery("topicSlug");

  const getTopicMenu = () => {
    if (!childNewsTopicList) return [];

    const newTopicMenu = childNewsTopicList.map((item) => ({
      title: item.name,
      slug: item.slug,
      href: `/${newsSlug}/${item.slug}`,
      image: item.image,
    }));

    return newTopicMenu;
  };

  const topicMenu = useMemo(() => {
    return getTopicMenu();
  }, [topicSlug, childNewsTopicList]);

  return topicMenu;
}
