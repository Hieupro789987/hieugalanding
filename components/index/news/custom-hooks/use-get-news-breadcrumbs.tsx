import { useEffect, useState } from "react";
import { Post } from "../../../../lib/repo/post.repo";
import { Topic } from "../../../../lib/repo/topic.repo";
import { BreadCrumb } from "../../../shared/utilities/misc";

interface useGetNewsBreadCrumbsProps {
  isVideosPage: boolean;
  parentTopic: Topic;
  selectedChildTopic: Topic;
  post: Post;
}

export function useGetNewsBreadCrumbs({
  isVideosPage,
  parentTopic,
  selectedChildTopic,
  post,
  ...props
}: useGetNewsBreadCrumbsProps) {
  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([{ label: "Trang chủ", href: "/" }]);

  const getBreadCrumbs = () => {
    let newBreadCrumbs = [...breadCrumbs];

    if (isVideosPage) {
      newBreadCrumbs = [{ label: "Trang chủ", href: "/" }, { label: "Videos" }];

      if (selectedChildTopic) {
        newBreadCrumbs = [
          { label: "Trang chủ", href: "/" },
          { label: "Videos", href: "/videos" },
          { label: `${selectedChildTopic.name}` },
        ];
      }

      setBreadCrumbs(newBreadCrumbs);
      return;
    }

    if (parentTopic) {
      newBreadCrumbs = [{ label: "Trang chủ", href: "/" }, { label: parentTopic?.name }];
    }

    if (parentTopic && selectedChildTopic) {
      newBreadCrumbs = [
        { label: "Trang chủ", href: "/" },
        { label: `${parentTopic.name}`, href: `/${parentTopic.slug}` },
        { label: `${selectedChildTopic.name}` },
      ];
    }

    if (parentTopic && selectedChildTopic && post) {
      newBreadCrumbs = [
        { label: "Trang chủ", href: "/" },
        { label: `${parentTopic.name}`, href: `/${parentTopic.slug}` },
        {
          label: `${selectedChildTopic.name}`,
          href: `/${parentTopic.slug}/${selectedChildTopic.slug}`,
        },
        { label: `${post.title}` },
      ];
    }

    setBreadCrumbs(newBreadCrumbs);
  };

  useEffect(() => {
    getBreadCrumbs();
  }, [post, selectedChildTopic, parentTopic]);

  return breadCrumbs;
}
