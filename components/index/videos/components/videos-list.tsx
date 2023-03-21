import { YoutubeVideo, YoutubeVideoService } from "../../../../lib/repo/youtube-video.repo";
import { Spinner } from "../../../shared/utilities/misc";
import { NotFound } from "../../../shared/utilities/misc/not-found";
import { YoutubeVideoItem } from "./videos-item";
import { VideoDialog } from "../../../shared/shop-layout/video-dialog";
import { useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
export function VideosList({
  videos,
  title,
  ...props
}: ReactProps & { videos: YoutubeVideo[]; title: string }) {
  const slug: string = useQuery("slug");
  const [openVideoDialog, setOpenVideoDialog] = useState<string>();

  const handleClickOpenVideo = (video: string) => {
    setOpenVideoDialog(video);
  };
  if (videos?.length === undefined) return <Spinner />;
  if (videos.length <= 0) return <NotFound text="Không tìm thấy video nào" />;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <YoutubeVideoItem
            youtubeVideo={video}
            key={video.id}
            onClickOpenVideo={handleClickOpenVideo}
          />
        ))}
      </div>
      <VideoDialog
        videoUrl={openVideoDialog ? `https://www.youtube.com/watch?v=${openVideoDialog}` : ""}
        isOpen={!!openVideoDialog}
        onClose={() => setOpenVideoDialog("")}
      />
    </>
  );
}
