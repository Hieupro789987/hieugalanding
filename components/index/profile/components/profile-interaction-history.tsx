import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowRightSLine, RiRefreshLine } from "react-icons/ri";
import { formatDate } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import {
  Interaction,
  InteractionService,
} from "../../../../lib/repo/global-customer/interaction.repo";
import { Select } from "../../../shared/utilities/form";

import { Button } from "../../../shared/utilities/form/button";
import { BreadCrumbs, NotFound, Spinner, StatusLabel } from "../../../shared/utilities/misc";

export function ProfileInteractionHistory({ ...props }) {
  const screenLg = useScreen("lg");
  const [filterInteraction, setFilterInteraction] = useState<any>();

  const filter = (x: string) => {
    const obj = {};
    if (x === "ALL") {
      obj["action"] = {};
      obj["action"] = undefined;
    } else {
      if (x === "LIKED_COMMENT" || x === "LIKED_QUESTION") {
        obj["action"] = {};
        obj["action"] = "LIKED";
        obj["targetType"] = x === "LIKED_COMMENT" ? "QuestionComment" : "Question";
      } else {
        obj["action"] = {};
        obj["action"] = x;
      }
    }
    setFilterInteraction(obj);
  };

  const { items, loadAll, hasMore, loadMore, loading } = useCrud(
    InteractionService,
    {
      limit: 6,
      order: { createdAt: -1 },
      ...(!!filterInteraction && {
        filter: { ...filterInteraction },
      }),
    },
    !!filterInteraction && { fetchingCondition: !!filterInteraction }
  );

  if (items === undefined || items === null) return <Spinner />;

  return (
    <>
      {!screenLg && (
        <div className="px-3 bg-white border-b boder-b-neutralGrey">
          <BreadCrumbs
            className="relative z-10 my-3"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                href: "/profile",
                label: "Tài khoản",
              },
              {
                label: "Lịch sử tương tác",
              },
            ]}
          />
        </div>
      )}
      <div className="flex-1 p-3 bg-white lg:p-0">
        <div className="items-center justify-between mb-5 lg:flex">
          <div className="flex-shrink mb-2 text-lg font-bold text-accent lg:mb-0">
            LỊCH SỬ TƯƠNG TÁC
          </div>
          <div className="flex flex-row-reverse justify-end lg:flex-row">
            <Button
              textPrimary
              light
              icon={<RiRefreshLine />}
              iconClassName="text-xl"
              className=" px-2.5 lg:mr-4 lg:ml-0 ml-4"
              onClick={async () => await loadAll(true)}
            />
            <Select
              placeholder="Lọc loại tương tác"
              options={INTERACTION_TYPE}
              className="w-52 border-primary"
              onChange={(val) => filter(val)}
              native
            />
          </div>
        </div>
        {items?.length > 0 ? (
          items.map((item) => <InteractionItem interaction={item} key={item.id} />)
        ) : (
          <NotFound text="Lịch sử tương tác trống" />
        )}
        <div className="text-center">
          {items?.length > 0 && hasMore && (
            <Button
              text="Xem thêm"
              textPrimary
              isLoading={loading}
              asyncLoading={false}
              onClick={() => loadMore()}
            />
          )}
        </div>
      </div>
    </>
  );
}

export function InteractionItem({ interaction, ...props }: { interaction: Interaction }) {
  const screenLg = useScreen("lg");

  return (
    <>
      <Link href={`/questions/${interaction?.question?.slug}`}>
        <a className="cursor-pointer group">
          <div className="animate-emerge w-full px-2 py-2  mt-[6px] border border-gray-300 rounded-md shadow-sm cursor-pointer group lg:mt-2 lg:pb-1 lg:pt-3 lg:px-3">
            <div className="flex items-center">
              <StatusLabel
                type="light"
                value={
                  interaction.action === "LIKED"
                    ? interaction?.targetType === "Question"
                      ? "LIKED_QUESTION"
                      : "LIKED_COMMENT"
                    : interaction.action
                }
                options={INTERACTION_TYPE}
                maxContent
                className="px-3 py-2 text-sm rounded"
              />
              <div className="ml-5 text-sm font-medium text-gray-400">
                {formatDate(interaction.time, "HH:mm dd/MM/yyyy")}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1 lg:mt-0">
              <div className="w-full overflow-hidden text-black group-hover:text-primary">
                <div className="text-sm lowercase lg:flex lg:text-base">
                  <span className="min-w-fit lg:mr-1">Bạn đã </span>
                  <strong className="min-w-fit">
                    {" "}
                    {ACTION[interaction.action](interaction.targetType)?.label}{" "}
                  </strong>
                  {interaction.action !== "LIKED" ? (
                    <span
                      className={` ${screenLg ? "text-ellipsis-1 mx-1" : "text-ellipsis-2"} `}
                      style={{ display: `${screenLg ? "block" : "inline"}` }}
                    >
                      {" "}
                      {isActionCrud(interaction.action) && interaction.targetType === "Question"
                        ? screenLg
                          ? interaction.question?.title
                          : concatString(interaction.question?.title)
                        : screenLg
                        ? interaction.comment?.content
                        : concatString(interaction.comment?.content)}
                    </span>
                  ) : (
                    <span className="lg:mx-1">của</span>
                  )}
                  {!isActionCrud(interaction.action) && (
                    <span className="min-w-fit" style={{ display: "inline" }}>
                      {" "}
                      {interaction.action !== "LIKED" && "câu hỏi của"}{" "}
                      <strong>
                        @
                        {interaction.targetType === "Question"
                          ? interaction.question?.globalCustomerId
                            ? interaction.question?.globalCustomer?.name
                            : interaction.question?.expert?.name
                          : interaction.comment?.globalCustomerId
                          ? interaction.comment?.globalCustomer?.name
                          : interaction.comment?.expert?.name}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
              <Button
                tooltip="Xem chi tiết"
                icon={<RiArrowRightSLine />}
                className="pr-0"
                iconClassName="text-2xl"
              />
            </div>
          </div>
        </a>
      </Link>
    </>
  );
}

export const INTERACTION_TYPE = [
  { value: "ALL", label: "Tất cả" },
  { value: "CREATED", label: "Tạo câu hỏi", color: "blue" },
  { value: "UPDATED", label: "Chỉnh sửa câu hỏi", color: "purple" },

  {
    value: "LIKED_COMMENT",
    label: "Thích bình luận",
    color: "orange",
  },
  {
    value: "LIKED_QUESTION",
    label: "Thích câu hỏi",
    color: "orange",
  },
  { value: "COMMENTED", label: "Bình luận", color: "green" },
  { value: "DELETED", label: "Xóa câu hỏi", color: "danger" },
];

export const ACTION = {
  CREATED: (x?: string) => {
    return { label: "tạo câu hỏi" };
  },
  UPDATED: (x?: string) => {
    return { label: "chỉnh sửa câu hỏi" };
  },
  DELETED: (x?: string) => {
    return { label: "xóa câu hỏi" };
  },
  LIKED: (x: string = "") => {
    return x === "Question" ? { label: "thích câu hỏi" } : { label: "thích bình luận" };
  },
  COMMENTED: (x?: string) => {
    return { label: "bình luận" };
  },
};

export function concatString(x?: string) {
  if (x?.split(" ").length > 15) {
    return x?.split(" ").slice(0, 15).join(" ").concat("...");
  } else {
    return x;
  }
}

export function isActionCrud(action: string) {
  if (!action) return false;
  if (action == "CREATED" || action == "UPDATED" || action == "DELETED") {
    return true;
  }
  return false;
}
