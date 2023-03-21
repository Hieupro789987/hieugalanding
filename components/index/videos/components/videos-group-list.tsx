import { SideMenu } from "../../../shared/common/side-menu";
import { useVideosContext } from "../providers/videos-provider";

export function VideoGroupList({ ...props }: ReactProps & {}) {
  const { videoGroups } = useVideosContext();

  return (
    <>
      <SideMenu
        title="Video"
        menuItems={[{ title: "Tất cả", slug: "videos", href: "/videos" }, ...videoGroups]}
      />
    </>
  );
}
