import React from "react";
import { YoutubeVideo } from "../../../../lib/repo/youtube-video.repo";
import { Img } from "../../../shared/utilities/misc";
import { formatDate } from "../../../../lib/helpers/parser";
import playVideoImg from "../../../../public/assets/img/play-video.png";

type Props = {
  youtubeVideo: YoutubeVideo;
  onClickOpenVideo: (video: string) => void;
};

export function YoutubeVideoItem({ ...props }: Props) {
  const { youtubeVideo, onClickOpenVideo } = props;

  return (
    <>
      <div className="flex cursor-pointer group flex-col justify-between shrink-0 grow-0 flex-1 p-2 lg:p-3.5 xl:p-5 bg-white border border-blue-100 rounded-md">
        <div
          className="flex flex-col h-full"
          onClick={() => onClickOpenVideo(youtubeVideo.videoId)}
        >
          <Img
            ratio169
            rounded
            src={youtubeVideo?.thumb}
            className="relative object-contain w-full mx-auto overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-full backdrop-brightness-75 group-hover:backdrop-brightness-[80%] flex-center">
              <img srcSet={`${playVideoImg.src} 2x`} />
            </div>
          </Img>
          <div className="h-auto my-3 text-sm font-bold whitespace-normal group-hover:text-primary text-accent md:text-sm">
            {youtubeVideo?.title}
          </div>
          <div className="h-auto mt-auto text-sm whitespace-normal text-accent md:text-sm">
            {formatDate(youtubeVideo?.published)}
          </div>
        </div>
      </div>
    </>
  );
}
