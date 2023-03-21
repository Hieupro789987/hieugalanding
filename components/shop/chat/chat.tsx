import { useAuth } from "../../../lib/providers/auth-provider";
import { ThreadProvider } from "../../shared/chat/thread-provider";
import { ThreadBox } from "../../shared/chat/thread-box";
import { ThreadList } from "../../shared/chat/thread-list";

export function ChatPage() {
  const { member } = useAuth();
  return (
    <div
      className="w-full border shadow bg-white rounded flex"
      style={{ height: "calc(100vh - 192px)" }}
    >
      <ThreadProvider senderId={member.id} senderRole="MEMBER" receiverRole="CUSTOMER">
        <ThreadList />
        <ThreadBox height="calc(100vh - 266px)" />
      </ThreadProvider>
    </div>
  );
}
