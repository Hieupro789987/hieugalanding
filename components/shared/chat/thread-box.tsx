import { FaInbox } from "react-icons/fa";
import { MessageBox } from "../../shared/chat/message-box";
import { MessageInput } from "../../shared/chat/message-input";
import { MessageProvider } from "../../shared/chat/message-provider";
import { NotFound } from "../../shared/utilities/misc";
import { useThreadContext } from "./thread-provider";
import { ThreadInfo } from "./thread-info";

export function ThreadBox({ height }: { height: number | string }) {
  const { selectedThread, senderId, senderRole, receiverRole } = useThreadContext();

  if (selectedThread === undefined)
    return <NotFound className="py-40" text="Hãy chọn một hộp thư" icon={<FaInbox />} />;
  return (
    <>
      {selectedThread ? (
        <MessageProvider
          threadId={selectedThread.id}
          senderId={senderId}
          senderRole={senderRole}
          receiverRole={receiverRole}
        >
          <div className="flex-1 h-full">
            <MessageBox height={height} />
            <MessageInput />
          </div>
          <ThreadInfo />
        </MessageProvider>
      ) : (
        <></>
      )}
    </>
  );
}
