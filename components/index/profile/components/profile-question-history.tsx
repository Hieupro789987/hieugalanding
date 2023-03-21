import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowRightSLine, RiRefreshLine } from "react-icons/ri";
import { formatDate } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import {
  QuestionHistory,
  QuestionHistoryService,
} from "../../../../lib/repo/question/question-history.repo";
import { Button } from "../../../shared/utilities/form";
import { BreadCrumbs, NotFound, Spinner } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";

export function ProfileQuestionHistory({ ...props }) {
  const screenLg = useScreen("lg");

  const { items, loadAll, page, setPage, total, hasMore, loadMore, loading } = useCrud(
    QuestionHistoryService,
    {
      limit: 6,
      order: { createdAt: -1 },
    }
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

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
                label: "Lịch sử câu hỏi của tôi",
              },
            ]}
          />
        </div>
      )}
      <div className="flex-1 p-3 bg-white lg:p-0">
        <div className="flex items-center justify-between mb-5 lg:mb-0 ">
          <div className="text-lg font-bold text-accent">LỊCH SỬ CÂU HỎI CỦA TÔI</div>
          <Button
            textPrimary
            light
            icon={<RiRefreshLine />}
            iconClassName="text-xl"
            className="px-2.5 py-1"
            tooltip="Tải lại"
            onClick={async () => await loadAll(true)}
          />
        </div>
        {items?.length > 0 ? (
          items.map((item: QuestionHistory) => (
            <QuestionItem questionHistory={item} key={item.id} />
          ))
        ) : (
          <NotFound text="Lịch sử câu hỏi trống" />
        )}

        <div className="flex justify-end mt-3">
          {screenLg ? (
            <PaginationRound
              limit={6}
              page={page}
              total={total}
              onPageChange={(page: number) => setPage(page)}
            />
          ) : (
            <>
              {hasMore && (
                <Button
                  text="Xem thêm"
                  textPrimary
                  isLoading={loading}
                  className={screenLg && "m-auto"}
                  onClick={() => loadMore()}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function QuestionItem({ questionHistory, ...props }: { questionHistory: QuestionHistory }) {
  const screenLg = useScreen("lg");

  return (
    <div className="animate-emerge w-full px-2 pt-2 pb-0 mt-[6px] border border-gray-300 rounded-md shadow-sm lg:mt-2  lg:pt-4 lg:pb-2 lg:px-4 animate-emerge-up">
      <Link href={`/questions/${questionHistory.question.slug}`}>
        <a className="cursor-pointer group">
          <div className="mb-1 text-sm font-medium text-gray-500 lg:mb-0">{`#${
            questionHistory.question.code
          } tạo ${formatDistanceToNow(new Date(questionHistory.time), {
            locale: vi,
            addSuffix: true,
          })}`}</div>
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-b-gray-300">
            <div
              className={`text-sm font-bold text-accent   ${
                screenLg ? "text-ellipsis-1" : "text-ellipsis-2"
              }  lg:text-base group-hover:text-primary group-hover:underline`}
            >
              {questionHistory.question.title}
            </div>
            <Button
              textPrimary
              icon={<RiArrowRightSLine />}
              className="pr-0"
              iconClassName="text-2xl"
              tooltip="Xem chi tiết"
            />
          </div>

          <div className="flex items-center justify-between pb-2 lg:pb-0">
            <div className="flex items-center">
              <span
                className={`inline-block w-2.5 h-2.5 mr-2 bg-${
                  ACTION[questionHistory.action]?.statusColor
                }-500 rounded-full `}
              ></span>
              <span className="text-xs font-medium lg:text-sm">{`${
                ACTION[questionHistory.action]?.label
              } lúc ${formatDate(questionHistory.time, "HH:mm dd-MM-yyyy")}`}</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

export const ACTION = {
  CREATED: {
    label: "Tạo mới",
    statusColor: "blue",
  },
  UPDATED: {
    label: "Chỉnh sửa",
    statusColor: "green",
  },
  DELETED: {
    label: "Xóa",
    statusColor: "red",
  },
};

