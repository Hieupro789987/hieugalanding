import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiChatCheckLine, RiMoreFill, RiPlayCircleFill } from "react-icons/ri";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { Question } from "../../../../../lib/repo/question/question.repo";
import { Button } from "../../../utilities/form";
import { Img } from "../../../utilities/misc";
import { Dropdown } from "../../../utilities/popover/dropdown";
import { QuestionChip } from "../question-chip";
import { QuestionWrapper } from "../question-content-wrapper";
import { countLines } from "./question-item";

interface QuestionItemContentProps extends ReactProps {
  question: Question;
  isDetails: boolean;
  isQuestEditable: boolean;
  isQuestDeletable: boolean;
  canEditQuest: boolean;
  onQuestEdit: (canEditQuest?: boolean) => void;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
  onQuestDel: (quest: Question) => void;
  onOpenVideoDialog: (url: string) => void;
  onOpenShareDialog: (quest: Question) => void;
}

export function QuestionItemContent({
  question,
  isDetails,
  isQuestEditable,
  isQuestDeletable,
  canEditQuest,
  onQuestEdit,
  onQuestDel,
  totalComments,
  totalLikes,
  totalViews,
  onOpenVideoDialog,
  onOpenShareDialog,
  ...props
}: QuestionItemContentProps) {
  const INIT_LINES_DISPLAY = 5;
  const router = useRouter();
  const screenLg = useScreen("lg");
  const loadMoreRef = useRef();
  const [numberOfLines, setNumberOfLines] = useState<number>(0);

  const isShowMoreVisible = isDetails && !isQuestEditable && !isQuestDeletable ? false : true;

  useEffect(() => {
    setNumberOfLines(countLines(question?.id));
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-6 text-sm font-bold">
          <QuestionWrapper href={isDetails ? null : `/questions/${question.slug}`}>
            <div className="">{`#${question.code}`}</div>
          </QuestionWrapper>
          {question.isExpertCommented && (
            <div className="flex items-center gap-2 text-primary">
              <i className="text-xl">
                <RiChatCheckLine />
              </i>
              <div className="font-semibold">Chuyên gia đã bình luận</div>
            </div>
          )}
        </div>
        {isShowMoreVisible && (
          <>
            <i
              className="text-2xl cursor-pointer text-accent lg:hover:text-primary"
              ref={loadMoreRef}
            >
              <RiMoreFill />
            </i>
            <Dropdown reference={loadMoreRef} trigger="click" placement="bottom-end">
              <Dropdown.Item
                className={`justify-start ${isDetails && "hidden"}`}
                text="Chi tiết câu hỏi"
                onClick={() => router.push(`/questions/${question.slug}`)}
              />
              <Dropdown.Item
                className={`justify-start  ${!isQuestEditable && "hidden"}`}
                text="Chỉnh sửa câu hỏi"
                onClick={() => onQuestEdit?.(canEditQuest)}
              />
              <Dropdown.Item
                className={`justify-start ${!isQuestDeletable && "hidden"}`}
                text="Xóa câu hỏi"
                hoverDanger
                onClick={() => onQuestDel?.(question)}
              />
            </Dropdown>
          </>
        )}
      </div>
      <QuestionWrapper href={isDetails ? null : `/questions/${question.slug}`}>
        <div
          id={`${question.id}`}
          className={`text-base lg:text-lg leading-7 font-semibold ${
            numberOfLines > INIT_LINES_DISPLAY && !isDetails
              ? `text-ellipsis-${INIT_LINES_DISPLAY}`
              : "h-auto"
          }`}
        >
          {question.title}
        </div>
      </QuestionWrapper>
      <div className="w-full">
        {numberOfLines > INIT_LINES_DISPLAY && !isDetails && (
          <Button
            className="p-0 text-xs text-primary"
            style={{ marginTop: "-8px" }}
            text="Xem thêm"
            href={`/questions/${question.slug}`}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 mt-2 flex-nowrap lg:flex-wrap lg:flex-row lg:items-center lg:gap-x-4">
        {!!question.plant?.name && <QuestionChip title={question.plant.name} type="plant" />}
        {!!question.questionTopic?.name && <QuestionChip title={question.questionTopic.name} type="topic" />}
        {!!question.cultivatedArea && (
          <QuestionChip title={`Diện tích ${question.cultivatedArea} ha`} type="area" />
        )}
        {!!question.expectedOutput && (
          <QuestionChip title={`Sản lượng ${question.expectedOutput}`} type="quantity" />
        )}
      </div>
      <QuestionWrapper href={isDetails ? null : `/questions/${question.slug}`}>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {!!question.video?.downloadUrl && !isDetails && (
            <Img
              lazyload={false}
              src={question.video?.thumbnail}
              className="relative w-20 h-20 border border-gray-100 rounded"
              imageClassName="brightness-50"
              alt={`${question?.code}-video-thumbnail`}
            >
              <i className="absolute text-3xl text-white top-6 left-6">
                <RiPlayCircleFill />
              </i>
            </Img>
          )}
          {!!question.audio?.downloadUrl && !isDetails && (
            <Img
              lazyload={false}
              src="https://i.imgur.com/V2u2rxx.png"
              className="w-20 h-20 border border-gray-100 rounded"
              alt={`${question?.code}-audio-alert`}
            />
          )}
          {!!question.images?.length && (
            <>
              {question.images.slice(0, isDetails ? undefined : 4).map((img, index) => {
                return index === 3 && question.images?.length >= 5 && !isDetails ? (
                  <Img
                    lazyload={false}
                    src={question.images[3]}
                    className="relative w-20 h-20 border border-gray-100 rounded"
                    imageClassName="brightness-50"
                    key={index}
                    alt={`${question?.code}-image`}
                  >
                    <div className="absolute text-2xl font-bold text-white top-6 left-6">{`+${
                      question.images?.length - 3
                    }`}</div>
                  </Img>
                ) : (
                  <Img
                    key={index}
                    lazyload={false}
                    alt={`${question?.code}-image`}
                    src={img}
                    className={`w-20 h-20 border border-gray-100 rounded ${
                      isDetails && "lg:hover:brightness-90"
                    }`}
                    {...(isDetails && { showImageOnClick: true })}
                  />
                );
              })}
            </>
          )}
        </div>
      </QuestionWrapper>
      {!!question.video?.downloadUrl && isDetails && (
        <div className="mt-3">
          <Img
            alt={`${question?.code}-video-thumbnail`}
            lazyload={false}
            ratio169
            src={question.video?.thumbnail}
            onClick={() => onOpenVideoDialog?.(question.video?.downloadUrl)}
            className="w-48 rounded"
            imageClassName="brightness-90 lg:hover:brightness-75"
          >
            <i
              className="absolute text-[39px] text-white/90 top-8 left-20"
              onClick={() => onOpenVideoDialog?.(question.video?.downloadUrl)}
            >
              <RiPlayCircleFill />
            </i>
          </Img>
        </div>
      )}
      {!!question.audio?.downloadUrl && isDetails && (
        <audio controls className="mt-3" style={{ width: screenLg ? "400px" : "340px" }}>
          <source src={question.audio?.downloadUrl} type="audio/mpeg" />
        </audio>
      )}
      <div className="flex items-center gap-2 mt-3">
        <Img
          src={question.expert?.avatar || question.globalCustomer?.avatar}
          avatar
          lazyload={false}
          alt={`${question?.code}-owner-avatar`}
          className="w-6 h-6"
        />
        <div className="flex gap-1 text-sm">
          <div className="font-bold">{question.expert?.name || question.globalCustomer?.name}</div>
          <div className="text-gray-600 ">
            {`hỏi ${formatDistanceToNowStrict(new Date(question?.createdAt || new Date()), {
              locale: vi,
              addSuffix: true,
              roundingMethod: "ceil",
            })}`}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3 mt-3 text-sm font-medium text-gray-500 lg:gap-4 lg:text-base">
        <div className="">{`${totalViews} Lượt xem`}</div>
        <div className="">{`${totalLikes} Thích`}</div>
        <div className="">{`${totalComments} Bình luận`}</div>
      </div>
    </>
  );
}
