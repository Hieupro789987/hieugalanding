import React from "react";
import { HiX } from "react-icons/hi";
import ReactPlayer from "react-player";
import { useScreen } from "../../../lib/hooks/useScreen";
import { Dialog, DialogProps } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form";
import { Img } from "../utilities/misc";

export function VideoDialog({ videoUrl = "", ...props }: DialogProps & { videoUrl: string }) {
  const screenSm = useScreen("sm");
  return (
    <Dialog
      {...props}
      mobileSizeMode={!screenSm}
      slideFromBottom={"none"}
      maxWidth={"960px"}
      width={"94%"}
    >
      <Button
        className="absolute right-0 w-10 h-10 rounded-full -top-14 bg-gray-50"
        outline
        hoverDarken
        iconClassName="text-xl"
        icon={<HiX />}
        onClick={props.onClose}
      />
      <Img className="w-full" noImage ratio169>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-sm">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            style={{ borderRadius: "3px", overflow: "hidden" }}
            controls
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
          />
        </div>
      </Img>
    </Dialog>
  );
}
