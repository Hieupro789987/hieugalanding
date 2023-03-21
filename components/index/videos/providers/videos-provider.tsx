import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { YoutubeVideoGroupService } from "../../../../lib/repo/youtube-video-group.repo";
import { YoutubeVideo, YoutubeVideoService } from "../../../../lib/repo/youtube-video.repo";
import { BreadCrumb } from "../../../shared/utilities/misc";

type VideoGroup = {
  title: string;
  slug: string;
  href: string;
};

export const VideosContext = createContext<
  Partial<{
    youtubeVideoCrud: CrudProps<YoutubeVideo>;
    youtubeVideoMobileCrud: CrudProps<YoutubeVideo>;
    videoGroups: VideoGroup[];
    breadCrumbs: BreadCrumb[];
  }>
>({});

export function VideosProvider({ id, ...props }: ReactProps & { id?: string }) {
  const router = useRouter();
  const screenLg = useScreen("lg");
  const slug: string = useQuery("slug");
  const [videoGroups, setVideoGroups] = useState<VideoGroup[]>([]);
  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([
    { label: "Trang chủ", href: "/" },
    { label: "Videos" },
  ]);
  const youtubeVideoCrud = useCrud(YoutubeVideoService, {
    limit: 12,
    order: { published: -1 },
    filter: { groupIds: id },
  });
  const youtubeVideoMobileCrud = useCrud(YoutubeVideoService, {
    limit: 6,
    order: { published: -1 },
    filter: { groupIds: id },
  });
  const getBreadCrumbs = () => {
    if (!slug || !videoGroups?.length) return;

    const selectedGroup = videoGroups.find((group) => group.slug === slug);
    const newBreadCrumbs = [
      { label: "Trang chủ", href: "/" },
      { label: "Videos", href: "/videos" },
      { label: `${selectedGroup.title}` },
    ];
    setBreadCrumbs(newBreadCrumbs);
  };

  useEffect(() => {
    (async () => {
      try {
        const YoutubeVideoGroups = await YoutubeVideoGroupService.getAll({
          query: {
            limit: 0,
            order: { priority: -1 },
          },
        });
        setVideoGroups(
          YoutubeVideoGroups.data.map((item) => ({
            title: item.name,
            slug: item.slug,
            href: `/videos/${item.slug}`,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!slug && videoGroups?.length) router.push(`/videos`);
    getBreadCrumbs();
  }, [slug, videoGroups]);

  useEffect(() => {
    if (screenLg) {
      youtubeVideoCrud.setPage(1);
    } else {
      youtubeVideoMobileCrud.setPage(1);
    }
  }, [id]);

  return (
    <VideosContext.Provider
      value={{
        youtubeVideoCrud,
        youtubeVideoMobileCrud,
        videoGroups,
        breadCrumbs,
      }}
    >
      {props.children}
    </VideosContext.Provider>
  );
}

export const useVideosContext = () => useContext(VideosContext);
