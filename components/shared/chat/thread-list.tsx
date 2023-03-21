import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { FaSearch } from "react-icons/fa";
import { CustomerService } from "../../../lib/repo/customer.repo";
import { MemberService } from "../../../lib/repo/member.repo";
import { Thread, ThreadService } from "../../../lib/repo/thread.repo";
import { Img } from "../../shared/utilities/misc";
import { Button, Select } from "../utilities/form";
import { useChatContext } from "./chat-provider";
import { useThreadContext } from "./thread-provider";

export function ThreadList() {
  const {
    threads,
    total,
    fetchThread,
    receiverRole,
    senderId,
    selectedThread,
    selectThread,
    loadMore,
  } = useThreadContext();

  const [id, setId] = useState("");
  const { unseenThreads } = useChatContext();

  return (
    <div className="h-full border-r w-72">
      {receiverRole == "CUSTOMER" && (
        <Select
          className="inline-grid h-12 border-none rounded-none"
          clearable
          searchable
          placeholder="Tìm kiếm khách hàng"
          value={id}
          onChange={(val, extraVal) => {
            setId(val);
            if (val) {
              fetchThread(extraVal.data.threadId, true).then((res) => {
                setId("");
              });
            }
          }}
          dropDownIcon={<FaSearch />}
          autocompletePromise={({ id, search }) =>
            CustomerService.getAllAutocompletePromise(
              { id, search },
              {
                fragment: "id name threadId",
                query: {
                  filter: {
                    memberId: senderId,
                    threadId: { $exists: true, $nin: threads?.map((x) => x.id) || [] },
                  },
                },
                parseOption: (data) => ({
                  value: data.id,
                  label: data.name || "[Khách vãng lai]",
                  data,
                }),
              }
            )
          }
          dependency={threads}
        />
      )}
      {receiverRole == "MEMBER" && (
        <Select
          className="inline-grid h-12 border-none rounded-none"
          clearable
          searchable
          placeholder="Tìm kiếm cửa hàng"
          value={id}
          onChange={(val, extraVal) => {
            setId(val);
            if (val) {
              fetchThread(extraVal.data.threadId, true).then((res) => {
                setId("");
              });
            }
          }}
          dropDownIcon={<FaSearch />}
          autocompletePromise={({ id, search }) =>
            MemberService.getAllAutocompletePromise(
              { id, search },
              {
                fragment: "id name threadId shopName code",
                query: {
                  filter: {
                    threadId: { $exists: true, $nin: threads?.map((x) => x.id) || [] },
                  },
                },
                parseOption: (data) => ({
                  value: data.id,
                  label: `[${data.code}] ${data.shopName || "Không có tên"}`,
                  data,
                }),
              }
            )
          }
          dependency={threads}
        />
      )}
      <Scrollbars className="border-t mt-0.5" style={{ height: "calc(100% - 48px)" }}>
        {threads.map((thread) => {
          const unseenThread = unseenThreads.find((x) => x.id == thread.id);
          return (
            <ThreadItem
              avatar={
                receiverRole == "CUSTOMER" ? thread.customer?.avatar : thread.member?.shopLogo
              }
              name={receiverRole == "CUSTOMER" ? thread.customer?.name : thread.member?.shopName}
              thread={thread}
              key={thread.id}
              selected={selectedThread?.id == thread.id}
              seen={!unseenThread}
              onClick={() => {
                selectThread(thread);
              }}
            />
          );
        })}
        {threads.length < total && (
          <Button className="w-full h-12" text={"Xem thêm"} onClick={loadMore} />
        )}
      </Scrollbars>
    </div>
  );
}

export function ThreadItem({
  avatar,
  thread,
  name,
  selected,
  seen,
  onClick,
}: {
  thread: Thread;
  avatar: string;
  name: string;
  selected: boolean;
  seen: boolean;
  onClick: () => any;
}) {
  return (
    <div
      className={`flex items-start px-3 py-2 border-b border-gray-100 cursor-pointer ${
        selected ? "bg-slate-light" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <Img src={avatar} className="w-12 border rounded-full" avatar></Img>
      <div className="flex-1 pt-0.5 pl-2">
        <div
          className={`text-ellipsis-1 ${
            seen ? "text-gray-600 font-medium" : " text-gray-900 font-semibold"
          }`}
        >
          {name || "[Khách vãng lai]"}
        </div>
        <div
          className={`text-ellipsis-1 font-medium text-sm ${
            seen ? "text-gray-500" : " text-primary"
          }`}
        >
          {thread.snippet}
        </div>
      </div>
      <div
        className={`w-2 h-2 mt-6 mr-1 shadow-sm rounded-full ${seen ? "opacity-0" : "bg-primary"}`}
      ></div>
    </div>
  );
}
