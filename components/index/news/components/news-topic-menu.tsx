import { useNewsContext } from "../providers/news-provider";
import { NewsSideMenu } from "./news-side-menu";

export function NewsTopicMenu({ ...props }) {
  const { parentTopic, topicMenu, videoMenu } = useNewsContext();

  return (
    <div className="gap-14 flex-cols mt-0.5">
      {!!parentTopic?.id && (
        <NewsSideMenu
          title={parentTopic?.name}
          className=""
          menuItems={[{ title: "Tất cả", slug: "", href: `/${parentTopic?.slug}` }, ...topicMenu]}
        />
      )}
      {parentTopic?.slug === "thong-tin-mua-vu" && (
        <NewsSideMenu
          title="Video"
          className=""
          menuItems={[{ title: "Tất cả", slug: "", href: `/videos`, isVideo: true }, ...videoMenu]}
        />
      )}
    </div>
  );
}
