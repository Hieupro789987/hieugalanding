import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdStars } from "react-icons/md";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { QuestionComment } from "../../../../../../lib/repo/question/question-comment.repo";
import { Question } from "../../../../../../lib/repo/question/question.repo";
import { QuestionChip } from "../../../../../shared/question/components/question-chip";
import { QuestionPrescription } from "../../../../../shared/question/components/question-prescription/question-prescription";
import { QuestionSuggestProducts } from "../../../../../shared/question/components/question-suggest-products/question-suggest-products";
import { Img } from "../../../../../shared/utilities/misc";
import { HomeQuestionWho } from "./home-question-item";

export function HomeQuestionDetail({
  questionFeatured,
  comment,
  height,
}: {
  questionFeatured: Question;
  comment?: QuestionComment;
  height: number;
}) {
  return (
    <Link href={`/questions/${questionFeatured.slug}`}>
      <a>
        <div className={`lg:h-full mb-0 lg:w-[512px] overflow-hidden`}>
          <div className={`shrink-0 grow-0 bg-white lg:shadow-sm lg:rounded-sm lg:h-full`}>
            <DetailContent questionFeatured={questionFeatured} comment={comment} height={height} />
          </div>
        </div>
      </a>
    </Link>
  );
}

export function DetailContent({
  questionFeatured,
  comment,
  height,
}: {
  questionFeatured: Question;
  comment?: QuestionComment;
  height: number;
}) {
  const isLg = useScreen("lg");
  const [titleLimit, setTitleLimit] = useState<string>();
  const elementRef = useRef(null);
  useEffect(() => {
    if (elementRef?.current?.offsetHeight / 24 > 3) {
      setTitleLimit("text-ellipsis-3");
    } else {
      setTitleLimit("");
    }
  }, []);

  return (
    <div
      className="relative lg:h-full lg:p-5 lg:mb-0 lg:min-h-[28.25rem] lg:max-h-[40.25rem]"
      style={{ maxHeight: `${height}px` }}
    >
      <div className="p-3 overflow-hidden bg-white shadow-sm ld:rounded-none lg:shadow-none lg:bg-none lg:p-0 lg:pb-5 lg:h-full">
        <div className="pb-4 mb-4 border-b border-b-gray-200">
          <div
            className={`font-semibold lg:mb-0 mb-2 ${
              !!titleLimit ? (isLg ? titleLimit : "text-ellipsis-2") : ""
            } `}
            ref={elementRef}
          >
            {questionFeatured.title}
          </div>
          {!!titleLimit && <div className="my-1 text-sm font-bold text-primary">Xem thêm</div>}
          {isLg && (
            <div className="flex flex-col gap-1 mt-2 flex-nowrap lg:flex-wrap lg:flex-row lg:items-center lg:gap-x-4">
              {!!questionFeatured.plant?.name && (
                <QuestionChip title={questionFeatured.plant.name} type="plant" />
              )}
              {!!questionFeatured.questionTopic?.name && (
                <QuestionChip title={questionFeatured.questionTopic.name} type="topic" />
              )}
              {!!questionFeatured.cultivatedArea && (
                <QuestionChip
                  title={`Diện tích ${questionFeatured.cultivatedArea} ha`}
                  type="area"
                />
              )}
              {!!questionFeatured.expectedOutput && (
                <QuestionChip
                  title={`Sản lượng ${questionFeatured.expectedOutput}`}
                  type="quantity"
                />
              )}
            </div>
          )}

          {!!questionFeatured.globalCustomerId && (
            <HomeQuestionWho
              avatar={questionFeatured.globalCustomer?.avatar}
              name={questionFeatured.globalCustomer.name}
              date={questionFeatured.createdAt}
            />
          )}
          {!!questionFeatured.expertId && (
            <HomeQuestionWho
              avatar={questionFeatured.expert?.avatar}
              name={questionFeatured.expert.name}
              date={questionFeatured.createdAt}
            />
          )}
        </div>

        <div>
          {questionFeatured.isExpertCommented && comment?.expertId ? (
            <>
              <div className="flex items-center gap-0.5 text-primary lg:text-base text-sm">
                <HomeQuestionWho avatar={comment.expert?.avatar} name={comment.expert?.name} />
                <i className="text-lg lg:text-xl">
                  <MdStars />
                </i>
                <div className="text-sm lg:text-base">Chuyên gia</div>
              </div>
              <div
                className={`lg:px-3 py-2 lg:mb-0 mb-2  mt-3 overflow-hidden lg:bg-gray-100 rounded h-auto  `}
              >
                <div
                  className={`leading-6 whitespace-pre-line text-sm md:text-base font-medium ${
                    isLg ? "" : "max-h-12 overflow-hidden"
                  }`}
                >
                  {!!comment?.content && <div className="my-1">{comment?.content}</div>}
                  {!!comment?.image && (
                    <Img
                      lazyload={false}
                      src={comment.image}
                      className={`w-20 my-1  border border-slate-200 rounded lg:hover:brightness-90 h-20`}
                      showImageOnClick
                      alt={`${comment?.id}-image`}
                    />
                  )}
                  {comment?.prescriptions?.length > 0 && (
                    <div className="my-1">
                      <QuestionPrescription prescriptions={comment?.prescriptions} />
                    </div>
                  )}
                  {comment?.suggestedProducts?.length > 0 && (
                    <div className="my-1">
                      <QuestionSuggestProducts suggestedProductList={comment?.suggestedProducts} />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            "Chưa có chuyên gia bình luận"
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 rounded-md lg:h-64 bg-gradient-to-t from-white"></div>
    </div>
  );
}
