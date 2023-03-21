import { CgSpinner } from "react-icons/cg";
import { formatDate } from "../../../lib/helpers/parser";
import { useToggle } from "../../../lib/hooks/useToggle";
import { ThreadMessage } from "../../../lib/repo/thread-message.repo";
import { Accordion, Img } from "../utilities/misc";

interface Props extends ReactProps {
  isSender: boolean;
  showDate?: boolean;
  threadMessage: ThreadMessage;
  avatar?: string;
  isPlaceholder?: boolean;
}
export function MessageItem({
  threadMessage,
  showDate,
  isSender,
  isPlaceholder,
  avatar,
  ...props
}: Props) {
  const [openTime, toggleOpenTime] = useToggle(false);
  const payload = threadMessage.attachment?.payload;
  return (
    <div>
      {showDate && (
        <div className="pt-3 pb-2 text-sm font-bold text-center uppercase text-accent">
          {formatDate(threadMessage.createdAt, "EEE, dd/MM/yyyy")}
        </div>
      )}
      <div
        id={threadMessage.id}
        className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : ""}`}
      >
        <Img
          lazyload={false}
          className="w-8 mb-1"
          imageClassName="border bg-white"
          src={avatar}
          avatar
          noImage={avatar === undefined}
        >
          {avatar === undefined && isPlaceholder && (
            <i className="absolute bottom-2 right-2 text-primary animate-spin">
              <CgSpinner />
            </i>
          )}
        </Img>
        <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
          {(threadMessage.text || !payload) && (
            <div
              className={`py-2 px-3 max-w-2xs xs:max-w-xs md:max-w-sm min-h-10 min-w-8 break-words ${
                isSender ? "rounded-l-xl rounded-r" : "rounded-r-xl rounded-l"
              } ${payload ? (isSender ? "rounded-br-none" : "rounded-bl-none") : ""} ${
                isSender ? "bg-primary text-gray-50" : "bg-gray-100 text-accent"
              }`}
              onClick={toggleOpenTime}
            >
              <div className="font-medium leading-snug whitespace-pre-wrap">
                {threadMessage.text}
              </div>
            </div>
          )}
          {payload && (
            <Img
              src={payload?.url}
              className={`w-24 rounded-xl border ${
                threadMessage.text ? (isSender ? "rounded-tr-none" : "rounded-tl-none") : ""
              }`}
              compress={100}
              showImageOnClick
              lazyload={false}
              scrollContainer={`#thread-${threadMessage.threadId}`}
            />
          )}
        </div>
      </div>
      {threadMessage.createdAt && (
        <Accordion className={`${openTime ? "animate-emerge" : ""}`} isOpen={openTime}>
          <div
            className={`text-xs text-gray-500 font-medium pt-0.5 ${
              isSender ? "pr-11 text-right" : "pl-11"
            }`}
          >
            {formatDate(threadMessage.createdAt, "dd/MM/yyyy HH:mm")}
          </div>
        </Accordion>
      )}
    </div>
  );
}
