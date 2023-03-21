import { useEffect, useRef, useState } from "react";
import { MdStars } from "react-icons/md";
import { RiMoreFill } from "react-icons/ri";
import { QuestionComment } from "../../../../../lib/repo/question/question-comment.repo";
import { Button } from "../../../utilities/form";
import { Img } from "../../../utilities/misc";
import { Dropdown } from "../../../utilities/popover/dropdown";
import { countLines } from "../question-item/question-item";
import { QuestionPrescription } from "../question-prescription/question-prescription";
import { QuestionSuggestProducts } from "../question-suggest-products/question-suggest-products";

interface QuestionCommentItemDataProps extends ReactProps {
  comment: QuestionComment;
  editCommentId: string;
  onEditCommentIdChange: (val: string) => void;
  onDeleteComment: (deletedComment: QuestionComment) => void;
  isDetails?: boolean;
  onHiddenComment?: (hiddenComment: QuestionComment) => void;
  isCommentEditable: boolean;
  isCommentDeletable: boolean;
  isCommentHidable: boolean;
  hiddenClass: string;
}

export function QuestionCommentItemData({
  comment,
  editCommentId,
  onEditCommentIdChange,
  onDeleteComment,
  isDetails = false,
  onHiddenComment,
  isCommentEditable,
  isCommentDeletable,
  isCommentHidable,
  hiddenClass,
  ...props
}: QuestionCommentItemDataProps) {
  const editCommentRef = useRef(null);
  const commentRef = useRef(null);

  return (
    <>
      <div className="flex items-center justify-between gap-4 font-semibold" ref={commentRef}>
        <div className={`flex items-center gap-2 ${hiddenClass}`}>
          <Img
            lazyload={false}
            src={comment.expert?.avatar || comment.globalCustomer?.avatar}
            avatar
            alt={`${comment?.id}-owner-avatar`}
            className="w-6 h-6 grow-0 shrink-0"
          />
          <div className="text-base">{comment.expert?.name || comment.globalCustomer?.name}</div>
          {!!comment?.expertId && (
            <div className="flex items-center gap-0.5 text-primary">
              <i className="text-xl">
                <MdStars />
              </i>
              <div className="">Chuyên gia</div>
            </div>
          )}
        </div>
        <i
          className={`text-2xl text-gray-500 cursor-pointer lg:hover:text-primary 
            ${!isCommentEditable && !isCommentDeletable && "hidden"}
          `}
          ref={editCommentRef}
        >
          <RiMoreFill />
        </i>
        <Dropdown
          appendTo={editCommentRef.current}
          reference={editCommentRef}
          trigger="click"
          placement="bottom-end"
          dropDownItemClassName="opacity-100"
        >
          <Dropdown.Item
            text="Chỉnh sửa bình luận"
            className={`justify-start ${!isCommentEditable && "hidden"}`}
            onClick={() => onEditCommentIdChange?.(comment?.id)}
          />
          <Dropdown.Item
            className={`justify-start ${!isCommentHidable && "hidden"}`}
            text={`${comment.isHidden ? "Hiện" : "Ẩn"} bình luận`}
            onClick={() => onHiddenComment?.(comment)}
            hoverDanger
          />
          <Dropdown.Item
            text="Xóa bình luận"
            className={`justify-start ${!isCommentDeletable && "hidden"}`}
            onClick={() => onDeleteComment?.(comment)}
            hoverDanger
          />
        </Dropdown>
      </div>
      <div className={`p-4 pt-2 mt-3 bg-gray-100 rounded ${hiddenClass}`}>
        <CommentContent comment={comment} isDetails={isDetails} commentRef={commentRef} />
        {!!comment?.image && (
          <Img
            lazyload={false}
            src={comment.image}
            className={`w-20 mt-3 border border-slate-200 rounded lg:hover:brightness-90 h-20`}
            showImageOnClick
            alt={`${comment?.id}-image`}
          />
        )}
        {comment?.prescriptions?.length > 0 && (
          <div className="mt-3">
            <QuestionPrescription prescriptions={comment?.prescriptions} />
          </div>
        )}
        {comment?.suggestedProducts?.length > 0 && (
          <div className="mt-3">
            <QuestionSuggestProducts suggestedProductList={comment?.suggestedProducts} />
          </div>
        )}
      </div>
    </>
  );
}

function CommentContent({
  commentRef,
  comment,
  isDetails = false,
  ...props
}: ReactProps & { comment: any; isDetails?: boolean; commentRef: any }) {
  const INIT_LINES_DISPLAY = 10;
  const [numberLines, setNumberLines] = useState<number>(0);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    setNumberLines(countLines(comment?.id));
  }, [comment]);

  return (
    <>
      <div
        id={`${comment?.id}`}
        className={`leading-6 whitespace-pre-line text-sm md:text-base font-medium ${
          numberLines > INIT_LINES_DISPLAY && !showMore && !isDetails
            ? `text-ellipsis-${INIT_LINES_DISPLAY} h-${INIT_LINES_DISPLAY * 6}`
            : "h-auto"
        }`}
      >
        {comment?.content}
      </div>
      {comment?.content && numberLines > INIT_LINES_DISPLAY && !isDetails && (
        <Button
          className="p-0 mt-3 text-xs transform -translate-y-2 text-primary"
          text={showMore ? "Thu gọn" : "Xem thêm"}
          onClick={() => {
            setShowMore(!showMore);
            if (showMore) {
              commentRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }}
        />
      )}
    </>
  );
}
